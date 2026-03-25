import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { name, phone } = await req.json();
  const patient = await prisma.user.update({
    where: { id: params.id },
    data: { name, phone },
  });
  return NextResponse.json(patient);
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.medicalRecord.deleteMany({ where: { patientId: params.id } });
  await prisma.appointment.deleteMany({ where: { patientId: params.id } });
  await prisma.user.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
