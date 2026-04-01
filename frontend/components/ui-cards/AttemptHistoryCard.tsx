"use client";

import React from "react";
import { Typography } from "@components/ui-elements/Typography";
import { Badge } from "@components/ui-elements/Badge";
import { Button } from "@components/ui-elements/Button";
import {
  Clock3,
  CheckCircle2,
  CircleAlert,
  FileText,
  History as HistoryIcon,
  Eye,
} from "lucide-react";
import Link from "next/link";

interface AttemptHistoryCardProps {
  attemptId: number;
  paperId: number;
  status: string;
  index: number;
  isAutoSubmitted: boolean;
  completionReason?: string;
  startedAt: string;
  submittedAt?: string;
  attemptedCount: number;
  totalQuestions: number;
  unattemptedCount: number;
  userId: number | string;
  statusBadge: React.ReactNode;
}

export const AttemptHistoryCard = ({
  attemptId,
  paperId,
  status,
  index,
  isAutoSubmitted,
  completionReason,
  startedAt,
  submittedAt,
  attemptedCount,
  totalQuestions,
  unattemptedCount,
  userId,
  statusBadge,
}: AttemptHistoryCardProps) => {
  // Calculate Duration
  const getDuration = () => {
    if (!startedAt || !submittedAt) return "--:--";
    const start = new Date(startedAt).getTime();
    const end = new Date(submittedAt).getTime();
    const diff = Math.floor((end - start) / 1000);
    const mins = Math.floor(diff / 60);
    const secs = diff % 60;
    return `${mins}m ${secs}s`;
  };

  // Map status to pillar colors
  const getPillarColor = (s: string) => {
    switch (s.toLowerCase()) {
      case "submitted":
      case "auto_submitted":
        return "bg-brand-primary";
      case "started":
        return "bg-amber-500";
      default:
        return "bg-rose-500";
    }
  };

  return (
    <div className="group relative flex flex-col gap-6 overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-2 hover:border-brand-primary/50 hover:shadow-2xl hover:shadow-brand-primary/10">
      {/* Left Side Status Pillar */}
      <div
        className={`absolute inset-y-0 left-0 w-1.5 transition-colors duration-300 ${getPillarColor(status)}`}
      />

      {/* Creative Background Glow */}
      <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-brand-primary/5 blur-3xl transition-all group-hover:bg-brand-primary/15" />

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
        {/* Creative Identity Section */}
        <div className="flex items-center gap-5">
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-primary/20 via-brand-primary/10 to-transparent text-xl font-black text-brand-primary ring-2 ring-brand-primary/10 transition-all group-hover:ring-brand-primary/30 group-hover:rotate-12">
              #{index + 1}
            </div>
            <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-background bg-card text-brand-primary shadow-sm">
              <HistoryIcon size={10} />
            </div>
          </div>

          <div className="space-y-2">
            <Typography
              variant="h4"
              className="text-foreground tracking-tight font-bold"
            >
              Interview Attempt #{index + 1}
            </Typography>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {statusBadge}

              <div className="flex items-center gap-2 px-2 py-0.5 rounded-full bg-muted/40 border border-border/40">
                <Badge
                  variant="outline"
                  color={isAutoSubmitted ? "warning" : "secondary"}
                  className="border-none bg-transparent p-0 text-[10px] lowercase font-bold tracking-widest text-muted-foreground"
                >
                  {isAutoSubmitted
                    ? "Auto-Submit"
                    : completionReason || "Manual"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Time Data Row (Integrated into specialized card) */}
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 rounded-xl bg-muted/20 px-4 py-3 border border-border/30">
          {/* Date Column */}
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
              Date
            </span>
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-foreground">
              <FileText size={12} className="text-brand-primary" />
              <span>
                {new Date(startedAt).toLocaleDateString([], {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="h-6 w-px bg-border/40 hidden md:block" />

          {/* Started At Column */}
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
              Started At
            </span>
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-foreground">
              <Clock3 size={12} className="text-brand-primary" />
              <span>
                {new Date(startedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          <div className="h-6 w-px bg-border/40 hidden md:block" />

          {/* Submitted At Column */}
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
              Submitted At
            </span>
            <div className="flex items-center gap-1.5 text-[12px] font-semibold text-foreground">
              <CheckCircle2 size={12} className={`text-emerald-500`} />
              <span>
                {submittedAt
                  ? new Date(submittedAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "--:--"}
              </span>
            </div>
          </div>

          <div className="h-6 w-px bg-border/40 hidden md:block" />

          {/* Duration Column */}
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
              Duration
            </span>
            <div className="flex items-center gap-1.5 text-[12px] font-black text-brand-primary">
              <HistoryIcon size={12} />
              <span>{getDuration()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Footer */}
      <div className="flex flex-wrap items-center justify-between rounded-xl bg-muted/30 p-4 ring-1 ring-border/50 gap-4">
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
              Paper
            </span>
            <div className="flex items-center gap-1.5 text-brand-primary font-bold">
              <FileText size={14} />
              <span>Paper #{paperId}</span>
            </div>
          </div>
          <div className="hidden sm:block h-8 w-px bg-border/60" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
              Questions Solved
            </span>
            <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
              <CheckCircle2 size={14} />
              <span>
                {attemptedCount}/{totalQuestions}
              </span>
            </div>
          </div>
          <div className="hidden sm:block h-8 w-px bg-border/60" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80">
              Questions Missed
            </span>
            <div className="flex items-center gap-1.5 text-rose-500 font-bold">
              <CircleAlert size={14} />
              <span>{unattemptedCount}</span>
            </div>
          </div>
        </div>

        <Link href={`/admin/results/${userId}/attempts/${attemptId}`}>
          <Button
            size="sm"
            variant="primary"
            shadow
            animate="scale"
            className="font-bold h-9 bg-brand-primary hover:bg-brand-primary/90"
            endIcon={<Eye size={14} />}
          >
            Analyze Attempt
          </Button>
        </Link>
      </div>
    </div>
  );
};
