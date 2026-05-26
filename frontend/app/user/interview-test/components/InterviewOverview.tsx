import Link from "next/link";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import {
  AlertCircle,
  ArrowLeft,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Clock3,
  Briefcase,
  BarChart,
  Award,
  CalendarX,
} from "lucide-react";
import { Button } from "@components/ui-elements/Button";
import { Badge } from "@components/ui-elements/Badge";
import { Typography } from "@components/ui-elements/Typography";
import { Alert } from "@components/ui-elements/Alert";
import type { InterviewSection } from "../types";
import type { InterviewPaperMetaResponse } from "@lib/api/paper-assignments";

interface InterviewOverviewProps {
  sections: InterviewSection[];
  overallExamDurationMinutes: number;
  startError?: string | null;
  paper?: InterviewPaperMetaResponse | null;
  onStart: () => void;
}

export function InterviewOverview({
  sections,
  overallExamDurationMinutes,
  startError,
  paper,
  onStart,
}: InterviewOverviewProps) {
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const instructionItems: ReactNode[] = [
    <>
      <span className="font-semibold">Sequential Navigation:</span> Use only the{" "}
      <span className="text-brand-primary font-medium italic">Previous</span>{" "}
      and{" "}
      <span className="text-brand-primary font-medium italic">Save & Next</span>{" "}
      buttons for navigation. Direct section jumping is disabled.
    </>,
    <>
      <span className="font-semibold text-amber-500 underline decoration-amber-500/30 underline-offset-4">
        Permanent Section Lock:
      </span>{" "}
      Once a section is submitted or timed out, it will be{" "}
      <span className="font-bold">permanently locked</span>. Access to previous
      sections is restricted.
    </>,
    <>
      <span className="font-semibold text-brand-primary">
        Global Assessment Timer:
      </span>{" "}
      You have a total of{" "}
      <span className="font-bold">
        {formatDuration(overallExamDurationMinutes)}
      </span>{" "}
      for the entire interview. Manage your time across sections strategically.
    </>,
    <>
      <span className="font-semibold">Automatic Progress Capture:</span> Your
      responses are saved in real-time. If time runs out, your current progress
      will be <span className="font-bold italic">auto-submitted</span>{" "}
      immediately.
    </>,
    <>
      <span className="font-semibold">Integrity Protocol:</span> For assessment
      security, do not refresh the page or attempt to switch tabs during the
      session.
    </>,
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,99,49,0.12),transparent_45%)]" />

      <div className="relative z-10 space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Badge
              shape="square"
              variant="outline"
              color="primary"
              icon={
                <Sparkles
                  size={12}
                  className="opacity-80 animate-pulse duration-1000"
                />
              }
              className="font-bold shadow-sm shadow-brand-primary/10"
            >
              Interview Module
            </Badge>
            <Badge
              shape="square"
              variant="outline"
              color="default"
              icon={
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
              }
              className="font-bold bg-background/50 backdrop-blur-sm"
            >
              Live Session
            </Badge>
          </div>

          <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
            <Link href="/user/dashboard" className="flex-1 sm:flex-none">
              <Button
                size="md"
                variant="outline"
                color="primary"
                animate="scale"
                startIcon={
                  <ArrowLeft
                    size={16}
                    className="transition-transform duration-300 group-hover:-translate-x-1.5 ease-in-out"
                  />
                }
                className="w-full group"
              >
                Back
              </Button>
            </Link>
            <Button
              size="md"
              color="primary"
              animate="scale"
              startIcon={
                <PlayCircle
                  size={18}
                  className="transition-all duration-300 group-hover:scale-125 group-hover:rotate-[15deg] ease-out"
                />
              }
              onClick={onStart}
              disabled={!!startError || !paper}
              className="flex-1 sm:flex-none group"
            >
              Start Interview
            </Button>
          </div>
        </div>

        {paper && (
          <div className="space-y-4">
            {/* Creative Title with Marker Highlight */}
            <div className="relative inline-block">
              <Typography
                variant="h1"
                className="tracking-tight text-3xl md:text-4xl font-black relative z-10"
              >
                {paper.paper_name}
              </Typography>
              <div className="absolute bottom-1 left-0 w-full h-3 bg-brand-primary/20 -z-0 rounded-full" />
            </div>

            {/* Dynamic Description Callout */}
            <div className="relative border-l-4 border-brand-primary bg-brand-primary/5 p-4 md:p-5 rounded-r-xl my-2">
              <Typography
                variant="body2"
                className="text-foreground/80 leading-relaxed sm:text-base"
              >
                {paper.description ||
                  "Welcome to your interview assessment session. To ensure a fair and structured evaluation, this platform incorporates sequential section progression and a global assessment timer."}
              </Typography>
            </div>

            {/* Pill-shaped Meta Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              {paper.department_name && (
                <div className="flex items-center gap-3 rounded-2xl border border-orange-500/30 bg-card px-4 py-2 shadow-sm hover:border-orange-500/60 hover:shadow-md transition-all">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FFEDD5] text-[#EA580C] dark:bg-[#EA580C]/20 dark:text-[#FB923C]">
                    <Briefcase size={16} strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground leading-tight mb-0.5">
                      Department
                    </span>
                    <span className="text-sm font-bold text-foreground leading-tight">
                      {paper.department_name}
                    </span>
                  </div>
                </div>
              )}
              {paper.test_level_name && (
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-card px-4 py-2 shadow-sm hover:border-emerald-500/60 hover:shadow-md transition-all">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#D1FAE5] text-[#059669] dark:bg-[#059669]/20 dark:text-[#10B981]">
                    <BarChart size={16} strokeWidth={2.5} />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground leading-tight mb-0.5">
                      Level
                    </span>
                    <span className="text-sm font-bold text-foreground leading-tight">
                      {paper.test_level_name}
                    </span>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-card px-4 py-2 shadow-sm hover:border-amber-500/60 hover:shadow-md transition-all">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FEF3C7] text-[#D97706] dark:bg-[#D97706]/20 dark:text-[#F59E0B]">
                  <Award size={16} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground leading-tight mb-0.5">
                    Total Marks
                  </span>
                  <span className="text-sm font-bold text-foreground leading-tight">
                    {paper.total_marks || "N/A"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-2xl border border-blue-500/30 bg-card px-4 py-2 shadow-sm hover:border-blue-500/60 hover:shadow-md transition-all">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#DBEAFE] text-[#2563EB] dark:bg-[#2563EB]/20 dark:text-[#3B82F6]">
                  <Clock3 size={16} strokeWidth={2.5} />
                </div>
                <div className="flex flex-col justify-center">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground leading-tight mb-0.5">
                    Duration
                  </span>
                  <span className="text-sm font-bold text-foreground leading-tight">
                    {formatDuration(overallExamDurationMinutes)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {startError && paper && (
          <Alert
            variant="error"
            title="Unable to Start Interview"
            description={startError}
          />
        )}

        {!paper && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl border border-dashed border-border/60 bg-background/30 backdrop-blur-sm"
          >
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-brand-primary/20 blur-2xl rounded-full" />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-background border border-border shadow-lg">
                <CalendarX className="h-10 w-10 text-brand-primary/70" />
              </div>
            </div>
            <Typography variant="h3" className="mb-2 tracking-tight">
              No Assessment Scheduled
            </Typography>
            <Typography
              variant="body2"
              className="text-muted-foreground max-w-md mx-auto mb-6 leading-relaxed"
            >
              {startError ||
                "You currently don't have any interview assessments assigned for today. Please contact your administrator if you believe this is an error."}
            </Typography>
            <Link href="/user/dashboard">
              <Button variant="outline" color="primary">
                Return to Dashboard
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Sections Grid Redesign */}
        {paper && (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Typography variant="body1" weight="bold">
                Assessment Structure
              </Typography>
              <div className="h-[1px] flex-1 bg-border/40" />
              <Badge variant="outline" shape="square">
                {sections.length} Sections
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {sections.map((section, index) => {
                const sectionMarks = section.questions.reduce(
                  (sum, q) => sum + (q.marks || 0),
                  0,
                );
                return (
                  <div
                    key={section.id}
                    className="group relative flex min-h-[4.5rem] h-auto items-stretch overflow-hidden rounded-xl border border-border/40 bg-background/20 transition-all duration-300 hover:border-brand-primary/30 hover:bg-background/40 hover:translate-y-[-2px] hover:shadow-lg hover:shadow-brand-primary/5"
                  >
                    {/* Creative Side Number */}
                    <div className="relative flex h-full w-16 shrink-0 items-center justify-center bg-brand-primary/5 border-r border-border/20">
                      <div className="absolute left-0 top-0 h-full w-1 bg-brand-primary/40 group-hover:w-1.5 group-hover:bg-brand-primary transition-all" />
                      <Typography
                        variant="h1"
                        className="text-4xl font-black italic opacity-[0.08] select-none group-hover:opacity-[0.15] transition-opacity pr-1"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </Typography>
                      <Typography
                        variant="body1"
                        weight="black"
                        className="absolute text-brand-primary/80 group-hover:text-brand-primary transition-colors"
                      >
                        {index + 1}
                      </Typography>
                    </div>

                    {/* Content Area */}
                    <div className="flex flex-1 flex-col justify-center px-4 py-3 gap-1.5">
                      <Typography
                        variant="body1"
                        weight="bold"
                        className="group-hover:text-brand-primary transition-colors tracking-tight uppercase text-xs md:text-sm leading-tight"
                      >
                        {section.title}
                      </Typography>

                      <div className="flex items-center gap-5 shrink-0">
                        <div className="flex items-center gap-1.5 group-hover:translate-y-[-1px] transition-transform">
                          <PlayCircle
                            size={14}
                            className="text-brand-primary/40"
                          />
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold text-foreground/40 uppercase tracking-wider">
                              Qs
                            </span>
                            <span className="text-xs font-black text-foreground/80">
                              {section.questions.length}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 group-hover:translate-y-[-1px] transition-transform delay-75">
                          <Clock3
                            size={14}
                            className="text-brand-secondary/40"
                          />
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold text-foreground/40 uppercase tracking-wider">
                              Time
                            </span>
                            <span className="text-xs font-black text-foreground/80">
                              {section.durationMinutes}m
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1.5 group-hover:translate-y-[-1px] transition-transform delay-100">
                          <Award size={14} className="text-amber-500/40" />
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-bold text-foreground/40 uppercase tracking-wider">
                              Marks
                            </span>
                            <span className="text-xs font-black text-foreground/80">
                              {sectionMarks}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Instructions Redesign */}
        <div className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-amber-500/[0.03] via-background to-brand-primary/[0.03] p-1 md:p-1.5">
          <div className="rounded-[calc(1rem-2px)] border border-amber-500/10 bg-background/40 backdrop-blur-sm p-5 md:p-6">
            <div className="mb-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/20 shadow-inner">
                  <AlertCircle
                    size={24}
                    className="animate-pulse duration-[3000ms]"
                  />
                </div>
                <div>
                  <Typography variant="h4">Interview Protocol</Typography>
                  <Typography variant="body5" className="text-foreground/60">
                    Please adhere to the following rules for a valid assessment
                  </Typography>
                </div>
              </div>
              <Badge
                variant="outline"
                color="warning"
                shape="square"
                animate="pulse"
                icon={<ShieldCheck size={14} />}
                className="font-bold px-3 py-1.5"
              >
                Secure Session
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
              {instructionItems.map((item, index) => (
                <div
                  key={`instruction-${index + 1}`}
                  className="group flex items-start gap-4 transition-transform hover:translate-x-1"
                >
                  <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary transition-colors group-hover:bg-brand-primary/20">
                    <Typography variant="body5" weight="bold">
                      {index + 1}
                    </Typography>
                  </div>
                  <Typography
                    variant="body3"
                    className="text-foreground/80 leading-relaxed pt-0.5"
                  >
                    {item}
                  </Typography>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
