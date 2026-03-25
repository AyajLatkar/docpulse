import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DoctorRecordsClient } from "./records-client";

export default async function DoctorRecordsPage() {
  const session = await getServerSession(authOptions);
  const doctorId = (session?.user as any)?.id;

  const [records, patients] = await Promise.all([
    prisma.medicalRecord.findMany({
      where: { doctorId },
      orderBy: { createdAt: "desc" },
      include: {
        patient: { select: { id: true, name: true, email: true } },
      },
    }),
    prisma.appointment.findMany({
      where: { doctorId },
      select: { patientId: true },
      distinct: ["patientId"],
    }),
  ]);

  const patientIds = patients.map((p) => p.patientId);
  const patientList = await prisma.user.findMany({
    where: { id: { in: patientIds } },
    select: { id: true, name: true, email: true },
    orderBy: { name: "asc" },
  });

  return (
    <DoctorRecordsClient
      records={JSON.parse(JSON.stringify(records))}
      patients={patientList}
      doctorId={doctorId}
    />
  );
}
