"use client";

import React from "react";
import { cn } from "@lib/utils";
import { STYLE_CONFIG } from "@lib/config/style";
import { Typography } from "@components/ui-elements/Typography";
import { Question } from "@types";

interface TypingTestQuestionViewProps {
  question: Question;
  showAnswers?: boolean;
}

export const TypingTestQuestionView: React.FC<TypingTestQuestionViewProps> = ({
  question,
  showAnswers = true,
}) => {
  const paragraph = question.passage || "";
  const wordCount = paragraph.trim() ? paragraph.trim().split(/\s+/).length : 0;
  const charCount = paragraph.length;

  return (
    <div className="space-y-4">
      {/* Explicit Question / Instruction */}
      <div className="flex items-start gap-2.5">
        <span className="shrink-0 px-2 py-0.5 mt-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-brand-primary/10 text-brand-primary border border-brand-primary/20 print:border-slate-400 print:text-black print:bg-slate-100">
          Question
        </span>
        <Typography
          variant="body3"
          weight="bold"
          className="text-foreground text-base print:text-black font-bold"
        >
          {question.question_text ||
            "Type the following paragraph accurately within the allocated time:"}
        </Typography>
      </div>

      {/* Typing Paragraph Box */}
      <div
        className={cn(
          "p-5 bg-slate-50 dark:bg-slate-800/30 border border-border/80 space-y-3 print:bg-slate-50 print:border-slate-400",
          STYLE_CONFIG.innerCardRadius,
        )}
      >
        <div className="flex items-center justify-between border-b border-border/60 pb-2 print:border-slate-300">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-600 text-white">
              Typing Content
            </span>
          </div>

          <div className="flex items-center gap-3 text-[11px] font-mono text-muted-foreground font-semibold">
            <span>{wordCount} words</span>
            <span>•</span>
            <span>{charCount} characters</span>
          </div>
        </div>

        <Typography
          variant="body4"
          className="text-foreground/90 font-mono text-sm leading-relaxed whitespace-pre-wrap select-none print:text-black"
        >
          {paragraph || "No typing paragraph provided."}
        </Typography>
      </div>

      {/* Candidate Response Area when answers are hidden */}
      {!showAnswers && (
        <div
          className={cn(
            "p-4 bg-slate-50/50 dark:bg-slate-800/20 border border-dashed border-slate-300 dark:border-slate-700 min-h-[90px] print:bg-white print:border-slate-400 flex flex-col justify-between",
            STYLE_CONFIG.innerCardRadius,
          )}
        >
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 print:bg-slate-100 print:text-black">
              Answer
            </span>
          </div>
          <div className="h-0 border-b border-dashed border-slate-200 dark:border-slate-800" />
        </div>
      )}
    </div>
  );
};
