"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  ArrowLeft,
} from "lucide-react";
import { Button } from "@components/ui-elements/Button";
import { Badge } from "@components/ui-elements/Badge";
import { Typography } from "@components/ui-elements/Typography";
import {
  cn,
  formatDate,
  formatTime,
  parseUTCDate,
  getThemedCardHoverStyles,
} from "@lib/utils";
import { STYLE_CONFIG } from "@lib/config/style";
import { GRADE_CONFIG, getGradeConfig } from "@lib/utils/gradeUtils";
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
  backHref?: string;
  backLabel?: string;
  onBack?: () => void;
  actions?: React.ReactNode;
}

const NEON_GRADE_EFFECTS: Record<
  string,
  { glow: string; textGlow: string; ring: string }
> = {
  Poor: {
    glow: "shadow-[0_0_24px_rgba(244,63,94,0.95)]",
    textGlow: "drop-shadow-[0_0_8px_rgba(244,63,94,0.9)]",
    ring: "ring-2 ring-rose-200 dark:ring-rose-400",
  },
  "Below Average": {
    glow: "shadow-[0_0_24px_rgba(249,115,22,0.95)]",
    textGlow: "drop-shadow-[0_0_8px_rgba(249,115,22,0.9)]",
    ring: "ring-2 ring-orange-200 dark:ring-orange-400",
  },
  Average: {
    glow: "shadow-[0_0_24px_rgba(245,158,11,0.95)]",
    textGlow: "drop-shadow-[0_0_8px_rgba(245,158,11,0.9)]",
    ring: "ring-2 ring-amber-200 dark:ring-amber-400",
  },
  "Above Average": {
    glow: "shadow-[0_0_24px_rgba(139,92,246,0.95)]",
    textGlow: "drop-shadow-[0_0_8px_rgba(139,92,246,0.9)]",
    ring: "ring-2 ring-purple-200 dark:ring-purple-400",
  },
  Good: {
    glow: "shadow-[0_0_24px_rgba(59,130,246,0.95)]",
    textGlow: "drop-shadow-[0_0_8px_rgba(59,130,246,0.9)]",
    ring: "ring-2 ring-blue-200 dark:ring-blue-400",
  },
  Excellent: {
    glow: "shadow-[0_0_24px_rgba(16,185,129,0.95)]",
    textGlow: "drop-shadow-[0_0_8px_rgba(16,185,129,0.9)]",
    ring: "ring-2 ring-emerald-200 dark:ring-emerald-400",
  },
};

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
  backHref,
  backLabel = "Back to Attempt History",
  onBack,
  actions,
}) => {
  const [hoveredGrade, setHoveredGrade] = useState<string | null>(null);
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

  const gradeConfig = getGradeConfig(overallGrade);

  return (
    <div
      className={cn(
        "bg-card border border-border/70 p-4 md:p-4.5 shadow-sm space-y-3.5",
        STYLE_CONFIG.cardRadius,
      )}
    >
      {/* Top Action Row: Navigation & Actions */}
      {(backHref || onBack || actions) && (
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-border/50">
          <div className="flex items-center gap-3">
            {backHref ? (
              <Link href={backHref}>
                <Button
                  variant="outline"
                  color="primary"
                  size="sm"
                  animate="scale"
                  startIcon={<ArrowLeft size={16} />}
                  className="font-bold text-xs"
                >
                  {backLabel}
                </Button>
              </Link>
            ) : onBack ? (
              <Button
                variant="outline"
                color="primary"
                size="sm"
                animate="scale"
                startIcon={<ArrowLeft size={16} />}
                onClick={onBack}
                className="font-bold text-xs"
              >
                {backLabel}
              </Button>
            ) : null}
          </div>

          {actions && (
            <div className="flex flex-wrap items-center gap-2.5 sm:ml-auto">
              {actions}
            </div>
          )}
        </div>
      )}

      {/* Candidate Profile Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary shrink-0 shadow-inner">
            <User size={22} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-base sm:text-lg font-bold text-foreground leading-snug truncate">
                {username}
              </h2>
              <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse shrink-0" />
              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-brand-primary/10 text-brand-primary font-bold text-xs shrink-0">
                Attempt #{attemptNumber}
              </span>
              <Badge
                color={statusColor}
                variant="outline"
                shape="square"
                className="uppercase font-bold tracking-wider shrink-0"
              >
                {status}
              </Badge>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5 font-medium">
              <Phone size={12} className="opacity-70 shrink-0" />
              <span>{mobile}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Metadata Pills Row (Spacious & Clean Full-Width Strip) */}
      <div className="flex flex-wrap items-center gap-2 text-xs pb-3 border-b border-border/50">
        {/* Paper */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/40 border border-border/50 text-[11px] sm:text-xs">
          <FileText size={12} className="text-brand-primary shrink-0" />
          <span className="text-muted-foreground font-medium">Paper:</span>
          <span
            className="font-bold text-foreground max-w-[180px] sm:max-w-[260px] truncate"
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
          <span className="text-muted-foreground font-medium">Submitted:</span>
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

      {/* Middle Performance Metrics: 4 Dashboard-Themed Hover Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-3.5">
        {/* 1. Total Score */}
        <div
          className={cn(
            "bg-card p-3.5 sm:p-4 flex items-center gap-3.5 transition-all duration-300 ease-out group relative overflow-hidden h-full min-h-[88px] sm:min-h-[92px]",
            STYLE_CONFIG.cardRadius,
            getThemedCardHoverStyles("blue"),
          )}
        >
          {/* Icon Box */}
          <div
            className={cn(
              "w-11 h-11 sm:w-12 sm:h-12 shadow-sm border border-border/40 flex items-center justify-center transition-all group-hover:scale-105 shrink-0",
              STYLE_CONFIG.iconRadius,
              "bg-blue-500/10",
            )}
          >
            <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500 transition-colors" />
          </div>

          <div className="flex-1 min-w-0 relative z-10">
            <Typography
              variant="h5"
              className="text-muted-foreground/80 uppercase tracking-wider font-bold text-[10px] sm:text-[10.5px] mb-0.5 truncate"
            >
              Total Score
            </Typography>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-xl sm:text-2xl font-black text-foreground leading-tight tracking-tight">
                {totalScore.toFixed(2)}
              </span>
              <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">
                / {totalMaxMarks}
              </span>
            </div>
          </div>

          {/* Backdrop Icon */}
          <div className="absolute -top-1 -right-2 opacity-[0.06] dark:opacity-[0.1] pointer-events-none transition-transform group-hover:scale-110 group-hover:-rotate-3 text-blue-500">
            <Trophy size={64} />
          </div>
        </div>

        {/* 2. Accuracy Rate */}
        <div
          className={cn(
            "bg-card p-3.5 sm:p-4 flex items-center gap-3.5 transition-all duration-300 ease-out group relative overflow-hidden h-full min-h-[88px] sm:min-h-[92px]",
            STYLE_CONFIG.cardRadius,
            getThemedCardHoverStyles("emerald"),
          )}
        >
          {/* Icon Box */}
          <div
            className={cn(
              "w-11 h-11 sm:w-12 sm:h-12 shadow-sm border border-border/40 flex items-center justify-center transition-all group-hover:scale-105 shrink-0",
              STYLE_CONFIG.iconRadius,
              "bg-emerald-500/10",
            )}
          >
            <Target className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-500 transition-colors" />
          </div>

          <div className="flex-1 min-w-0 relative z-10">
            <Typography
              variant="h5"
              className="text-muted-foreground/80 uppercase tracking-wider font-bold text-[10px] sm:text-[10.5px] mb-0.5 truncate"
            >
              Accuracy Rate
            </Typography>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 leading-tight tracking-tight">
                {accuracy}%
              </span>
              <span className="text-[10.5px] sm:text-xs font-semibold text-muted-foreground whitespace-nowrap">
                of attempted
              </span>
            </div>
          </div>

          {/* Backdrop Icon */}
          <div className="absolute -top-1 -right-2 opacity-[0.06] dark:opacity-[0.1] pointer-events-none transition-transform group-hover:scale-110 group-hover:-rotate-3 text-emerald-500">
            <Target size={64} />
          </div>
        </div>

        {/* 3. Completion */}
        <div
          className={cn(
            "bg-card p-3.5 sm:p-4 flex items-center gap-3.5 transition-all duration-300 ease-out group relative overflow-hidden h-full min-h-[88px] sm:min-h-[92px]",
            STYLE_CONFIG.cardRadius,
            getThemedCardHoverStyles("amber"),
          )}
        >
          {/* Icon Box */}
          <div
            className={cn(
              "w-11 h-11 sm:w-12 sm:h-12 shadow-sm border border-border/40 flex items-center justify-center transition-all group-hover:scale-105 shrink-0",
              STYLE_CONFIG.iconRadius,
              "bg-amber-500/10",
            )}
          >
            <Activity className="w-5 h-5 sm:w-6 sm:h-6 text-amber-500 transition-colors" />
          </div>

          <div className="flex-1 min-w-0 relative z-10">
            <Typography
              variant="h5"
              className="text-muted-foreground/80 uppercase tracking-wider font-bold text-[10px] sm:text-[10.5px] mb-0.5 truncate"
            >
              Completion
            </Typography>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span className="text-xl sm:text-2xl font-black text-foreground leading-tight tracking-tight">
                {attemptedCount}/{totalQuestions}
              </span>
              <span className="text-[10.5px] sm:text-xs font-semibold text-muted-foreground whitespace-nowrap">
                answered
              </span>
            </div>
          </div>

          {/* Backdrop Icon */}
          <div className="absolute -top-1 -right-2 opacity-[0.06] dark:opacity-[0.1] pointer-events-none transition-transform group-hover:scale-110 group-hover:-rotate-3 text-amber-500">
            <Activity size={64} />
          </div>
        </div>

        {/* 4. Final Grade */}
        <div
          className={cn(
            "bg-card p-3.5 sm:p-4 flex items-center gap-3.5 transition-all duration-300 ease-out group relative overflow-hidden h-full min-h-[88px] sm:min-h-[92px]",
            STYLE_CONFIG.cardRadius,
            getThemedCardHoverStyles(gradeConfig.label || overallGrade),
          )}
        >
          {/* Icon Box */}
          <div
            className={cn(
              "w-11 h-11 sm:w-12 sm:h-12 shadow-sm border border-border/40 flex items-center justify-center transition-all group-hover:scale-105 shrink-0",
              STYLE_CONFIG.iconRadius,
              gradeConfig.bg,
            )}
          >
            <Star
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
              Final Grade
            </Typography>
            <div className="flex items-baseline gap-1.5 flex-wrap">
              <span
                className={cn(
                  "text-lg sm:text-xl font-black leading-tight tracking-tight truncate max-w-full",
                  gradeConfig.color,
                )}
                title={overallGrade || "N/A"}
              >
                {(overallGrade || "N/A").toUpperCase()}
              </span>
              <span className="text-xs font-bold text-muted-foreground whitespace-nowrap">
                ({overallPercentage}%)
              </span>
            </div>
          </div>

          {/* Backdrop Icon */}
          <div
            className={cn(
              "absolute -top-1 -right-2 opacity-[0.06] dark:opacity-[0.1] pointer-events-none transition-transform group-hover:scale-110 group-hover:-rotate-3",
              gradeConfig.color,
            )}
          >
            <Star size={64} />
          </div>
        </div>
      </div>

      {/* Grade Scale Matrix Section (Integrated at bottom of card) */}
      {gradeSettings &&
        gradeSettings.length > 0 &&
        (() => {
          const sorted = [...gradeSettings].sort((a, b) => a.min - b.min);
          return (
            <div className="pt-3.5 border-t border-border/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Star size={13} className="text-brand-primary" />
                  Grade Scale Matrix
                </span>
                {hoveredGrade && (
                  <span className="text-xs font-black text-brand-primary animate-in fade-in duration-200">
                    {hoveredGrade} Range Active
                  </span>
                )}
              </div>

              {/* Segmented Bar with Neon Glow & Hover Scale */}
              <div className="relative w-full h-8 sm:h-9 bg-slate-100 dark:bg-slate-800/90 rounded-2xl p-0.5 flex items-center shadow-inner overflow-visible">
                {sorted.map((g, i) => {
                  const cfg =
                    GRADE_CONFIG[g.grade_label] ?? GRADE_CONFIG["N/A"];
                  const neon = NEON_GRADE_EFFECTS[g.grade_label] ?? {
                    glow: "shadow-[0_0_20px_rgba(59,130,246,0.8)]",
                    textGlow: "",
                    ring: "ring-2 ring-white/80",
                  };
                  const width = g.max - g.min;
                  const isHovered = hoveredGrade === g.grade_label;
                  const isFirst = i === 0;
                  const isLast = i === sorted.length - 1;

                  return (
                    <div
                      key={i}
                      onMouseEnter={() => setHoveredGrade(g.grade_label)}
                      onMouseLeave={() => setHoveredGrade(null)}
                      className={cn(
                        "absolute top-0 h-full flex items-center justify-center cursor-pointer transition-all duration-300 ease-out select-none",
                        cfg.barBg,
                        isFirst && "rounded-l-2xl",
                        isLast && "rounded-r-2xl",
                        isHovered
                          ? cn(
                              "z-30 scale-y-115 sm:scale-y-125 rounded-xl brightness-110",
                              neon.glow,
                              neon.ring,
                            )
                          : hoveredGrade
                            ? "opacity-60 scale-y-95"
                            : "opacity-100 hover:brightness-105",
                      )}
                      style={{ left: `${g.min}%`, width: `${width}%` }}
                    >
                      {width >= 7 && (
                        <span
                          className={cn(
                            "text-[10.5px] sm:text-xs font-black text-white leading-none drop-shadow-md whitespace-nowrap tabular-nums transition-transform duration-200",
                            isHovered && "scale-110 tracking-wide",
                          )}
                        >
                          {g.min}–{g.max}%
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Grade Labels below */}
              <div className="relative w-full h-5">
                {sorted.map((g, i) => {
                  const cfg =
                    GRADE_CONFIG[g.grade_label] ?? GRADE_CONFIG["N/A"];
                  const neon = NEON_GRADE_EFFECTS[g.grade_label];
                  const midPoint = g.min + (g.max - g.min) / 2;
                  const clampedLeft = Math.min(Math.max(midPoint, 0), 100);
                  const isHovered = hoveredGrade === g.grade_label;

                  return (
                    <span
                      key={i}
                      onMouseEnter={() => setHoveredGrade(g.grade_label)}
                      onMouseLeave={() => setHoveredGrade(null)}
                      className={cn(
                        "absolute text-[11px] sm:text-xs font-black whitespace-nowrap leading-none transition-all duration-300 cursor-pointer select-none",
                        cfg.color,
                        isHovered
                          ? cn("scale-115 font-black z-20", neon?.textGlow)
                          : hoveredGrade
                            ? "opacity-50"
                            : "opacity-90 hover:opacity-100",
                      )}
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
