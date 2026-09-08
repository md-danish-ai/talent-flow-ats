"use client";

import React from "react";
import Image from "next/image";
import { Typography } from "@components/ui-elements/Typography";
import { type AdminUserResultAnswer } from "@types";
import { type ParsedOption } from "@lib/utils";
import { STYLE_CONFIG } from "@lib/config/style";

interface MCQResultViewProps {
  answer: AdminUserResultAnswer;
  options: ParsedOption[];
  optionSelectedByKey: string;
  normalizedUserAnswer: string;
  getCanonicalImageUrl: (url?: string | null) => string | null;
  normalizeText: (val?: string | null) => string;
  openLightbox: (src: string, title: string) => void;
}

export const MCQResultView = ({
  answer,
  options,
  optionSelectedByKey,
  normalizedUserAnswer,
  getCanonicalImageUrl,
  normalizeText,
  openLightbox,
}: MCQResultViewProps) => {
  return (
    <div
      className={`grid gap-3.5 ${
        answer.question_type === "IMAGE_MULTIPLE_CHOICE" && answer.image_url
          ? "grid-cols-1"
          : "grid-cols-1 md:grid-cols-2"
      }`}
    >
      {options.map((opt) => {
        const isSelected =
          optionSelectedByKey === opt.optionLabel ||
          normalizeText(opt.optionText) === normalizedUserAnswer;
        const isCorrect = opt.isCorrect;
        const isWrong = isSelected && !isCorrect;

        let cardStyle = "border-border bg-card/60";
        let labelStyle = "border-border text-muted-foreground";

        if (isCorrect) {
          cardStyle =
            "border-emerald-500/30 bg-emerald-500/[0.04] shadow-sm shadow-emerald-500/10";
          labelStyle =
            "border-emerald-500/30 bg-emerald-500/10 text-emerald-600";
        } else if (isWrong) {
          cardStyle =
            "border-rose-500/30 bg-rose-500/[0.04] shadow-sm shadow-rose-500/10";
          labelStyle = "border-rose-500/30 bg-rose-500/10 text-rose-600";
        } else if (isSelected) {
          cardStyle = "border-brand-primary/30 bg-brand-primary/[0.04]";
          labelStyle =
            "border-brand-primary/30 bg-brand-primary/10 text-brand-primary";
        }

        return (
          <div
            key={opt.optionLabel}
            className={`group/opt relative ${STYLE_CONFIG.innerCardRadius} border p-3.5 transition-all duration-200 hover:scale-[1.01] ${cardStyle}`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center ${STYLE_CONFIG.iconRadius} border text-xs font-bold transition-colors ${labelStyle}`}
              >
                {opt.optionLabel}
              </div>
              <div className="flex-1 min-w-0">
                {opt.imageUrl && (
                  <div
                    className="mb-2.5 w-fit max-w-full border border-border/40 bg-muted/20 p-1.5 rounded-lg shadow-inner cursor-zoom-in hover:scale-[1.01] hover:border-brand-primary/30 transition-all active:scale-[0.98] duration-200 group-hover/opt:border-border/60"
                    onClick={(e) => {
                      e.stopPropagation();
                      openLightbox(
                        opt.imageUrl!,
                        `Option ${opt.optionLabel} Media`,
                      );
                    }}
                  >
                    <Image
                      src={getCanonicalImageUrl(opt.imageUrl) as string}
                      alt={`Option ${opt.optionLabel} Content`}
                      width={400}
                      height={300}
                      className="w-auto h-auto max-h-[140px] object-contain rounded bg-black/[0.02] dark:bg-white/[0.02]"
                      unoptimized
                    />
                  </div>
                )}
                <Typography
                  variant="body2"
                  className="font-medium leading-snug text-sm sm:text-base text-foreground"
                >
                  {opt.optionText}
                </Typography>
                <div className="mt-2 flex flex-wrap gap-2">
                  {isSelected && (
                    <div
                      className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        isWrong
                          ? "bg-rose-500/10 text-rose-600 border border-rose-500/20"
                          : "bg-brand-primary/10 text-brand-primary border border-brand-primary/20"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          isWrong ? "bg-rose-600" : "bg-brand-primary"
                        }`}
                      />
                      Candidate Answer
                    </div>
                  )}
                  {isCorrect && (
                    <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      Correct Choice
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
