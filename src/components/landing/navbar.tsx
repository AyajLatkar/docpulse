"use client";

import Link from "next/link";
import { useState } from "react";
import { Activity, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0052FF] flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">
              Doc<span className="text-[#0052FF]">Pulse</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {["Features", "For Clinics", "For Hospitals", "Pricing"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-sm font-medium text-slate-600 hover:text-[#0052FF] transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" className="text-slate-700 hover:text-[#0052FF]">
                Sign In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-[#0052FF] hover:bg-[#0041CC] text-white rounded-xl px-5">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-slate-100 px-4 py-4 space-y-3">
          {["Features", "For Clinics", "For Hospitals", "Pricing"].map((item) => (
            <Link key={item} href="#" className="block text-sm font-medium text-slate-700">
              {item}
            </Link>
          ))}
          <div className="flex gap-3 pt-2">
            <Link href="/login" className="flex-1">
              <Button variant="outline" className="w-full">Sign In</Button>
            </Link>
            <Link href="/register" className="flex-1">
              <Button className="w-full bg-[#0052FF] text-white">Get Started</Button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
