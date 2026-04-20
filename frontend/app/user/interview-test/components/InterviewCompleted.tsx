"use client";

import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Trophy,
  Target,
  ListChecks,
  HelpCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@components/ui-elements/Button";
import { Typography } from "@components/ui-elements/Typography";
import { cn } from "@lib/utils";

interface InterviewCompletedProps {
  totalSections: number;
  totalQuestions: number;
  answeredCount: number;
  notAttemptedCount: number;
  completionReason: "manual" | "time_over" | null;
  overallExamDurationMinutes: number;
}

export function InterviewCompleted({
  totalSections,
  totalQuestions,
  answeredCount,
  notAttemptedCount,
  completionReason,
}: InterviewCompletedProps) {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="text-center space-y-6 py-12 relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-primary/[0.04] via-transparent to-emerald-500/[0.04] border border-border/60 shadow-xl dark:border-white/5 dark:bg-card/20">
        {/* Animated Background Sparkles */}
        <div className="absolute top-10 left-10 text-brand-primary/20 animate-bounce delay-75">
          <Sparkles size={24} />
        </div>
        <div className="absolute bottom-10 right-10 text-emerald-500/20 animate-bounce delay-300">
          <Sparkles size={32} />
        </div>

        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full animate-pulse" />
          <div className="relative h-24 w-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 scale-110">
            <CheckCircle2
              size={48}
              className="text-white animate-in zoom-in-50 duration-700"
            />
          </div>
        </div>

        <div className="space-y-3 max-w-lg mx-auto px-6 relative z-10">
          <Typography variant="h2" weight="bold" className="tracking-tight">
            Assessment Submitted
          </Typography>
          <Typography
            variant="body1"
            className="text-muted-foreground leading-relaxed"
          >
            Congratulations! You have successfully completed your interview
            assessment. Your performance data has been securely synchronized
            with our selection board.
          </Typography>
        </div>

        {completionReason === "time_over" && (
          <div className="relative z-10 inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-600 rounded-full border border-amber-500/20 text-xs font-bold uppercase tracking-widest animate-pulse">
            <Sparkles size={14} />
            Auto-Submitted Due to Timeout
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          icon={<ListChecks size={20} className="text-blue-500" />}
          label="Total Sections"
          value={totalSections}
          color="blue"
        />
        <StatCard
          icon={<HelpCircle size={20} className="text-violet-500" />}
          label="Total Questions"
          value={totalQuestions}
          color="violet"
        />
        <StatCard
          icon={<Target size={20} className="text-emerald-500" />}
          label="Answered"
          value={answeredCount}
          color="emerald"
        />
        <StatCard
          icon={<Trophy size={20} className="text-slate-400" />}
          label="Not Attempted"
          value={notAttemptedCount}
          color="slate"
        />
      </div>

      <div className="text-center pt-4">
        <Link href="/user/dashboard">
          <Button
            variant="primary"
            color="primary"
            shadow
            animate="scale"
            endIcon={<ArrowRight size={20} />}
            className="rounded-2xl px-12 h-16 font-black text-lg transition-all duration-500 hover:shadow-brand-primary/25"
          >
            Go to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
}

const colorMap: Record<string, { bg: string; iconBg: string }> = {
  blue: { bg: "bg-blue-500/5", iconBg: "bg-blue-500/10" },
  violet: { bg: "bg-violet-500/5", iconBg: "bg-violet-500/10" },
  emerald: { bg: "bg-emerald-500/5", iconBg: "bg-emerald-500/10" },
  slate: { bg: "bg-slate-500/5", iconBg: "bg-slate-500/10" },
};

function StatCard({
  icon,
  label,
  value,
  color,
  className,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  className?: string;
}) {
  const styles = colorMap[color] || colorMap.blue;

  return (
    <div
      className={cn(
        "relative flex flex-col gap-4 p-6 rounded-2xl border border-border/60 bg-card shadow-sm transition-transform duration-300 hover:-translate-y-1 overflow-hidden group dark:bg-card/40 dark:border-white/5",
        className,
      )}
    >
      <div
        className={`absolute top-0 right-0 w-16 h-16 ${styles.bg} rounded-bl-full translate-x-4 -translate-y-4 group-hover:scale-150 transition-transform duration-500`}
      />
      <div className="relative flex flex-col gap-4">
        <div
          className={`h-12 w-12 rounded-2xl ${styles.iconBg} flex items-center justify-center`}
        >
          {icon}
        </div>
        <div>
          <Typography
            variant="body5"
            weight="bold"
            className="text-muted-foreground uppercase tracking-widest text-[9px]"
          >
            {label}
          </Typography>
          <Typography
            variant="h2"
            weight="black"
            className="mt-1 text-foreground font-mono"
          >
            {value.toString().padStart(2, "0")}
          </Typography>
        </div>
      </div>
    </div>
  );
}
