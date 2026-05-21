"use client";

import React from "react";
import { cn } from "@lib/utils";
import { STYLE_CONFIG } from "@lib/config/style";
import { Badge, BadgeColor } from "@components/ui-elements/Badge";
import { Avatar } from "@components/ui-elements/Avatar";

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
  <div
    className={cn(
      "flex flex-col gap-1.5 p-2 transition-all",
      STYLE_CONFIG.innerCardRadius,
    )}
  >
    <div className="flex items-center gap-2">
      {/* Avatar Style matches the table's "brand" variant */}
      <div className="relative shrink-0">
        <Avatar name="M D" variant="brand" size="sm" />
        <span
          className={cn(
            "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border-2 border-white dark:border-slate-900 rounded-full shadow-sm",
            dotColor,
          )}
        />
      </div>

      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white leading-none mb-1">
          {label}
        </span>
        <Badge variant="outline" color={badgeColor} shape="square">
          {label}
        </Badge>
      </div>
    </div>
    <p className="text-[9px] text-slate-500 dark:text-slate-400 font-medium italic leading-tight">
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
    <div
      className={cn(
        "relative w-full mb-4 overflow-hidden bg-white/50 dark:bg-card border border-slate-200 dark:border-border transition-all",
        STYLE_CONFIG.cardRadius,
      )}
    >
      <div className="relative p-4 md:p-5 flex flex-col gap-4">
        {/* Top Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-brand-primary rounded-full shadow-lg shadow-brand-primary/20" />
              <h1 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">
                {title}
              </h1>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-[10px] ml-3 uppercase tracking-wider opacity-80">
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
