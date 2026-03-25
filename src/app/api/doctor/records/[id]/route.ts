import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "DOCTOR")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const doctorId = (session.user as any).id;
  const existing = await prisma.medicalRecord.findFirst({ where: { id: params.id, doctorId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { patientId, diagnosis, prescription, notes } = await req.json();
  const record = await prisma.medicalRecord.update({
    where: { id: params.id },
    data: { patientId, diagnosis, prescription, notes },
    include: { patient: { select: { id: true, name: true, email: true } } },
  });

  return NextResponse.json(record);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "DOCTOR")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const doctorId = (session.user as any).id;
  const existing = await prisma.medicalRecord.findFirst({ where: { id: params.id, doctorId } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.medicalRecord.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
