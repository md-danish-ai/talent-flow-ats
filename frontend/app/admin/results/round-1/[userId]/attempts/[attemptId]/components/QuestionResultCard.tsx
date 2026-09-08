"use client";

import React from "react";
import Image from "next/image";
import { Trophy, FileCheck2 } from "lucide-react";
import { Typography } from "@components/ui-elements/Typography";
import { Badge, type BadgeColor } from "@components/ui-elements/Badge";
import { Input } from "@components/ui-elements/Input";
import { Button } from "@components/ui-elements/Button";
import { ImageLightbox } from "@components/ui-elements/ImageLightbox";
import { type AdminUserResultAnswer } from "@types";
import { humanizeString, type ParsedOption } from "@lib/utils";
import { STYLE_CONFIG } from "@lib/config/style";

// Specialized Question Type Renderers
import { MCQResultView } from "./question-types/MCQResultView";
import { TypingResultView } from "./question-types/TypingResultView";
import { SubjectiveResultView } from "./question-types/SubjectiveResultView";
import { StructuredResultView } from "./question-types/StructuredResultView";

interface QuestionResultCardProps {
  answer: AdminUserResultAnswer;
  index: number;
  manualMarksValue: string;
  isManualMarksApplied: boolean;
  onManualMarksChange: (val: string) => void;
  onManualMarksApply: () => void;
  getCanonicalImageUrl: (url?: string | null) => string | null;
  parseQuestionOptions: (
    options: Array<Record<string, unknown>> | null | undefined,
  ) => ParsedOption[];
  extractOptionKey: (val?: string | null) => string;
  normalizeText: (val?: string | null) => string;
}

