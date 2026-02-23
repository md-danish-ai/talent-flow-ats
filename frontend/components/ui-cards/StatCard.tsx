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
    <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center gap-5 hover:border-brand-primary/30 transition-all group">
      <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <div>
        <Typography variant="body4" className="text-muted-foreground">
          {label}
        </Typography>
        <div className="flex items-baseline gap-2">
          <Typography
            variant="h3"
            as="p"
            weight="extrabold"
            className="text-foreground"
          >
            {value}
          </Typography>
          <Typography
            variant="body5"
            weight="semibold"
            as="span"
            className="text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded"
          >
            {change}
          </Typography>
        </div>
      </div>
    </div>
  );
};
