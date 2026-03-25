import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PatientAppointmentsClient } from "./appointments-client";

export default async function PatientAppointmentsPage() {
  const session = await getServerSession(authOptions);
  const patientId = (session?.user as any)?.id;

  const [appointments, doctors] = await Promise.all([
    prisma.appointment.findMany({
      where: { patientId },
      orderBy: { date: "desc" },
      include: { doctor: { select: { id: true, name: true, specialty: true } } },
    }),
    prisma.user.findMany({
      where: { role: "DOCTOR" },
      select: { id: true, name: true, specialty: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <PatientAppointmentsClient
      appointments={JSON.parse(JSON.stringify(appointments))}
      doctors={doctors}
      patientId={patientId}
    />
  );
}
