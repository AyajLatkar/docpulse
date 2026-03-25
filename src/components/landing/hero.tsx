"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Shield, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

const badges = [
  { icon: Shield, label: "HIPAA Compliant" },
  { icon: Clock, label: "99.99% Uptime" },
  { icon: Users, label: "10,000+ Patients" },
];

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Background gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-[#0052FF]/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#00C6FF]/10 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#0052FF]/10 text-[#0052FF] text-sm font-semibold px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-[#0052FF] animate-pulse" />
              Next-Gen Healthcare Platform
            </div>

            <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
              Healthcare{" "}
              <span className="gradient-text">Management</span>{" "}
              Reimagined
            </h1>

            <p className="text-lg text-slate-600 leading-relaxed mb-8 max-w-lg">
              DocPulse brings together appointment scheduling, medical records, and patient
              management into one seamless, secure platform built for modern healthcare.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 mb-10">
              {badges.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2 shadow-sm"
                >
                  <Icon className="w-4 h-4 text-[#0052FF]" />
                  <span className="text-sm font-medium text-slate-700">{label}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-[#0052FF] hover:bg-[#0041CC] text-white rounded-xl px-8 gap-2 shadow-lg shadow-[#0052FF]/30"
                >
                  Start Free Trial <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl px-8 border-slate-300 text-slate-700"
                >
                  View Demo
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Right — Dashboard preview card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Main card */}
              <div className="bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-500">Today's Overview</span>
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">Live</span>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: "Appointments", value: "24", color: "bg-[#0052FF]/10 text-[#0052FF]" },
                    { label: "Patients", value: "186", color: "bg-emerald-50 text-emerald-600" },
                    { label: "Doctors", value: "12", color: "bg-purple-50 text-purple-600" },
                  ].map((s) => (
                    <div key={s.label} className={`${s.color} rounded-2xl p-3 text-center`}>
                      <div className="text-2xl font-bold">{s.value}</div>
                      <div className="text-xs font-medium mt-1">{s.label}</div>
                    </div>
                  ))}
                </div>

                {/* Appointment list */}
                <div className="space-y-2">
                  {[
                    { name: "Sarah Johnson", time: "09:00 AM", type: "Cardiology", status: "Confirmed" },
                    { name: "Michael Chen", time: "10:30 AM", type: "General", status: "Pending" },
                    { name: "Emily Davis", time: "11:00 AM", type: "Neurology", status: "Confirmed" },
                  ].map((apt) => (
                    <div
                      key={apt.name}
                      className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#0052FF]/20 flex items-center justify-center text-[#0052FF] text-xs font-bold">
                          {apt.name[0]}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-800">{apt.name}</div>
                          <div className="text-xs text-slate-500">{apt.type}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs font-medium text-slate-700">{apt.time}</div>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                            apt.status === "Confirmed"
                              ? "bg-green-100 text-green-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {apt.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 -left-4 bg-[#0052FF] text-white rounded-2xl px-4 py-3 shadow-lg shadow-[#0052FF]/40">
                <div className="text-xs font-medium opacity-80">New Appointment</div>
                <div className="text-sm font-bold">Dr. Williams • 2:00 PM</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
