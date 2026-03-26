"use client";
import { memo } from "react";
import { FileText } from "lucide-react";
import { Textarea } from "@components/ui-elements/Textarea";
import { Typography } from "@components/ui-elements/Typography";

interface PassageContentViewProps {
  passage: string;
  questionText: string;
  currentAnswer: string;
  onChangeAnswer: (value: string) => void;
}

export const PassageContentView = memo(function PassageContentView({
  passage,
  questionText,
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
            <Typography variant="body5" weight="black" className="uppercase tracking-widest mr-1">
              Passage Paragraph
            </Typography>
          </div>
          <div className="p-5 italic font-medium leading-relaxed text-foreground/80">
            <Typography variant="body2" color="text-foreground/80" italic weight="medium" className="leading-relaxed">
              &quot;{passage}&quot;
            </Typography>
          </div>
        </div>

        {/* Question Section */}
        <div className="rounded-2xl border border-border bg-muted/10 p-1 relative pt-5 shadow-sm">
          <div className="absolute top-0 left-6 -translate-y-1/2 flex items-center gap-2 bg-background px-3 py-1 rounded-full border border-border shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            <Typography variant="body5" weight="black" className="uppercase tracking-widest mr-1">
              Question Text
            </Typography>
          </div>
          <div className="p-5">
            <Typography variant="body2" weight="semibold" color="text-foreground" className="leading-relaxed tracking-tight">
              {questionText}
            </Typography>
          </div>
        </div>

        {/* Answer Area */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <Typography
                variant="body4"
                className="font-bold text-brand-primary uppercase tracking-widest text-[11px]"
              >
                Your Analytical Response
              </Typography>
              <div className="h-1 w-1 rounded-full bg-brand-primary animate-ping" />
            </div>
            <div className="flex items-center gap-3">
              <Typography
                variant="body5"
                className="font-mono text-[11px] opacity-60 italic"
              >
                Write a detailed response based on the passage context above
              </Typography>
            </div>
          </div>
          <Textarea
            rows={8}
            placeholder="Focus and start typing your analysis here..."
            value={currentAnswer}
            onChange={(event) => onChangeAnswer(event.target.value)}
            className="rounded-2xl font-mono text-lg leading-relaxed bg-muted/5 border-2 border-border focus:border-brand-primary focus:bg-background focus:ring-[8px] focus:ring-brand-primary/10 transition-all p-6 shadow-inner"
          />
        </div>
      </div>
    </div>
  );
});
