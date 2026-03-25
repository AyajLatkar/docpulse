import { prisma } from "@/lib/prisma";
import { PatientsClient } from "./patients-client";

export default async function PatientsPage() {
  const patients = await prisma.user.findMany({
    where: { role: "PATIENT" },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { appointmentsAsPatient: true, medicalRecords: true },
      },
    },
  });

  return <PatientsClient patients={JSON.parse(JSON.stringify(patients))} />;
}
