import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SettingsClient } from "./settings-client";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);
  const adminId = (session?.user as any)?.id;

  const admin = await prisma.user.findUnique({
    where: { id: adminId },
    select: { id: true, name: true, email: true, phone: true, createdAt: true },
  });

  const stats = await prisma.$transaction([
    prisma.user.count({ where: { role: "DOCTOR" } }),
    prisma.user.count({ where: { role: "PATIENT" } }),
    prisma.appointment.count(),
    prisma.medicalRecord.count(),
  ]);

  return (
    <SettingsClient
      admin={JSON.parse(JSON.stringify(admin))}
      stats={{ doctors: stats[0], patients: stats[1], appointments: stats[2], records: stats[3] }}
    />
  );
}
