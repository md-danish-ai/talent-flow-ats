"use client";

import React from "react";
import { cn } from "@lib/utils";
import { Badge, BadgeColor } from "@components/ui-elements/Badge";
import { Avatar } from "@components/ui-elements/Avatar";
import { STYLE_CONFIG } from "@lib/config/style";

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
        : cn("gap-1.5 p-2", STYLE_CONFIG.innerCardRadius),
    )}
  >
    <div className="flex items-center gap-2">
      <div className="relative shrink-0">
        <Avatar
          name="R D"
          variant="brand"
          size="sm"
          className={compact ? "w-7 h-7" : ""}
        />
        <span
          className={cn(
            "absolute border-2 border-white dark:border-slate-900 rounded-full shadow-sm",
            compact
              ? "-bottom-0.5 -right-0.5 w-2 h-2 border-1"
              : "-bottom-0.5 -right-0.5 w-2.5 h-2.5",
            dotColor,
          )}
        />
      </div>

      <div className="flex flex-col">
        <span
          className={cn(
            "font-black uppercase tracking-widest text-slate-900 dark:text-white leading-none mb-1",
            compact ? "text-[8px]" : "text-[10px]",
          )}
        >
          {label}
        </span>
        <Badge variant="outline" color={badgeColor} shape="square">
          {label}
        </Badge>
      </div>
    </div>
    <p
      className={cn(
        "text-slate-500 dark:text-slate-400 font-medium leading-relaxed italic opacity-70",
        compact ? "text-[8px]" : "text-[9px]",
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
      <div className="flex flex-col w-[240px] p-2 bg-white dark:bg-slate-900/95 rounded-xl shadow-2xl border border-slate-200 dark:border-white/10">
        {statuses.map((status) => (
          <LegendItem key={status.label} {...status} compact={true} />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative w-full mb-4 overflow-hidden bg-white/50 dark:bg-card border border-slate-200 dark:border-border transition-all",
        STYLE_CONFIG.cardRadius,
      )}
    >
      <div className="relative p-4 md:p-5 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-brand-primary rounded-full shadow-lg shadow-brand-primary/20" />
              <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">
                {title}
              </h1>
            </div>
            {subtitle && (
              <p className="text-slate-500 dark:text-slate-400 font-medium text-[10px] ml-3 uppercase tracking-wider opacity-80">
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
