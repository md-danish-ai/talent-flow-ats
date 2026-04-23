"use client";
import { memo } from "react";
import { Radio } from "@components/ui-elements/Radio";
import { Typography } from "@components/ui-elements/Typography";

interface MultipleChoiceViewProps {
  questionId: number;
  options: string[];
  currentAnswer: string;
  onChangeAnswer: (value: string) => void;
}

export const MultipleChoiceView = memo(function MultipleChoiceView({
  questionId,
  options,
  currentAnswer,
  onChangeAnswer,
}: MultipleChoiceViewProps) {
  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center gap-2 px-2 mb-1">
        <Typography
          variant="body4"
          className="font-bold text-brand-primary uppercase tracking-widest text-[11px]"
        >
          Select Your Answer
        </Typography>
        <div className="h-1 w-1 rounded-full bg-brand-primary animate-ping" />
      </div>

      <div className="space-y-3">
        {(options || []).map((option, index) => {
          const optionKey = String.fromCharCode(65 + index);
          const savedValue = optionKey;
          const displayValue = `${optionKey}. ${option}`;
          const isChecked = currentAnswer === savedValue;

          return (
            <label
              key={`${questionId}-${optionKey}`}
              className={`group flex items-center gap-3 rounded-xl border px-4 py-3 transition-all cursor-pointer ${
                isChecked
                  ? "border-brand-primary bg-brand-primary/10 shadow-[0_6px_20px_rgba(249,99,49,0.14)]"
                  : "border-border bg-card hover:border-brand-primary/40 hover:bg-brand-primary/5"
              }`}
            >
              <Radio
                checked={isChecked}
                onChange={() => onChangeAnswer(savedValue)}
                name={`question-${questionId}`}
              />
              <Typography
                variant="body2"
                className={`transition-colors break-words ${
                  isChecked
                    ? "text-brand-primary font-semibold"
                    : "text-foreground group-hover:text-brand-primary"
                }`}
              >
                {displayValue}
              </Typography>
            </label>
          );
        })}
      </div>
    </div>
  );
});
