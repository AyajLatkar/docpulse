"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Activity, LayoutDashboard, Calendar, FileText,
  Users, UserCog, LogOut, Settings, Stethoscope,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

const adminNav: NavItem[] = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/appointments", label: "Appointments", icon: Calendar },
  { href: "/admin/doctors", label: "Doctors", icon: Stethoscope },
  { href: "/admin/patients", label: "Patients", icon: Users },
  { href: "/admin/records", label: "Medical Records", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

const doctorNav: NavItem[] = [
  { href: "/doctor", label: "Dashboard", icon: LayoutDashboard },
  { href: "/doctor/appointments", label: "Appointments", icon: Calendar },
  { href: "/doctor/patients", label: "My Patients", icon: Users },
  { href: "/doctor/records", label: "Medical Records", icon: FileText },
  { href: "/doctor/profile", label: "Profile", icon: UserCog },
];

const patientNav: NavItem[] = [
  { href: "/patient", label: "Dashboard", icon: LayoutDashboard },
  { href: "/patient/appointments", label: "My Appointments", icon: Calendar },
  { href: "/patient/records", label: "My Records", icon: FileText },
  { href: "/patient/profile", label: "Profile", icon: UserCog },
];

interface SidebarProps {
  role: "ADMIN" | "DOCTOR" | "PATIENT";
  userName: string;
  userEmail: string;
}

export function Sidebar({ role, userName, userEmail }: SidebarProps) {
  const pathname = usePathname();
  const nav = role === "ADMIN" ? adminNav : role === "DOCTOR" ? doctorNav : patientNav;

  return (
    <aside className="fixed left-0 top-0 h-full w-64 z-40 flex flex-col"
      style={{
        background: "linear-gradient(160deg, #0a1628 0%, #0d1f3c 50%, #0a1628 100%)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Glass overlay */}
      <div className="absolute inset-0 backdrop-blur-xl" style={{ background: "rgba(0,0,0,0.15)" }} />

      <div className="relative flex flex-col h-full">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-6 py-5 border-b border-white/8">
          <div className="w-8 h-8 rounded-lg bg-[#0052FF] flex items-center justify-center shadow-lg shadow-[#0052FF]/40">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-white">
            Doc<span className="text-[#4d8bff]">Pulse</span>
          </span>
        </div>

        {/* Role badge */}
        <div className="px-6 py-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-[#4d8bff] opacity-70">
            {role} Portal
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {nav.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || (href !== `/${role.toLowerCase()}` && pathname.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-[#0052FF] text-white shadow-lg shadow-[#0052FF]/30"
                    : "text-slate-400 hover:text-white hover:bg-white/8"
                )}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User + Logout */}
        <div className="px-3 py-4 border-t border-white/8 space-y-2">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-[#0052FF]/30 flex items-center justify-center text-[#4d8bff] text-sm font-bold">
              {userName?.[0]?.toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-white truncate">{userName}</div>
              <div className="text-xs text-slate-500 truncate">{userEmail}</div>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
