"use client";

import { Gauge, Target, AlertCircle, Timer, Radio } from "lucide-react";
import { Typography } from "@components/ui-elements/Typography";
import { Badge } from "@components/ui-elements/Badge";
import { cn, getGradeConfig } from "@lib/utils";
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

  return (
    <div className="p-8 bg-muted/5 space-y-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Typography
              variant="body4"
              className="font-bold border-l-4 border-brand-primary pl-3"
            >
              {isInProgress
                ? "Live Subject Preview"
                : "Detailed Subject Performance"}
            </Typography>
            {isInProgress && (
              <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-500 text-[10px] font-black uppercase tracking-widest animate-pulse">
                <Radio size={9} className="shrink-0" />
                Live
              </span>
            )}
          </div>
          <div className="flex flex-col items-end">
            <Typography variant="body5" className="text-muted-foreground">
              Attempt ID: #{latest?.attempt_id}
            </Typography>
            <Typography
              variant="body5"
              className="font-bold text-brand-primary uppercase text-[9px] tracking-widest mt-1"
            >
              Total History: {attempts_count} Sessions
            </Typography>
          </div>
        </div>

        {/* In-progress info banner */}
        {isInProgress && (
          <div className="flex items-start gap-2.5 px-4 py-3 rounded-xl bg-orange-500/5 border border-orange-500/20 text-orange-600 dark:text-orange-400">
            <Radio size={14} className="shrink-0 mt-0.5 animate-pulse" />
            <Typography variant="body5" className="text-[11px] leading-relaxed">
              Interview is currently in progress. Showing subjects answered so
              far — results will finalise after submission.
            </Typography>
          </div>
        )}

        {/* Subject cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {subjectResults.map((res: SubjectResult, ridx: number) => {
            const inProgress = res.is_in_progress;
            const progressPct =
              res.total_questions > 0
                ? Math.round((res.attempted_count / res.total_questions) * 100)
                : 0;

            return (
              <div
                key={ridx}
                className={cn(
                  "group relative bg-card p-5 rounded-2xl border flex flex-col gap-4 shadow-sm transition-all duration-300",
                  inProgress
                    ? "border-orange-400/40 hover:border-orange-500/50 hover:shadow-orange-500/10 hover:shadow-md"
                    : "border-border/50 hover:shadow-md hover:border-brand-primary/30",
                )}
              >
                {/* Pulse dot for in-progress */}
                {inProgress && (
                  <span className="absolute top-3 right-3 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500" />
                  </span>
                )}

                {/* Section name + badge */}
                <div className="flex items-start justify-between gap-3 pr-4">
                  <Typography
                    variant="body4"
                    className="font-bold text-slate-700 dark:text-slate-200 leading-tight line-clamp-2"
                  >
                    {res.section_name}
                  </Typography>
                  {inProgress ? (
                    <span className="shrink-0 px-1.5 py-0.5 rounded-md bg-orange-500/10 border border-orange-400/30 text-orange-500 text-[9px] font-black uppercase tracking-widest whitespace-nowrap">
                      In Progress
                    </span>
                  ) : (
                    <Badge
                      variant="fill"
                      shape="square"
                      color={getGradeConfig(res.grade).badgeColor}
                    >
                      {res.grade}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-col gap-2 mt-auto">
                  {inProgress ? (
                    /* Live preview: show attempted / total questions */
                    <>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-xl font-black text-orange-500 leading-none">
                          {res.attempted_count}
                        </span>
                        <span className="text-muted-foreground/40 font-bold text-sm">
                          /
                        </span>
                        <span className="text-base font-bold text-muted-foreground">
                          {res.total_questions}
                        </span>
                        <span className="text-[10px] text-muted-foreground/60 font-medium ml-0.5">
                          Qs
                        </span>
                      </div>

                      {/* Animated progress bar */}
                      <div className="w-full h-1.5 bg-slate-200/60 dark:bg-slate-700/50 rounded-full overflow-hidden shrink-0">
                        <div
                          className="h-full rounded-full bg-orange-400 transition-all duration-1000 animate-pulse"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                      <Typography
                        variant="body5"
                        className="text-center text-[10px] text-muted-foreground/60"
                      >
                        {progressPct}% attempted
                      </Typography>
                    </>
                  ) : (
                    /* Final result: show obtained / total marks */
                    <>
                      <div className="flex items-center justify-center">
                        <span className="text-xl font-black text-brand-primary leading-none flex items-baseline gap-1.5">
                          {res.obtained_marks}
                          <span className="text-muted-foreground/30 font-bold text-sm">
                            /
                          </span>
                          {res.total_marks}
                        </span>
                      </div>

                      {/* Mini Progress Bar */}
                      <div className="w-full h-1.5 bg-slate-200/60 dark:bg-slate-700/50 rounded-full overflow-hidden shrink-0">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-1000",
                            getGradeConfig(res.grade).barBg,
                          )}
                          style={{
                            width: `${Math.min(res.percentage || 0, 100)}%`,
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}

          {/* Empty state when interview is live but no responses yet */}
          {isInProgress && subjectResults.length === 0 && (
            <div className="col-span-full flex flex-col items-center gap-2 py-8 text-muted-foreground/50">
              <Radio size={22} className="animate-pulse text-orange-400" />
              <Typography variant="body5" className="text-center text-xs">
                No subjects attempted yet. Results will appear as the candidate
                answers questions.
              </Typography>
            </div>
          )}
        </div>
      </div>

      {latest?.typing_stats && (
        <div className="space-y-6">
          <Typography
            variant="body4"
            className="font-bold border-l-4 border-orange-500 pl-3"
          >
            Typing Test Result
          </Typography>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                label: "Speed",
                value: `${latest.typing_stats.wpm} WPM`,
                color: "text-amber-500 dark:text-amber-400",
                icon: (
                  <Gauge
                    className="text-amber-500 dark:text-amber-400"
                    size={18}
                  />
                ),
                accentBg: "bg-amber-500/10 dark:bg-amber-500/5",
                accentBorder:
                  "hover:border-amber-500/30 hover:shadow-amber-500/[0.03]",
              },
              {
                label: "Accuracy",
                value: `${latest.typing_stats.accuracy}%`,
                color: "text-emerald-600 dark:text-emerald-400",
                icon: (
                  <Target
                    className="text-emerald-600 dark:text-emerald-400"
                    size={18}
                  />
                ),
                accentBg: "bg-emerald-500/10 dark:bg-emerald-500/5",
                accentBorder:
                  "hover:border-emerald-500/30 hover:shadow-emerald-500/[0.03]",
              },
              {
                label: "Errors",
                value: latest.typing_stats.errors,
                color: "text-rose-500 dark:text-rose-400",
                icon: (
                  <AlertCircle
                    className="text-rose-500 dark:text-rose-400"
                    size={18}
                  />
                ),
                accentBg: "bg-rose-500/10 dark:bg-rose-500/5",
                accentBorder:
                  "hover:border-rose-500/30 hover:shadow-rose-500/[0.03]",
              },
              {
                label: "Duration",
                value:
                  latest.typing_stats.time_taken < 60
                    ? `${Math.round(latest.typing_stats.time_taken)}s`
                    : `${Math.floor(latest.typing_stats.time_taken / 60)}m ${Math.round(
                        latest.typing_stats.time_taken % 60,
                      )}s`,
                color: "text-indigo-500 dark:text-indigo-400",
                icon: (
                  <Timer
                    className="text-indigo-500 dark:text-indigo-400"
                    size={18}
                  />
                ),
                accentBg: "bg-indigo-500/10 dark:bg-indigo-500/5",
                accentBorder:
                  "hover:border-indigo-500/30 hover:shadow-indigo-500/[0.03]",
              },
            ].map((stat, sidx) => (
              <div
                key={sidx}
                className={`group/stat p-5 rounded-2xl border border-border/50 dark:border-white/[0.04] bg-card/80 backdrop-blur-md shadow-sm transition-all duration-300 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-lg flex items-center justify-between relative overflow-hidden ${stat.accentBorder}`}
              >
                {/* Subtle background glow flare */}
                <div
                  className={`absolute -top-6 -right-6 w-20 h-20 ${stat.accentBg} rounded-full blur-xl opacity-60 group-hover/stat:opacity-100 transition-all duration-500 pointer-events-none`}
                />

                <div className="space-y-1.5 relative z-10">
                  <Typography
                    variant="body5"
                    className="font-black text-muted-foreground/60 uppercase tracking-widest text-[10px] select-none"
                  >
                    {stat.label}
                  </Typography>
                  <Typography
                    variant="h2"
                    className={`font-black ${stat.color} tracking-tighter text-xl md:text-2xl bg-gradient-to-b from-foreground to-foreground/90 bg-clip-text select-none`}
                  >
                    {stat.value}
                  </Typography>
                </div>

                <div
                  className={`h-10 w-10 rounded-xl ${stat.accentBg} border border-border/20 dark:border-white/[0.02] flex items-center justify-center shadow-sm relative z-10 group-hover/stat:scale-110 transition-all duration-300`}
                >
                  {stat.icon}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
