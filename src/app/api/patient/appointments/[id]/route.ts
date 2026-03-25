import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "PATIENT")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const patientId = (session.user as any).id;
  const existing = await prisma.appointment.findFirst({ where: { id: params.id, patientId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Patients can only cancel
  const { status } = await req.json();
  if (status !== "CANCELLED") return NextResponse.json({ error: "Patients can only cancel appointments." }, { status: 403 });

  const apt = await prisma.appointment.update({
    where: { id: params.id },
    data: { status: "CANCELLED" },
    include: { doctor: { select: { id: true, name: true, specialty: true } } },
  });

  return NextResponse.json(apt);
}
