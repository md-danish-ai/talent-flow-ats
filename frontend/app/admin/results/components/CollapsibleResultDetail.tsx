"use client";

import {
  Gauge,
  Target,
  AlertCircle,
  Timer,
  Radio,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  CircleSlash,
} from "lucide-react";
import { Typography } from "@components/ui-elements/Typography";
import { GradeBadge } from "@components/ui-elements/GradeBadge";
import { cn, getGradeConfig, getGradeCardStyles, formatDate } from "@lib/utils";
import { type AdminUserLatestAttempt, type SubjectResult } from "@types";

interface CollapsibleResultDetailProps {
  latest?: AdminUserLatestAttempt | null;
  attempts_count: number;
}

export function CollapsibleResultDetail({
  latest,
  attempts_count,
}: CollapsibleResultDetailProps) {
  const isInProgress = latest?.is_in_progress;
  const subjectResults = latest?.subject_results ?? [];
  const interviewDate = latest?.submitted_at || latest?.started_at;

  return (
    <div className="px-6 py-5 bg-muted/5 space-y-5">
      <div className="space-y-3.5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Typography
              variant="body4"
              className="font-bold border-l-4 border-brand-primary pl-2.5 text-sm"
            >
              {isInProgress
                ? "Live Subject Preview"
                : "Detailed Subject Performance"}
            </Typography>
            {isInProgress && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-500 text-[9px] font-black uppercase tracking-widest animate-pulse">
                <Radio size={8} className="shrink-0" />
                Live
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap text-xs text-muted-foreground font-medium">
            {interviewDate && (
              <div className="flex items-center gap-1.5">
                <Calendar size={13} className="text-brand-primary shrink-0" />
                <span>
                  Interview Date:{" "}
                  <span className="font-semibold text-foreground">
                    {formatDate(interviewDate)}
                  </span>
                </span>
              </div>
            )}
            {latest?.active_duration_seconds ? (
              <div className="flex items-center gap-1.5">
                <Timer size={13} className="text-brand-primary shrink-0" />
                <span>
                  Duration:{" "}
                  <span className="font-semibold text-foreground">
                    {latest.active_duration_seconds < 60
                      ? `${latest.active_duration_seconds}s`
                      : `${Math.floor(latest.active_duration_seconds / 60)}m ${latest.active_duration_seconds % 60}s`}
                  </span>
                </span>
              </div>
            ) : null}
            {latest?.attempt_id && (
              <div className="flex items-center gap-1.5">
                <span>
                  Attempt ID:{" "}
                  <span className="font-semibold text-foreground">
                    #{latest.attempt_id}
                  </span>
                </span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <span>
                Total History:{" "}
                <span className="font-bold text-brand-primary uppercase text-[9px] tracking-wider px-1.5 py-0.5 rounded bg-brand-primary/10">
                  {attempts_count}{" "}
                  {attempts_count === 1 ? "Session" : "Sessions"}
                </span>
              </span>
            </div>
          </div>
        </div>

        {/* In-progress info banner */}
        {isInProgress && (
          <div className="flex items-start gap-2 px-3.5 py-2.5 rounded-xl bg-orange-500/5 border border-orange-500/20 text-orange-600 dark:text-orange-400">
            <Radio size={13} className="shrink-0 mt-0.5 animate-pulse" />
            <Typography variant="body5" className="text-[11px] leading-relaxed">
              Interview is currently in progress. Showing subjects answered so
              far — results will finalise after submission.
            </Typography>
          </div>
        )}

        {/* Subject cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {subjectResults.map((res: SubjectResult, ridx: number) => {
            const inProgress = res.is_in_progress;
            const progressPct =
              res.total_questions > 0
                ? Math.round((res.attempted_count / res.total_questions) * 100)
                : 0;

            const timeVal = res.time_minutes ?? res.duration_minutes;

            if (inProgress) {
              const remainingCount = Math.max(
                0,
                (res.total_questions || 0) - (res.attempted_count || 0),
              );

              return (
                <div
                  key={ridx}
                  className="group relative bg-card p-4 sm:p-4.5 rounded-xl border border-orange-400/40 hover:border-orange-500/50 hover:shadow-orange-500/10 hover:shadow-md flex flex-col gap-3.5 shadow-sm transition-all duration-300"
                >
                  {/* Pulse dot for in-progress */}
                  <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
                  </span>

                  {/* Header: Subject Title (Single Line) + Time & Badge (Row 2 Left & Right) */}
                  <div className="space-y-2">
                    <Typography
                      variant="body4"
                      className="font-bold text-foreground leading-snug text-[15px] block w-full pr-4"
                    >
                      {res.section_name}
                    </Typography>

                    <div className="flex items-center justify-between gap-2 min-h-[22px]">
                      {timeVal ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-orange-500/10 border border-orange-400/20 text-[11px] font-bold text-orange-600 dark:text-orange-400 shadow-2xs">
                          <Clock
                            size={11}
                            className="text-orange-500 shrink-0"
                          />
                          <span>{timeVal} Mins</span>
                        </span>
                      ) : (
                        <span />
                      )}
                      <span className="shrink-0 px-2.5 py-0.5 rounded-md bg-orange-500/10 border border-orange-400/30 text-orange-500 text-[10px] font-black uppercase tracking-wider whitespace-nowrap">
                        In Progress
                      </span>
                    </div>
                  </div>

                  {/* Middle: Attempted count & Progress bar */}
                  <div className="space-y-2">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-xl sm:text-2xl font-black text-orange-500 tracking-tight leading-none">
                          {res.attempted_count}
                        </span>
                        <span className="text-xs font-semibold text-muted-foreground/70">
                          / {res.total_questions} Questions
                        </span>
                      </div>
                      <span className="text-[11px] font-black px-2 py-0.5 rounded-md bg-orange-500/10 text-orange-600 dark:text-orange-400">
                        {progressPct}%
                      </span>
                    </div>

                    {/* Animated progress bar */}
                    <div className="w-full h-2 bg-muted/60 dark:bg-muted/40 rounded-full overflow-hidden shrink-0">
                      <div
                        className="h-full rounded-full bg-orange-400 transition-all duration-1000 animate-pulse"
                        style={{ width: `${progressPct}%` }}
                      />
                    </div>
                  </div>

                  {/* Bottom: Question Counts Breakdown matching Evaluated Cards */}
                  <div className="grid grid-cols-3 gap-1.5 pt-2.5 mt-auto border-t border-border/50">
                    <div className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-orange-500/10 dark:bg-orange-500/5 text-orange-600 dark:text-orange-400">
                      <div className="flex items-center gap-1.5 font-black text-sm sm:text-base leading-none">
                        <CheckCircle2
                          size={14}
                          className="shrink-0 text-orange-500 stroke-[2.2]"
                        />
                        <span>{res.attempted_count ?? 0}</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-tight mt-1 truncate">
                        Attempted
                      </span>
                    </div>

                    <div className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-amber-500/10 dark:bg-amber-500/5 text-amber-600 dark:text-amber-400">
                      <div className="flex items-center gap-1.5 font-black text-sm sm:text-base leading-none">
                        <Clock
                          size={14}
                          className="shrink-0 text-amber-500 stroke-[2.2]"
                        />
                        <span>{remainingCount}</span>
                      </div>
                      <span className="text-[9.5px] sm:text-[10px] font-bold uppercase tracking-tight mt-1 truncate">
                        Unattempted
                      </span>
                    </div>

                    <div className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-blue-500/10 dark:bg-blue-500/5 text-blue-600 dark:text-blue-400">
                      <div className="flex items-center gap-1.5 font-black text-sm sm:text-base leading-none">
                        <Target
                          size={14}
                          className="shrink-0 text-blue-500 stroke-[2.2]"
                        />
                        <span>{res.total_questions}</span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-tight mt-1 truncate">
                        Total
                      </span>
                    </div>
                  </div>
                </div>
              );
            }

            // Completed / Evaluated Subject Card
            const gradeConfig = getGradeConfig(res.grade);
            const gradeStyles = getGradeCardStyles(res.grade);
            const unattemptedCount =
              res.unattempted_count ??
              Math.max(
                0,
                (res.total_questions || 0) - (res.attempted_count || 0),
              );

            return (
              <div
                key={ridx}
                className={cn(
                  "group relative bg-card p-4 sm:p-4.5 rounded-xl border flex flex-col gap-3.5 shadow-sm transition-all duration-300 hover:shadow-md",
                  gradeStyles.card,
                )}
              >
                {/* Header: Subject Title (Single Line) + Time & Badge (Row 2 Left & Right) */}
                <div className="space-y-2">
                  <Typography
                    variant="body4"
                    className="font-bold text-foreground leading-snug text-[15px] block w-full pr-4"
                  >
                    {res.section_name}
                  </Typography>

                  <div className="flex items-center justify-between gap-2 min-h-[22px]">
                    {timeVal ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/60 text-[11px] font-bold text-slate-700 dark:text-slate-300 shadow-2xs">
                        <Clock
                          size={11}
                          className="text-brand-primary shrink-0"
                        />
                        <span>{timeVal} Mins</span>
                      </span>
                    ) : (
                      <span />
                    )}
                    <GradeBadge
                      gradeLabel={res.grade || "N/A"}
                      shape="square"
                      className="shrink-0 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider h-auto"
                    />
                  </div>
                </div>

                {/* Middle: Marks & Mini Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-xl sm:text-2xl font-black text-foreground tracking-tight leading-none">
                        {res.obtained_marks}
                      </span>
                      <span className="text-xs font-semibold text-muted-foreground/70">
                        / {res.total_marks} Marks
                      </span>
                    </div>
                    <span
                      className={cn(
                        "text-[11px] font-black px-2 py-0.5 rounded-md",
                        gradeConfig.bg,
                        gradeConfig.color,
                      )}
                    >
                      {res.percentage}%
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden shrink-0">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-700",
                        gradeConfig.barBg,
                      )}
                      style={{
                        width: `${Math.min(res.percentage || 0, 100)}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Bottom: Questions Breakdown (Correct / Incorrect / Skipped) */}
                <div className="grid grid-cols-3 gap-1.5 pt-2.5 mt-auto border-t border-border/50">
                  {/* Correct */}
                  <div className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/5 text-emerald-600 dark:text-emerald-400">
                    <div className="flex items-center gap-1.5 font-black text-sm sm:text-base leading-none">
                      <CheckCircle2
                        size={14}
                        className="shrink-0 text-emerald-500 stroke-[2.2]"
                      />
                      <span>{res.correct_count ?? 0}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-tight mt-1 truncate">
                      Correct
                    </span>
                  </div>

                  {/* Incorrect */}
                  <div className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-rose-500/10 dark:bg-rose-500/5 text-rose-600 dark:text-rose-400">
                    <div className="flex items-center gap-1.5 font-black text-sm sm:text-base leading-none">
                      <XCircle
                        size={14}
                        className="shrink-0 text-rose-500 stroke-[2.2]"
                      />
                      <span>{res.incorrect_count ?? 0}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-tight mt-1 truncate">
                      Incorrect
                    </span>
                  </div>

                  {/* Skipped */}
                  <div className="flex flex-col items-center justify-center py-2 px-1 rounded-lg bg-amber-500/10 dark:bg-amber-500/5 text-amber-600 dark:text-amber-400">
                    <div className="flex items-center gap-1.5 font-black text-sm sm:text-base leading-none">
                      <CircleSlash
                        size={14}
                        className="shrink-0 text-amber-500 stroke-[2.2]"
                      />
                      <span>{unattemptedCount}</span>
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-tight mt-1 truncate">
                      Skipped
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Empty state when interview is live but no responses yet */}
          {isInProgress && subjectResults.length === 0 && (
            <div className="col-span-full flex flex-col items-center gap-2 py-6 text-muted-foreground/50">
              <Radio size={20} className="animate-pulse text-orange-400" />
              <Typography variant="body5" className="text-center text-xs">
                No subjects attempted yet. Results will appear as the candidate
                answers questions.
              </Typography>
            </div>
          )}
        </div>
      </div>

      {/* Typing Test Stats Section */}
      {latest?.typing_stats && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Typography
              variant="body4"
              className="font-bold border-l-4 border-orange-500 pl-2.5 text-sm"
            >
              Typing Test Performance
            </Typography>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* 1. Speed */}
            <div className="p-3.5 rounded-xl bg-card border border-amber-500/30 dark:border-amber-500/20 hover:border-amber-500/60 shadow-2xs transition-all duration-300 flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Speed
                </span>
                <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center">
                  <Gauge size={15} />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-amber-500 dark:text-amber-400 tracking-tight leading-none">
                  {latest.typing_stats.wpm}
                </span>
                <span className="text-xs font-bold text-muted-foreground/70 uppercase">
                  WPM
                </span>
              </div>
            </div>

            {/* 2. Accuracy */}
            <div className="p-3.5 rounded-xl bg-card border border-emerald-500/30 dark:border-emerald-500/20 hover:border-emerald-500/60 shadow-2xs transition-all duration-300 flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Accuracy
                </span>
                <div className="w-7 h-7 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center">
                  <Target size={15} />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight leading-none">
                  {latest.typing_stats.accuracy}%
                </span>
                <span className="text-xs font-semibold text-muted-foreground/70">
                  accuracy
                </span>
              </div>
            </div>

            {/* Errors */}
            <div className="p-3.5 rounded-xl bg-card border border-rose-500/30 dark:border-rose-500/20 hover:border-rose-500/60 shadow-2xs transition-all duration-300 flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Errors
                </span>
                <div className="w-7 h-7 rounded-lg bg-rose-500/10 text-rose-500 border border-rose-500/20 flex items-center justify-center">
                  <AlertCircle size={15} />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-rose-500 dark:text-rose-400 tracking-tight leading-none">
                  {latest.typing_stats.errors}
                </span>
                <span className="text-xs font-semibold text-muted-foreground/70">
                  mistakes
                </span>
              </div>
            </div>

            {/* Duration */}
            <div className="p-3.5 rounded-xl bg-card border border-indigo-500/30 dark:border-indigo-500/20 hover:border-indigo-500/60 shadow-2xs transition-all duration-300 flex flex-col justify-between gap-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Duration
                </span>
                <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 flex items-center justify-center">
                  <Timer size={15} />
                </div>
              </div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400 tracking-tight leading-none">
                  {latest.typing_stats.time_taken < 60
                    ? `${Math.round(latest.typing_stats.time_taken)}s`
                    : `${Math.floor(latest.typing_stats.time_taken / 60)}m ${Math.round(
                        latest.typing_stats.time_taken % 60,
                      )}s`}
                </span>
                <span className="text-xs font-semibold text-muted-foreground/70">
                  time taken
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
