import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PatientProfileClient } from "./profile-client";

export default async function PatientProfilePage() {
  const session = await getServerSession(authOptions);
  const patientId = (session?.user as any)?.id;

  const patient = await prisma.user.findUnique({
    where: { id: patientId },
    select: { id: true, name: true, email: true, phone: true, createdAt: true },
  });

  const stats = await Promise.all([
    prisma.appointment.count({ where: { patientId } }),
    prisma.appointment.count({ where: { patientId, status: "COMPLETED" } }),
    prisma.medicalRecord.count({ where: { patientId } }),
    prisma.appointment.count({ where: { patientId, status: { in: ["PENDING", "CONFIRMED"] }, date: { gte: new Date() } } }),
  ]);

  return (
    <PatientProfileClient
      patient={JSON.parse(JSON.stringify(patient))}
      stats={{ total: stats[0], completed: stats[1], records: stats[2], upcoming: stats[3] }}
    />
  );
}
