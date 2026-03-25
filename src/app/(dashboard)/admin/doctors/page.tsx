import { prisma } from "@/lib/prisma";
import { DoctorsClient } from "./doctors-client";

export default async function DoctorsPage() {
  const doctors = await prisma.user.findMany({
    where: { role: "DOCTOR" },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { appointmentsAsDoctor: true, recordsCreated: true },
      },
    },
  });

  return <DoctorsClient doctors={JSON.parse(JSON.stringify(doctors))} />;
}
