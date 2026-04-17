"use client";

import React from "react";
import { Typography } from "@components/ui-elements/Typography";
import { Activity, Layers, UserCheck } from "lucide-react";
import { cn } from "@lib/utils";

interface StatsCardsProps {
  totalRules: number;
  activeRules: number;
  assignmentsToday: number;
  isLoading: boolean;
}

export function StatsCards({
  totalRules,
  activeRules,
  assignmentsToday,
  isLoading,
}: StatsCardsProps) {
  const stats = [
    {
      label: "Total Rules",
      value: totalRules,
      icon: Layers,
      color: "blue",
      description: "Total configured targets",
    },
    {
      label: "Active Running",
      value: activeRules,
      icon: Activity,
      color: "green",
      description: "Currently assigning papers",
    },
    {
      label: "Auto Assigned Today",
      value: assignmentsToday,
      icon: UserCheck,
      color: "brand",
      description: "Successfully processed",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {stats.map((stat, i) => (
        <div
          key={i}
          className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-start gap-4"
        >
          <div
            className={cn(
              "p-3 rounded-xl",
              stat.color === "blue" &&
                "bg-blue-50 text-blue-600 dark:bg-blue-900/20",
              stat.color === "green" &&
                "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20",
              stat.color === "brand" &&
                "bg-brand-primary/10 text-brand-primary",
            )}
          >
            <stat.icon className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <Typography
              variant="body5"
              weight="bold"
              className="text-muted-foreground uppercase tracking-wider mb-1"
            >
              {stat.label}
            </Typography>
            <div className="flex items-baseline gap-2">
              <Typography variant="h2" weight="bold">
                {isLoading ? "..." : stat.value}
              </Typography>
            </div>
            <Typography
              variant="body5"
              className="text-muted-foreground mt-1 font-medium"
            >
              {stat.description}
            </Typography>
          </div>
        </div>
      ))}
    </div>
  );
}
