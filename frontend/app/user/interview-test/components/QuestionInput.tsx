"use client";
import { memo } from "react";
import { Typography } from "@components/ui-elements/Typography";
import type { InterviewQuestion } from "../types";
import { QuestionImage } from "./QuestionTypes/QuestionImage";

// Import Specialized Components
import { MultipleChoiceView } from "./QuestionTypes/MultipleChoiceView";
import { SubjectiveView } from "./QuestionTypes/SubjectiveView";
import { PassageContentView } from "./QuestionTypes/PassageContentView";
import { TypingTestView } from "./QuestionTypes/TypingTestView";
import { LeadGenerationView } from "./QuestionTypes/LeadGenerationView";
import { ContactDetailsView } from "./QuestionTypes/ContactDetailsView";

interface QuestionInputProps {
  question: InterviewQuestion;
  currentAnswer: string;
  onChangeAnswer: (value: string) => void;
}

function QuestionInputComponent({
  question,
  currentAnswer,
  onChangeAnswer,
}: QuestionInputProps) {
  // 1. Passage Content Header Early Return
  if (question.type === "PASSAGE_CONTENT") {
    return (
      <PassageContentView
        key={question.id}
        passage={question.passage || ""}
        questionText={question.questionText}
        currentAnswer={currentAnswer}
        onChangeAnswer={onChangeAnswer}
      />
    );
  }

  // 2. Typing Test Header Early Return (Uses custom internally styled layout)
  if (question.type === "TYPING_TEST") {
    return (
      <TypingTestView
        key={question.id}
        passage={question.passage || ""}
        questionText={question.questionText}
        currentAnswer={currentAnswer}
        onChangeAnswer={onChangeAnswer}
      />
    );
  }

  // 3. Form Handling (Lead Gen / Contact Details)
  if (question.type === "LEAD_GENERATION") {
    return (
      <div className="space-y-6">
        <LeadGenerationView
          key={question.id}
          questionText={question.questionText}
          currentAnswer={currentAnswer}
          onChangeAnswer={onChangeAnswer}
        />
      </div>
    );
  }

  if (question.type === "CONTACT_DETAILS") {
    return (
      <div className="space-y-6">
        <ContactDetailsView
          key={question.id}
          questionText={question.questionText}
          currentAnswer={currentAnswer}
          onChangeAnswer={onChangeAnswer}
        />
      </div>
    );
  }

  // 4. Default Standard Questions (MCQ / Subjective)
  const isChoiceType =
    question.type === "MULTIPLE_CHOICE" ||
    question.type === "IMAGE_MULTIPLE_CHOICE";

  return (
    <div key={question.id} className="space-y-6 pt-2">
      {/* Description */}
      {question.description && (
        <Typography
          variant="body3"
          className="text-muted-foreground italic bg-muted/5 p-3 rounded-lg border-l-4 border-brand-primary/20"
        >
          {question.description}
        </Typography>
      )}

      {/* Standard Passage (if applicable for standard questions) */}
      {question.passage && (
        <div className="rounded-2xl border border-border bg-muted/10 p-1 relative pt-5 shadow-sm">
          <div className="absolute top-0 left-6 -translate-y-1/2 flex items-center gap-2 bg-background px-3 py-1 rounded-full border border-border shadow-sm">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary/40" />
            <Typography
              variant="body5"
              weight="black"
              className="uppercase tracking-widest mr-1"
            >
              Reference Passage
            </Typography>
          </div>
          <div className="p-5 italic font-medium leading-relaxed text-foreground/80 max-h-60 overflow-y-auto scrollbar-thin">
            <Typography
              variant="body2"
              color="text-foreground/80"
              italic
              weight="medium"
              className="leading-relaxed"
            >
              &quot;{question.passage}&quot;
            </Typography>
          </div>
        </div>
      )}

      {/* Media Content */}
      <QuestionImage
        imageUrl={question.imageUrl}
        image_url={question.image_url}
      />

      {/* Question Text */}
      <div className="rounded-2xl border border-border bg-muted/10 p-1 relative pt-5 shadow-sm">
        <div className="absolute top-0 left-6 -translate-y-1/2 flex items-center gap-2 bg-background px-3 py-1 rounded-full border border-border shadow-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
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
            {question.questionText}
          </Typography>
        </div>
      </div>

      {/* Input Logic */}
      {isChoiceType ? (
        <MultipleChoiceView
          questionId={question.id}
          options={question.options || []}
          currentAnswer={currentAnswer}
          onChangeAnswer={onChangeAnswer}
        />
      ) : (
        <SubjectiveView
          currentAnswer={currentAnswer}
          onChangeAnswer={onChangeAnswer}
        />
      )}
    </div>
  );
}

export const QuestionInput = memo(QuestionInputComponent);
