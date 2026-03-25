import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { patientId, doctorId, diagnosis, prescription, notes } = await req.json();
  if (!patientId || !doctorId || !diagnosis)
    return NextResponse.json({ error: "Patient, doctor and diagnosis are required." }, { status: 400 });

  const record = await prisma.medicalRecord.create({
    data: { patientId, doctorId, diagnosis, prescription, notes },
    include: {
      patient: { select: { id: true, name: true, email: true } },
      doctor: { select: { id: true, name: true, specialty: true } },
    },
  });

  return NextResponse.json(record, { status: 201 });
}
