"use client";

import { useState } from "react";
import { Plus, Search, Trash2, Edit2, X, Loader2, Mail, Phone, Calendar, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Patient {
  id: string;
  name: string;
  email: string;
  phone?: string;
  createdAt: string;
  _count: { appointmentsAsPatient: number; medicalRecords: number };
}

export function PatientsClient({ patients: initial }: { patients: Patient[] }) {
  const [patients, setPatients] = useState(initial);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });

  const filtered = patients.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.email.toLowerCase().includes(search.toLowerCase())
  );

  function openCreate() {
    setEditItem(null);
    setForm({ name: "", email: "", password: "", phone: "" });
    setShowModal(true);
  }

  function openEdit(p: Patient) {
    setEditItem(p);
    setForm({ name: p.name, email: p.email, password: "", phone: p.phone || "" });
    setShowModal(true);
  }

  async function handleSave() {
    setLoading(true);
    try {
      const url = editItem ? `/api/admin/patients/${editItem.id}` : "/api/admin/patients";
      const method = editItem ? "PUT" : "POST";
      const body = editItem ? { name: form.name, phone: form.phone } : form;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const data = await res.json();
      if (editItem) {
        setPatients((prev) => prev.map((p) => (p.id === editItem.id ? { ...p, ...data } : p)));
      } else {
        setPatients((prev) => [{ ...data, _count: { appointmentsAsPatient: 0, medicalRecords: 0 } }, ...prev]);
      }
      setShowModal(false);
    } catch (e: any) {
      alert(e.message || "Failed to save.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this patient? All their records will be removed.")) return;
    const res = await fetch(`/api/admin/patients/${id}`, { method: "DELETE" });
    if (res.ok) setPatients((prev) => prev.filter((p) => p.id !== id));
    else alert("Failed to delete.");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Patients</h1>
          <p className="text-slate-500 text-sm mt-1">{patients.length} registered patients</p>
        </div>
        <Button onClick={openCreate} className="bg-[#0052FF] hover:bg-[#0041CC] text-white rounded-xl gap-2">
          <Plus className="w-4 h-4" /> Add Patient
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input placeholder="Search patients..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="pl-9 rounded-xl border-slate-200 h-10" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/60">
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Patient</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Contact</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Appointments</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Records</th>
              <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Joined</th>
              <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-400">No patients found.</td></tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold text-sm">
                        {p.name[0]}
                      </div>
                      <div className="font-semibold text-slate-800">{p.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-slate-600">{p.email}</div>
                    {p.phone && <div className="text-xs text-slate-400">{p.phone}</div>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {p._count.appointmentsAsPatient}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-700">
                      <FileText className="w-3.5 h-3.5 text-slate-400" />
                      {p._count.medicalRecords}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 text-xs">
                    {new Date(p.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-[#0052FF]">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-500 hover:text-red-500">
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">{editItem ? "Edit Patient" : "Add Patient"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-slate-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-slate-700">Full Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Jane Doe" className="mt-1 rounded-xl border-slate-200 h-10" />
              </div>
              {!editItem && (
                <>
                  <div>
                    <Label className="text-sm font-medium text-slate-700">Email</Label>
                    <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="patient@example.com" className="mt-1 rounded-xl border-slate-200 h-10" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700">Password</Label>
                    <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="Min 8 characters" className="mt-1 rounded-xl border-slate-200 h-10" />
                  </div>
                </>
              )}
              <div>
                <Label className="text-sm font-medium text-slate-700">Phone (optional)</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+1 234 567 8900" className="mt-1 rounded-xl border-slate-200 h-10" />
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1 rounded-xl">Cancel</Button>
              <Button onClick={handleSave} disabled={loading} className="flex-1 bg-[#0052FF] hover:bg-[#0041CC] text-white rounded-xl">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : editItem ? "Update" : "Add Patient"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
