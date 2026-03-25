import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "DOCTOR")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const doctorId = (session.user as any).id;
  const body = await req.json();

  // Ensure doctor owns this appointment
  const existing = await prisma.appointment.findFirst({ where: { id: params.id, doctorId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data: any = {};
  if (body.status) data.status = body.status;
  if (body.notes !== undefined) data.notes = body.notes;

  const apt = await prisma.appointment.update({
    where: { id: params.id },
    data,
    include: { patient: { select: { id: true, name: true, email: true, phone: true } } },
  });

  return NextResponse.json(apt);
}
