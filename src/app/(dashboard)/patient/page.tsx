import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/dashboard/stat-card";
import { Calendar, FileText, CheckCircle, Clock } from "lucide-react";
import { AppointmentStatus } from "@prisma/client";

const statusColors: Record<AppointmentStatus, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  COMPLETED: "bg-blue-100 text-blue-700",
};

export default async function PatientDashboard() {
  const session = await getServerSession(authOptions);
  const patientId = (session?.user as any)?.id;

  const [totalApts, upcomingApts, records, completedApts] = await Promise.all([
    prisma.appointment.count({ where: { patientId } }),
    prisma.appointment.findMany({
      where: { patientId, status: { in: ["PENDING", "CONFIRMED"] }, date: { gte: new Date() } },
      include: { doctor: { select: { name: true, specialty: true } } },
      orderBy: { date: "asc" },
      take: 5,
    }),
    prisma.medicalRecord.count({ where: { patientId } }),
    prisma.appointment.count({ where: { patientId, status: "COMPLETED" } }),
  ]);

  const recentRecords = await prisma.medicalRecord.findMany({
    where: { patientId },
    take: 4,
    orderBy: { createdAt: "desc" },
    include: { doctor: { select: { name: true, specialty: true } } },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          Hello, {session?.user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-slate-500 mt-1">Here&apos;s your health overview.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Appointments" value={totalApts} icon={Calendar} color="bg-blue-50 text-[#0052FF]" />
        <StatCard title="Upcoming" value={upcomingApts.length} icon={Clock} color="bg-amber-50 text-amber-600" />
        <StatCard title="Completed" value={completedApts} icon={CheckCircle} color="bg-green-50 text-green-600" />
        <StatCard title="Medical Records" value={records} icon={FileText} color="bg-purple-50 text-purple-600" />
      </div>

      {/* Upcoming appointments */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-50">
          <h2 className="text-base font-bold text-slate-900">Upcoming Appointments</h2>
        </div>
        <div className="divide-y divide-slate-50">
          {upcomingApts.length === 0 ? (
            <div className="px-6 py-10 text-center text-slate-400 text-sm">No upcoming appointments.</div>
          ) : (
            upcomingApts.map((apt) => (
              <div key={apt.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#0052FF]/10 flex items-center justify-center text-[#0052FF] font-bold text-sm">
                    {apt.doctor.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">Dr. {apt.doctor.name}</div>
                    <div className="text-xs text-slate-500">{apt.doctor.specialty || "General"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-700">
                      {new Date(apt.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                    </div>
                    <div className="text-xs text-slate-400">{apt.time}</div>
                  </div>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[apt.status]}`}>
                    {apt.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent records */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-50">
          <h2 className="text-base font-bold text-slate-900">Recent Medical Records</h2>
        </div>
        <div className="divide-y divide-slate-50">
          {recentRecords.length === 0 ? (
            <div className="px-6 py-10 text-center text-slate-400 text-sm">No medical records yet.</div>
          ) : (
            recentRecords.map((rec) => (
              <div key={rec.id} className="px-6 py-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{rec.diagnosis}</div>
                    <div className="text-xs text-slate-500 mt-0.5">Dr. {rec.doctor.name} · {rec.doctor.specialty || "General"}</div>
                  </div>
                  <div className="text-xs text-slate-400">
                    {new Date(rec.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </div>
                </div>
                {rec.prescription && (
                  <div className="mt-2 text-xs text-slate-500 bg-slate-50 rounded-lg px-3 py-2">
                    Rx: {rec.prescription}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
