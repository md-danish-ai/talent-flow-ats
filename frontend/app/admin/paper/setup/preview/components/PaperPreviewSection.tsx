"use client";

import React from "react";
import { cn } from "@lib/utils";
import { STYLE_CONFIG } from "@lib/config/style";
import { Typography } from "@components/ui-elements/Typography";
import { Badge } from "@components/ui-elements/Badge";
import { PaperPreviewQuestionCard } from "./PaperPreviewQuestionCard";
import { Question, PaperSubjectConfig } from "@types";
import { Clock, BookOpen, Trophy, HelpCircle } from "lucide-react";

interface PaperPreviewSectionProps {
  subjectConfig: PaperSubjectConfig;
  subjectName: string;
  subjectCode: string;
  questions: Question[];
  sectionIndex: number;
  startIndex: number;
  showAnswers?: boolean;
}

export const PaperPreviewSection: React.FC<PaperPreviewSectionProps> = ({
  subjectConfig,
  subjectName,
  subjectCode,
  questions,
  sectionIndex,
  startIndex,
  showAnswers = true,
}) => {
  const timeMinutes = subjectConfig.time_minutes || 0;
  const targetCount = subjectConfig.question_count || 0;
  const totalMarks = subjectConfig.total_marks || 0;

  return (
    <section
      id={`section-subject-${subjectConfig.subject_id}`}
      className="space-y-4 print:space-y-3 print:break-before-auto"
    >
      {/* Sleek Single-Line Subject Section Header Card */}
      <div
        className={cn(
          "bg-white dark:bg-slate-900 text-foreground border border-border/80 shadow-sm px-5 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 transition-all duration-200 print:bg-slate-100 print:text-black print:border-slate-400 print:px-4 print:py-2.5 print:shadow-none print:break-inside-avoid",
          STYLE_CONFIG.cardRadius,
        )}
      >
        {/* Left: Section Badge, Name & Code in Single Row */}
        <div className="flex items-center flex-wrap gap-2.5">
          <span className="px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider bg-brand-primary text-white print:bg-slate-800 print:text-white">
            Section {sectionIndex + 1}
          </span>

          <Typography
            variant="body2"
            weight="black"
            className="text-foreground tracking-tight font-black text-lg sm:text-xl print:text-black"
          >
            {subjectName}
          </Typography>

          {subjectCode && (
            <Badge
              variant="outline"
              color="default"
              shape="square"
              className="text-[11px] font-mono font-bold text-muted-foreground print:text-slate-600 print:border-slate-300"
            >
              {subjectCode}
            </Badge>
          )}
        </div>

        {/* Right: Metadata Badges in Single Row */}
        <div className="flex items-center flex-wrap gap-2 sm:gap-3">
          {/* Subject Total Time */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/25 text-amber-800 dark:text-amber-300 text-xs font-bold rounded-md print:bg-white print:border-slate-300 print:text-black">
            <Clock
              size={14}
              className="text-amber-600 dark:text-amber-400 shrink-0"
            />
            <span>
              Time:{" "}
              <strong className="font-black text-foreground print:text-black">
                {timeMinutes > 0 ? `${timeMinutes} Mins` : "No Limit"}
              </strong>
            </span>
          </div>

          {/* Question Count */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/25 text-blue-800 dark:text-blue-300 text-xs font-bold rounded-md print:bg-white print:border-slate-300 print:text-black">
            <HelpCircle
              size={14}
              className="text-blue-600 dark:text-blue-400 shrink-0"
            />
            <span>
              Questions:{" "}
              <strong className="font-black text-foreground print:text-black">
                {questions.length} / {targetCount} Qs
              </strong>
            </span>
          </div>

          {/* Section Total Marks */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/25 text-emerald-800 dark:text-emerald-300 text-xs font-bold rounded-md print:bg-white print:border-slate-300 print:text-black">
            <Trophy
              size={14}
              className="text-emerald-600 dark:text-emerald-400 shrink-0"
            />
            <span>
              Marks:{" "}
              <strong className="font-black text-foreground print:text-black">
                {Number(totalMarks) % 1 === 0
                  ? Number(totalMarks).toString()
                  : Number(totalMarks).toFixed(1)}{" "}
                Marks
              </strong>
            </span>
          </div>
        </div>
      </div>

      {/* Questions under this Subject */}
      {questions.length > 0 ? (
        <div className="space-y-4 print:space-y-3">
          {questions.map((q, idx) => (
            <PaperPreviewQuestionCard
              key={q.id || idx}
              question={q}
              index={startIndex + idx}
              showAnswers={showAnswers}
            />
          ))}
        </div>
      ) : (
        <div
          className={cn(
            "p-8 border border-dashed border-border bg-slate-50/50 dark:bg-slate-900/20 text-center space-y-2 print:border-slate-300 print:bg-white",
            STYLE_CONFIG.cardRadius,
          )}
        >
          <BookOpen className="mx-auto text-muted-foreground/40" size={32} />
          <Typography
            variant="body3"
            weight="bold"
            className="text-muted-foreground"
          >
            No questions assigned to {subjectName} yet
          </Typography>
          <Typography variant="body5" className="text-muted-foreground/70">
            Assigned questions for this subject will appear here once added in
            the Paper Setup panel.
          </Typography>
        </div>
      )}
    </section>
  );
};
