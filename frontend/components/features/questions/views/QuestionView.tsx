"use client";

import React, { useState } from "react";
import { cn } from "@lib/utils";
import { STYLE_CONFIG } from "@lib/config/style";
import { Badge } from "@components/ui-elements/Badge";
import { ImageLightbox } from "@components/ui-elements/ImageLightbox";
import { Question } from "@types";
import { QUESTION_TYPES } from "@lib/constants/questions";

import { MCQQuestionView } from "./MCQQuestionView";
import { PassageQuestionView } from "./PassageQuestionView";
import { SubjectiveQuestionView } from "./SubjectiveQuestionView";
import { TypingTestQuestionView } from "./TypingTestQuestionView";
import { LeadGenerationQuestionView } from "./LeadGenerationQuestionView";
import { ContactDetailsQuestionView } from "./ContactDetailsQuestionView";

interface QuestionViewProps {
  question: Question;
  index?: number;
  showAnswers?: boolean;
  showHeader?: boolean;
  className?: string;
}

export const QuestionView: React.FC<QuestionViewProps> = ({
  question,
  index,
  showAnswers = true,
  showHeader = true,
  className,
}) => {
  const [lightboxImage, setLightboxImage] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const typeCode =
    typeof question.question_type === "string"
      ? question.question_type
      : question.question_type?.code;

  const subjectCode =
    typeof question.subject === "string"
      ? question.subject
      : question.subject?.code ||
        (question as unknown as Record<string, unknown>).subject_type;

  const questionTypeName = question.question_type?.name || "Multiple Choice";
  const marks = Number(question.marks || 0);

  const handleImageClick = (url: string, title: string) => {
    setLightboxImage({ url, title });
  };

  // Render body based on question type
  const renderQuestionBody = () => {
    // 1. Lead Generation
    if (
      typeCode === QUESTION_TYPES.LEAD_GENERATION ||
      subjectCode === "LEAD_GENERATION"
    ) {
      return (
        <LeadGenerationQuestionView
          question={question}
          showAnswers={showAnswers}
        />
      );
    }

    // 2. Contact Details
    if (
      typeCode === QUESTION_TYPES.CONTACT_DETAILS ||
      subjectCode === "COMPANY_CONTACT_DETAILS" ||
      subjectCode === "CONTACT_DETAILS"
    ) {
      return (
        <ContactDetailsQuestionView
          question={question}
          showAnswers={showAnswers}
        />
      );
    }

    // 3. Typing Test
    if (
      typeCode === QUESTION_TYPES.TYPING_TEST ||
      subjectCode === "TYPING_TEST"
    ) {
      return (
        <TypingTestQuestionView question={question} showAnswers={showAnswers} />
      );
    }

    // 4. Passage Content
    if (
      typeCode === QUESTION_TYPES.PASSAGE_CONTENT ||
      Boolean(question.passage)
    ) {
      return (
        <PassageQuestionView
          question={question}
          showAnswers={showAnswers}
          onImageClick={handleImageClick}
        />
      );
    }

    // 5. Subjective / Image Subjective
    if (
      typeCode === QUESTION_TYPES.SUBJECTIVE ||
      typeCode === QUESTION_TYPES.IMAGE_SUBJECTIVE ||
      questionTypeName.toLowerCase().includes("subjective") ||
      questionTypeName.toLowerCase().includes("essay")
    ) {
      return (
        <SubjectiveQuestionView
          question={question}
          showAnswers={showAnswers}
          onImageClick={handleImageClick}
        />
      );
    }

    // 6. Default: MCQ & Image MCQ
    return (
      <MCQQuestionView
        question={question}
        showAnswers={showAnswers}
        onImageClick={handleImageClick}
      />
    );
  };

  return (
    <>
      <div
        className={cn(
          "relative bg-white dark:bg-slate-900 border border-border/80 shadow-sm transition-all duration-200 overflow-hidden print:border-slate-300 print:shadow-none print:bg-white print:break-inside-avoid print:mb-6",
          STYLE_CONFIG.cardRadius,
          className,
        )}
      >
        {/* Card Header: Question Number, Type, Marks */}
        {showHeader && (
          <div className="flex items-center justify-between px-6 py-3.5 bg-slate-50/80 dark:bg-slate-800/40 border-b border-border/60 print:bg-slate-100 print:border-slate-300 print:py-2">
            <div className="flex items-center gap-3">
              {index !== undefined && (
                <div className="flex items-center justify-center px-3 py-1 bg-brand-primary/10 text-brand-primary font-black text-xs tracking-wider border border-brand-primary/20 rounded-md print:bg-slate-200 print:text-slate-900 print:border-slate-400">
                  Q. {String(index + 1).padStart(2, "0")}
                </div>
              )}

              <Badge
                variant="outline"
                color="primary"
                shape="square"
                className="text-[10px] font-bold uppercase tracking-wider print:text-slate-800 print:border-slate-400"
              >
                {questionTypeName}
              </Badge>

              {question.exam_level?.name && (
                <span className="hidden sm:inline-block text-[11px] font-semibold text-muted-foreground print:inline-block">
                  • {question.exam_level.name}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <div className="px-3 py-1 bg-amber-500/10 dark:bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-400 font-extrabold text-xs rounded-md print:bg-slate-100 print:text-slate-900 print:border-slate-300">
                {marks % 1 === 0 ? marks.toString() : marks.toFixed(1)}{" "}
                {marks === 1 ? "Mark" : "Marks"}
              </div>
            </div>
          </div>
        )}

        {/* Question View Body */}
        <div className="p-6 print:p-4">{renderQuestionBody()}</div>
      </div>

      {/* Shared Lightbox */}
      {lightboxImage && (
        <ImageLightbox
          isOpen={true}
          src={lightboxImage.url}
          title={lightboxImage.title}
          onClose={() => setLightboxImage(null)}
        />
      )}
    </>
  );
};
