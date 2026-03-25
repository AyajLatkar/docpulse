import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DoctorAppointmentsClient } from "./appointments-client";

export default async function DoctorAppointmentsPage() {
  const session = await getServerSession(authOptions);
  const doctorId = (session?.user as any)?.id;

  const appointments = await prisma.appointment.findMany({
    where: { doctorId },
    orderBy: { date: "desc" },
    include: {
      patient: { select: { id: true, name: true, email: true, phone: true } },
    },
  });

  return <DoctorAppointmentsClient appointments={JSON.parse(JSON.stringify(appointments))} />;
}
