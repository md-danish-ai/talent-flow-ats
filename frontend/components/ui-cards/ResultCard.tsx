"use client";

import React from "react";
import { Typography } from "@components/ui-elements/Typography";
import { Badge } from "@components/ui-elements/Badge";
import { Button } from "@components/ui-elements/Button";
import {
  LucideIcon,
  CheckCircle2,
  Activity,
  Clock,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { STYLE_CONFIG } from "@lib/config/style";
import { cn } from "@lib/utils";

interface Metric {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color?: string;
}

interface ResultCardProps {
  /** The primary title or name */
  title: string;
  /** Sub-header information (array of icon + text or just strings) */
  subtitle?: React.ReactNode;
  /** Status for the pillar color mapping (submitted, started, expired, etc.) */
  status?: string;
  /** Content for the circular avatar block (Initial or #Index) */
  avatarContent: React.ReactNode;
  /** An icon representing the identity type (User, File, etc.) */
  identityIcon: LucideIcon;
  /** Array of performance metrics to show in the footer */
  metrics?: Metric[];
  /** Extra metadata badges (e.g. Auto-Submit) */
  metadataBadges?: React.ReactNode;
  /** Status badge element (pre-rendered Badge) */
  statusBadge?: React.ReactNode;
  /** Action URL for the primary button */
  actionHref: string;
  /** Label for the primary button */
  actionLabel: string;
  /** Icon for the primary button */
  actionIcon: LucideIcon;
}

export const ResultCard = ({
  title,
  subtitle,
  status,
  avatarContent,
  identityIcon: IdentityIcon,
  metrics,
  metadataBadges,
  statusBadge,
  actionHref,
  actionLabel,
  actionIcon: ActionIcon,
}: ResultCardProps) => {
  // Map status to pillar and glowing gradient colors
  const getPillarConfig = (s?: string) => {
    switch (s?.toLowerCase()) {
      case "submitted":
      case "auto_submitted":
        return {
          bar: "bg-gradient-to-b from-emerald-400 to-teal-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]",
          glow: "from-emerald-500/10 to-teal-500/5",
          ring: "ring-emerald-500/20 group-hover:ring-emerald-500/40",
          text: "text-emerald-500",
        };
      case "started":
        return {
          bar: "bg-gradient-to-b from-blue-400 to-indigo-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]",
          glow: "from-blue-500/10 to-indigo-500/5",
          ring: "ring-blue-500/20 group-hover:ring-blue-500/40",
          text: "text-blue-500",
        };
      case "not_started":
        return {
          bar: "bg-gradient-to-b from-amber-400 to-orange-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]",
          glow: "from-amber-500/10 to-orange-500/5",
          ring: "ring-amber-500/20 group-hover:ring-amber-500/40",
          text: "text-amber-500",
        };
      case "expired":
      case "system_error":
        return {
          bar: "bg-gradient-to-b from-rose-500 to-red-600 shadow-[0_0_15px_rgba(239,68,68,0.5)]",
          glow: "from-rose-500/10 to-red-600/5",
          ring: "ring-rose-500/20 group-hover:ring-rose-500/40",
          text: "text-rose-500",
        };
      default:
        return {
          bar: "bg-slate-300 dark:bg-slate-700",
          glow: "from-slate-500/5 to-slate-600/5",
          ring: "ring-border",
          text: "text-muted-foreground",
        };
    }
  };

  const config = getPillarConfig(status);

  return (
    <div
      className={cn(
        "group relative flex flex-col gap-6 overflow-hidden border border-border bg-white/70 dark:bg-card/70 backdrop-blur-md p-6 md:p-8 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-2 hover:border-brand-primary/30 hover:shadow-[0_20px_50px_rgba(249,99,49,0.08)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)]",
        STYLE_CONFIG.cardRadius,
      )}
    >
      {/* Left Side Dynamic Glowing Status Pillar */}
      <div
        className={`absolute inset-y-0 left-0 w-[5px] transition-all duration-500 rounded-r-full ${config.bar}`}
      />

      {/* Creative Background Glow */}
      <div
        className={`absolute -top-16 -right-16 h-40 w-40 rounded-full bg-gradient-to-br ${config.glow} blur-3xl transition-all duration-700 group-hover:scale-125`}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        {/* Creative Identity Section */}
        <div className="flex items-center gap-5">
          <div className="relative shrink-0">
            <div
              className={cn(
                `flex h-16 w-16 items-center justify-center bg-gradient-to-br from-brand-primary/10 via-brand-primary/5 to-transparent text-xl font-black text-brand-primary ring-2 ${config.ring} transition-all duration-500 group-hover:scale-105 group-hover:rotate-6`,
                STYLE_CONFIG.innerCardRadius,
              )}
            >
              {avatarContent}
            </div>
            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-xl border border-border bg-white dark:bg-slate-900 text-brand-primary shadow-sm">
              <IdentityIcon size={12} />
            </div>
          </div>

          <div className="space-y-1.5">
            <Typography
              variant="h3"
              className="text-foreground tracking-tight font-black sm:text-lg"
            >
              {title}
            </Typography>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-muted-foreground">
              {subtitle}
              {metadataBadges}
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex flex-col items-start sm:items-end gap-1 shrink-0">
          {statusBadge ||
            (status && (
              <Badge
                variant="outline"
                shape="square"
                color={
                  status.toLowerCase() === "submitted" ||
                  status.toLowerCase() === "auto_submitted"
                    ? "success"
                    : status.toLowerCase() === "started"
                      ? "secondary"
                      : status.toLowerCase() === "not_started"
                        ? "warning"
                        : status.toLowerCase() === "expired" ||
                            status.toLowerCase() === "system_error"
                          ? "error"
                          : "default"
                }
                icon={
                  status.toLowerCase() === "submitted" ||
                  status.toLowerCase() === "auto_submitted" ? (
                    <CheckCircle2 size={12} />
                  ) : status.toLowerCase() === "started" ? (
                    <Activity size={12} />
                  ) : status.toLowerCase() === "not_started" ? (
                    <Clock size={12} />
                  ) : (
                    <AlertCircle size={12} />
                  )
                }
                className="px-3.5 py-1 uppercase tracking-wider font-black text-[9px] rounded-lg shadow-sm"
              >
                {status.replace("_", " ")}
              </Badge>
            ))}
        </div>
      </div>

      {/* Performance / Footer Section */}
      <div
        className={cn(
          "flex flex-col lg:flex-row lg:items-center justify-between bg-slate-50/50 dark:bg-slate-900/30 p-5 border border-border/40 gap-6 mt-auto",
          STYLE_CONFIG.innerCardRadius,
        )}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full lg:w-auto">
          {metrics?.map((metric) => (
            <div
              key={metric.label}
              className="flex flex-col gap-1 pr-4 border-r-0 sm:border-r border-border/30 last:border-0"
            >
              <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
                {metric.label}
              </span>
              <div
                className={`flex items-center gap-1.5 font-bold text-sm tracking-tight ${
                  metric.color || "text-foreground"
                }`}
              >
                <metric.icon size={14} className="opacity-80" />
                <span className="truncate max-w-[150px]">{metric.value}</span>
              </div>
            </div>
          ))}
        </div>

        <Link href={actionHref} className="shrink-0 w-full lg:w-auto">
          <Button
            size="sm"
            variant="primary"
            shadow
            animate="scale"
            className="font-black h-11 bg-brand-primary hover:bg-brand-primary/95 text-xs w-full lg:w-auto shadow-lg shadow-brand-primary/10"
            endIcon={<ActionIcon size={14} />}
          >
            {actionLabel}
          </Button>
        </Link>
      </div>
    </div>
  );
};
