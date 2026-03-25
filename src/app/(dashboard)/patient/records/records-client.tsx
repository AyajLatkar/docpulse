"use client";

import { useState } from "react";
import { Search, FileText, X, Stethoscope, Pill, ClipboardList } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Record {
  id: string;
  diagnosis: string;
  prescription?: string;
  notes?: string;
  createdAt: string;
  doctor: { id: string; name: string; specialty?: string };
}

export function PatientRecordsClient({ records }: { records: Record[] }) {
  const [search, setSearch] = useState("");
  const [viewItem, setViewItem] = useState<Record | null>(null);

  const filtered = records.filter(
    (r) =>
      r.diagnosis.toLowerCase().includes(search.toLowerCase()) ||
      r.doctor.name.toLowerCase().includes(search.toLowerCase()) ||
      (r.doctor.specialty || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">My Medical Records</h1>
        <p className="text-slate-500 text-sm mt-1">{records.length} records in your health history</p>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input placeholder="Search by diagnosis or doctor..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="pl-9 rounded-xl border-slate-200 h-10" />
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 py-16 text-center">
          <FileText className="w-10 h-10 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">No medical records found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div key={r.id}
              onClick={() => setViewItem(r)}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md hover:border-[#0052FF]/20 transition-all cursor-pointer">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{r.diagnosis}</div>
                    <div className="text-sm text-slate-500 mt-0.5">
                      Dr. {r.doctor.name}
                      {r.doctor.specialty && <span className="text-[#0052FF] ml-1.5 font-medium">· {r.doctor.specialty}</span>}
                    </div>
                  </div>
                </div>
                <div className="text-xs text-slate-400 shrink-0">
                  {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </div>
              </div>

              {r.prescription && (
                <div className="mt-3 flex items-start gap-2 bg-green-50 rounded-xl px-4 py-2.5">
                  <Pill className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-slate-600 line-clamp-2">{r.prescription}</p>
                </div>
              )}

              <div className="mt-3 text-xs text-[#0052FF] font-medium">Tap to view full record →</div>
            </div>
          ))}
        </div>
      )}

      {/* View Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Medical Record</h2>
              <button onClick={() => setViewItem(null)} className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Doctor info */}
            <div className="flex items-center gap-3 bg-slate-50 rounded-xl p-4">
              <div className="w-10 h-10 rounded-xl bg-[#0052FF]/10 flex items-center justify-center text-[#0052FF] font-bold">
                {viewItem.doctor.name[0]}
              </div>
              <div>
                <div className="font-semibold text-slate-800">Dr. {viewItem.doctor.name}</div>
                <div className="text-sm text-[#0052FF] font-medium">{viewItem.doctor.specialty || "General Medicine"}</div>
              </div>
              <div className="ml-auto text-xs text-slate-400">
                {new Date(viewItem.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </div>
            </div>

            <div className="space-y-3">
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Stethoscope className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">Diagnosis</span>
                </div>
                <p className="text-slate-800 font-semibold">{viewItem.diagnosis}</p>
              </div>

              {viewItem.prescription && (
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Pill className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-bold text-green-600 uppercase tracking-wide">Prescription</span>
                  </div>
                  <p className="text-slate-700">{viewItem.prescription}</p>
                </div>
              )}

              {viewItem.notes && (
                <div className="bg-amber-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ClipboardList className="w-4 h-4 text-amber-600" />
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-wide">Doctor&apos;s Notes</span>
                  </div>
                  <p className="text-slate-700">{viewItem.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
