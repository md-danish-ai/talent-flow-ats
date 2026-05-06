"use client";
import { memo } from "react";
import { FileText } from "lucide-react";
import { Typography } from "@components/ui-elements/Typography";

import { MultipleChoiceView } from "./MultipleChoiceView";

interface PassageContentViewProps {
  questionId: number;
  passage: string;
  questionText: string;
  options: (
    | string
    | { option_text: string; image_url?: string; imageUrl?: string }
  )[];
  currentAnswer: string;
  onChangeAnswer: (value: string) => void;
}

export const PassageContentView = memo(function PassageContentView({
  questionId,
  passage,
  questionText,
  options,
  currentAnswer,
  onChangeAnswer,
}: PassageContentViewProps) {
  return (
    <div className="space-y-6 pt-2 text-foreground">
      {/* Content Blocks */}
      <div className="space-y-5">
        {/* Passage Section */}
        <div className="rounded-2xl border border-border bg-muted/10 p-1 relative pt-5 shadow-sm">
          <div className="absolute top-0 left-6 -translate-y-1/2 flex items-center gap-2 bg-background px-3 py-1 rounded-full border border-border shadow-sm">
            <FileText size={10} className="text-orange-500" />
            <Typography
              variant="body5"
              weight="black"
              className="uppercase tracking-widest mr-1"
            >
              Passage Paragraph
            </Typography>
          </div>
          <div className="p-5 italic font-medium leading-relaxed text-foreground/80">
            <Typography
              variant="body2"
              color="text-foreground/80"
              italic
              weight="medium"
              className="leading-relaxed"
            >
              &quot;{passage}&quot;
            </Typography>
          </div>
        </div>

        {/* Question Section */}
        <div className="rounded-2xl border border-border bg-muted/10 p-1 relative pt-5 shadow-sm">
          <div className="absolute top-0 left-6 -translate-y-1/2 flex items-center gap-2 bg-background px-3 py-1 rounded-full border border-border shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            <Typography
              variant="body5"
              weight="black"
              className="uppercase tracking-widest mr-1"
            >
              Question Text
            </Typography>
          </div>
          <div className="p-5">
            <Typography
              variant="body2"
              weight="semibold"
              color="text-foreground"
              className="leading-relaxed tracking-tight"
            >
              {questionText}
            </Typography>
          </div>
        </div>

        {/* Options Area */}
        <div className="pt-2">
          <MultipleChoiceView
            questionId={questionId}
            options={options}
            currentAnswer={currentAnswer}
            onChangeAnswer={onChangeAnswer}
          />
        </div>
      </div>
    </div>
  );
});
