"use client";

import { useState } from "react";
import { Search, Calendar, FileText, Mail, Phone, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Patient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  appointmentsAsPatient: { date: string; status: string; reason?: string }[];
  medicalRecords: { diagnosis: string; createdAt: string }[];
  _count: { appointmentsAsPatient: number; medicalRecords: number };
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  CONFIRMED: "bg-green-100 text-green-700",
  CANCELLED: "bg-red-100 text-red-700",
  COMPLETED: "bg-blue-100 text-blue-700",
};

export function DoctorPatientsClient({ patients }: { patients: Patient[] }) {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Patient | null>(null);

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">My Patients</h1>
        <p className="text-slate-500 text-sm mt-1">{patients.length} patients under your care</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input placeholder="Search patients..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="pl-9 rounded-xl border-slate-200 h-10" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-3 py-16 text-center text-slate-400">No patients found.</div>
        ) : (
          filtered.map((p) => (
            <div key={p.id}
              onClick={() => setSelected(p)}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md hover:border-[#0052FF]/20 transition-all cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-lg">
                    {p.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{p.name}</div>
                    <div className="text-xs text-slate-400">{p.email}</div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>

              {p.phone && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
                  <Phone className="w-3.5 h-3.5" />{p.phone}
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="bg-blue-50 rounded-xl p-2.5 text-center">
                  <div className="text-lg font-bold text-[#0052FF]">{p._count.appointmentsAsPatient}</div>
                  <div className="text-xs text-slate-500">Appointments</div>
                </div>
                <div className="bg-purple-50 rounded-xl p-2.5 text-center">
                  <div className="text-lg font-bold text-purple-600">{p._count.medicalRecords}</div>
                  <div className="text-xs text-slate-500">Records</div>
                </div>
              </div>

              {p.appointmentsAsPatient[0] && (
                <div className="text-xs text-slate-500 bg-slate-50 rounded-xl px-3 py-2">
                  Last visit: {new Date(p.appointmentsAsPatient[0].date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[p.appointmentsAsPatient[0].status]}`}>
                    {p.appointmentsAsPatient[0].status}
                  </span>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Patient Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-xl">
                  {selected.name[0]}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-lg">{selected.name}</div>
                  <div className="text-sm text-slate-500">Patient Profile</div>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-xs text-slate-400 mb-1">Email</div>
                <div className="font-medium text-slate-800 break-all">{selected.email}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-xs text-slate-400 mb-1">Phone</div>
                <div className="font-medium text-slate-800">{selected.phone || "Not provided"}</div>
              </div>
              <div className="bg-blue-50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-[#0052FF]">{selected._count.appointmentsAsPatient}</div>
                <div className="text-xs text-slate-500">Total Appointments</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-3 text-center">
                <div className="text-2xl font-bold text-purple-600">{selected._count.medicalRecords}</div>
                <div className="text-xs text-slate-500">Medical Records</div>
              </div>
            </div>

            {selected.medicalRecords.length > 0 && (
              <div>
                <div className="text-sm font-bold text-slate-700 mb-2">Latest Diagnosis</div>
                <div className="bg-green-50 rounded-xl p-3">
                  <div className="font-medium text-slate-800">{selected.medicalRecords[0].diagnosis}</div>
                  <div className="text-xs text-slate-400 mt-1">
                    {new Date(selected.medicalRecords[0].createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
