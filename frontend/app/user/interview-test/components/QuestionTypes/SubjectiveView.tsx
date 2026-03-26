"use client";
import { memo } from "react";
import { Textarea } from "@components/ui-elements/Textarea";
import { Typography } from "@components/ui-elements/Typography";

interface SubjectiveViewProps {
  currentAnswer: string;
  onChangeAnswer: (value: string) => void;
}

export const SubjectiveView = memo(function SubjectiveView({
  currentAnswer,
  onChangeAnswer,
}: SubjectiveViewProps) {
  return (
    <div className="space-y-3 pt-2">
      <div className="flex items-center gap-2 px-2">
        <Typography
          variant="body4"
          className="font-bold text-brand-primary uppercase tracking-widest text-[11px]"
        >
          Your Analytical Response
        </Typography>
        <div className="h-1 w-1 rounded-full bg-brand-primary animate-ping" />
      </div>
      <Textarea
        rows={8}
        placeholder="Write your answer here..."
        value={currentAnswer}
        onChange={(event) => onChangeAnswer(event.target.value)}
        className="rounded-2xl font-mono text-lg leading-relaxed bg-muted/5 border-2 border-border focus:border-brand-primary focus:bg-background focus:ring-[8px] focus:ring-brand-primary/10 transition-all p-6 shadow-inner"
      />
    </div>
  );
});
