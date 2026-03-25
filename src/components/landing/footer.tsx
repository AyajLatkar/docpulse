import Link from "next/link";
import { Activity } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0052FF] flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">
              Doc<span className="text-[#0052FF]">Pulse</span>
            </span>
          </Link>

          <div className="flex gap-6 text-sm">
            {["Privacy Policy", "Terms of Service", "HIPAA Compliance", "Contact"].map((item) => (
              <Link key={item} href="#" className="hover:text-white transition-colors">
                {item}
              </Link>
            ))}
          </div>

          <p className="text-sm">© {new Date().getFullYear()} DocPulse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
