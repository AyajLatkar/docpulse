"use client";

import { useState } from "react";
import { Plus, Search, Trash2, Edit2, X, Loader2, Stethoscope, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SPECIALTIES = ["Cardiology","Neurology","Pediatrics","Orthopedics","Dermatology","General Medicine","Oncology","Psychiatry","Radiology","Surgery","ENT","Ophthalmology","Gynecology","Urology","Endocrinology"];

interface Doctor {
  id: string;
  name: string;
  email: string;
  specialty?: string;
  phone?: string;
  createdAt: string;
  _count: { appointmentsAsDoctor: number; recordsCreated: number };
}

export function DoctorsClient({ doctors: initial }: { doctors: Doctor[] }) {
  const [doctors, setDoctors] = useState(initial);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", specialty: "General Medicine", phone: "" });

  const filtered = doctors.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase()) ||
      (d.specialty || "").toLowerCase().includes(search.toLowerCase())
  );

  function openCreate() {
    setEditItem(null);
    setForm({ name: "", email: "", password: "", specialty: "General Medicine", phone: "" });
    setShowModal(true);
  }

  function openEdit(doc: Doctor) {
    setEditItem(doc);
    setForm({ name: doc.name, email: doc.email, password: "", specialty: doc.specialty || "General Medicine", phone: doc.phone || "" });
    setShowModal(true);
  }

  async function handleSave() {
    setLoading(true);
    try {
      const url = editItem ? `/api/admin/doctors/${editItem.id}` : "/api/admin/doctors";
      const method = editItem ? "PUT" : "POST";
      const body = editItem
        ? { name: form.name, specialty: form.specialty, phone: form.phone }
        : form;
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) { const e = await res.json(); throw new Error(e.error); }
      const data = await res.json();
      if (editItem) {
        setDoctors((prev) => prev.map((d) => (d.id === editItem.id ? { ...d, ...data } : d)));
      } else {
        setDoctors((prev) => [{ ...data, _count: { appointmentsAsDoctor: 0, recordsCreated: 0 } }, ...prev]);
      }
      setShowModal(false);
    } catch (e: any) {
      alert(e.message || "Failed to save.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this doctor? This will also remove their appointments.")) return;
    const res = await fetch(`/api/admin/doctors/${id}`, { method: "DELETE" });
    if (res.ok) setDoctors((prev) => prev.filter((d) => d.id !== id));
    else alert("Failed to delete.");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900">Doctors</h1>
          <p className="text-slate-500 text-sm mt-1">{doctors.length} registered doctors</p>
        </div>
        <Button onClick={openCreate} className="bg-[#0052FF] hover:bg-[#0041CC] text-white rounded-xl gap-2">
          <Plus className="w-4 h-4" /> Add Doctor
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input placeholder="Search doctors..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="pl-9 rounded-xl border-slate-200 h-10" />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.length === 0 ? (
          <div className="col-span-3 py-16 text-center text-slate-400">No doctors found.</div>
        ) : (
          filtered.map((doc) => (
            <div key={doc.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#0052FF]/10 flex items-center justify-center text-[#0052FF] font-bold text-lg">
                    {doc.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Dr. {doc.name}</div>
                    <div className="text-xs text-[#0052FF] font-medium">{doc.specialty || "General"}</div>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => openEdit(doc)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-[#0052FF]">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDelete(doc.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 text-sm text-slate-500">
                <div className="flex items-center gap-2"><Mail className="w-3.5 h-3.5" />{doc.email}</div>
                {doc.phone && <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" />{doc.phone}</div>}
              </div>

              <div className="mt-4 pt-4 border-t border-slate-50 grid grid-cols-2 gap-3">
                <div className="text-center">
                  <div className="text-xl font-bold text-slate-900">{doc._count.appointmentsAsDoctor}</div>
                  <div className="text-xs text-slate-400">Appointments</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-slate-900">{doc._count.recordsCreated}</div>
                  <div className="text-xs text-slate-400">Records</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">{editItem ? "Edit Doctor" : "Add Doctor"}</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-slate-100"><X className="w-5 h-5" /></button>
            </div>

            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-slate-700">Full Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Dr. John Smith" className="mt-1 rounded-xl border-slate-200 h-10" />
              </div>
              {!editItem && (
                <>
                  <div>
                    <Label className="text-sm font-medium text-slate-700">Email</Label>
                    <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="doctor@docpulse.com" className="mt-1 rounded-xl border-slate-200 h-10" />
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-slate-700">Password</Label>
                    <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
                      placeholder="Min 8 characters" className="mt-1 rounded-xl border-slate-200 h-10" />
                  </div>
                </>
              )}
              <div>
                <Label className="text-sm font-medium text-slate-700">Specialty</Label>
                <select value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                  className="mt-1 w-full h-10 rounded-xl border border-slate-200 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0052FF]/30">
                  {SPECIALTIES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-700">Phone (optional)</Label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+1 234 567 8900" className="mt-1 rounded-xl border-slate-200 h-10" />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button variant="outline" onClick={() => setShowModal(false)} className="flex-1 rounded-xl">Cancel</Button>
              <Button onClick={handleSave} disabled={loading} className="flex-1 bg-[#0052FF] hover:bg-[#0041CC] text-white rounded-xl">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : editItem ? "Update" : "Add Doctor"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
