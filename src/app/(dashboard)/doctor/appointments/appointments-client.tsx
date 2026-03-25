"use client";

import { useState } from "react";
import { Search, CheckCircle, XCircle, Clock, Calendar, User, Loader2, X, FileText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  CONFIRMED: "bg-green-100 text-green-700 border-green-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
  COMPLETED: "bg-blue-100 text-blue-700 border-blue-200",
};

const STATUSES = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];

interface Appointment {
  id: string;
  date: string;
  time: string;
  status: string;
  reason?: string;
  notes?: string;
  patient: { id: string; name: string; email: string; phone?: string };
}

export function DoctorAppointmentsClient({ appointments: initial }: { appointments: Appointment[] }) {
  const [appointments, setAppointments] = useState(initial);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [notesModal, setNotesModal] = useState<Appointment | null>(null);
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  const filtered = appointments.filter((a) => {
    const matchSearch = a.patient.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "ALL" || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  async function updateStatus(id: string, status: string) {
    const res = await fetch(`/api/doctor/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const data = await res.json();
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, ...data } : a)));
    }
  }

  async function saveNotes() {
    if (!notesModal) return;
    setLoading(true);
    const res = await fetch(`/api/doctor/appointments/${notesModal.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ notes }),
    });
    if (res.ok) {
      const data = await res.json();
      setAppointments((prev) => prev.map((a) => (a.id === notesModal.id ? { ...a, ...data } : a)));
      setNotesModal(null);
    }
    setLoading(false);
  }

  const counts = {
    ALL: appointments.length,
    PENDING: appointments.filter((a) => a.status === "PENDING").length,
    CONFIRMED: appointments.filter((a) => a.status === "CONFIRMED").length,
    COMPLETED: appointments.filter((a) => a.status === "COMPLETED").length,
    CANCELLED: appointments.filter((a) => a.status === "CANCELLED").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">My Appointments</h1>
        <p className="text-slate-500 text-sm mt-1">{appointments.length} total appointments</p>
      </div>

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        {["ALL", ...STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              filterStatus === s
                ? "bg-[#0052FF] text-white border-[#0052FF] shadow-md shadow-[#0052FF]/20"
                : "bg-white text-slate-600 border-slate-200 hover:border-[#0052FF]/40"
            }`}
          >
            {s}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${filterStatus === s ? "bg-white/20" : "bg-slate-100"}`}>
              {counts[s as keyof typeof counts]}
            </span>
          </button>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input placeholder="Search patient..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="pl-9 rounded-xl border-slate-200 h-10" />
      </div>

      {/* Appointment cards */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 py-16 text-center text-slate-400">
            No appointments found.
          </div>
        ) : (
          filtered.map((apt) => (
            <div key={apt.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0052FF]/10 flex items-center justify-center text-[#0052FF] font-bold text-lg shrink-0">
                    {apt.patient.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">{apt.patient.name}</div>
                    <div className="text-sm text-slate-500">{apt.patient.email}</div>
                    {apt.patient.phone && <div className="text-xs text-slate-400">{apt.patient.phone}</div>}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${STATUS_COLORS[apt.status]}`}>
                    {apt.status}
                  </span>
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-600">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  {new Date(apt.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {apt.time}
                </div>
                {apt.reason && (
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-slate-400" />
                    {apt.reason}
                  </div>
                )}
              </div>

              {apt.notes && (
                <div className="mt-3 bg-slate-50 rounded-xl px-4 py-2.5 text-sm text-slate-600">
                  <span className="font-medium text-slate-700">Notes: </span>{apt.notes}
                </div>
              )}

              {/* Action buttons */}
              <div className="mt-4 flex flex-wrap gap-2">
                {apt.status === "PENDING" && (
                  <button onClick={() => updateStatus(apt.id, "CONFIRMED")}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 hover:bg-green-100 rounded-xl text-xs font-semibold transition-colors">
                    <CheckCircle className="w-3.5 h-3.5" /> Confirm
                  </button>
                )}
                {(apt.status === "PENDING" || apt.status === "CONFIRMED") && (
                  <>
                    <button onClick={() => updateStatus(apt.id, "COMPLETED")}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-xl text-xs font-semibold transition-colors">
                      <CheckCircle className="w-3.5 h-3.5" /> Mark Complete
                    </button>
                    <button onClick={() => updateStatus(apt.id, "CANCELLED")}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl text-xs font-semibold transition-colors">
                      <XCircle className="w-3.5 h-3.5" /> Cancel
                    </button>
                  </>
                )}
                <button onClick={() => { setNotesModal(apt); setNotes(apt.notes || ""); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-xs font-semibold transition-colors">
                  <FileText className="w-3.5 h-3.5" /> {apt.notes ? "Edit Notes" : "Add Notes"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Notes Modal */}
      {notesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Appointment Notes</h2>
              <button onClick={() => setNotesModal(null)} className="p-1 rounded-lg hover:bg-slate-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-sm">
              <span className="font-semibold text-slate-700">{notesModal.patient.name}</span>
              <span className="text-slate-400 mx-2">·</span>
              <span className="text-slate-500">{new Date(notesModal.date).toLocaleDateString()} {notesModal.time}</span>
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700">Clinical Notes</Label>
              <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={5}
                placeholder="Enter clinical observations, treatment notes..."
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0052FF]/30 resize-none" />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setNotesModal(null)} className="flex-1 rounded-xl">Cancel</Button>
              <Button onClick={saveNotes} disabled={loading} className="flex-1 bg-[#0052FF] hover:bg-[#0041CC] text-white rounded-xl">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Notes"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
