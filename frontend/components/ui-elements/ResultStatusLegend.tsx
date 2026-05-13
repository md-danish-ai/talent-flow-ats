"use client";

import React from "react";
import { cn } from "@lib/utils";
import { Badge, BadgeColor } from "@components/ui-elements/Badge";

interface StatusLegendHeaderProps {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  compact?: boolean;
}

const LegendItem = ({
  label,
  description,
  dotColor,
  badgeColor,
  compact = false,
}: {
  label: string;
  description: string;
  dotColor: string;
  badgeColor: BadgeColor;
  compact?: boolean;
}) => (
  <div
    className={cn(
      "flex flex-col transition-all",
      compact
        ? "gap-1 p-2 border-b border-slate-100 dark:border-white/10 last:border-0"
        : "gap-2 p-3 rounded-xl",
    )}
  >
    <div className="flex items-center gap-3">
      <div className="relative shrink-0">
        <div
          className={cn(
            "rounded-lg bg-brand-primary/10 dark:bg-brand-primary/20 flex items-center justify-center font-bold text-brand-primary",
            compact ? "w-7 h-7 text-[8px]" : "w-9 h-9 text-[10px]",
          )}
        >
          RD
        </div>
        <span
          className={cn(
            "absolute border-2 border-white dark:border-slate-900 rounded-full shadow-sm",
            compact
              ? "-bottom-0.5 -right-0.5 w-2.5 h-2.5 border-1"
              : "-bottom-0.5 -right-0.5 w-3 h-3",
            dotColor,
          )}
        />
      </div>

      <div className="flex flex-col">
        <span
          className={cn(
            "font-black uppercase tracking-widest text-slate-900 dark:text-white leading-none",
            compact ? "text-[9px] mb-0.5" : "text-[11px] mb-1",
          )}
        >
          {label}
        </span>
        <Badge
          variant="outline"
          color={badgeColor}
          shape="square"
          className={cn(
            "font-bold py-0 px-1.5 w-fit",
            compact ? "text-[7px] h-3.5" : "text-[9px] h-4",
          )}
        >
          {label}
        </Badge>
      </div>
    </div>
    <p
      className={cn(
        "text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic opacity-70",
        compact ? "text-[10px]" : "text-[10px]",
      )}
    >
      {description}
    </p>
  </div>
);

export function ResultStatusLegend({
  title,
  subtitle,
  action,
  compact = false,
}: StatusLegendHeaderProps) {
  const statuses: {
    label: string;
    description: string;
    dotColor: string;
    badgeColor: BadgeColor;
  }[] = [
    {
      label: "Not Started",
      description: "Candidate has not initiated the assessment yet.",
      dotColor: "bg-slate-400",
      badgeColor: "default",
    },
    {
      label: "Started",
      description: "Assessment is active and currently in progress.",
      dotColor: "bg-violet-500",
      badgeColor: "violet",
    },
    {
      label: "Submitted",
      description: "Assessment completed and results generated.",
      dotColor: "bg-green-500",
      badgeColor: "success",
    },
    {
      label: "Auto Submitted",
      description: "Automatically closed due to time limit.",
      dotColor: "bg-blue-500",
      badgeColor: "blue",
    },
    {
      label: "Expired",
      description: "Session timed out or link became invalid.",
      dotColor: "bg-red-500",
      badgeColor: "error",
    },
  ];

  if (compact) {
    return (
      <div className="flex flex-col w-[280px] p-2 bg-white dark:bg-slate-900/95 rounded-xl shadow-2xl border border-slate-200 dark:border-white/10">
        {statuses.map((status) => (
          <LegendItem key={status.label} {...status} compact={true} />
        ))}
      </div>
    );
  }

  return (
    <div className="relative w-full mb-8 rounded-2xl overflow-hidden bg-white/50 dark:bg-card border border-slate-200 dark:border-border transition-all">
      <div className="relative p-6 md:p-8 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-brand-primary rounded-full shadow-[0_0_12px_rgba(249,99,49,0.4)]" />
              <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">
                {title}
              </h1>
            </div>
            {subtitle && (
              <p className="text-slate-500 dark:text-slate-400 font-medium text-sm ml-4 uppercase tracking-wider opacity-80">
                {subtitle}
              </p>
            )}
          </div>

          {action && <div className="shrink-0">{action}</div>}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-2 pt-2">
          {statuses.map((status) => (
            <LegendItem key={status.label} {...status} />
          ))}
        </div>
      </div>
    </div>
  );
}
