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
      className={`grid gap-4 ${
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

        let cardStyle = "border-border bg-card/50";
        let labelStyle = "border-border text-muted-foreground/60";

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
            className={`group/opt relative ${STYLE_CONFIG.innerCardRadius} border p-4 transition-all duration-300 hover:scale-[1.02] ${cardStyle}`}
          >
            <div className="flex items-start gap-4">
              <div
                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center ${STYLE_CONFIG.iconRadius} border text-xs font-black transition-colors ${labelStyle}`}
              >
                {opt.optionLabel}
              </div>
              <div className="flex-1 min-w-0">
                {opt.imageUrl && (
                  <div
                    className="mb-3.5 w-fit max-w-full border border-border/30 bg-muted/5 p-1.5 rounded-md shadow-inner cursor-zoom-in hover:scale-[1.02] hover:border-brand-primary/30 transition-all active:scale-[0.98] duration-300 group-hover/opt:border-border/60"
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
                      className="w-auto h-auto max-h-[160px] object-contain rounded-[4px] bg-black/[0.02] dark:bg-white/[0.02]"
                      unoptimized
                    />
                  </div>
                )}
                <Typography
                  variant="body2"
                  className="font-bold leading-snug text-base md:text-lg"
                >
                  {opt.optionText}
                </Typography>
                <div className="mt-2.5 flex flex-wrap gap-2">
                  {isSelected && (
                    <div
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-[9px] font-black uppercase tracking-wider ${
                        isWrong
                          ? "bg-rose-500/10 text-rose-600"
                          : "bg-brand-primary/10 text-brand-primary"
                      }`}
                    >
                      <div
                        className={`w-1 h-1 rounded-sm ${
                          isWrong ? "bg-rose-600" : "bg-brand-primary"
                        }`}
                      />
                      Candidate Answer
                    </div>
                  )}
                  {isCorrect && (
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-emerald-500/10 text-emerald-600 text-[9px] font-black uppercase tracking-wider">
                      <div className="w-1 h-1 rounded-sm bg-emerald-600" />
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
