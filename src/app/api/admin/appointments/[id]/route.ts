import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const data: any = {};
  if (body.patientId) data.patientId = body.patientId;
  if (body.doctorId) data.doctorId = body.doctorId;
  if (body.date) data.date = new Date(body.date);
  if (body.time) data.time = body.time;
  if (body.status) data.status = body.status;
  if (body.reason !== undefined) data.reason = body.reason;

  const apt = await prisma.appointment.update({
    where: { id: params.id },
    data,
    include: {
      patient: { select: { id: true, name: true, email: true } },
      doctor: { select: { id: true, name: true, specialty: true } },
    },
  });

  return NextResponse.json(apt);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.appointment.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
