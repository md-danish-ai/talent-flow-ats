import React from "react";
import { Typography } from "@components/ui-elements/Typography";

interface StatCardProps {
  label: string;
  value: string;
  change: string;
  icon: React.ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  change,
  icon,
}) => {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm flex items-center gap-5 hover:border-brand-primary/30 hover:shadow-[0_20px_25px_-5px_theme(colors.brand-primary/10%),0_8px_10px_-6px_theme(colors.brand-primary/10%)] transition-all group">
      <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center text-[var(--color-brand-primary)] group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <Typography variant="body4" color="text-slate-500">
          {label}
        </Typography>
        <div className="flex items-baseline gap-2">
          <Typography
            variant="h1"
            as="p"
            weight="extrabold"
            color="text-slate-900"
          >
            {value}
          </Typography>
          <Typography
            variant="body5"
            weight="semibold"
            as="span"
            className="text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded"
          >
            {change}
          </Typography>
        </div>
      </div>
    </div>
  );
};
