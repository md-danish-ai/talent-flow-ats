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
} from "lucide-react";
import { Button } from "@components/ui-elements/Button";
import { Badge } from "@components/ui-elements/Badge";
import { Typography } from "@components/ui-elements/Typography";
import { Alert } from "@components/ui-elements/Alert";
import type { InterviewSection } from "../types";

interface InterviewOverviewProps {
  sections: InterviewSection[];
  overallExamDurationMinutes: number;
  startError?: string | null;
  onStart: () => void;
}

export function InterviewOverview({
  sections,
  overallExamDurationMinutes,
  startError,
  onStart,
}: InterviewOverviewProps) {
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
      <span className="font-bold">{overallExamDurationMinutes} minutes</span>{" "}
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
              className="flex-1 sm:flex-none group"
            >
              Start Interview
            </Button>
          </div>
        </div>

        <div className="space-y-1.5">
          <Typography variant="h1" className=" tracking-tight">
            Assess your potential with{" "}
            <span className="text-brand-primary">Confidence</span>
          </Typography>
          <Typography
            variant="body2"
            className=" text-foreground/70 leading-relaxed"
          >
            Welcome to your interview assessment session. To ensure a fair and
            structured evaluation, this platform incorporates
            <span className="text-foreground font-semibold">
              {" "}
              sequential section progression
            </span>{" "}
            and a
            <span className="text-foreground font-semibold">
              {" "}
              global assessment timer
            </span>
            . Review the key protocol below before you begin.
          </Typography>
        </div>

        {startError && (
          <Alert
            variant="error"
            title="Unable to Start Interview"
            description={startError}
          />
        )}

        {/* Sections Grid Redesign */}
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
            {sections.map((section, index) => (
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
                      <PlayCircle size={14} className="text-brand-primary/40" />
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
                      <Clock3 size={14} className="text-brand-secondary/40" />
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-foreground/40 uppercase tracking-wider">
                          Time
                        </span>
                        <span className="text-xs font-black text-foreground/80">
                          {section.durationMinutes}m
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

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
