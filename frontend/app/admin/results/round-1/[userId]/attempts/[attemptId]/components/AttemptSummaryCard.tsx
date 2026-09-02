"use client";

import React from "react";
import {
  User,
  Calendar,
  Clock,
  CheckCircle,
  History,
  FileText,
  Phone,
  Trophy,
  Target,
  Activity,
  Star,
} from "lucide-react";
import { Badge } from "@components/ui-elements/Badge";
import { cn, formatDate, formatTime, parseUTCDate } from "@lib/utils";
import { STYLE_CONFIG } from "@lib/config/style";
import { GRADE_CONFIG } from "@lib/utils/gradeUtils";
import { GradeSetting } from "@types";

interface AttemptSummaryCardProps {
  attemptNumber: number;
  status: string;
  username: string;
  mobile: string;
  paperName: string;
  startedAt: string;
  submittedAt?: string | null;
  totalScore: number;
  totalMaxMarks: number;
  correctCount: number;
  attemptedCount: number;
  totalQuestions: number;
  overallGrade: string;
  overallPercentage: number;
  gradeSettings?: GradeSetting[];
}

export const AttemptSummaryCard: React.FC<AttemptSummaryCardProps> = ({
  attemptNumber,
  status,
  username,
  mobile,
  paperName,
  startedAt,
  submittedAt,
  totalScore,
  totalMaxMarks,
  correctCount,
  attemptedCount,
  totalQuestions,
  overallGrade,
  overallPercentage,
  gradeSettings,
}) => {
  const calculateDuration = (start: string, end?: string | null) => {
    if (!start || !end) return "N/A";
    const s = parseUTCDate(start)?.getTime();
    const e = parseUTCDate(end)?.getTime();
    if (!s || !e) return "N/A";
    const diff = Math.max(0, e - s);
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return `${mins}m ${secs}s`;
  };

  const duration = calculateDuration(startedAt, submittedAt);

  const statusColor =
    status === "auto_submitted"
      ? "warning"
      : status === "submitted"
        ? "success"
        : status === "started"
          ? "secondary"
          : "default";

  const accuracy =
    attemptedCount > 0 ? Math.round((correctCount / attemptedCount) * 100) : 0;

  const getGradeColor = (grade: string) => {
    const upper = (grade || "").toUpperCase();
    if (upper.includes("EXCELLENT") || upper.includes("A"))
      return "text-emerald-600 dark:text-emerald-400";
    if (upper.includes("GOOD") || upper.includes("B"))
      return "text-brand-primary";
    if (upper.includes("AVERAGE") || upper.includes("C"))
      return "text-amber-600 dark:text-amber-400";
    if (upper.includes("POOR") || upper.includes("D") || upper.includes("FAIL"))
      return "text-rose-600 dark:text-rose-400";
    return "text-indigo-600 dark:text-indigo-400";
  };

  return (
    <div
      className={cn(
        "bg-card border border-border/70 p-4 md:p-4.5 shadow-sm space-y-3.5",
        STYLE_CONFIG.cardRadius,
      )}
    >
      {/* Top Header: Candidate & Attempt on Left, Timing / Paper Details on Right */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-border/50">
        {/* Left Info: User Avatar, Name, Attempt Number, Status */}
        <div className="flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shrink-0 shadow-inner">
            <User size={20} />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-foreground leading-snug">
                {username}
              </h2>
              <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse" />
              <span className="inline-flex items-center px-2 py-0.5 rounded bg-brand-primary/10 text-brand-primary font-bold text-xs">
                Attempt #{attemptNumber}
              </span>
              <Badge
                color={statusColor}
                variant="outline"
                shape="square"
                className="uppercase font-bold tracking-wider"
              >
                {status}
              </Badge>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5 font-medium">
              <Phone size={11} className="opacity-70" />
              <span>{mobile}</span>
            </div>
          </div>
        </div>

        {/* Right Info: Compact Metadata Pills */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {/* Paper */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/40 border border-border/50 text-[11px] sm:text-xs">
            <FileText size={12} className="text-brand-primary shrink-0" />
            <span className="text-muted-foreground font-medium">Paper:</span>
            <span
              className="font-bold text-foreground max-w-[140px] sm:max-w-[180px] truncate"
              title={paperName}
            >
              {paperName}
            </span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/40 border border-border/50 text-[11px] sm:text-xs">
            <Calendar size={12} className="text-brand-primary shrink-0" />
            <span className="font-bold text-foreground">
              {formatDate(startedAt)}
            </span>
          </div>

          {/* Started */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/40 border border-border/50 text-[11px] sm:text-xs">
            <Clock size={12} className="text-orange-500 shrink-0" />
            <span className="text-muted-foreground font-medium">Started:</span>
            <span className="font-bold text-foreground">
              {formatTime(startedAt)}
            </span>
          </div>

          {/* Submitted */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/40 border border-border/50 text-[11px] sm:text-xs">
            <CheckCircle size={12} className="text-emerald-500 shrink-0" />
            <span className="text-muted-foreground font-medium">
              Submitted:
            </span>
            <span className="font-bold text-foreground">
              {submittedAt ? formatTime(submittedAt) : "N/A"}
            </span>
          </div>

          {/* Duration */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/40 border border-border/50 text-[11px] sm:text-xs">
            <History size={12} className="text-indigo-500 shrink-0" />
            <span className="text-muted-foreground font-medium">Duration:</span>
            <span className="font-bold text-brand-primary">{duration}</span>
          </div>
        </div>
      </div>

      {/* Middle Performance Metrics: 4 Sleek Integrated Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 md:gap-3">
        {/* 1. Total Score */}
        <div className="p-3 sm:p-3.5 rounded-lg bg-muted/20 border border-border/40 hover:border-brand-primary/30 transition-colors flex flex-col justify-between gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Total Score
            </span>
            <div className="p-1 rounded-md bg-brand-primary/10 text-brand-primary">
              <Trophy size={14} />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl sm:text-2xl font-black text-foreground leading-none">
              {totalScore.toFixed(2)}
            </span>
            <span className="text-[11px] sm:text-xs font-bold text-muted-foreground">
              / {totalMaxMarks}
            </span>
          </div>
        </div>

        {/* 2. Accuracy Rate */}
        <div className="p-3 sm:p-3.5 rounded-lg bg-muted/20 border border-border/40 hover:border-emerald-500/30 transition-colors flex flex-col justify-between gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Accuracy Rate
            </span>
            <div className="p-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Target size={14} />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 leading-none">
              {accuracy}%
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold text-muted-foreground uppercase">
              of attempted
            </span>
          </div>
        </div>

        {/* 3. Completion */}
        <div className="p-3 sm:p-3.5 rounded-lg bg-muted/20 border border-border/40 hover:border-amber-500/30 transition-colors flex flex-col justify-between gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Completion
            </span>
            <div className="p-1 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Activity size={14} />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span className="text-xl sm:text-2xl font-black text-foreground leading-none">
              {attemptedCount}/{totalQuestions}
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold text-muted-foreground uppercase">
              answered
            </span>
          </div>
        </div>

        {/* 4. Final Grade */}
        <div className="p-3 sm:p-3.5 rounded-lg bg-muted/20 border border-border/40 hover:border-indigo-500/30 transition-colors flex flex-col justify-between gap-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Final Grade
            </span>
            <div className="p-1 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Star size={14} />
            </div>
          </div>
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <span
              className={cn(
                "text-xl sm:text-2xl font-black leading-none",
                getGradeColor(overallGrade),
              )}
            >
              {(overallGrade || "N/A").toUpperCase()}
            </span>
            <span className="text-[10px] sm:text-[11px] font-bold text-muted-foreground">
              ({overallPercentage}%)
            </span>
          </div>
        </div>
      </div>

      {/* Grade Scale Matrix Section (Integrated at bottom of card) */}
      {gradeSettings &&
        gradeSettings.length > 0 &&
        (() => {
          const sorted = [...gradeSettings].sort((a, b) => a.min - b.min);
          return (
            <div className="pt-3 border-t border-border/40 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Star size={12} className="text-brand-primary" />
                  Grade Scale Matrix
                </span>
              </div>

              {/* Segmented Bar */}
              <div className="relative w-full h-5 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden">
                {sorted.map((g, i) => {
                  const cfg =
                    GRADE_CONFIG[g.grade_label] ?? GRADE_CONFIG["N/A"];
                  const width = g.max - g.min;
                  return (
                    <div
                      key={i}
                      className={`absolute top-0 h-full ${cfg.barBg} flex items-center justify-center`}
                      style={{ left: `${g.min}%`, width: `${width}%` }}
                    >
                      {width >= 8 && (
                        <span className="text-[9px] font-bold text-white leading-none drop-shadow-sm whitespace-nowrap tabular-nums">
                          {g.min}–{g.max}%
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Grade Labels below */}
              <div className="relative w-full h-3.5">
                {sorted.map((g, i) => {
                  const cfg =
                    GRADE_CONFIG[g.grade_label] ?? GRADE_CONFIG["N/A"];
                  const midPoint = g.min + (g.max - g.min) / 2;
                  const clampedLeft = Math.min(Math.max(midPoint, 0), 100);
                  return (
                    <span
                      key={i}
                      className={`absolute text-[10px] font-bold ${cfg.color} whitespace-nowrap leading-none`}
                      style={{
                        left: `${clampedLeft}%`,
                        transform: "translateX(-50%)",
                      }}
                    >
                      {g.grade_label}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })()}
    </div>
  );
};
