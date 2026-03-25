"use client";

import { motion } from "framer-motion";
import {
  Calendar, FileText, Video, Shield, Bell, BarChart3,
  Users, Stethoscope,
} from "lucide-react";

const features = [
  {
    icon: Calendar,
    title: "Smart Scheduling",
    desc: "AI-powered appointment booking with real-time availability and automated reminders.",
    color: "bg-blue-50 text-[#0052FF]",
  },
  {
    icon: FileText,
    title: "Digital Medical Records",
    desc: "Secure, structured EMR system with full history, prescriptions, and lab results.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: Video,
    title: "Telemedicine",
    desc: "HD video consultations with integrated e-prescriptions and session notes.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: Shield,
    title: "HIPAA Compliant",
    desc: "End-to-end encryption, role-based access control, and full audit trails.",
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    desc: "Automated SMS, email, and in-app alerts for appointments and follow-ups.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    desc: "Real-time insights on patient flow, revenue, and clinical performance.",
    color: "bg-cyan-50 text-cyan-600",
  },
  {
    icon: Users,
    title: "Multi-Role Access",
    desc: "Separate dashboards for Admins, Doctors, and Patients with tailored workflows.",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: Stethoscope,
    title: "Clinical Workflows",
    desc: "Streamlined consultation flows, diagnosis templates, and prescription management.",
    color: "bg-teal-50 text-teal-600",
  },
];

export function Features() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 bg-[#0052FF]/10 text-[#0052FF] text-sm font-semibold px-4 py-2 rounded-full mb-4">
            Everything You Need
          </div>
          <h2 className="text-4xl font-extrabold text-slate-900 mb-4">
            Built for Modern Healthcare
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            From solo clinics to multi-specialty hospitals, DocPulse scales with your practice.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="group bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-lg hover:border-[#0052FF]/20 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
