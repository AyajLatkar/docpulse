"use client";

import { useState } from "react";
import { Calendar, Plus, Search, Filter, Trash2, Edit2, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  CONFIRMED: "bg-green-100 text-green-700 border-green-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
  COMPLETED: "bg-blue-100 text-blue-700 border-blue-200",
};

const STATUSES = ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
const TIMES = ["09:00 AM","09:30 AM","10:00 AM","10:30 AM","11:00 AM","11:30 AM","12:00 PM","02:00 PM","02:30 PM","03:00 PM","03:30 PM","04:00 PM","04:30 PM","05:00 PM"];

interface Appointment {
  id: string;
  date: string;
  time: string;
  status: string;
  reason?: string;
  notes?: string;
  patient: { id: string; name: string; email: string };
  doctor: { id: string; name: string; specialty?: string };
}

interface Props {
  appointments: Appointment[];
  doctors: { id: string; name: string; specialty?: string | null }[];
  patients: { id: string; name: string; email: string }[];
}

export function AppointmentsClient({ appointments: initial, doctors, patients }: Props) {
  const [appointments, setAppointments] = useState(initial);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ patientId: "", doctorId: "", date: "", time: "09:00 AM", status: "PENDING", reason: "" });

  const filtered = appointments.filter((a) => {
    const matchSearch =
      a.patient.name.toLowerCase().includes(search.toLowerCase()) ||
      a.doctor.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "ALL" || a.status === filterStatus;
    return matchSearch && matchStatus;
  });

  function openCreate() {
    setEditItem(null);
    setForm({ patientId: "", doctorId: "", date: "", time: "09:00 AM", status: "PENDING", reason: "" });
    setShowModal(true);
  }

  function openEdit(apt: Appointment) {
    setEditItem(apt);
    setForm({
      patientId: apt.patient.id,
      doctorId: apt.doctor.id,
      date: apt.date.split("T")[0],
      time: apt.time,
      status: apt.status,
      reason: apt.reason || "",
    });
    setShowModal(true);
  }

  async function handleSave() {
    setLoading(true);
    try {
      const url = editItem ? `/api/admin/appointments/${editItem.id}` : "/api/admin/appointments";
      const method = editItem ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (editItem) {
        setAppointments((prev) => prev.map((a) => (a.id === editItem.id ? data : a)));
      } else {
        setAppointments((prev) => [data, ...prev]);
      }
      setShowModal(false);
    } catch {
      alert("Failed to save appointment.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this appointment?")) return;
    const res = await fetch(`/api/admin/appointments/${id}`, { method: "DELETE" });
    if (res.ok) setAppointments((prev) => prev.filter((a) => a.id !== id));
  }

  async function handleStatusChange(id: string, status: string) {
    const res = await fetch(`/api/admin/appointments/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const data = await res.json();
      setAppointments((prev) => prev.map((a) => (a.id === id ? data : a)));
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Appointments</h1>
          <p className="text-slate-500 text-sm mt-1">{appointments.length} total appointments</p>
        </div>
        <Button onClick={openCreate} className="bg-[#0052FF] hover:bg-[#0041CC] text-white rounded-xl gap-2">
          <Plus className="w-4 h-4" /> New Appointment
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Search patient or doctor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl border-slate-200 h-10"
          />
        </div>
        <div className="flex gap-2">
          {["ALL", ...STATUSES].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                filterStatus === s
                  ? "bg-[#0052FF] text-white border-[#0052FF]"
                  : "bg-white text-slate-600 border-slate-200 hover:border-[#0052FF]/40"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Patient</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Doctor</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Date & Time</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Reason</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">No appointments found.</td>
                </tr>
              ) : (
                filtered.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#0052FF]/10 flex items-center justify-center text-[#0052FF] font-bold text-xs">
                          {apt.patient.name[0]}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-800">{apt.patient.name}</div>
                          <div className="text-xs text-slate-400">{apt.patient.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-700">Dr. {apt.doctor.name}</div>
                      <div className="text-xs text-slate-400">{apt.doctor.specialty || "General"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-700">
                        {new Date(apt.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </div>
                      <div className="text-xs text-slate-400">{apt.time}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 max-w-[150px] truncate">{apt.reason || "—"}</td>
                    <td className="px-6 py-4">
                      <select
                        value={apt.status}
                        onChange={(e) => handleStatusChange(apt.id, e.target.value)}
                        className={`text-xs font-semibold px-2 py-1 rounded-full border cursor-pointer ${STATUS_COLORS[apt.status]}`}
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(apt)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-[#0052FF] transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(apt.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-500 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">{editItem ? "Edit Appointment" : "New Appointment"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-slate-100"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-3">
              <div>
                <Label className="text-slate-700 font-medium text-sm">Patient</Label>
                <select value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })}
                  className="mt-1 w-full h-10 rounded-xl border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0052FF]/30">
                  <option value="">Select patient</option>
                  {patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <Label className="text-slate-700 font-medium text-sm">Doctor</Label>
                <select value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
                  className="mt-1 w-full h-10 rounded-xl border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0052FF]/30">
                  <option value="">Select doctor</option>
                  {doctors.map((d) => <option key={d.id} value={d.id}>Dr. {d.name} — {d.specialty || "General"}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-slate-700 font-medium text-sm">Date</Label>
                  <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="mt-1 rounded-xl border-slate-200 h-10" />
                </div>
                <div>
                  <Label className="text-slate-700 font-medium text-sm">Time</Label>
                  <select value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}
                    className="mt-1 w-full h-10 rounded-xl border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0052FF]/30">
                    {TIMES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <Label className="text-slate-700 font-medium text-sm">Status</Label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="mt-1 w-full h-10 rounded-xl border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0052FF]/30">
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <Label className="text-slate-700 font-medium text-sm">Reason</Label>
                <Input value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder="e.g. Routine Checkup" className="mt-1 rounded-xl border-slate-200 h-10" />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1 rounded-xl">Cancel</Button>
              <Button onClick={handleSave} disabled={loading} className="flex-1 bg-[#0052FF] hover:bg-[#0041CC] text-white rounded-xl">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : editItem ? "Update" : "Create"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
