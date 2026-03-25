import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/dashboard/stat-card";
import { Calendar, Users, FileText, CheckCircle } from "lucide-react";
import { AppointmentStatus } from "@prisma/client";

const statusColors: Record<AppointmentStatus, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  COMPLETED: "bg-blue-100 text-blue-700",
};

export default async function DoctorDashboard() {
  const session = await getServerSession(authOptions);
  const doctorId = (session?.user as any)?.id;

  const [appointments, patients, records, todayApts] = await Promise.all([
    prisma.appointment.count({ where: { doctorId } }),
    prisma.appointment.groupBy({ by: ["patientId"], where: { doctorId } }),
    prisma.medicalRecord.count({ where: { doctorId } }),
    prisma.appointment.findMany({
      where: {
        doctorId,
        date: {
          gte: new Date(new Date().setHours(0, 0, 0, 0)),
          lte: new Date(new Date().setHours(23, 59, 59, 999)),
        },
      },
      include: { patient: { select: { name: true, email: true } } },
      orderBy: { time: "asc" },
    }),
  ]);

  const recentAppointments = await prisma.appointment.findMany({
    where: { doctorId },
    take: 6,
    orderBy: { date: "desc" },
    include: { patient: { select: { name: true } } },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">
          Dr. {session?.user?.name?.split(" ").slice(-1)[0]}&apos;s Dashboard
        </h1>
        <p className="text-slate-500 mt-1">Manage your appointments and patient records.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Appointments" value={appointments} icon={Calendar} color="bg-blue-50 text-[#0052FF]" />
        <StatCard title="Unique Patients" value={patients.length} icon={Users} color="bg-purple-50 text-purple-600" />
        <StatCard title="Medical Records" value={records} icon={FileText} color="bg-emerald-50 text-emerald-600" />
        <StatCard title="Today's Schedule" value={todayApts.length} icon={CheckCircle} color="bg-amber-50 text-amber-600" />
      </div>

      {/* Today's appointments */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-50">
          <h2 className="text-base font-bold text-slate-900">Today&apos;s Appointments</h2>
        </div>
        <div className="divide-y divide-slate-50">
          {todayApts.length === 0 ? (
            <div className="px-6 py-10 text-center text-slate-400 text-sm">No appointments scheduled for today.</div>
          ) : (
            todayApts.map((apt) => (
              <div key={apt.id} className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#0052FF]/10 flex items-center justify-center text-[#0052FF] font-bold text-sm">
                    {apt.patient.name[0]}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-800">{apt.patient.name}</div>
                    <div className="text-xs text-slate-500">{apt.reason || "General Consultation"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-slate-700">{apt.time}</span>
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[apt.status]}`}>
                    {apt.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Recent appointments */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="px-6 py-4 border-b border-slate-50">
          <h2 className="text-base font-bold text-slate-900">Recent Appointments</h2>
        </div>
        <div className="divide-y divide-slate-50">
          {recentAppointments.map((apt) => (
            <div key={apt.id} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-sm">
                  {apt.patient.name[0]}
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">{apt.patient.name}</div>
                  <div className="text-xs text-slate-500">
                    {new Date(apt.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })} · {apt.time}
                  </div>
                </div>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColors[apt.status]}`}>
                {apt.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
