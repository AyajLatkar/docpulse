"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  patient: { id: string; name: string; email: string; phone?: string; createdAt: string };
  stats: { total: number; completed: number; records: number; upcoming: number };
}

export function PatientProfileClient({ patient, stats }: Props) {
  const [tab, setTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [profile, setProfile] = useState({ name: patient.name, phone: patient.phone || "" });
  const [passwords, setPasswords] = useState({ current: "", newPw: "", confirm: "" });

  async function saveProfile() {
    setLoading(true); setSuccess("");
    try {
      const res = await fetch("/api/patient/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error();
      setSuccess("Profile updated successfully.");
    } catch { setSuccess("Failed to update."); }
    finally { setLoading(false); }
  }

  async function savePassword() {
    if (passwords.newPw !== passwords.confirm) { setSuccess("Passwords do not match."); return; }
    if (passwords.newPw.length < 8) { setSuccess("Password must be at least 8 characters."); return; }
    setLoading(true); setSuccess("");
    try {
      const res = await fetch("/api/patient/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.newPw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("Password changed successfully.");
      setPasswords({ current: "", newPw: "", confirm: "" });
    } catch (e: any) { setSuccess(e.message || "Failed."); }
    finally { setLoading(false); }
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">My Profile</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your personal information</p>
      </div>

      {/* Profile header */}
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-white/20 flex items-center justify-center text-3xl font-bold">
            {patient.name[0]}
          </div>
          <div>
            <div className="text-2xl font-extrabold">{patient.name}</div>
            <div className="text-emerald-100 text-sm mt-1">{patient.email}</div>
            <div className="text-emerald-100 text-xs mt-0.5">
              Member since {new Date(patient.createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20">
          {[
            { label: "Total Appointments", value: stats.total },
            { label: "Upcoming", value: stats.upcoming },
            { label: "Completed", value: stats.completed },
            { label: "Records", value: stats.records },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold">{s.value}</div>
              <div className="text-emerald-100 text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        {["profile", "security"].map((t) => (
          <button key={t} onClick={() => { setTab(t); setSuccess(""); }}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all capitalize ${
              tab === t ? "bg-[#0052FF] text-white shadow-md shadow-[#0052FF]/20" : "bg-white text-slate-600 border border-slate-200 hover:border-[#0052FF]/40"
            }`}>
            {t}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        {success && (
          <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium ${
            success.includes("success") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
          }`}>{success}</div>
        )}

        {tab === "profile" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-sm font-medium text-slate-700">Full Name</Label>
                <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="mt-1 rounded-xl border-slate-200 h-10" />
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-700">Email</Label>
                <Input value={patient.email} disabled className="mt-1 rounded-xl border-slate-200 h-10 bg-slate-50" />
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-700">Phone</Label>
                <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  placeholder="+1 234 567 8900" className="mt-1 rounded-xl border-slate-200 h-10" />
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-700">Member Since</Label>
                <Input value={new Date(patient.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  disabled className="mt-1 rounded-xl border-slate-200 h-10 bg-slate-50" />
              </div>
            </div>
            <Button onClick={saveProfile} disabled={loading} className="bg-[#0052FF] hover:bg-[#0041CC] text-white rounded-xl px-6">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
            </Button>
          </div>
        )}

        {tab === "security" && (
          <div className="space-y-4 max-w-sm">
            <div>
              <Label className="text-sm font-medium text-slate-700">Current Password</Label>
              <Input type="password" value={passwords.current} onChange={(e) => setPasswords({ ...passwords, current: e.target.value })}
                placeholder="••••••••" className="mt-1 rounded-xl border-slate-200 h-10" />
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700">New Password</Label>
              <Input type="password" value={passwords.newPw} onChange={(e) => setPasswords({ ...passwords, newPw: e.target.value })}
                placeholder="Min 8 characters" className="mt-1 rounded-xl border-slate-200 h-10" />
            </div>
            <div>
              <Label className="text-sm font-medium text-slate-700">Confirm Password</Label>
              <Input type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                placeholder="Repeat new password" className="mt-1 rounded-xl border-slate-200 h-10" />
            </div>
            <Button onClick={savePassword} disabled={loading} className="bg-[#0052FF] hover:bg-[#0041CC] text-white rounded-xl px-6">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
