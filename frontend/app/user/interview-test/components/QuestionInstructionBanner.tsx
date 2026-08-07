"use client";

import React from "react";
import { Info } from "lucide-react";
import { Typography } from "@components/ui-elements/Typography";
import { getQuestionInstruction } from "@lib/utils/questionInstructions";

interface QuestionInstructionBannerProps {
  subjectName?: string;
  type?: string;
  className?: string;
}

export const QuestionInstructionBanner: React.FC<
  QuestionInstructionBannerProps
> = ({ subjectName, type, className = "" }) => {
  const instruction = getQuestionInstruction(subjectName, type);

  if (!instruction) return null;

  return (
    <div
      className={`rounded-xl border-l-4 border-brand-primary bg-brand-primary/5 dark:bg-brand-primary/10 p-4 shadow-sm flex items-start gap-3 transition-all ${className}`}
    >
      <div className="p-1.5 rounded-lg bg-brand-primary/10 text-brand-primary shrink-0 mt-0.5">
        <Info size={18} />
      </div>
      <div className="space-y-0.5">
        <Typography
          variant="body5"
          weight="semibold"
          className="text-brand-primary uppercase tracking-wider block font-bold"
        >
          Instruction
        </Typography>
        <Typography
          variant="body4"
          weight="medium"
          className="text-foreground/90 leading-relaxed block font-medium"
        >
          {instruction}
        </Typography>
      </div>
    </div>
  );
};
