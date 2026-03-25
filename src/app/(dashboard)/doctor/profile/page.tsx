import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DoctorProfileClient } from "./profile-client";

export default async function DoctorProfilePage() {
  const session = await getServerSession(authOptions);
  const doctorId = (session?.user as any)?.id;

  const doctor = await prisma.user.findUnique({
    where: { id: doctorId },
    select: { id: true, name: true, email: true, specialty: true, phone: true, createdAt: true },
  });

  const stats = await Promise.all([
    prisma.appointment.count({ where: { doctorId } }),
    prisma.appointment.count({ where: { doctorId, status: "COMPLETED" } }),
    prisma.medicalRecord.count({ where: { doctorId } }),
    prisma.appointment.findMany({ where: { doctorId }, select: { patientId: true }, distinct: ["patientId"] }),
  ]);

  return (
    <DoctorProfileClient
      doctor={JSON.parse(JSON.stringify(doctor))}
      stats={{ total: stats[0], completed: stats[1], records: stats[2], patients: stats[3].length }}
    />
  );
}
