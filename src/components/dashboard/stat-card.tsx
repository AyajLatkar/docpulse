import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: string;
}

export function StatCard({ title, value, icon: Icon, trend, trendUp, color = "bg-[#0052FF]/10 text-[#0052FF]" }: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center", color)}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <span className={cn(
            "text-xs font-semibold px-2 py-1 rounded-full",
            trendUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
          )}>
            {trendUp ? "↑" : "↓"} {trend}
          </span>
        )}
      </div>
      <div className="text-3xl font-extrabold text-slate-900 mb-1">{value}</div>
      <div className="text-sm text-slate-500 font-medium">{title}</div>
    </div>
  );
}
