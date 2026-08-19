"use client";

import { useEffect, useRef } from "react";
import { CheckCircle2, Clock, Lock, Check } from "lucide-react";
import { STYLE_CONFIG } from "@lib/config/style";
import { Typography } from "@components/ui-elements/Typography";
import type { InterviewSection, TimerZone } from "../types";
import { cn } from "@lib/utils";

interface InterviewStatusCardProps {
  sections: InterviewSection[];
  sectionIndex: number;
  totalSections: number;
  progressPercent: number;
  lockedSections: boolean[];
  timerZone: TimerZone;
  answeredCount: number;
  notAttemptedCount: number;
  questionIndex: number;
}

export function InterviewStatusCard({
  sections,
  sectionIndex,
  totalSections,
  progressPercent,
  lockedSections,
  timerZone,
  answeredCount,
  notAttemptedCount,
  questionIndex,
}: InterviewStatusCardProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeElement = document.getElementById(`section-${sectionIndex}`);
    if (activeElement) {
      activeElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [sectionIndex]);

  const totalQuestionsInSection =
    sections[sectionIndex]?.questions?.length || 0;

  return (
    <div
      id="interview-active-status"
      className={cn(
        "flex flex-col bg-card border border-border/60 shadow-sm p-4 sm:p-5 space-y-3.5 transition-colors overflow-hidden",
        STYLE_CONFIG.cardRadius,
      )}
    >
      {/* Overall Section Progress Tracker */}
      <div
        id="interview-active-progress"
        className="space-y-2 pb-3 border-b border-border/50"
      >
        <div className="flex justify-between items-center text-sm font-semibold">
          <span className="text-slate-700 dark:text-zinc-300">
            Exam Progress
          </span>
          <span className="text-brand-primary font-bold text-sm">
            {progressPercent}%
          </span>
        </div>

        <div className="h-2 w-full rounded-full bg-muted overflow-hidden shadow-inner">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${
              timerZone === "danger"
                ? "bg-red-500"
                : timerZone === "warn"
                  ? "bg-amber-500"
                  : "bg-brand-primary"
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="flex justify-between items-center text-xs text-muted-foreground font-medium">
          <span>Section 1</span>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[10px] font-semibold tracking-wide bg-amber-500/10 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            Auto-lock on submission
          </span>
          <span>Section {totalSections}</span>
        </div>
      </div>

      {/* Section Checklist List */}
      <div
        ref={scrollContainerRef}
        className="space-y-2 max-h-[400px] overflow-y-auto pr-1 custom-scrollbar scroll-smooth"
      >
        {sections.map((section, index) => {
          const isCurrent = index === sectionIndex;
          const isLocked = lockedSections[index];

          if (isCurrent) {
            return (
              <div
                key={section.id}
                id={`section-${index}`}
                className={cn(
                  "flex flex-col gap-2 rounded-lg border p-3 transition-all duration-300",
                  timerZone === "danger"
                    ? "border-red-500/70 bg-red-500/10 shadow-sm ring-1 ring-red-500/30"
                    : timerZone === "warn"
                      ? "border-amber-500/70 bg-amber-500/10 shadow-sm ring-1 ring-amber-500/30"
                      : "border-brand-primary/60 bg-brand-primary/5 dark:bg-brand-primary/10 shadow-sm ring-1 ring-brand-primary/20",
                )}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <span className="inline-flex items-center justify-center h-6 w-6 rounded-md text-xs font-bold bg-brand-primary text-white shrink-0">
                      {index + 1}
                    </span>
                    <Typography
                      variant="body4"
                      weight="bold"
                      className={cn(
                        "text-sm sm:text-base leading-snug break-words",
                        timerZone === "danger"
                          ? "text-red-600 dark:text-red-400"
                          : timerZone === "warn"
                            ? "text-amber-600 dark:text-amber-400"
                            : "text-brand-primary font-bold",
                      )}
                    >
                      {section.title}
                    </Typography>
                  </div>

                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-brand-primary/15 text-brand-primary border border-brand-primary/30 shrink-0">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-primary animate-ping" />
                    In Progress
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-600 dark:text-zinc-400 pt-2 border-t border-slate-200/60 dark:border-zinc-800/60">
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-slate-400 dark:text-zinc-500" />
                    <span>{section.durationMinutes} mins</span>
                  </div>
                  <span className="font-semibold text-brand-primary">
                    Question {questionIndex + 1} of {totalQuestionsInSection}
                  </span>
                </div>
              </div>
            );
          }

          if (isLocked) {
            return (
              <div
                key={section.id}
                id={`section-${index}`}
                className="flex items-center justify-between gap-2 rounded-lg border border-emerald-500/25 bg-emerald-500/5 dark:bg-emerald-500/10 px-3 py-2 transition-all duration-200"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-md text-xs font-bold bg-emerald-500 text-white shrink-0">
                    <Check className="h-3 w-3" />
                  </span>
                  <Typography
                    variant="body4"
                    weight="medium"
                    className="text-sm text-slate-800 dark:text-zinc-200 leading-snug break-words"
                  >
                    {section.title}
                  </Typography>
                </div>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/40 shrink-0">
                  <CheckCircle2 className="h-3 w-3" />
                  Completed
                </span>
              </div>
            );
          }

          return (
            <div
              key={section.id}
              id={`section-${index}`}
              className="flex flex-col gap-1.5 rounded-lg border border-slate-200/80 dark:border-zinc-800/80 bg-slate-50/50 dark:bg-zinc-900/30 p-2.5 opacity-70 transition-all duration-200"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <span className="inline-flex items-center justify-center h-5 w-5 rounded-md text-xs font-semibold bg-slate-200 dark:bg-zinc-700 text-slate-600 dark:text-zinc-300 shrink-0">
                    {index + 1}
                  </span>
                  <Typography
                    variant="body4"
                    className="text-sm text-slate-700 dark:text-zinc-300 font-medium leading-snug break-words"
                  >
                    {section.title}
                  </Typography>
                </div>

                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 text-xs shrink-0">
                  <Lock className="h-3 w-3" />
                  Upcoming
                </span>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 pt-1.5 border-t border-slate-200/60 dark:border-zinc-800/60">
                <div className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-slate-400 dark:text-zinc-500" />
                  <span>{section.durationMinutes} mins</span>
                </div>
                <span>{section.questions.length} questions</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Answered Stats Summary */}
      <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80">
        <div className="grid grid-cols-2 gap-2.5">
          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-emerald-50/80 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/40">
            <span className="text-xs uppercase font-bold text-emerald-600 dark:text-emerald-400 tracking-wider">
              Answered
            </span>
            <span className="text-base sm:text-lg font-black text-emerald-600 dark:text-emerald-400">
              {answeredCount}
            </span>
          </div>

          <div className="flex items-center justify-between px-3.5 py-2.5 rounded-lg bg-rose-50/80 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-800/40">
            <span className="text-xs uppercase font-bold text-rose-600 dark:text-rose-400 tracking-wider">
              Unattempted
            </span>
            <span className="text-base sm:text-lg font-black text-rose-600 dark:text-rose-400">
              {notAttemptedCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
