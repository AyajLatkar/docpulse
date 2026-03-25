"use client";

import { useState } from "react";
import { Loader2, User, Lock, Bell, Shield, Database, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  admin: { id: string; name: string; email: string; phone?: string; createdAt: string };
  stats: { doctors: number; patients: number; appointments: number; records: number };
}

export function SettingsClient({ admin, stats }: Props) {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [profile, setProfile] = useState({ name: admin.name, email: admin.email, phone: admin.phone || "" });
  const [passwords, setPasswords] = useState({ current: "", newPw: "", confirm: "" });
  const [notifications, setNotifications] = useState({
    newAppointment: true,
    appointmentReminder: true,
    newPatient: true,
    systemAlerts: true,
  });

  async function saveProfile() {
    setLoading(true);
    setSuccess("");
    try {
      const res = await fetch(`/api/admin/settings/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (!res.ok) throw new Error();
      setSuccess("Profile updated successfully.");
    } catch {
      setSuccess("Failed to update profile.");
    } finally {
      setLoading(false);
    }
  }

  async function savePassword() {
    if (passwords.newPw !== passwords.confirm) {
      setSuccess("Passwords do not match.");
      return;
    }
    if (passwords.newPw.length < 8) {
      setSuccess("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    setSuccess("");
    try {
      const res = await fetch(`/api/admin/settings/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: passwords.current, newPassword: passwords.newPw }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("Password changed successfully.");
      setPasswords({ current: "", newPw: "", confirm: "" });
    } catch (e: any) {
      setSuccess(e.message || "Failed to change password.");
    } finally {
      setLoading(false);
    }
  }

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Lock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "system", label: "System", icon: Database },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your account and system preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar tabs */}
        <div className="w-48 shrink-0 space-y-1">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => { setActiveTab(id); setSuccess(""); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                activeTab === id
                  ? "bg-[#0052FF] text-white shadow-md shadow-[#0052FF]/20"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          {success && (
            <div className={`mb-4 px-4 py-3 rounded-xl text-sm font-medium ${
              success.includes("success") ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
            }`}>
              {success}
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === "profile" && (
            <div className="space-y-5">
              <div className="flex items-center gap-4 pb-5 border-b border-slate-100">
                <div className="w-16 h-16 rounded-2xl bg-[#0052FF]/10 flex items-center justify-center text-[#0052FF] text-2xl font-bold">
                  {admin.name[0]}
                </div>
                <div>
                  <div className="font-bold text-slate-900 text-lg">{admin.name}</div>
                  <div className="text-sm text-slate-500">{admin.email}</div>
                  <div className="text-xs text-[#0052FF] font-medium mt-0.5">Administrator</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-slate-700">Full Name</Label>
                  <Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="mt-1 rounded-xl border-slate-200 h-10" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700">Email</Label>
                  <Input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="mt-1 rounded-xl border-slate-200 h-10" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700">Phone</Label>
                  <Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    placeholder="+1 234 567 8900" className="mt-1 rounded-xl border-slate-200 h-10" />
                </div>
                <div>
                  <Label className="text-sm font-medium text-slate-700">Member Since</Label>
                  <Input value={new Date(admin.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    disabled className="mt-1 rounded-xl border-slate-200 h-10 bg-slate-50" />
                </div>
              </div>

              <Button onClick={saveProfile} disabled={loading} className="bg-[#0052FF] hover:bg-[#0041CC] text-white rounded-xl px-6">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Changes"}
              </Button>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-5">
              <h3 className="font-bold text-slate-900">Change Password</h3>
              <div className="space-y-3 max-w-sm">
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
                  <Label className="text-sm font-medium text-slate-700">Confirm New Password</Label>
                  <Input type="password" value={passwords.confirm} onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
                    placeholder="Repeat new password" className="mt-1 rounded-xl border-slate-200 h-10" />
                </div>
              </div>
              <Button onClick={savePassword} disabled={loading} className="bg-[#0052FF] hover:bg-[#0041CC] text-white rounded-xl px-6">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update Password"}
              </Button>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <h3 className="font-bold text-slate-900 mb-3">Security Info</h3>
                <div className="space-y-2">
                  {[
                    { label: "Two-Factor Authentication", value: "Not enabled", color: "text-amber-600" },
                    { label: "Last Login", value: "Today", color: "text-green-600" },
                    { label: "Session Timeout", value: "30 days", color: "text-slate-600" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-50">
                      <span className="text-sm text-slate-600">{item.label}</span>
                      <span className={`text-sm font-medium ${item.color}`}>{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === "notifications" && (
            <div className="space-y-5">
              <h3 className="font-bold text-slate-900">Notification Preferences</h3>
              <div className="space-y-3">
                {[
                  { key: "newAppointment", label: "New Appointment Booked", desc: "Get notified when a new appointment is created" },
                  { key: "appointmentReminder", label: "Appointment Reminders", desc: "Reminders 24 hours before appointments" },
                  { key: "newPatient", label: "New Patient Registration", desc: "Alert when a new patient registers" },
                  { key: "systemAlerts", label: "System Alerts", desc: "Critical system notifications and updates" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <div className="text-sm font-semibold text-slate-800">{item.label}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{item.desc}</div>
                    </div>
                    <button
                      onClick={() => setNotifications((prev) => ({ ...prev, [item.key]: !prev[item.key as keyof typeof prev] }))}
                      className={`relative w-11 h-6 rounded-full transition-colors ${
                        notifications[item.key as keyof typeof notifications] ? "bg-[#0052FF]" : "bg-slate-300"
                      }`}
                    >
                      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        notifications[item.key as keyof typeof notifications] ? "translate-x-5" : "translate-x-0"
                      }`} />
                    </button>
                  </div>
                ))}
              </div>
              <Button className="bg-[#0052FF] hover:bg-[#0041CC] text-white rounded-xl px-6"
                onClick={() => setSuccess("Notification preferences saved successfully.")}>
                Save Preferences
              </Button>
            </div>
          )}

          {/* System Tab */}
          {activeTab === "system" && (
            <div className="space-y-5">
              <h3 className="font-bold text-slate-900">System Overview</h3>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: "Total Doctors", value: stats.doctors, icon: "🩺", color: "bg-blue-50" },
                  { label: "Total Patients", value: stats.patients, icon: "👥", color: "bg-green-50" },
                  { label: "Total Appointments", value: stats.appointments, icon: "📅", color: "bg-purple-50" },
                  { label: "Medical Records", value: stats.records, icon: "📋", color: "bg-amber-50" },
                ].map((s) => (
                  <div key={s.label} className={`${s.color} rounded-xl p-4`}>
                    <div className="text-2xl mb-1">{s.icon}</div>
                    <div className="text-2xl font-bold text-slate-900">{s.value}</div>
                    <div className="text-sm text-slate-500">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2">
                {[
                  { label: "Platform", value: "DocPulse v1.0.0" },
                  { label: "Framework", value: "Next.js 14 (App Router)" },
                  { label: "Database", value: "PostgreSQL (Neon)" },
                  { label: "Auth", value: "NextAuth.js JWT" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2 border-b border-slate-50">
                    <span className="text-sm text-slate-500">{item.label}</span>
                    <span className="text-sm font-medium text-slate-800">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
