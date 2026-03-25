import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PatientRecordsClient } from "./records-client";

export default async function PatientRecordsPage() {
  const session = await getServerSession(authOptions);
  const patientId = (session?.user as any)?.id;

  const records = await prisma.medicalRecord.findMany({
    where: { patientId },
    orderBy: { createdAt: "desc" },
    include: {
      doctor: { select: { id: true, name: true, specialty: true } },
    },
  });

  return <PatientRecordsClient records={JSON.parse(JSON.stringify(records))} />;
}
