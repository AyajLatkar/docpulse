import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DoctorPatientsClient } from "./patients-client";

export default async function DoctorPatientsPage() {
  const session = await getServerSession(authOptions);
  const doctorId = (session?.user as any)?.id;

  // Get unique patients who have appointments with this doctor
  const appointmentPatients = await prisma.appointment.findMany({
    where: { doctorId },
    select: { patientId: true },
    distinct: ["patientId"],
  });

  const patientIds = appointmentPatients.map((a) => a.patientId);

  const patients = await prisma.user.findMany({
    where: { id: { in: patientIds } },
    include: {
      appointmentsAsPatient: {
        where: { doctorId },
        orderBy: { date: "desc" },
        take: 1,
        select: { date: true, status: true, reason: true },
      },
      medicalRecords: {
        where: { doctorId },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { diagnosis: true, createdAt: true },
      },
      _count: {
        select: {
          appointmentsAsPatient: { where: { doctorId } },
          medicalRecords: { where: { doctorId } },
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return <DoctorPatientsClient patients={JSON.parse(JSON.stringify(patients))} />;
}
