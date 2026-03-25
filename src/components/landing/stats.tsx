"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "10K+", label: "Active Patients" },
  { value: "500+", label: "Doctors Onboarded" },
  { value: "99.99%", label: "Platform Uptime" },
  { value: "2M+", label: "Appointments Handled" },
];

export function Stats() {
  return (
    <section className="py-16 bg-[#0052FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center text-white"
            >
              <div className="text-4xl font-extrabold mb-1">{stat.value}</div>
              <div className="text-blue-200 text-sm font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
