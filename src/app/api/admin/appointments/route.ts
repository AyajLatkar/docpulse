import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { patientId, doctorId, date, time, status, reason } = await req.json();
  if (!patientId || !doctorId || !date || !time)
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });

  const apt = await prisma.appointment.create({
    data: { patientId, doctorId, date: new Date(date), time, status: status || "PENDING", reason },
    include: {
      patient: { select: { id: true, name: true, email: true } },
      doctor: { select: { id: true, name: true, specialty: true } },
    },
  });

  return NextResponse.json(apt, { status: 201 });
}
