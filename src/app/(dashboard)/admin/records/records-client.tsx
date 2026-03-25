"use client";

import { useState } from "react";
import { Plus, Search, Trash2, Edit2, X, Loader2, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Record {
  id: string;
  diagnosis: string;
  prescription?: string;
  notes?: string;
  createdAt: string;
  patient: { id: string; name: string; email: string };
  doctor: { id: string; name: string; specialty?: string };
}

interface Props {
  records: Record[];
  doctors: { id: string; name: string; specialty?: string | null }[];
  patients: { id: string; name: string; email: string }[];
}

export function RecordsClient({ records: initial, doctors, patients }: Props) {
  const [records, setRecords] = useState(initial);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [viewItem, setViewItem] = useState<Record | null>(null);
  const [editItem, setEditItem] = useState<Record | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ patientId: "", doctorId: "", diagnosis: "", prescription: "", notes: "" });

  const filtered = records.filter(
    (r) =>
      r.patient.name.toLowerCase().includes(search.toLowerCase()) ||
      r.doctor.name.toLowerCase().includes(search.toLowerCase()) ||
      r.diagnosis.toLowerCase().includes(search.toLowerCase())
  );

  function openCreate() {
    setEditItem(null);
    setForm({ patientId: "", doctorId: "", diagnosis: "", prescription: "", notes: "" });
    setShowModal(true);
  }

  function openEdit(r: Record) {
    setEditItem(r);
    setForm({ patientId: r.patient.id, doctorId: r.doctor.id, diagnosis: r.diagnosis, prescription: r.prescription || "", notes: r.notes || "" });
    setShowModal(true);
  }

  async function handleSave() {
    setLoading(true);
    try {
      const url = editItem ? `/api/admin/records/${editItem.id}` : "/api/admin/records";
      const method = editItem ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      if (editItem) {
        setRecords((prev) => prev.map((r) => (r.id === editItem.id ? data : r)));
      } else {
        setRecords((prev) => [data, ...prev]);
      }
      setShowModal(false);
    } catch {
      alert("Failed to save record.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this medical record?")) return;
    const res = await fetch(`/api/admin/records/${id}`, { method: "DELETE" });
    if (res.ok) setRecords((prev) => prev.filter((r) => r.id !== id));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Medical Records</h1>
          <p className="text-slate-500 text-sm mt-1">{records.length} total records</p>
        </div>
        <Button onClick={openCreate} className="bg-[#0052FF] hover:bg-[#0041CC] text-white rounded-xl gap-2">
          <Plus className="w-4 h-4" /> New Record
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input placeholder="Search by patient, doctor, diagnosis..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="pl-9 rounded-xl border-slate-200 h-10" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-3 py-16 text-center text-slate-400">No records found.</div>
        ) : (
          filtered.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900 text-sm">{r.patient.name}</div>
                    <div className="text-xs text-slate-400">Dr. {r.doctor.name}</div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setViewItem(r)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-[#0052FF]">
                    <FileText className="w-4 h-4" />
                  </button>
                  <button onClick={() => openEdit(r)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-[#0052FF]">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(r.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Diagnosis</span>
                  <p className="text-sm font-medium text-slate-800 mt-0.5">{r.diagnosis}</p>
                </div>
                {r.prescription && (
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Prescription</span>
                    <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{r.prescription}</p>
                  </div>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between">
                <span className="text-xs text-[#0052FF] font-medium">{r.doctor.specialty || "General"}</span>
                <span className="text-xs text-slate-400">
                  {new Date(r.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* View Modal */}
      {viewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Medical Record</h2>
              <button onClick={() => setViewItem(null)} className="p-1 rounded-lg hover:bg-slate-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-xs text-slate-400 font-medium mb-1">Patient</div>
                <div className="font-semibold text-slate-800">{viewItem.patient.name}</div>
                <div className="text-xs text-slate-500">{viewItem.patient.email}</div>
              </div>
              <div className="bg-slate-50 rounded-xl p-3">
                <div className="text-xs text-slate-400 font-medium mb-1">Doctor</div>
                <div className="font-semibold text-slate-800">Dr. {viewItem.doctor.name}</div>
                <div className="text-xs text-slate-500">{viewItem.doctor.specialty || "General"}</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-blue-50 rounded-xl p-4">
                <div className="text-xs font-semibold text-blue-600 uppercase tracking-wide mb-1">Diagnosis</div>
                <p className="text-slate-800 font-medium">{viewItem.diagnosis}</p>
              </div>
              {viewItem.prescription && (
                <div className="bg-green-50 rounded-xl p-4">
                  <div className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Prescription</div>
                  <p className="text-slate-700">{viewItem.prescription}</p>
                </div>
              )}
              {viewItem.notes && (
                <div className="bg-slate-50 rounded-xl p-4">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1">Notes</div>
                  <p className="text-slate-700">{viewItem.notes}</p>
                </div>
              )}
            </div>
            <div className="text-xs text-slate-400 text-right">
              Created: {new Date(viewItem.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">{editItem ? "Edit Record" : "New Record"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-slate-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-slate-700">Patient</Label>
                <select value={form.patientId} onChange={(e) => setForm({ ...form, patientId: e.target.value })}
                  className="mt-1 w-full h-10 rounded-xl border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0052FF]/30">
                  <option value="">Select patient</option>
                  {patients.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-700">Doctor</Label>
                <select value={form.doctorId} onChange={(e) => setForm({ ...form, doctorId: e.target.value })}
                  className="mt-1 w-full h-10 rounded-xl border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0052FF]/30">
                  <option value="">Select doctor</option>
                  {doctors.map((d) => <option key={d.id} value={d.id}>Dr. {d.name} — {d.specialty || "General"}</option>)}
                </select>
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-700">Diagnosis</Label>
                <Input value={form.diagnosis} onChange={(e) => setForm({ ...form, diagnosis: e.target.value })}
                  placeholder="e.g. Hypertension Stage 1" className="mt-1 rounded-xl border-slate-200 h-10" />
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-700">Prescription</Label>
                <textarea value={form.prescription} onChange={(e) => setForm({ ...form, prescription: e.target.value })}
                  placeholder="Medications and dosage..." rows={3}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0052FF]/30 resize-none" />
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-700">Notes</Label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Additional clinical notes..." rows={3}
                  className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0052FF]/30 resize-none" />
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
