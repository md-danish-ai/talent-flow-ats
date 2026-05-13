"use client";

import React from "react";
import Image from "next/image";
import { Trophy, PencilLine, FileCheck2 } from "lucide-react";
import { Typography } from "@components/ui-elements/Typography";
import { Badge, type BadgeColor } from "@components/ui-elements/Badge";
import { Input } from "@components/ui-elements/Input";
import { Button } from "@components/ui-elements/Button";
import { ImageLightbox } from "@components/ui-elements/ImageLightbox";
import { motion, AnimatePresence } from "framer-motion";
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

  let mainContentSpanClass = "lg:col-span-8";
  if (isMcqImage) {
    mainContentSpanClass = hasImage ? "lg:col-span-6" : "lg:col-span-12";
  } else if (hasSubjectiveImage) {
    mainContentSpanClass = hasEvaluation ? "lg:col-span-4" : "lg:col-span-6";
  } else if (
    answer.question_type === "MULTIPLE_CHOICE" ||
    answer.question_type === "PASSAGE_CONTENT"
  ) {
    mainContentSpanClass = "lg:col-span-12";
  } else if (!hasEvaluation) {
    mainContentSpanClass = "lg:col-span-12";
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
      className={`group relative overflow-hidden ${STYLE_CONFIG.cardRadius} border transition-all shadow-2xl shadow-slate-300/30 dark:shadow-none hover:shadow-brand-primary/10 ${statusConfig.border} ${statusConfig.bg} p-6 md:p-8`}
    >
      {/* Question Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2.5">
            <Badge variant="outline" color="primary" shape="square">
              Q{index + 1}
            </Badge>
            <Badge
              variant="outline"
              color={statusConfig.badge as BadgeColor}
              shape="square"
            >
              {humanizeString(answer.status)}
            </Badge>
            {answer.question_type && (
              <Badge variant="outline" color="violet" shape="square">
                {humanizeString(answer.question_type)}
              </Badge>
            )}
          </div>
          <Typography
            variant="h2"
            className="font-black leading-[1.3] text-foreground tracking-tight text-2xl md:text-3xl"
          >
            {answer.question_text}
          </Typography>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* MCQ Image Container */}
        {isMcqImage && hasImage && (
          <div className="lg:col-span-6 flex flex-col justify-center items-center lg:items-start">
            <div
              className={`w-fit border border-border/50 bg-muted/20 p-2 ${STYLE_CONFIG.innerCardRadius} shadow-inner cursor-zoom-in hover:scale-[1.02] transition-all active:scale-[0.98] duration-300`}
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
                className={`w-auto h-auto max-h-[400px] max-w-full ${STYLE_CONFIG.innerCardRadius} object-contain`}
                unoptimized
              />
            </div>
          </div>
        )}

        {/* Subjective/Other Reference Media Container */}
        {hasSubjectiveImage && (
          <div
            className={`${hasEvaluation ? "lg:col-span-4" : "lg:col-span-6"} space-y-6 flex flex-col animate-in fade-in slide-in-from-left-3 duration-500`}
          >
            <div className="flex items-center gap-3">
              <Typography
                variant="body5"
                className="font-black uppercase tracking-[0.2em] text-muted-foreground/60 whitespace-nowrap"
              >
                Reference Media
              </Typography>
              <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent opacity-50" />
            </div>
            <div
              className={`w-full border border-border/50 bg-muted/20 p-2 ${STYLE_CONFIG.innerCardRadius} shadow-inner cursor-zoom-in hover:scale-[1.01] hover:border-brand-primary/30 transition-all active:scale-[0.98] duration-300`}
              onClick={() =>
                openLightbox(answer.image_url || "", "Reference Media")
              }
            >
              <Image
                src={getCanonicalImageUrl(answer.image_url) as string}
                alt="Question Content"
                width={800}
                height={600}
                className={`w-full h-auto max-h-[400px] rounded-sm object-contain bg-black/5 dark:bg-white/5`}
                unoptimized
              />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className={`${mainContentSpanClass} space-y-6`}>
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
            <Typography
              variant="body5"
              className="font-black uppercase tracking-[0.2em] text-muted-foreground/60 whitespace-nowrap"
            >
              Response Review
            </Typography>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
          </div>

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

        {/* Evaluation Sidebar Part */}
        {hasEvaluation && (
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <Typography
                variant="body5"
                className="font-black uppercase tracking-[0.2em] text-muted-foreground/60 whitespace-nowrap"
              >
                Evaluation
              </Typography>
              <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent opacity-50" />
            </div>
            <div
              className={`${STYLE_CONFIG.cardRadius} border border-slate-200/60 dark:border-white/[0.06] bg-gradient-to-b from-card/95 via-card/90 to-card/95 dark:from-card/90 dark:via-card/80 dark:to-card/95 shadow-xl shadow-slate-200/50 dark:shadow-none backdrop-blur-xl p-6 space-y-6 relative overflow-hidden animate-in fade-in duration-500`}
            >
              {/* Glowing background element for visual richness */}
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-brand-primary/10 dark:bg-brand-primary/5 rounded-full blur-2xl opacity-60 pointer-events-none" />

              {/* Redesigned System Score Dashboard Widget */}
              <div
                className={`p-5 ${STYLE_CONFIG.innerCardRadius} bg-gradient-to-br from-foreground/[0.01] to-foreground/[0.04] dark:from-white/[0.01] dark:to-white/[0.04] border border-border/40 dark:border-white/[0.03] shadow-inner space-y-3 relative transition-all duration-300 hover:border-border/70 hover:bg-foreground/[0.02] dark:hover:bg-white/[0.02]`}
              >
                <div className="flex items-center justify-between">
                  <Typography
                    variant="body4"
                    className="font-black text-muted-foreground/70 uppercase tracking-widest text-[11px]"
                  >
                    System Calculated Score
                  </Typography>
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`h-1.5 w-1.5 rounded-full ${answer.status === "correct" ? "bg-emerald-500 shadow-[0_0_6px_#10b981]" : "bg-rose-500 shadow-[0_0_6px_#f43f5e]"} animate-pulse`}
                    />
                    <span className="text-[11px] font-black text-muted-foreground/45 uppercase">
                      {answer.status}
                    </span>
                  </div>
                </div>

                <div className="flex items-baseline gap-1.5">
                  <Typography
                    variant="h1"
                    className="font-black tracking-tighter text-4xl md:text-5xl bg-gradient-to-b from-foreground to-foreground/80 bg-clip-text select-none"
                  >
                    {answer.marks_obtained}
                  </Typography>
                  <Typography
                    variant="h3"
                    className="text-muted-foreground/30 font-black tracking-tight"
                  >
                    / {answer.max_marks}
                  </Typography>
                </div>

                <div className="space-y-1">
                  <div className="w-full h-2.5 bg-muted/50 dark:bg-black/30 rounded-full overflow-hidden border border-border/20 dark:border-white/[0.02] p-[1.5px]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(answer.marks_obtained / (answer.max_marks || 1)) * 100}%`,
                      }}
                      className={`h-full rounded-full transition-all duration-1000 ${
                        answer.status === "correct"
                          ? "bg-gradient-to-r from-emerald-500 to-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.4)]"
                          : "bg-gradient-to-r from-rose-500 to-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.4)]"
                      }`}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-black tracking-wider uppercase text-muted-foreground/35 select-none px-0.5">
                    <span>Min</span>
                    <span>Max Marks</span>
                  </div>
                </div>
              </div>

              <div className="h-px w-full bg-gradient-to-r from-transparent via-border/30 to-transparent" />

              {/* Redesigned Manual Override Block */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Typography
                    variant="body4"
                    className="font-black text-muted-foreground/60 uppercase tracking-widest text-[11px]"
                  >
                    Manual Evaluation
                  </Typography>
                  <PencilLine size={14} className="text-muted-foreground/40" />
                </div>

                <div className="space-y-3.5">
                  {/* PRESERVED INPUT: Exactly matching user's styling without modifications */}
                  <Input
                    type="number"
                    min={0}
                    max={answer.max_marks}
                    value={manualMarksValue}
                    onChange={(e) =>
                      onManualMarksChange(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder={`Score (0-${answer.max_marks})`}
                    className="font-black [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />

                  <Button
                    variant="primary"
                    color="primary"
                    animate="scale"
                    className="w-full h-12 transition-all duration-300 font-black shadow-md hover:shadow-lg hover:shadow-brand-primary/10 active:scale-[0.98]"
                    onClick={onManualMarksApply}
                  >
                    Adjust Marks
                  </Button>

                  <AnimatePresence>
                    {isManualMarksApplied && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        className={`flex items-center justify-between p-3 text-[12px] font-black text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-lg border border-emerald-500/25 backdrop-blur-sm shadow-sm shadow-emerald-500/10 animate-in zoom-in-95`}
                      >
                        <div className="flex items-center gap-2">
                          <FileCheck2
                            size={14}
                            className="text-emerald-600 dark:text-emerald-400"
                          />
                          <span className="tracking-wide uppercase text-[11px]">
                            Marks Applied:
                          </span>
                        </div>
                        <span className="px-2.5 py-0.5 bg-emerald-600 dark:bg-emerald-500 text-white rounded font-mono shadow-sm leading-normal">
                          {manualMarksValue}
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <Typography
                    variant="body5"
                    className="text-center text-muted-foreground/45 italic tracking-wide text-[11px]"
                  >
                    * Manual override overrides system calculations.
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Decorative elements */}
      {answer.status === "correct" && (
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-700">
          <Trophy size={200} />
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
