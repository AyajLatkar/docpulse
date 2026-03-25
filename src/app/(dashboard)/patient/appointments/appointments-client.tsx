"use client";

import { useState } from "react";
import { Plus, Search, Calendar, Clock, X, Loader2, XCircle, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  CONFIRMED: "bg-green-100 text-green-700 border-green-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
  COMPLETED: "bg-blue-100 text-blue-700 border-blue-200",
};

const TIMES = ["09:00 AM","09:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","02:00 PM","02:30 PM","03:00 PM","03:30 PM","04:00 PM","04:30 PM","05:00 PM"];
const REASONS = ["Routine Checkup","Follow-up Visit","New Symptoms","Prescription Renewal","Lab Results Review","Specialist Referral","Vaccination","Other"];

interface Appointment {
  id: string;
  date: string;
  time: string;
  status: string;
  reason?: string;
  notes?: string;
  doctor: { id: string; name: string; specialty?: string };
}

interface Props {
  appointments: Appointment[];
  doctors: { id: string; name: string; specialty?: string | null }[];
  patientId: string;
}

export function PatientAppointmentsClient({ appointments: initial, doctors, patientId }: Props) {
  const [appointments, setAppointments] = useState(initial);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ doctorId: "", date: "", time: "09:00 AM", reason: "Routine Checkup" });

  const filtered = appointments.filter((a) => {
    const matchSearch = a.doctor.name.toLowerCase().includes(search.toLowerCase()) ||
      (a.reason || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "ALL" || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  async function bookAppointment() {
    if (!form.doctorId || !form.date) { alert("Please select a doctor and date."); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/patient/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, patientId }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setAppointments((prev) => [data, ...prev]);
      setShowModal(false);
      setForm({ doctorId: "", date: "", time: "09:00 AM", reason: "Routine Checkup" });
    } catch {
      alert("Failed to book appointment.");
    } finally {
      setLoading(false);
    }
  }

  async function cancelAppointment(id: string) {
    if (!confirm("Cancel this appointment?")) return;
    const res = await fetch(`/api/patient/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "CANCELLED" }),
    });
    if (res.ok) {
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: "CANCELLED" } : a)));
    }
  }

  const upcoming = appointments.filter((a) => ["PENDING", "CONFIRMED"].includes(a.status) && new Date(a.date) >= new Date()).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">My Appointments</h1>
          <p className="text-slate-500 text-sm mt-1">{upcoming} upcoming · {appointments.length} total</p>
        </div>
        <Button onClick={() => setShowModal(true)} className="bg-[#0052FF] hover:bg-[#0041CC] text-white rounded-xl gap-2">
          <Plus className="w-4 h-4" /> Book Appointment
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map((s) => (
          <button key={s} onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${
              filterStatus === s ? "bg-[#0052FF] text-white border-[#0052FF]" : "bg-white text-slate-600 border-slate-200 hover:border-[#0052FF]/40"
            }`}>
            {s}
          </button>
        ))}
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input placeholder="Search doctor or reason..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="pl-9 rounded-xl border-slate-200 h-10" />
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 py-16 text-center">
            <Calendar className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No appointments found.</p>
            <button onClick={() => setShowModal(true)} className="mt-3 text-[#0052FF] text-sm font-semibold hover:underline">
              Book your first appointment →
            </button>
          </div>
        ) : (
          filtered.map((apt) => (
            <div key={apt.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0052FF]/10 flex items-center justify-center text-[#0052FF] font-bold text-lg shrink-0">
                    {apt.doctor.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Dr. {apt.doctor.name}</div>
                    <div className="text-sm text-[#0052FF] font-medium">{apt.doctor.specialty || "General Medicine"}</div>
                  </div>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full border shrink-0 ${STATUS_COLORS[apt.status]}`}>
                  {apt.status}
                </span>
              </div>

              <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-600">
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
                    <Stethoscope className="w-4 h-4 text-slate-400" />
                    {apt.reason}
                  </div>
                )}
              </div>

              {apt.notes && (
                <div className="mt-3 bg-blue-50 rounded-xl px-4 py-2.5 text-sm text-slate-600">
                  <span className="font-medium text-blue-700">Doctor&apos;s Notes: </span>{apt.notes}
                </div>
              )}

              {["PENDING", "CONFIRMED"].includes(apt.status) && new Date(apt.date) >= new Date() && (
                <div className="mt-4">
                  <button onClick={() => cancelAppointment(apt.id)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-xl text-xs font-semibold transition-colors">
                    <XCircle className="w-3.5 h-3.5" /> Cancel Appointment
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Book Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Book Appointment</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-slate-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-slate-700">Select Doctor</Label>
                <select value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
                  className="mt-1 w-full h-10 rounded-xl border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0052FF]/30">
                  <option value="">Choose a doctor</option>
                  {doctors.map((d) => <option key={d.id} value={d.id}>Dr. {d.name} — {d.specialty || "General"}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-sm font-medium text-slate-700">Date</Label>
                  <Input type="date" value={form.date} min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="mt-1 rounded-xl border-slate-200 h-10" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700">Time</Label>
                  <select value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="mt-1 w-full h-10 rounded-xl border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0052FF]/30">
                    {TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-700">Reason for Visit</Label>
                <select value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  className="mt-1 w-full h-10 rounded-xl border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0052FF]/30">
                  {REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1 rounded-xl">Cancel</Button>
              <Button onClick={bookAppointment} disabled={loading} className="flex-1 bg-[#0052FF] hover:bg-[#0041CC] text-white rounded-xl">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Book Appointment"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
