import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/dashboard/stat-card";
import { Users, Calendar, FileText, Stethoscope, TrendingUp, Clock } from "lucide-react";
import { AppointmentStatus } from "@prisma/client";

async function getStats() {
  const [totalPatients, totalDoctors, totalAppointments, pendingAppointments, totalRecords, todayAppointments] =
    await Promise.all([
      prisma.user.count({ where: { role: "PATIENT" } }),
      prisma.user.count({ where: { role: "DOCTOR" } }),
      prisma.appointment.count(),
      prisma.appointment.count({ where: { status: "PENDING" } }),
      prisma.medicalRecord.count(),
      prisma.appointment.count({
        where: {
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lte: new Date(new Date().setHours(23, 59, 59, 999)),
          },
        },
      }),
    ]);

  return { totalPatients, totalDoctors, totalAppointments, pendingAppointments, totalRecords, todayAppointments };
}

async function getRecentAppointments() {
  return prisma.appointment.findMany({
    take: 8,
    orderBy: { createdAt: "desc" },
    include: {
      patient: { select: { name: true, email: true } },
      doctor: { select: { name: true, specialty: true } },
    },
  });
}

const statusColors: Record<AppointmentStatus, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  COMPLETED: "bg-blue-100 text-blue-700",
};

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions);
  const stats = await getStats();
  const appointments = await getRecentAppointments();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          Good morning, {session?.user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-slate-500 mt-1">Here&apos;s what&apos;s happening at DocPulse today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Patients" value={stats.totalPatients} icon={Users} trend="12%" trendUp color="bg-blue-50 text-[#0052FF]" />
        <StatCard title="Doctors" value={stats.totalDoctors} icon={Stethoscope} color="bg-purple-50 text-purple-600" />
        <StatCard title="Appointments" value={stats.totalAppointments} icon={Calendar} trend="8%" trendUp color="bg-emerald-50 text-emerald-600" />
        <StatCard title="Today" value={stats.todayAppointments} icon={Clock} color="bg-cyan-50 text-cyan-600" />
        <StatCard title="Pending" value={stats.pendingAppointments} icon={TrendingUp} color="bg-amber-50 text-amber-600" />
        <StatCard title="Records" value={stats.totalRecords} icon={FileText} color="bg-rose-50 text-rose-600" />
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
          <h2 className="text-base font-bold text-slate-900">Recent Appointments</h2>
          <span className="text-xs text-slate-400">{appointments.length} records</span>
        </div>
        <div className="divide-y divide-slate-50">
          {appointments.map((apt) => (
            <div key={apt.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#0052FF]/10 flex items-center justify-center text-[#0052FF] font-bold text-sm">
                  {apt.patient.name[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">{apt.patient.name}</div>
                  <div className="text-xs text-slate-500">Dr. {apt.doctor.name} · {apt.doctor.specialty || "General"}</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
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
          ))}
          {appointments.length === 0 && (
            <div className="px-6 py-12 text-center text-slate-400 text-sm">
              No appointments yet. Run the seed script to populate demo data.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