export const QuestionResultCard = ({
  answer,
  index,
  manualMarksValue,
  isManualMarksApplied,
  onManualMarksChange,
  onManualMarksApply,
  getCanonicalImageUrl,
  parseQuestionOptions,
  extractOptionKey,
  normalizeText,
}: QuestionResultCardProps) => {
  const options = parseQuestionOptions(answer.options || []);
  const [lightboxData, setLightboxData] = React.useState<{
    isOpen: boolean;
    src: string;
    title: string;
  }>({ isOpen: false, src: "", title: "" });

  const openLightbox = (src: string, title: string) => {
    setLightboxData({ isOpen: true, src, title });
  };
  const optionSelectedByKey = extractOptionKey(answer.user_answer);
  const normalizedUserAnswer = normalizeText(answer.user_answer);
  const isChoiceType = options.length > 0;

  const hasImage = !!answer.image_url;
  const isMcqImage = answer.question_type === "IMAGE_MULTIPLE_CHOICE";
  const hasSubjectiveImage = hasImage && !isMcqImage;
  const hasEvaluation =
    answer.question_type !== "MULTIPLE_CHOICE" &&
    answer.question_type !== "IMAGE_MULTIPLE_CHOICE" &&
    answer.question_type !== "PASSAGE_CONTENT" &&
    answer.is_attempted;

  let mainContentSpanClass = "col-span-12";
  if (isMcqImage && hasImage) {
    mainContentSpanClass = "lg:col-span-6";
  } else if (hasSubjectiveImage) {
    mainContentSpanClass = "lg:col-span-7";
  }

  const statusConfig =
    answer.status === "correct"
      ? {
          border: "border-emerald-500/20",
          bg: "bg-emerald-500/[0.02]",
          text: "text-emerald-700",
          badge: "success",
        }
      : answer.status === "incorrect"
        ? {
            border: "border-rose-500/20",
            bg: "bg-rose-500/[0.02]",
            text: "text-rose-700",
            badge: "error",
          }
        : {
            border: "border-amber-500/20",
            bg: "bg-amber-500/[0.02]",
            text: "text-amber-700",
            badge: "warning",
          };

  return (
    <div
      className={`group relative overflow-hidden ${STYLE_CONFIG.cardRadius} border transition-all shadow-sm hover:shadow-md hover:shadow-brand-primary/10 ${statusConfig.border} ${statusConfig.bg} p-5 md:p-6 space-y-4`}
    >
      {/* Top Header: Question Meta & Evaluation Actions */}
      <div className="flex flex-col gap-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Left: Question Type & Status (Correction) */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Question Type */}
            {answer.question_type && (
              <Badge variant="outline" color="violet" shape="square">
                {humanizeString(answer.question_type)}
              </Badge>
            )}

            {/* Status (Correction) */}
            <Badge
              variant="outline"
              color={statusConfig.badge as BadgeColor}
              shape="square"
            >
              <span
                className={`w-1.5 h-1.5 rounded-full mr-1.5 inline-block ${
                  answer.status === "correct"
                    ? "bg-emerald-500 shadow-[0_0_6px_#10b981]"
                    : answer.status === "incorrect"
                      ? "bg-rose-500 shadow-[0_0_6px_#f43f5e]"
                      : "bg-amber-500 shadow-[0_0_6px_#f59e0b]"
                }`}
              />
              {humanizeString(answer.status)}
            </Badge>
          </div>

          {/* Right: Elevated Standout Marks & Manual Marks Dock */}
          {hasEvaluation && (
            <div className="relative flex items-center gap-3 bg-white dark:bg-slate-900 border-2 border-brand-primary/30 dark:border-brand-primary/45 p-2 px-3.5 rounded-xl shrink-0 shadow-md shadow-brand-primary/10 dark:shadow-black/50 ring-2 ring-brand-primary/10 dark:ring-brand-primary/20 transition-all duration-200 hover:border-brand-primary/50 hover:shadow-lg hover:shadow-brand-primary/15">
              {/* Top accent glow line */}
              <div className="absolute -top-[2px] left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-brand-primary to-transparent rounded-full opacity-80" />

              {/* Applied Badge at the Start */}
              {isManualMarksApplied && (
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-500/15 dark:bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/35 whitespace-nowrap shadow-sm">
                  <FileCheck2
                    size={13}
                    className="text-emerald-600 dark:text-emerald-400"
                  />
                  Applied
                </span>
              )}

              {/* Current Marks Display */}
              <div className="flex items-center gap-2 pr-3 border-r-2 border-brand-primary/20 dark:border-brand-primary/30">
                <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                  MARKS:
                </span>
                <span className="text-base font-black text-foreground">
                  {answer.marks_obtained}
                  <span className="text-xs font-bold text-muted-foreground">
                    {" "}
                    / {answer.max_marks}
                  </span>
                </span>
              </div>

              {/* Manual Input + Action */}
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] font-black uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                  MANUAL:
                </span>
                <Input
                  type="text"
                  inputMode="decimal"
                  value={manualMarksValue}
                  onChange={(e) => {
                    let val = e.target.value;
                    if (val === "") {
                      onManualMarksChange("");
                      return;
                    }
                    val = val.replace(/[^0-9.]/g, "");
                    const parts = val.split(".");
                    if (parts.length > 2) {
                      val = parts[0] + "." + parts.slice(1).join("");
                    }
                    const [intPart, decPart] = val.split(".");
                    if (decPart !== undefined) {
                      val = `${intPart}.${decPart.slice(0, 2)}`;
                    }
                    const num = parseFloat(val);
                    if (!isNaN(num) && num > answer.max_marks) {
                      val = String(answer.max_marks);
                    }
                    onManualMarksChange(val);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      onManualMarksApply();
                    }
                  }}
                  placeholder={`0-${answer.max_marks}`}
                  className="h-9 w-24 text-center font-bold text-xs bg-slate-50 dark:bg-slate-950 border-2 border-border/80 focus:border-brand-primary shadow-inner"
                />
                <Button
                  variant="primary"
                  color="primary"
                  size="sm"
                  className="h-9 px-4.5 text-xs font-bold whitespace-nowrap shadow-md hover:shadow-lg active:scale-[0.98] shrink-0 min-w-[75px]"
                  onClick={onManualMarksApply}
                >
                  Assign
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Question Text with Q.X */}
        <div className="flex items-start gap-2.5 pt-0.5">
          <span className="font-mono font-black text-brand-primary text-base md:text-lg shrink-0 leading-snug select-none">
            Q.{index + 1}.
          </span>
          <Typography
            variant="h3"
            className="font-bold leading-snug text-foreground tracking-tight text-base md:text-lg flex-1"
          >
            {answer.question_text}
          </Typography>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* MCQ Image Container */}
        {isMcqImage && hasImage && (
          <div className="lg:col-span-6 flex flex-col justify-center items-center lg:items-start">
            <div
              className={`w-fit border border-border/50 bg-muted/20 p-2 ${STYLE_CONFIG.innerCardRadius} shadow-inner cursor-zoom-in hover:scale-[1.01] transition-all active:scale-[0.98] duration-200`}
              onClick={() =>
                openLightbox(
                  answer.image_url || "",
                  answer.question_text || "Question Content",
                )
              }
            >
              <Image
                src={getCanonicalImageUrl(answer.image_url) as string}
                alt="Question Content"
                width={800}
                height={600}
                className={`w-auto h-auto max-h-[300px] max-w-full ${STYLE_CONFIG.innerCardRadius} object-contain`}
                unoptimized
              />
            </div>
          </div>
        )}

        {/* Subjective/Other Reference Media Container */}
        {hasSubjectiveImage && (
          <div className="lg:col-span-5 space-y-2 flex flex-col">
            <Typography
              variant="body5"
              className="font-bold uppercase tracking-wider text-muted-foreground/70 text-xs"
            >
              Reference Media
            </Typography>
            <div
              className={`w-full border border-border/50 bg-muted/20 p-2 ${STYLE_CONFIG.innerCardRadius} shadow-inner cursor-zoom-in hover:scale-[1.01] hover:border-brand-primary/30 transition-all active:scale-[0.98] duration-200`}
              onClick={() =>
                openLightbox(answer.image_url || "", "Reference Media")
              }
            >
              <Image
                src={getCanonicalImageUrl(answer.image_url) as string}
                alt="Question Content"
                width={800}
                height={600}
                className={`w-full h-auto max-h-[300px] rounded object-contain bg-black/5 dark:bg-white/5`}
                unoptimized
              />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className={mainContentSpanClass}>
          {(() => {
            if (answer.question_type === "TYPING_TEST") {
              return <TypingResultView answer={answer} />;
            }
            if (
              answer.question_type === "LEAD_GENERATION" ||
              answer.question_type === "CONTACT_DETAILS"
            ) {
              return <StructuredResultView answer={answer} />;
            }
            if (isChoiceType) {
              return (
                <MCQResultView
                  answer={answer}
                  options={options}
                  optionSelectedByKey={optionSelectedByKey}
                  normalizedUserAnswer={normalizedUserAnswer}
                  getCanonicalImageUrl={getCanonicalImageUrl}
                  normalizeText={normalizeText}
                  openLightbox={openLightbox}
                />
              );
            }
            return <SubjectiveResultView answer={answer} />;
          })()}
        </div>
      </div>

      {/* Decorative elements */}
      {answer.status === "correct" && (
        <div className="absolute top-0 right-0 p-3 opacity-[0.025] pointer-events-none group-hover:scale-105 transition-transform duration-500">
          <Trophy size={140} />
        </div>
      )}

      <ImageLightbox
        isOpen={lightboxData.isOpen}
        onClose={() => setLightboxData((prev) => ({ ...prev, isOpen: false }))}
        src={lightboxData.src}
        title={lightboxData.title}
      />
    </div>
  );
};
