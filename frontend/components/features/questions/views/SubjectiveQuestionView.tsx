"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@lib/utils";
import { STYLE_CONFIG } from "@lib/config/style";
import { Typography } from "@components/ui-elements/Typography";
import { ImageLightbox } from "@components/ui-elements/ImageLightbox";
import { getCanonicalImageUrl } from "@lib/utils/image";
import { Question } from "@types";
import { FileImage } from "lucide-react";

interface SubjectiveQuestionViewProps {
  question: Question;
  showAnswers?: boolean;
  onImageClick?: (url: string, title: string) => void;
}

export const SubjectiveQuestionView: React.FC<SubjectiveQuestionViewProps> = ({
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

  const modelAnswer = question.answer?.answer_text;

  return (
    <div className="space-y-4">
      {/* Question Image if present (Image Subjective) */}
      {question.image_url && (
        <div className="flex flex-col items-start gap-2">
          <div
            className={cn(
              "relative max-w-lg w-full h-56 md:h-64 border border-border/80 overflow-hidden bg-slate-50 dark:bg-slate-950 group cursor-zoom-in print:h-48 print:max-w-md",
              STYLE_CONFIG.innerCardRadius,
            )}
            onClick={() =>
              handleImgClick(question.image_url!, "Subjective Question Diagram")
            }
          >
            <Image
              src={getCanonicalImageUrl(question.image_url)}
              alt="Subjective Question Material"
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

      {/* Explicitly labeled Question Text */}
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

      {/* Answer Area - Shows Model Answer when visible, or Ruled Response Box when hidden */}
      {showAnswers ? (
        <div
          className={cn(
            "p-3.5 bg-emerald-500/[0.06] dark:bg-emerald-500/10 border border-emerald-500/25 space-y-2 print:bg-emerald-50/40 print:border-emerald-600",
            STYLE_CONFIG.innerCardRadius,
          )}
        >
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider bg-emerald-600 text-white print:bg-emerald-700">
              Answer
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
              Expected Model Response
            </span>
          </div>
          <Typography
            variant="body4"
            className="text-emerald-950 dark:text-emerald-100 leading-relaxed font-semibold pl-1 whitespace-pre-wrap text-sm print:text-black"
          >
            {modelAnswer || "No model response text configured."}
          </Typography>
        </div>
      ) : (
        <div
          className={cn(
            "p-4 bg-slate-50/50 dark:bg-slate-800/20 border border-dashed border-slate-300 dark:border-slate-700 min-h-[120px] print:bg-white print:border-slate-400 flex flex-col justify-between",
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
