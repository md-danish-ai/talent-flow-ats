"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@lib/utils";
import { STYLE_CONFIG } from "@lib/config/style";
import { Typography } from "@components/ui-elements/Typography";
import { Badge } from "@components/ui-elements/Badge";
import { ImageLightbox } from "@components/ui-elements/ImageLightbox";
import { getCanonicalImageUrl } from "@lib/utils/image";
import { Question, QuestionOption } from "@types";
import { Check, FileImage } from "lucide-react";

interface MCQQuestionViewProps {
  question: Question;
  showAnswers?: boolean;
  onImageClick?: (url: string, title: string) => void;
}

export const MCQQuestionView: React.FC<MCQQuestionViewProps> = ({
  question,
  showAnswers = true,
  onImageClick,
}) => {
  const [internalLightbox, setInternalLightbox] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const handleImgClick = (url: string, title: string) => {
    if (onImageClick) {
      onImageClick(url, title);
    } else {
      setInternalLightbox({ url, title });
    }
  };

  const rawOptions = question.options;
  const options: QuestionOption[] = Array.isArray(rawOptions)
    ? rawOptions
    : rawOptions && typeof rawOptions === "object"
      ? (Object.values(rawOptions) as QuestionOption[])
      : [];

  const correctOptions = options.filter((opt) => opt.is_correct);

  return (
    <div className="space-y-4">
      {/* Question Image if present (Image MCQ) */}
      {question.image_url && (
        <div className="flex flex-col items-start gap-2">
          <div
            className={cn(
              "relative max-w-lg w-full h-56 md:h-64 border border-border/80 overflow-hidden bg-slate-50 dark:bg-slate-950 group cursor-zoom-in print:h-48 print:max-w-md",
              STYLE_CONFIG.innerCardRadius,
            )}
            onClick={() =>
              handleImgClick(question.image_url!, "Question Material")
            }
          >
            <Image
              src={getCanonicalImageUrl(question.image_url)}
              alt="Question Material"
              fill
              className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
              unoptimized
            />
            <div className="absolute top-2 right-2 px-2 py-1 bg-black/70 text-white text-[10px] font-bold rounded flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity print:hidden">
              <FileImage size={12} />
              <span>Zoom</span>
            </div>
          </div>
        </div>
      )}

      {/* Clearly labeled Question Text */}
      <div className="flex items-start gap-2.5">
        <span className="shrink-0 px-2 py-0.5 mt-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-brand-primary/10 text-brand-primary border border-brand-primary/20 print:border-slate-400 print:text-black print:bg-slate-100">
          Question
        </span>
        <Typography
          variant="body3"
          weight="bold"
          className="text-foreground leading-relaxed text-base print:text-slate-900 font-bold"
        >
          {question.question_text}
        </Typography>
      </div>

      {/* Options List */}
      {options.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 print:grid-cols-1 print:gap-2 pt-1">
          {options.map((opt, optIdx) => {
            const label = opt.option_label || String.fromCharCode(65 + optIdx);
            const isCorrect = Boolean(opt.is_correct);
            const isAnswerHighlighted = showAnswers && isCorrect;

            return (
              <div
                key={opt.option_label || optIdx}
                className={cn(
                  "flex items-start gap-3 p-3.5 border transition-all duration-200 relative",
                  STYLE_CONFIG.innerCardRadius,
                  isAnswerHighlighted
                    ? "bg-emerald-500/[0.08] dark:bg-emerald-500/15 border-emerald-500/40 text-emerald-950 dark:text-emerald-100 font-medium shadow-sm print:bg-emerald-50 print:border-emerald-600 print:text-black"
                    : "bg-slate-50/50 dark:bg-slate-800/20 border-border/60 text-foreground/80 print:bg-white print:border-slate-300 print:text-black",
                )}
              >
                {/* Option Label Badge (A, B, C, D) */}
                <div
                  className={cn(
                    "w-7 h-7 shrink-0 flex items-center justify-center font-black text-xs border mt-0.5",
                    STYLE_CONFIG.iconRadius,
                    isAnswerHighlighted
                      ? "bg-emerald-600 text-white border-emerald-600 shadow-sm print:bg-emerald-700 print:text-white"
                      : "bg-white dark:bg-slate-800 text-foreground border-border/80 print:bg-slate-100 print:text-black print:border-slate-400",
                  )}
                >
                  {label}
                </div>

                {/* Option Content & Image */}
                <div className="flex-1 space-y-2">
                  {opt.option_text && (
                    <Typography
                      variant="body4"
                      weight={isAnswerHighlighted ? "bold" : "medium"}
                      className="leading-snug pt-0.5"
                    >
                      {opt.option_text}
                    </Typography>
                  )}

                  {opt.image_url && (
                    <div
                      className={cn(
                        "relative w-32 h-20 border border-border/80 overflow-hidden bg-white cursor-zoom-in mt-1",
                        STYLE_CONFIG.innerCardRadius,
                      )}
                      onClick={() =>
                        handleImgClick(opt.image_url!, `Option ${label}`)
                      }
                    >
                      <Image
                        src={getCanonicalImageUrl(opt.image_url)}
                        alt={`Option ${label}`}
                        fill
                        className="object-contain p-1"
                        unoptimized
                      />
                    </div>
                  )}
                </div>

                {/* Correct Badge */}
                {isAnswerHighlighted && (
                  <div className="shrink-0 flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-extrabold text-[11px] uppercase tracking-wider bg-emerald-500/15 px-2 py-0.5 rounded print:text-emerald-800 print:border print:border-emerald-600">
                    <Check size={13} className="stroke-[3]" />
                    <span>Correct</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-3 text-xs text-muted-foreground italic">
          No choices configured for this question.
        </div>
      )}

      {/* Answer Area - Shows Answer Key when visible, or Candidate Response Box when hidden */}
      {showAnswers ? (
        <div
          className={cn(
            "p-3.5 bg-emerald-500/[0.06] dark:bg-emerald-500/10 border border-emerald-500/25 flex flex-wrap items-center justify-between gap-2.5 print:bg-emerald-50/50 print:border-emerald-500",
            STYLE_CONFIG.innerCardRadius,
          )}
        >
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider bg-emerald-600 text-white print:bg-emerald-700">
              Answer
            </span>
            <span className="text-sm font-black text-emerald-950 dark:text-emerald-100 print:text-black">
              {correctOptions.length > 0
                ? `Option ${correctOptions.map((o) => o.option_label || "").join(", ")}: ${correctOptions.map((o) => o.option_text || "").join(" ")}`
                : question.answer?.answer_text || "Marked as correct option"}
            </span>
          </div>

          {question.answer?.answer_text && (
            <Badge
              variant="outline"
              color="success"
              shape="square"
              className="font-bold text-[10px]"
            >
              Key: {question.answer.answer_text}
            </Badge>
          )}
        </div>
      ) : (
        <div
          className={cn(
            "p-3.5 bg-slate-50 dark:bg-slate-800/30 border border-dashed border-slate-300 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3 print:bg-white print:border-slate-400",
            STYLE_CONFIG.innerCardRadius,
          )}
        >
          <div className="flex items-center gap-2.5">
            <span className="px-2 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 print:bg-slate-100 print:text-black">
              Answer
            </span>
            <span className="text-xs font-semibold text-muted-foreground italic print:text-slate-700">
              Selected Option:{" "}
              <strong className="font-mono text-foreground print:text-black">
                ________________
              </strong>
            </span>
          </div>

          {options.length > 0 && (
            <div className="flex items-center gap-2 print:flex">
              <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Choice:
              </span>
              <div className="flex items-center gap-1.5">
                {options.map((opt, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded border border-slate-300 dark:border-slate-600 flex items-center justify-center text-[11px] font-bold text-muted-foreground bg-white dark:bg-slate-900 print:border-slate-400 print:text-black"
                  >
                    {opt.option_label || String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {internalLightbox && (
        <ImageLightbox
          isOpen={true}
          src={internalLightbox.url}
          title={internalLightbox.title}
          onClose={() => setInternalLightbox(null)}
        />
      )}
    </div>
  );
};
