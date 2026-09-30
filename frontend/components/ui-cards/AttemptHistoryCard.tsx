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
  Trophy,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { STYLE_CONFIG } from "@lib/config/style";
import {
  cn,
  formatDate,
  formatTime,
  parseUTCDate,
  getThemedCardHoverStyles,
} from "@lib/utils";
import { useMe } from "@hooks/api/user/use-me";
import { getGradeConfig } from "@lib/utils/gradeUtils";

interface AttemptHistoryCardProps {
  attemptId: number;
  paperId: number;
  paperName?: string;
  status: string;
  index: number;
  totalAttempts: number;
  isAutoSubmitted: boolean;
  completionReason?: string;
  startedAt: string;
  submittedAt?: string;
  attemptedCount: number;
  totalQuestions: number;
  unattemptedCount: number;
  userId: number | string;
  statusBadge: React.ReactNode;
  typingStats?: {
    wpm: number;
    accuracy: number;
    errors: number;
    time_taken: number;
  } | null;
  activeDurationSeconds?: number;
  overallGrade?: string;
  interviewDate?: string;
}

export const AttemptHistoryCard = ({
  attemptId,
  paperId,
  paperName,
  index,
  totalAttempts,
  isAutoSubmitted,
  completionReason,
  startedAt,
  submittedAt,
  attemptedCount,
  totalQuestions,
  unattemptedCount,
  userId,
  statusBadge,
  typingStats,
  activeDurationSeconds,
  overallGrade,
  interviewDate,
}: AttemptHistoryCardProps) => {
  const { data: user } = useMe();
  const isProjectLead = user?.role === "project_lead";

  // Calculate Duration
  const getDuration = () => {
    // Prefer cumulative active seconds recorded by backend
    if (activeDurationSeconds && activeDurationSeconds > 0) {
      const mins = Math.floor(activeDurationSeconds / 60);
      const secs = activeDurationSeconds % 60;
      return `${mins}m ${secs}s`;
    }

    // Fallback for legacy attempts or in-progress states
    if (!startedAt || !submittedAt) return "N/A";
    const start = parseUTCDate(startedAt)?.getTime();
    const end = parseUTCDate(submittedAt)?.getTime();
    if (!start || !end) return "N/A";
    const diff = Math.max(0, Math.floor((end - start) / 1000));
    const mins = Math.floor(diff / 60);
    const secs = diff % 60;
    return `${mins}m ${secs}s`;
  };

  const gradeConfig = getGradeConfig(overallGrade);
  const duration = getDuration();
  const completionPercentage =
    totalQuestions > 0
      ? Math.round((attemptedCount / totalQuestions) * 100)
      : 0;

  return (
    <div
      className={cn(
        "bg-card border border-border/70 p-4 md:p-5 shadow-sm space-y-4 transition-all duration-300",
        STYLE_CONFIG.cardRadius,
      )}
    >
      {/* Top Header Row: Attempt Info, Paper & Timings on Left, Action Button on Top Right */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pb-3.5 border-b border-border/50">
        {/* Left: Attempt Number Avatar, Title, Status Badges & Subtitle */}
        <div className="flex items-start sm:items-center gap-3.5 min-w-0">
          <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary font-black text-sm shrink-0 shadow-inner">
            #{totalAttempts - index}
          </div>
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <Typography
                variant="h4"
                className="text-base sm:text-lg font-bold text-foreground leading-snug"
              >
                Interview Attempt #{totalAttempts - index}
              </Typography>
              <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse shrink-0" />
              {statusBadge}
              {(completionReason || isAutoSubmitted) && (
                <Badge
                  variant="outline"
                  color={
                    completionReason === "time_over" || isAutoSubmitted
                      ? "warning"
                      : "secondary"
                  }
                  shape="square"
                  className="font-bold uppercase tracking-wider text-[10px]"
                >
                  {completionReason === "time_over"
                    ? "TIME OVER"
                    : completionReason === "manual"
                      ? "MANUAL"
                      : (
                          completionReason ||
                          (isAutoSubmitted ? "TIME OVER" : "MANUAL")
                        ).toUpperCase()}
                </Badge>
              )}
            </div>

            {/* Subtitle: Paper Name, Date & Session Window */}
            <div className="flex items-center gap-2.5 text-xs text-muted-foreground flex-wrap font-medium">
              <div className="flex items-center gap-1.5 text-foreground font-semibold">
                <FileText size={13} className="text-brand-primary shrink-0" />
                <span
                  className="truncate max-w-[200px] sm:max-w-[280px]"
                  title={paperName || `Paper #${paperId}`}
                >
                  {paperName || `Paper #${paperId}`}
                </span>
              </div>
              <span className="text-border">•</span>
              <div className="flex items-center gap-1.5">
                <Calendar size={13} className="text-orange-500 shrink-0" />
                <span>{formatDate(interviewDate || startedAt)}</span>
              </div>
              <span className="text-border">•</span>
              <div className="flex items-center gap-1.5">
                <Clock3 size={13} className="text-blue-500 shrink-0" />
                <span>
                  {formatTime(startedAt)} –{" "}
                  {submittedAt ? formatTime(submittedAt) : "In Progress"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Right: Analyze Attempt CTA Button */}
        {!isProjectLead && (
          <Link
            href={`/admin/results/round-1/${userId}/attempts/${attemptId}`}
            target="_blank"
            rel="noopener noreferrer"
            className="sm:ml-auto shrink-0"
          >
            <Button
              size="sm"
              variant="primary"
              color="primary"
              shadow
              animate="scale"
              endIcon={<Eye size={14} />}
              className="shadow-md shadow-brand-primary/20 px-3.5 py-1.5 text-xs font-bold"
            >
              Analyze Attempt
            </Button>
          </Link>
        )}
      </div>

      {/* 4 Dashboard Performance Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-3.5">
        {/* 1. Questions Solved */}
        <div
          className={cn(
            "bg-card p-3.5 sm:p-4 flex items-center gap-3.5 transition-all duration-300 ease-out group relative overflow-hidden h-full min-h-[88px] sm:min-h-[92px]",
            STYLE_CONFIG.cardRadius,
            getThemedCardHoverStyles("emerald"),
          )}
        >
          <div
            className={cn(
              "w-11 h-11 sm:w-12 sm:h-12 shadow-sm border border-border/40 flex items-center justify-center transition-all group-hover:scale-105 shrink-0",
              STYLE_CONFIG.iconRadius,
              "bg-emerald-500/10",
            )}
          >
            <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 transition-colors" />
          </div>

          <div className="flex-1 min-w-0 relative z-10">
            <Typography
              variant="h5"
              className="text-muted-foreground/80 uppercase tracking-wider font-bold text-[10px] sm:text-[10.5px] mb-0.5 truncate"
            >
              Questions Solved
            </Typography>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 leading-tight tracking-tight">
                {attemptedCount}/{totalQuestions}
              </span>
              <span className="text-[10.5px] sm:text-xs font-bold text-muted-foreground uppercase whitespace-nowrap">
                ({completionPercentage}%)
              </span>
            </div>
          </div>

          <div className="absolute -top-1 -right-2 opacity-[0.06] dark:opacity-[0.1] pointer-events-none transition-transform group-hover:scale-110 group-hover:-rotate-3 text-emerald-500">
            <CheckCircle2 size={64} />
          </div>
        </div>

        {/* 2. Questions Missed */}
        <div
          className={cn(
            "bg-card p-3.5 sm:p-4 flex items-center gap-3.5 transition-all duration-300 ease-out group relative overflow-hidden h-full min-h-[88px] sm:min-h-[92px]",
            STYLE_CONFIG.cardRadius,
            getThemedCardHoverStyles("amber"),
          )}
        >
          <div
            className={cn(
              "w-11 h-11 sm:w-12 sm:h-12 shadow-sm border border-border/40 flex items-center justify-center transition-all group-hover:scale-105 shrink-0",
              STYLE_CONFIG.iconRadius,
              "bg-amber-500/10",
            )}
          >
            <CircleAlert className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 transition-colors" />
          </div>

          <div className="flex-1 min-w-0 relative z-10">
            <Typography
              variant="h5"
              className="text-muted-foreground/80 uppercase tracking-wider font-bold text-[10px] sm:text-[10.5px] mb-0.5 truncate"
            >
              Questions Missed
            </Typography>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 leading-tight tracking-tight">
                {unattemptedCount}
              </span>
              <span className="text-[10.5px] sm:text-xs font-bold text-muted-foreground uppercase whitespace-nowrap">
                unattempted
              </span>
            </div>
          </div>

          <div className="absolute -top-1 -right-2 opacity-[0.06] dark:opacity-[0.1] pointer-events-none transition-transform group-hover:scale-110 group-hover:-rotate-3 text-amber-500">
            <CircleAlert size={64} />
          </div>
        </div>

        {/* 3. Active Duration */}
        <div
          className={cn(
            "bg-card p-3.5 sm:p-4 flex items-center gap-3.5 transition-all duration-300 ease-out group relative overflow-hidden h-full min-h-[88px] sm:min-h-[92px]",
            STYLE_CONFIG.cardRadius,
            getThemedCardHoverStyles("blue"),
          )}
        >
          <div
            className={cn(
              "w-11 h-11 sm:w-12 sm:h-12 shadow-sm border border-border/40 flex items-center justify-center transition-all group-hover:scale-105 shrink-0",
              STYLE_CONFIG.iconRadius,
              "bg-blue-500/10",
            )}
          >
            <HistoryIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 transition-colors" />
          </div>

          <div className="flex-1 min-w-0 relative z-10">
            <Typography
              variant="h5"
              className="text-muted-foreground/80 uppercase tracking-wider font-bold text-[10px] sm:text-[10.5px] mb-0.5 truncate"
            >
              Active Duration
            </Typography>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-xl sm:text-2xl font-black text-brand-primary leading-tight tracking-tight">
                {duration}
              </span>
              <span className="text-[10.5px] sm:text-xs font-semibold text-muted-foreground whitespace-nowrap">
                test time
              </span>
            </div>
          </div>

          <div className="absolute -top-1 -right-2 opacity-[0.06] dark:opacity-[0.1] pointer-events-none transition-transform group-hover:scale-110 group-hover:-rotate-3 text-blue-500">
            <HistoryIcon size={64} />
          </div>
        </div>

        {/* 4. Overall Grade */}
        <div
          className={cn(
            "bg-card p-3.5 sm:p-4 flex items-center gap-3.5 transition-all duration-300 ease-out group relative overflow-hidden h-full min-h-[88px] sm:min-h-[92px]",
            STYLE_CONFIG.cardRadius,
            getThemedCardHoverStyles(gradeConfig.label || overallGrade),
          )}
        >
          <div
            className={cn(
              "w-11 h-11 sm:w-12 sm:h-12 shadow-sm border border-border/40 flex items-center justify-center transition-all group-hover:scale-105 shrink-0",
              STYLE_CONFIG.iconRadius,
              gradeConfig.bg,
            )}
          >
            <Trophy
              className={cn(
                "w-5 h-5 sm:w-6 sm:h-6 transition-colors",
                gradeConfig.color,
              )}
            />
          </div>

          <div className="flex-1 min-w-0 relative z-10">
            <Typography
              variant="h5"
              className="text-muted-foreground/80 uppercase tracking-wider font-bold text-[10px] sm:text-[10.5px] mb-0.5 truncate"
            >
              Overall Grade
            </Typography>
            <span
              className={cn(
                "text-lg sm:text-xl font-black leading-tight tracking-tight truncate block",
                gradeConfig.color,
              )}
              title={overallGrade || "N/A"}
            >
              {(overallGrade || "N/A").toUpperCase()}
            </span>
          </div>

          <div
            className={cn(
              "absolute -top-1 -right-2 opacity-[0.06] dark:opacity-[0.1] pointer-events-none transition-transform group-hover:scale-110 group-hover:-rotate-3",
              gradeConfig.color,
            )}
          >
            <Trophy size={64} />
          </div>
        </div>
      </div>

      {/* Typing Stats Strip (Clean Footer Bar if typing stats are recorded) */}
      {typingStats && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-50/80 dark:bg-slate-900/60 border border-border/60 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-sm">⌨️</span>
            <span className="font-bold text-foreground text-xs">
              Typing Speed Assessment
            </span>
          </div>
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap text-xs">
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground text-[11px]">Speed:</span>
              <span className="font-bold text-brand-primary">
                {typingStats.wpm} WPM
              </span>
            </div>
            <span className="text-border">•</span>
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground text-[11px]">
                Accuracy:
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">
                {typingStats.accuracy}%
              </span>
            </div>
            <span className="text-border">•</span>
            <div className="flex items-center gap-1.5">
              <span className="text-muted-foreground text-[11px]">Time:</span>
              <span className="font-bold text-amber-600 dark:text-amber-400">
                {Math.round(typingStats.time_taken)}s
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
