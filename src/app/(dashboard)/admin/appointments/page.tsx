import { prisma } from "@/lib/prisma";
import { AppointmentStatus } from "@prisma/client";
import { AppointmentsClient } from "./appointments-client";

async function getAppointments() {
  return prisma.appointment.findMany({
    orderBy: { date: "desc" },
    include: {
      patient: { select: { id: true, name: true, email: true } },
      doctor: { select: { id: true, name: true, specialty: true } },
    },
  });
}

async function getDoctors() {
  return prisma.user.findMany({
    where: { role: "DOCTOR" },
    select: { id: true, name: true, specialty: true },
    orderBy: { name: "asc" },
  });
}

async function getPatients() {
  return prisma.user.findMany({
    where: { role: "PATIENT" },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });
}

export default async function AppointmentsPage() {
  const [appointments, doctors, patients] = await Promise.all([
    getAppointments(),
    getDoctors(),
    getPatients(),
  ]);

  return (
    <AppointmentsClient
      appointments={JSON.parse(JSON.stringify(appointments))}
      doctors={doctors}
      patients={patients}
    />
  );
}
