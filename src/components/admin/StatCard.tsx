import React from "react";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  badge?: string;
}

export default function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  badge,
}: StatCardProps) {
  return (
    <div className="p-5 rounded-2xl bg-white border border-forest-100/90 shadow-soft-sm hover:shadow-soft-md transition-shadow">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-forest-850 uppercase tracking-wider">
          {title}
        </span>
        <div className="w-9 h-9 rounded-xl bg-forest-50 border border-forest-100 flex items-center justify-center text-forest-700">
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3">
        <h3 className="text-2xl font-extrabold text-forest-950 tracking-tight">
          {value}
        </h3>
        {subtitle && (
          <p className="text-xs text-forest-600/80 mt-1 flex items-center gap-1.5">
            {badge && (
              <span className="px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                {badge}
              </span>
            )}
            <span>{subtitle}</span>
          </p>
        )}
      </div>
    </div>
  );
}
