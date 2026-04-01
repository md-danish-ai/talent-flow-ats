"use client";

import React from "react";
import { Typography } from "@components/ui-elements/Typography";
import { Badge } from "@components/ui-elements/Badge";
import { Button } from "@components/ui-elements/Button";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

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
  // Map status to pillar colors
  const getPillarColor = (s?: string) => {
    switch (s?.toLowerCase()) {
      case "submitted":
      case "auto_submitted":
        return "bg-brand-primary";
      case "started":
        return "bg-amber-500";
      case "expired":
        return "bg-rose-500";
      case "system_error":
        return "bg-rose-600";
      default:
        return "bg-border";
    }
  };

  return (
    <div className="group relative flex flex-col gap-6 overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-2 hover:border-brand-primary/50 hover:shadow-2xl hover:shadow-brand-primary/10">
      {/* Left Side Status Pillar */}
      <div
        className={`absolute inset-y-0 left-0 w-1.5 transition-colors duration-300 ${getPillarColor(
          status
        )}`}
      />

      {/* Creative Background Glow */}
      <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-brand-primary/5 blur-3xl transition-all group-hover:bg-brand-primary/15" />

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
        {/* Creative Identity Section */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary/20 via-brand-primary/10 to-transparent text-xl font-black text-brand-primary ring-2 ring-brand-primary/10 transition-all group-hover:ring-brand-primary/30 group-hover:rotate-12">
              {avatarContent}
            </div>
            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-card text-brand-primary shadow-sm">
              <IdentityIcon size={10} />
            </div>
          </div>

          <div className="space-y-2">
            <Typography
              variant="h4"
              className="text-foreground tracking-tight font-bold"
            >
              {title}
            </Typography>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-muted-foreground">
              {subtitle}
              {metadataBadges}
            </div>
          </div>
        </div>

        {/* Status Badge */}
        {statusBadge && (
          <div className="flex flex-col items-end gap-1">
            {statusBadge}
          </div>
        )}
      </div>

      {/* Center Section: Special Metadata Row (if any, e.g. Timestamps) */}
      {/* (Can be expanded if needed, currently keeping it simple for the footer metrics) */}

      {/* Performance / Footer Section */}
      <div className="flex flex-wrap items-center justify-between rounded-xl bg-muted/30 p-4 ring-1 ring-border/50 gap-4">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {metrics?.map((metric, idx) => (
            <React.Fragment key={metric.label}>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
                  {metric.label}
                </span>
                <div
                  className={`flex items-center gap-1.5 font-bold ${
                    metric.color || "text-foreground"
                  }`}
                >
                  <metric.icon size={14} />
                  <span>{metric.value}</span>
                </div>
              </div>
              {idx < metrics.length - 1 && (
                <div className="hidden sm:block h-8 w-px bg-border/60" />
              )}
            </React.Fragment>
          ))}
        </div>

        <Link href={actionHref}>
          <Button
            size="sm"
            variant="primary"
            shadow
            animate="scale"
            className="font-bold h-9 bg-brand-primary hover:bg-brand-primary/90"
            endIcon={<ActionIcon size={14} />}
          >
            {actionLabel}
          </Button>
        </Link>
      </div>
    </div>
  );
};
