"use client";

import React from "react";
import Image from "next/image";
import { Trophy, PencilLine, FileCheck2 } from "lucide-react";
import { Typography } from "@components/ui-elements/Typography";
import { Badge, type BadgeColor } from "@components/ui-elements/Badge";
import { Input } from "@components/ui-elements/Input";
import { Button } from "@components/ui-elements/Button";
import { motion, AnimatePresence } from "framer-motion";
import { type AdminUserResultAnswer } from "@lib/api/results";
import { type ParsedOption } from "../utils";

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
  const optionSelectedByKey = extractOptionKey(answer.user_answer);
  const normalizedUserAnswer = normalizeText(answer.user_answer);
  const isChoiceType = options.length > 0;

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
      className={`group relative overflow-hidden rounded-[2rem] border transition-all hover:shadow-xl hover:shadow-brand-primary/5 ${statusConfig.border} ${statusConfig.bg} p-6 md:p-8`}
    >
      {/* Question Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-foreground/5 text-[11px] font-black text-foreground/70 border border-foreground/5">
              {index + 1}
            </span>
            <Badge
              variant="outline"
              color={statusConfig.badge as BadgeColor}
              className="px-4 py-1 font-black text-[9px] uppercase tracking-widest border-none bg-card/50 shadow-sm"
            >
              {answer.status.replace("_", " ")}
            </Badge>
            {answer.question_type && (
              <Badge
                variant="outline"
                color="default"
                className="px-4 py-1 font-black text-[9px] uppercase tracking-widest opacity-60"
              >
                {answer.question_type.replace("_", " ")}
              </Badge>
            )}
          </div>
          <Typography
            variant="h3"
            className="font-black leading-[1.3] text-foreground tracking-tight"
          >
            {answer.question_text}
          </Typography>
        </div>
      </div>

      {answer.image_url && answer.question_type !== "IMAGE_MULTIPLE_CHOICE" && (
        <div className="mb-8 w-fit mx-auto border border-border/50 bg-muted/20 p-2.5 rounded-[1.5rem] shadow-inner group-hover:scale-[1.01] transition-transform duration-500">
          <Image
            src={getCanonicalImageUrl(answer.image_url) as string}
            alt="Question Content"
            width={800}
            height={400}
            className="w-auto h-auto max-h-[300px] max-w-full rounded-[1rem] object-contain"
            unoptimized
          />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {answer.question_type === "IMAGE_MULTIPLE_CHOICE" &&
          answer.image_url && (
            <div className="lg:col-span-6 flex flex-col justify-center items-center lg:items-start">
              <div className="w-fit border border-border/50 bg-muted/20 p-2.5 rounded-[1.5rem] shadow-inner group-hover:scale-[1.05] transition-transform duration-500">
                <Image
                  src={getCanonicalImageUrl(answer.image_url) as string}
                  alt="Question Content"
                  width={800}
                  height={600}
                  className="w-auto h-auto max-h-[400px] max-w-full rounded-[1rem] object-contain"
                  unoptimized
                />
              </div>
            </div>
          )}

        {/* Main Content Area */}
        <div
          className={
            answer.question_type === "IMAGE_MULTIPLE_CHOICE" && answer.image_url
              ? "lg:col-span-6 space-y-6"
              : answer.question_type === "MULTIPLE_CHOICE" ||
                  answer.question_type === "IMAGE_MULTIPLE_CHOICE"
                ? "lg:col-span-12 space-y-6"
                : "lg:col-span-8 space-y-6"
          }
        >
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

          {isChoiceType ? (
            <div
              className={`grid gap-4 ${
                answer.question_type === "IMAGE_MULTIPLE_CHOICE" &&
                answer.image_url
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
                  labelStyle =
                    "border-rose-500/30 bg-rose-500/10 text-rose-600";
                } else if (isSelected) {
                  cardStyle = "border-brand-primary/30 bg-brand-primary/[0.04]";
                  labelStyle =
                    "border-brand-primary/30 bg-brand-primary/10 text-brand-primary";
                }

                return (
                  <div
                    key={opt.optionLabel}
                    className={`group/opt relative rounded-2xl border p-4 transition-all duration-300 hover:scale-[1.02] ${cardStyle}`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[11px] font-black transition-colors ${labelStyle}`}
                      >
                        {opt.optionLabel}
                      </div>
                      <div className="flex-1 min-w-0">
                        <Typography
                          variant="body4"
                          className="font-bold leading-snug"
                        >
                          {opt.optionText}
                        </Typography>
                        <div className="mt-2.5 flex flex-wrap gap-2">
                          {isSelected && (
                            <div
                              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${isWrong ? "bg-rose-500/10 text-rose-600" : "bg-brand-primary/10 text-brand-primary"}`}
                            >
                              <div
                                className={`w-1 h-1 rounded-full ${isWrong ? "bg-rose-600" : "bg-brand-primary"}`}
                              />
                              Candidate Answer
                            </div>
                          )}
                          {isCorrect && (
                            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[9px] font-black uppercase tracking-wider">
                              <div className="w-1 h-1 rounded-full bg-emerald-600" />
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
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {answer.typing_stats && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2 duration-1000">
                  {[
                    {
                      label: "Speed",
                      value: `${answer.typing_stats.wpm} WPM`,
                      bg: "bg-brand-primary/5",
                      color: "text-brand-primary",
                    },
                    {
                      label: "Accuracy",
                      value: `${answer.typing_stats.accuracy}%`,
                      bg: "bg-emerald-500/5",
                      color: "text-emerald-600",
                    },
                    {
                      label: "Errors",
                      value: answer.typing_stats.errors,
                      bg: "bg-rose-500/5",
                      color: "text-rose-600",
                    },
                    {
                      label: "Duration",
                      value: `${Math.round(answer.typing_stats.time_taken)}s`,
                      bg: "bg-amber-500/5",
                      color: "text-amber-600",
                    },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className={`p-4 rounded-2xl border border-border/50 ${stat.bg} transition-all hover:scale-[1.05]`}
                    >
                      <Typography
                        variant="body5"
                        className="font-black text-muted-foreground/60 uppercase tracking-widest text-[9px] mb-1"
                      >
                        {stat.label}
                      </Typography>
                      <Typography
                        variant="body3"
                        className={`font-black ${stat.color} tracking-tight`}
                      >
                        {stat.value}
                      </Typography>
                    </div>
                  ))}
                </div>
              )}
              <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.03] p-5 animate-in fade-in slide-in-from-top-4 duration-500">
                <Typography
                  variant="body5"
                  className="font-black text-emerald-600/60 mb-2 uppercase tracking-widest font-mono"
                >
                  {answer.question_type === "TYPING_TEST"
                    ? "SOURCE PASSAGE"
                    : "EXPECTED ANSWER"}
                </Typography>
                <Typography
                  as="div"
                  variant="body4"
                  className="font-mono leading-relaxed italic text-muted-foreground whitespace-pre-wrap text-xs"
                >
                  {(() => {
                    const isStructuredType =
                      answer.question_type === "LEAD_GENERATION" ||
                      answer.question_type === "CONTACT_DETAILS";
                    let displayData: string | null | undefined =
                      answer.correct_answer || answer.passage;

                    // For structured types, prioritize options field if others are empty
                    if (
                      isStructuredType &&
                      !displayData &&
                      answer.options &&
                      !Array.isArray(answer.options)
                    ) {
                      displayData = JSON.stringify(answer.options);
                    }

                    if (
                      displayData &&
                      typeof displayData === "string" &&
                      displayData.trim().startsWith("{")
                    ) {
                      try {
                        const parsed = JSON.parse(displayData);
                        if (typeof parsed === "object" && parsed !== null) {
                          return (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2 not-italic">
                              {Object.entries(parsed).map(([key, value]) => {
                                const label = key
                                  .replace(/([A-Z])/g, " $1")
                                  .replace(/^./, (str) => str.toUpperCase())
                                  .replace(/_/g, " ");
                                return (
                                  <div
                                    key={key}
                                    className="p-3 rounded-xl bg-emerald-500/[0.03] border border-emerald-500/10 shadow-sm transition-all hover:bg-emerald-500/5"
                                  >
                                    <Typography
                                      variant="body5"
                                      className="font-black text-[9px] uppercase tracking-wider text-emerald-600/50 mb-1 leading-none"
                                    >
                                      {label}
                                    </Typography>
                                    <Typography
                                      variant="body4"
                                      className="font-bold text-emerald-700/80 break-words leading-tight"
                                    >
                                      {String(value || "N/A")}
                                    </Typography>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        }
                      } catch {
                        /* fallback */
                      }
                    }
                    return displayData || "N/A";
                  })()}
                </Typography>
              </div>
              <div className="rounded-2xl border border-black/[0.03] bg-black/[0.02] p-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <Typography
                  variant="body5"
                  className="font-black text-muted-foreground/60 mb-2 uppercase tracking-widest"
                >
                  {answer.question_type === "TYPING_TEST"
                    ? "TYPED TEXT (ERROR TRACKING)"
                    : "CANDIDATE RESPONSE"}
                </Typography>
                <Typography
                  as="div"
                  variant="body4"
                  className="font-mono leading-relaxed whitespace-pre-wrap select-all text-xs"
                >
                  {(() => {
                    if (
                      answer.question_type === "TYPING_TEST" &&
                      answer.user_answer &&
                      (answer.correct_answer || answer.passage)
                    ) {
                      return (answer.user_answer as string)
                        .split("")
                        .map((char, i) => {
                          const source =
                            answer.correct_answer || (answer.passage as string);
                          const isCorrect = char === source[i];
                          return (
                            <span
                              key={i}
                              className={
                                isCorrect
                                  ? "text-foreground"
                                  : "text-rose-600 bg-rose-500/10 font-black underline decoration-rose-500/50 underline-offset-[3px]"
                              }
                            >
                              {char}
                            </span>
                          );
                        });
                    }

                    // Handle JSON/Structured responses (Lead Gen, Contact Details)
                    if (
                      answer.user_answer &&
                      answer.user_answer.trim().startsWith("{")
                    ) {
                      try {
                        const parsed = JSON.parse(answer.user_answer);
                        if (typeof parsed === "object" && parsed !== null) {
                          return (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                              {Object.entries(parsed).map(([key, value]) => {
                                const label = key
                                  .replace(/([A-Z])/g, " $1")
                                  .replace(/^./, (str) => str.toUpperCase())
                                  .replace(/_/g, " ");
                                return (
                                  <div
                                    key={key}
                                    className="p-3 rounded-xl bg-white/40 border border-black/[0.03] shadow-sm"
                                  >
                                    <Typography
                                      variant="body5"
                                      className="font-black text-[9px] uppercase tracking-wider text-muted-foreground/50 mb-1 leading-none"
                                    >
                                      {label}
                                    </Typography>
                                    <Typography
                                      variant="body4"
                                      className="font-bold text-foreground break-words leading-tight"
                                    >
                                      {String(value || "N/A")}
                                    </Typography>
                                  </div>
                                );
                              })}
                            </div>
                          );
                        }
                      } catch {
                        /* fallback */
                      }
                    }

                    return answer.user_answer || "No response recorded.";
                  })()}
                </Typography>
              </div>
            </div>
          )}
        </div>

        {/* Evaluation Sidebar Part */}
        <div className="lg:col-span-4 space-y-6">
          {answer.question_type !== "MULTIPLE_CHOICE" &&
            answer.question_type !== "IMAGE_MULTIPLE_CHOICE" && (
              <>
                <div className="flex items-center gap-3">
                  <Typography
                    variant="body5"
                    className="font-black uppercase tracking-[0.2em] text-muted-foreground/60 whitespace-nowrap"
                  >
                    Evaluation
                  </Typography>
                  <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent opacity-50" />
                </div>

                <div className="rounded-[1.75rem] border border-border/50 bg-card/80 backdrop-blur-md p-6 shadow-sm space-y-6">
                  <div className="p-4 rounded-2xl bg-foreground/5 space-y-2">
                    <Typography
                      variant="body5"
                      className="font-black text-muted-foreground/60 uppercase tracking-widest"
                    >
                      SYSTEM SCORE
                    </Typography>
                    <div className="flex items-baseline gap-2">
                      <Typography
                        variant="h2"
                        className="font-black tracking-tighter"
                      >
                        {answer.marks_obtained}
                      </Typography>
                      <Typography
                        variant="h4"
                        className="text-muted-foreground/40 font-black"
                      >
                        / {answer.max_marks}
                      </Typography>
                    </div>
                    <div className="w-full h-1.5 bg-foreground/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${(answer.marks_obtained / (answer.max_marks || 1)) * 100}%`,
                        }}
                        className={`h-full ${answer.status === "correct" ? "bg-emerald-500" : "bg-rose-500"}`}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Typography
                        variant="body5"
                        className="font-black text-muted-foreground/60 uppercase tracking-widest"
                      >
                        MANUAL OVERRIDE
                      </Typography>
                      <PencilLine
                        size={14}
                        className="text-muted-foreground/40"
                      />
                    </div>

                    <div className="space-y-3">
                      <Input
                        type="number"
                        min={0}
                        max={answer.max_marks}
                        value={manualMarksValue}
                        onChange={(e) =>
                          onManualMarksChange(e.target.value.replace(/\D/g, ""))
                        }
                        placeholder={`Score (0-${answer.max_marks})`}
                        className="rounded-[1.25rem] border-none bg-foreground/5 h-12 font-black transition-all focus:bg-white focus:text-black shadow-inner"
                      />
                      <Button
                        variant="outline"
                        className="w-full rounded-[1.25rem] h-12 border-2 hover:bg-brand-primary hover:text-white transition-all duration-300 font-black shadow-sm"
                        onClick={onManualMarksApply}
                      >
                        Adjust Marks
                      </Button>

                      <AnimatePresence>
                        {isManualMarksApplied && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="flex items-center gap-2 p-3 text-[10px] font-black text-emerald-600 bg-emerald-500/10 rounded-xl border border-emerald-500/20"
                          >
                            <FileCheck2 size={12} />
                            MARKS APPLIED: {manualMarksValue}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <Typography
                        variant="body5"
                        className="text-center text-muted-foreground/40 italic"
                      >
                        Manual override will skip system calculations.
                      </Typography>
                    </div>
                  </div>
                </div>
              </>
            )}
        </div>
      </div>

      {/* Decorative elements */}
      {answer.status === "correct" && (
        <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-700">
          <Trophy size={200} />
        </div>
      )}
    </div>
  );
};
