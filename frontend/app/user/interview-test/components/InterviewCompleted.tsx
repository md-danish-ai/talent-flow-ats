"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Trophy,
  Target,
  ListChecks,
  HelpCircle,
  Clock3,
  ShieldCheck,
  Sparkles,
  LayoutDashboard,
  FileCheck,
  UserCheck,
  BellRing,
  TrendingUp,
} from "lucide-react";
import { Button } from "@components/ui-elements/Button";
import { Badge } from "@components/ui-elements/Badge";
import { Typography } from "@components/ui-elements/Typography";
import { cn } from "@lib/utils";
import { STYLE_CONFIG } from "@lib/config/style";

interface InterviewCompletedProps {
  totalSections: number;
  totalQuestions: number;
  answeredCount: number;
  notAttemptedCount: number;
  completionReason: "manual" | "time_over" | null;
  overallExamDurationMinutes?: number;
}

export function InterviewCompleted({
  totalSections,
  totalQuestions,
  answeredCount,
  notAttemptedCount,
  completionReason,
}: InterviewCompletedProps) {
  const isTimeout = completionReason === "time_over";
  const completionRate =
    totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0;

  return (
    <div className="w-full max-w-6xl mx-auto py-4 sm:py-6 space-y-6 animate-in fade-in zoom-in-95 duration-500">
      {/* 1. Hero Celebration Banner */}
      <div
        className={cn(
          "relative overflow-hidden border border-border/80 bg-card shadow-xl p-6 sm:p-8 md:p-10 backdrop-blur-xl",
          STYLE_CONFIG.cardRadius,
        )}
      >
        {/* Background Ambient Glows */}
        <div className="pointer-events-none absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/15 blur-[90px] rounded-full" />
        <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 bg-brand-primary/15 blur-[90px] rounded-full" />

        <div className="relative z-10 flex items-center justify-start">
          {/* Left: Holographic Icon & Title */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-5 flex-1">
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-emerald-500/30 rounded-3xl blur-xl animate-pulse" />
              <div className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-3xl bg-gradient-to-br from-emerald-400 via-emerald-600 to-teal-700 p-0.5 shadow-2xl shadow-emerald-500/30">
                <div className="w-full h-full bg-card/90 backdrop-blur-md rounded-[22px] flex items-center justify-center text-emerald-500 dark:text-emerald-400">
                  <CheckCircle2
                    size={44}
                    strokeWidth={2.5}
                    className="animate-in zoom-in duration-500"
                  />
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white rounded-full p-1.5 shadow-lg border-2 border-card">
                <ShieldCheck size={14} strokeWidth={3} />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
                <span className="text-[11px] font-black uppercase tracking-widest px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Assessment Completed
                </span>
                {isTimeout ? (
                  <Badge
                    variant="outline"
                    color="warning"
                    shape="square"
                    icon={<Clock3 size={13} />}
                    className="font-bold text-xs px-3 py-1 uppercase tracking-wider"
                  >
                    Auto-Submitted Due to Timeout
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    color="success"
                    shape="square"
                    icon={<Sparkles size={13} />}
                    className="font-bold text-xs px-3 py-1 uppercase tracking-wider"
                  >
                    Submitted Successfully
                  </Badge>
                )}
              </div>

              <Typography
                variant="h2"
                className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight"
              >
                Thank You for Your Submission!
              </Typography>
              <Typography
                variant="body2"
                className="text-muted-foreground text-sm sm:text-base max-w-2xl leading-relaxed"
              >
                Your responses have been securely encrypted and synchronized
                with our recruitment panel. You can monitor your application
                progress on your candidate dashboard.
              </Typography>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Dual-Column Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Performance Metrics (7 cols) */}
        <div
          className={cn(
            "lg:col-span-7 flex flex-col justify-between border border-border/80 bg-card p-6 sm:p-7 shadow-sm space-y-6",
            STYLE_CONFIG.cardRadius,
          )}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2 text-foreground font-bold text-sm uppercase tracking-wider">
                <TrendingUp size={18} className="text-brand-primary" />
                <span>Performance Breakdown</span>
              </div>
              <span className="text-xs font-semibold text-muted-foreground">
                Live Attempt Metrics
              </span>
            </div>

            {/* 4 Rich Cards Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Sections Card */}
              <div className="p-4 rounded-2xl border border-blue-500/20 bg-blue-500/[0.04] space-y-2 hover:border-blue-500/40 transition-all shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400">
                    Total Sections
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-blue-500/15 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <ListChecks size={18} />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black font-mono text-foreground">
                    {totalSections.toString().padStart(2, "0")}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    Modules evaluated
                  </span>
                </div>
              </div>

              {/* Total Questions Card */}
              <div className="p-4 rounded-2xl border border-violet-500/20 bg-violet-500/[0.04] space-y-2 hover:border-violet-500/40 transition-all shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-violet-600 dark:text-violet-400">
                    Total Questions
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-violet-500/15 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                    <HelpCircle size={18} />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black font-mono text-foreground">
                    {totalQuestions.toString().padStart(2, "0")}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    Allocated questions
                  </span>
                </div>
              </div>

              {/* Attempted Card */}
              <div className="p-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/[0.06] space-y-2 hover:border-emerald-500/50 transition-all shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    Questions Attempted
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                    <Target size={18} />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black font-mono text-emerald-600 dark:text-emerald-400">
                    {answeredCount.toString().padStart(2, "0")}
                  </span>
                  <span className="text-xs font-bold text-emerald-700/80 dark:text-emerald-400/80">
                    Responses saved
                  </span>
                </div>
              </div>

              {/* Unattempted Card */}
              <div className="p-4 rounded-2xl border border-slate-500/20 bg-slate-500/[0.04] space-y-2 hover:border-slate-500/40 transition-all shadow-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Unattempted
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-slate-500/15 text-slate-500 dark:text-slate-400 flex items-center justify-center">
                    <Trophy size={18} />
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black font-mono text-foreground">
                    {notAttemptedCount.toString().padStart(2, "0")}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground">
                    Skipped items
                  </span>
                </div>
              </div>
            </div>

            {/* Answer Progress Visual Bar */}
            <div className="p-4 rounded-2xl bg-muted/20 border border-border/70 space-y-2">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-foreground">
                  Overall Question Completion
                </span>
                <span className="text-emerald-600 dark:text-emerald-400 font-mono">
                  {answeredCount} / {totalQuestions} ({completionRate}%)
                </span>
              </div>
              <div className="w-full bg-muted/50 h-2.5 rounded-full overflow-hidden border border-border/20">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-1000 shadow-sm"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </div>

          {/* Verification Badge */}
          <div className="flex items-center gap-3 pt-2 text-xs text-muted-foreground border-t border-border/50">
            <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
            <span>
              Integrity and sequential section progressions have been verified.
            </span>
          </div>
        </div>

        {/* Right Column: Next Steps & Hiring Progression (5 cols) */}
        <div
          className={cn(
            "lg:col-span-5 flex flex-col justify-between border border-border/80 bg-card p-6 sm:p-7 shadow-sm space-y-6",
            STYLE_CONFIG.cardRadius,
          )}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-3">
              <div className="flex items-center gap-2 text-foreground font-bold text-sm uppercase tracking-wider">
                <Sparkles size={18} className="text-amber-500" />
                <span>Next Hiring Steps</span>
              </div>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-brand-primary/10 text-brand-primary">
                Round 1 of 2
              </span>
            </div>

            {/* Vertical 3-Step Process Roadmap */}
            <div className="space-y-3.5">
              {/* Step 1 */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-emerald-500/[0.06] border border-emerald-500/25">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                  <FileCheck size={18} strokeWidth={2.5} />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-foreground block">
                    1. Assessment Completed
                  </span>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Responses saved and submitted to the evaluation system.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-brand-primary/[0.06] border border-brand-primary/30 shadow-sm">
                <div className="w-9 h-9 rounded-xl bg-brand-primary/20 text-brand-primary flex items-center justify-center shrink-0 mt-0.5 animate-pulse">
                  <Clock3 size={18} strokeWidth={2.5} />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-foreground block">
                    2. Technical & Auto-Grading
                  </span>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Selection board reviews subjective and automated results.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-muted/15 border border-border/60 opacity-80">
                <div className="w-9 h-9 rounded-xl bg-muted text-muted-foreground flex items-center justify-center shrink-0 mt-0.5">
                  <UserCheck size={18} />
                </div>
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-foreground block">
                    3. Round 2 (Face-to-Face)
                  </span>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Qualified candidates are scheduled for project lead
                    interview.
                  </p>
                </div>
              </div>
            </div>

            {/* Notification Notice */}
            <div className="p-3.5 rounded-2xl bg-muted/25 border border-border/70 flex items-start gap-3 text-xs text-muted-foreground">
              <BellRing
                size={16}
                className="text-brand-primary shrink-0 mt-0.5"
              />
              <span>
                Please check your registered WhatsApp/SMS for real-time round
                updates.
              </span>
            </div>
          </div>

          {/* Action Link */}
          <div className="pt-2">
            <Link href="/user/dashboard" className="block w-full">
              <Button
                variant="primary"
                color="primary"
                size="lg"
                animate="scale"
                startIcon={<LayoutDashboard size={18} />}
                endIcon={<ArrowRight size={18} />}
                className="w-full h-12 rounded-xl font-bold shadow-xl shadow-brand-primary/25 text-sm sm:text-base hover:scale-[1.01] transition-transform"
              >
                Go to Candidate Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
