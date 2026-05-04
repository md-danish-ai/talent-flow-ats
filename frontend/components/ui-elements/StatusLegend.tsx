"use client";

import React from "react";
import { cn } from "@lib/utils";
import { Badge, BadgeColor } from "@components/ui-elements/Badge";

interface StatusLegendHeaderProps {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
}

const LegendItem = ({
  label,
  description,
  dotColor,
  badgeColor,
}: {
  label: string;
  description: string;
  dotColor: string;
  badgeColor: BadgeColor;
}) => (
  <div className="flex flex-col gap-2 p-3 rounded-xl transition-all">
    <div className="flex items-center gap-3">
      {/* Avatar Style matches the table's "brand" variant (usually squared/rounded-lg) */}
      <div className="relative shrink-0">
        <div className="w-9 h-9 rounded-lg bg-brand-primary/10 dark:bg-brand-primary/20 flex items-center justify-center text-[10px] font-bold text-brand-primary">
          MD
        </div>
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-white dark:border-slate-900 rounded-full shadow-sm",
            dotColor,
          )}
        />
      </div>

      <div className="flex flex-col">
        <span className="text-[11px] font-black uppercase tracking-widest text-slate-900 dark:text-white leading-none mb-1">
          {label}
        </span>
        <Badge
          variant="outline"
          color={badgeColor}
          shape="square"
          className="text-[8px] h-4 px-1.5 font-black py-0 w-fit uppercase tracking-tighter"
        >
          {label}
        </Badge>
      </div>
    </div>
    <p className="text-[10px] text-slate-500 dark:text-slate-400 font-medium italic leading-tight">
      {description}
    </p>
  </div>
);

export function AttemptStatusLegend({
  title,
  subtitle,
  action,
}: StatusLegendHeaderProps) {
  const statuses: {
    label: string;
    description: string;
    dotColor: string;
    badgeColor: BadgeColor;
  }[] = [
    {
      label: "Pending",
      description: "No paper assigned, initial state.",
      dotColor: "bg-amber-500",
      badgeColor: "warning",
    },
    {
      label: "Ready",
      description: "Paper assigned, awaiting login.",
      dotColor: "bg-blue-500",
      badgeColor: "blue",
    },
    {
      label: "In Progress",
      description: "Active attempt, candidate is online.",
      dotColor: "bg-orange-500",
      badgeColor: "primary",
    },
    {
      label: "Submitted",
      description: "Process complete, candidate finished.",
      dotColor: "bg-green-500",
      badgeColor: "success",
    },
    {
      label: "Expired",
      description: "Time limit reached, session locked.",
      dotColor: "bg-red-500",
      badgeColor: "error",
    },
  ];

  return (
    <div className="relative w-full mb-8 rounded-2xl overflow-hidden bg-white/50 dark:bg-card border border-slate-200 dark:border-border transition-all">
      <div className="relative p-6 md:p-8 flex flex-col gap-6">
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-6 bg-brand-primary rounded-full shadow-lg shadow-brand-primary/20" />
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">
                {title}
              </h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-sm ml-4 uppercase tracking-wider opacity-80">
              {subtitle}
            </p>
          </div>

          {action && <div className="shrink-0">{action}</div>}
        </div>

        {/* Legend Grid Section */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 pt-2">
          {statuses.map((status) => (
            <LegendItem key={status.label} {...status} />
          ))}
        </div>
      </div>
    </div>
  );
}
