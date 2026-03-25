import { Radio } from "@components/ui-elements/Radio";
import { Textarea } from "@components/ui-elements/Textarea";
import { Typography } from "@components/ui-elements/Typography";
import type { InterviewQuestion } from "../types";

const BACKEND_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

/** Converts a relative `/images/...` path from the backend into a full URL. */
function resolveImageUrl(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `${BACKEND_BASE_URL}${url}`;
}

interface QuestionInputProps {
  question: InterviewQuestion;
  currentAnswer: string;
  onChangeAnswer: (value: string) => void;
}

export function QuestionInput({
  question,
  currentAnswer,
  onChangeAnswer,
}: QuestionInputProps) {
  const isChoiceType =
    question.type === "MCQ" ||
    question.type === "IMAGE_MCQ" ||
    question.type === "PASSAGE_MCQ";

  return (
    <div className="space-y-4">
      <Typography variant="h3" className="text-foreground">
        {question.type === "SUBJECTIVE"
          ? "Subjective Question"
          : "Multiple Choice Question"}
      </Typography>

      {question.description && (
        <Typography variant="body3">{question.description}</Typography>
      )}

      {question.passage && (
        <div className="rounded-lg border border-border bg-muted/20 p-3 sm:p-4 max-h-56 sm:max-h-60 overflow-y-auto">
          <Typography variant="body4" className="text-foreground">
            Passage
          </Typography>
          <Typography variant="body3" className="mt-2 leading-relaxed">
            {question.passage}
          </Typography>
        </div>
      )}

      {question.imageUrl && (
        <div className="rounded-lg border border-border bg-muted/20 p-4">
          <Typography variant="body5" className="mb-2">
            Reference Image
          </Typography>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resolveImageUrl(question.imageUrl)}
            alt="Question reference"
            className="w-full max-w-[320px] h-auto rounded-lg border border-border object-contain bg-white"
          />
        </div>
      )}


      <Typography variant="body2" className="text-foreground font-semibold">
        {question.questionText}
      </Typography>

      {isChoiceType ? (
        <div className="space-y-3">
          {(question.options || []).map((option, index) => {
            const optionKey = String.fromCharCode(65 + index);
            const savedValue = optionKey;
            const displayValue = `${optionKey}. ${option}`;
            const isChecked = currentAnswer === savedValue;

            return (
              <label
                key={`${question.id}-${optionKey}`}
                className={`group flex items-center gap-3 rounded-xl border px-4 py-3 transition-all ${
                  isChecked
                    ? "border-brand-primary bg-brand-primary/10 shadow-[0_6px_20px_rgba(249,99,49,0.14)]"
                    : "border-border bg-card hover:border-brand-primary/40 hover:bg-brand-primary/5"
                }`}
              >
                <Radio
                  checked={isChecked}
                  onChange={() => onChangeAnswer(savedValue)}
                  name={`question-${question.id}`}
                />
                <Typography
                  variant="body3"
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
      ) : (
        <Textarea
          rows={8}
          placeholder="Write your answer here..."
          value={currentAnswer}
          onChange={(event) => onChangeAnswer(event.target.value)}
          className="rounded-xl"
        />
      )}
    </div>
  );
}
