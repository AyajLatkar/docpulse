import { prisma } from "@/lib/prisma";
import { RecordsClient } from "./records-client";

export default async function RecordsPage() {
  const [records, doctors, patients] = await Promise.all([
    prisma.medicalRecord.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        patient: { select: { id: true, name: true, email: true } },
        doctor: { select: { id: true, name: true, specialty: true } },
      },
    }),
    prisma.user.findMany({ where: { role: "DOCTOR" }, select: { id: true, name: true, specialty: true }, orderBy: { name: "asc" } }),
    prisma.user.findMany({ where: { role: "PATIENT" }, select: { id: true, name: true, email: true }, orderBy: { name: "asc" } }),
  ]);

  return (
    <RecordsClient
      records={JSON.parse(JSON.stringify(records))}
      doctors={doctors}
      patients={patients}
    />
  );
}
