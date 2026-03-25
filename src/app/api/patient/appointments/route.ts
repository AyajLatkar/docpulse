import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "PATIENT")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const patientId = (session.user as any).id;
  const { doctorId, date, time, reason } = await req.json();

  if (!doctorId || !date || !time)
    return NextResponse.json({ error: "Doctor, date and time are required." }, { status: 400 });

  const apt = await prisma.appointment.create({
    data: { patientId, doctorId, date: new Date(date), time, reason, status: "PENDING" },
    include: { doctor: { select: { id: true, name: true, specialty: true } } },
  });

  return NextResponse.json(apt, { status: 201 });
}
