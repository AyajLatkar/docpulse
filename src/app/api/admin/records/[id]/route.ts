import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { patientId, doctorId, diagnosis, prescription, notes } = await req.json();
  const record = await prisma.medicalRecord.update({
    where: { id: params.id },
    data: { patientId, doctorId, diagnosis, prescription, notes },
    include: {
      patient: { select: { id: true, name: true, email: true } },
      doctor: { select: { id: true, name: true, specialty: true } },
    },
  });
  return NextResponse.json(record);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.medicalRecord.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
