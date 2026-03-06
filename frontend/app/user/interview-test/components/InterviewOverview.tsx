import Link from "next/link";
import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { ArrowLeft, CheckCircle2, PlayCircle, Sparkles } from "lucide-react";
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
      Use only <span className="font-semibold">Previous</span> and{" "}
      <span className="font-semibold">Save & Next</span> for navigation.
    </>,
    <>Once a section is completed, it gets locked and cannot be reopened.</>,
    <>
      The complete paper has one overall timer of{" "}
      <span className="font-semibold">{overallExamDurationMinutes} minutes</span>.
    </>,
    <>
      When time ends, the paper is auto-submitted with selected answers as
      attempted and empty answers as not attempted.
    </>,
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-8"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,99,49,0.12),transparent_45%)]" />

      <div className="relative z-10 space-y-6">
        <div className="flex flex-wrap items-center gap-3">
          <Badge color="primary" icon={<Sparkles size={14} />}>
            Interview Module
          </Badge>
          <Badge variant="outline" color="secondary">
            UI Demo Mode
          </Badge>
        </div>

        <div className="space-y-2">
          <Typography variant="h1" className="max-w-3xl">
            Start Your Interview Assessment
          </Typography>
          <Typography variant="body2" className="max-w-3xl">
            This flow follows your approved rules: overall paper timer, no direct
            jump, previous/next navigation, and mandatory section lock after
            section completion.
          </Typography>
        </div>

        {startError && (
          <Alert
            variant="error"
            title="Unable to Start Interview"
            description={startError}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className="rounded-xl border border-border bg-background/70 px-4 py-4"
            >
              <Typography variant="body4" className="text-foreground">
                Section {index + 1}
              </Typography>
              <Typography variant="h4" className="mt-1">
                {section.title}
              </Typography>
              <Typography variant="body5" className="mt-1">
                {section.questions.length} questions
              </Typography>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-brand-primary/20 bg-gradient-to-br from-brand-primary/10 via-background to-brand-secondary/10 p-5 md:p-6">
          <div className="mb-4 flex items-center gap-2">
            <div className="rounded-lg bg-brand-primary/15 p-2 text-brand-primary">
              <Sparkles size={16} />
            </div>
            <Typography variant="h4" className="text-foreground">
              Interview Instructions
            </Typography>
          </div>

          <ul className="space-y-3">
            {instructionItems.map((item, index) => (
              <li
                key={`instruction-${index + 1}`}
                className="flex items-start gap-3 rounded-xl border border-border/70 bg-card/80 px-3 py-3"
              >
                <CheckCircle2
                  size={16}
                  className="mt-0.5 shrink-0 text-brand-primary"
                />
                <Typography variant="body3" className="text-foreground">
                  {item}
                </Typography>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button
            size="lg"
            color="primary"
            startIcon={<PlayCircle size={18} />}
            onClick={onStart}
            className="w-full sm:w-auto"
          >
            Start Interview
          </Button>
          <Link href="/user/dashboard">
            <Button
              size="lg"
              variant="outline"
              color="default"
              startIcon={<ArrowLeft size={16} />}
              className="w-full sm:w-auto"
            >
              Back
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
