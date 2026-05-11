"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { type Question, type QuestionOption } from "@types";
import { Typography } from "@components/ui-elements/Typography";
import { Badge } from "@components/ui-elements/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui-elements/Table";
import {
  ListChecks,
  BookOpen,
  Layers,
  Trophy,
  FileImage,
  CheckCircle2,
  FileText,
  MessageSquareText,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@lib/utils";
import { QUESTION_TYPES } from "@lib/constants/questions";

import { ImageLightbox } from "@components/ui-elements/ImageLightbox";
import { getCanonicalImageUrl } from "@lib/utils/image";
import { STYLE_CONFIG } from "@lib/config/style";

/**
 * Clean Border Animation Component
 */
function AnimatedBorder({ color, active }: { color: string; active: boolean }) {
  const getRadius = () => {
    switch (STYLE_CONFIG.cardRadius) {
      case "rounded-none":
        return "0px";
      case "rounded-sm":
        return "4px";
      case "rounded-md":
        return "6px";
      case "rounded-lg":
        return "8px";
      case "rounded-xl":
        return "12px";
      case "rounded-2xl":
        return "16px";
      case "rounded-3xl":
        return "24px";
      default:
        return "16px";
    }
  };
  const r = getRadius();

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible">
      <motion.rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        rx={r}
        ry={r}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{
          pathLength: active ? 1 : 0,
          opacity: active ? 1 : 0,
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      />
    </svg>
  );
}

interface QuestionDetailViewProps {
  question: Question;
  className?: string;
  title?: string;
  subtitle?: string;
}

export const QuestionDetailView: React.FC<QuestionDetailViewProps> = ({
  question,
  className,
  title,
  subtitle,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [previewImage, setPreviewImage] = useState<{
    url: string;
    title: string;
  } | null>(null);

  const typeCode =
    typeof question.question_type === "string"
      ? question.question_type
      : question.question_type?.code;

  const isPassage = typeCode === QUESTION_TYPES.PASSAGE_CONTENT;
  const isSubjective =
    typeCode === QUESTION_TYPES.SUBJECTIVE ||
    typeCode === QUESTION_TYPES.IMAGE_SUBJECTIVE;

  return (
    <div
      className={cn(
        "relative border border-border/60 bg-white dark:bg-slate-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden transition-all duration-300",
        STYLE_CONFIG.cardRadius,
        isHovered && "scale-[1.01] border-brand-primary/30 shadow-2xl",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatedBorder color="var(--color-brand-primary)" active={isHovered} />
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-slate-50/50 dark:bg-slate-800/30">
        <div className="flex items-center gap-4">
          <div
            className={cn(
              "p-2.5 bg-brand-primary/10 text-brand-primary shadow-sm",
              STYLE_CONFIG.iconRadius,
            )}
          >
            <ListChecks size={20} />
          </div>
          <div>
            <Typography
              variant="body2"
              weight="bold"
              className="tracking-tight text-foreground/90"
            >
              {title ||
                (isPassage
                  ? "Passage Details"
                  : isSubjective
                    ? "Question Breakdown"
                    : "MCQ Analysis")}
            </Typography>
            <Typography
              variant="body5"
              className="text-muted-foreground/70 uppercase tracking-widest font-bold text-[9px]"
            >
              {subtitle || "Technical Overview & Insight"}
            </Typography>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className={`flex items-center gap-3 bg-emerald-50/30 dark:bg-emerald-500/5 p-3 ${STYLE_CONFIG.innerCardRadius} border border-emerald-500/10 shadow-sm`}
          >
            <div
              className={`p-2 ${STYLE_CONFIG.iconRadius} bg-emerald-500/10 text-emerald-600 dark:text-emerald-400`}
            >
              <BookOpen size={14} />
            </div>
            <div className="flex flex-col">
              <Typography
                variant="body5"
                weight="bold"
                className="text-emerald-600/60 uppercase tracking-widest text-[9px]"
              >
                Subject
              </Typography>
              <Typography variant="body4" weight="bold">
                {typeof question.subject === "string"
                  ? question.subject
                  : question.subject?.name || "N/A"}
              </Typography>
            </div>
          </div>
          <div
            className={`flex items-center gap-3 bg-amber-50/30 dark:bg-amber-500/5 p-3 ${STYLE_CONFIG.innerCardRadius} border border-amber-500/10 shadow-sm`}
          >
            <div
              className={`p-2 ${STYLE_CONFIG.iconRadius} bg-amber-500/10 text-amber-600 dark:text-amber-400`}
            >
              <Layers size={14} />
            </div>
            <div className="flex flex-col">
              <Typography
                variant="body5"
                weight="bold"
                className="text-amber-600/60 uppercase tracking-widest text-[9px]"
              >
                Exam Level
              </Typography>
              <Typography variant="body4" weight="bold">
                {typeof question.exam_level === "string"
                  ? question.exam_level
                  : question.exam_level?.name || "N/A"}
              </Typography>
            </div>
          </div>
          <div
            className={`flex items-center gap-3 bg-brand-primary/5 p-3 ${STYLE_CONFIG.innerCardRadius} border border-brand-primary/10 shadow-sm`}
          >
            <div
              className={`p-2 ${STYLE_CONFIG.iconRadius} bg-brand-primary/10 text-brand-primary`}
            >
              <Trophy size={14} />
            </div>
            <div className="flex flex-col">
              <Typography
                variant="body5"
                weight="bold"
                className="text-brand-primary/60 uppercase tracking-widest text-[9px]"
              >
                Marks
              </Typography>
              <Typography
                variant="body4"
                weight="black"
                className="text-brand-primary"
              >
                {question.marks} Points
              </Typography>
            </div>
          </div>
        </div>

        {/* Passage Content Section */}
        {isPassage && question.passage && (
          <div
            className={`p-5 pt-7 ${STYLE_CONFIG.innerCardRadius} bg-slate-50 dark:bg-slate-800/10 border border-slate-100 dark:border-slate-800 relative group/passage`}
          >
            <div
              className={`absolute -top-3.5 left-5 px-3 py-1.5 ${STYLE_CONFIG.badgeRadius} bg-white dark:bg-slate-900 border border-border flex items-center gap-2 shadow-sm group-hover/passage:border-brand-primary/30 transition-colors z-20`}
            >
              <FileText size={12} className="text-brand-primary" />
              <Typography
                variant="body5"
                weight="black"
                className="text-muted-foreground uppercase tracking-widest text-[10px]"
              >
                Passage Paragraph
              </Typography>
            </div>
            <Typography
              variant="body4"
              className="leading-relaxed text-foreground/70 font-medium italic relative z-10"
            >
              &quot;{question.passage}&quot;
            </Typography>
          </div>
        )}

        {/* Question Header Section */}
        <div
          className={`p-5 pt-8 ${STYLE_CONFIG.innerCardRadius} bg-brand-primary/[0.02] border border-brand-primary/10 relative group/ques`}
        >
          <div
            className={`absolute -top-3.5 left-5 px-3 py-1.5 ${STYLE_CONFIG.badgeRadius} bg-white dark:bg-slate-900 border border-border flex items-center gap-2 shadow-sm group-hover/ques:border-brand-primary/30 transition-colors z-20`}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
            <Typography
              variant="body5"
              weight="black"
              className="text-muted-foreground uppercase tracking-widest text-[10px]"
            >
              Question Text
            </Typography>
          </div>
          {question.image_url && (
            <div className="mb-5 relative z-10">
              <div
                className={`relative w-full h-[280px] border border-border/40 ${STYLE_CONFIG.innerCardRadius} overflow-hidden bg-white dark:bg-slate-900 shadow-inner group/img cursor-zoom-in`}
                onClick={() =>
                  setPreviewImage({
                    url: question.image_url!,
                    title: "Question Image",
                  })
                }
              >
                <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/5 transition-colors flex items-center justify-center opacity-0 group-hover/img:opacity-100 z-10">
                  <div className="bg-white p-2 rounded-full shadow-lg">
                    <FileImage className="text-brand-primary" />
                  </div>
                </div>
                <Image
                  src={getCanonicalImageUrl(question.image_url) as string}
                  alt="Question material"
                  fill
                  className="object-contain p-4"
                  unoptimized
                />
              </div>
              <div className="mt-2 flex items-center gap-2 pl-1">
                <FileImage size={12} className="text-brand-primary/60" />
                <Typography
                  variant="body5"
                  className="text-muted-foreground/60 font-mono text-[9px]"
                >
                  Attachment Preview (Click to Enlarge)
                </Typography>
              </div>
            </div>
          )}
          <Typography
            variant="body3"
            weight="bold"
            className="leading-relaxed text-foreground/90 pl-1 relative z-10"
          >
            {question.question_text}
          </Typography>
        </div>

        {/* Options Table for MCQs */}
        {!isSubjective && (
          <div
            className={`border border-border/40 overflow-hidden bg-white dark:bg-slate-900/50 shadow-sm relative z-10 ${STYLE_CONFIG.innerCardRadius}`}
          >
            {(() => {
              const options = (question.options as QuestionOption[]) || [];
              const hasText = options.some(
                (o) => o.option_text && o.option_text.trim() !== "",
              );
              const hasMedia = options.some(
                (o) => o.image_url && o.image_url.trim() !== "",
              );

              if (options.length === 0) {
                return (
                  <div className="p-6 flex flex-col items-center justify-center bg-slate-50/50 dark:bg-slate-800/30">
                    <ListChecks
                      size={24}
                      className="text-muted-foreground/30 mb-2"
                    />
                    <Typography
                      variant="body4"
                      weight="medium"
                      className="text-muted-foreground/70"
                    >
                      No options configured for this question.
                    </Typography>
                  </div>
                );
              }

              return (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-border/40 hover:bg-transparent shadow-none">
                      <TableHead className="w-[80px] h-10">
                        <Typography
                          variant="body5"
                          weight="bold"
                          className="uppercase tracking-widest text-muted-foreground/60 text-center w-full block"
                        >
                          Label
                        </Typography>
                      </TableHead>
                      {hasText && (
                        <TableHead className="h-10">
                          <Typography
                            variant="body5"
                            weight="bold"
                            className="uppercase tracking-widest text-muted-foreground/60"
                          >
                            Option Content
                          </Typography>
                        </TableHead>
                      )}
                      {hasMedia && (
                        <TableHead className="w-[120px] h-10">
                          <Typography
                            variant="body5"
                            weight="bold"
                            className="uppercase tracking-widest text-muted-foreground/60"
                          >
                            Media
                          </Typography>
                        </TableHead>
                      )}
                      <TableHead className="w-[130px] text-right h-10 pr-5">
                        <Typography
                          variant="body5"
                          weight="bold"
                          className="uppercase tracking-widest text-muted-foreground/60 text-right w-full block"
                        >
                          Status
                        </Typography>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {options.map((opt: QuestionOption, index: number) => (
                      <TableRow
                        key={opt.option_label ?? index}
                        className={cn(
                          "border-b border-border/30 last:border-0 transition-colors shadow-none",
                          opt.is_correct
                            ? "bg-emerald-500/[0.02] hover:bg-emerald-500/[0.04]"
                            : "bg-red-500/[0.01] hover:bg-red-500/[0.03]",
                        )}
                      >
                        <TableCell className="py-2.5 font-bold text-center">
                          <div
                            className={cn(
                              "flex items-center justify-center w-7 h-7 mx-auto border",
                              STYLE_CONFIG.iconRadius,
                              opt.is_correct
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600"
                                : "bg-red-500/10 border-red-500/20 text-red-600",
                            )}
                          >
                            <Typography variant="body4" weight="bold">
                              {opt.option_label ||
                                String.fromCharCode(65 + index)}
                            </Typography>
                          </div>
                        </TableCell>
                        {hasText && (
                          <TableCell
                            className={cn(
                              "py-2.5",
                              opt.is_correct
                                ? "text-emerald-600 dark:text-emerald-400 font-bold"
                                : "text-red-600/80 dark:text-red-400 font-medium",
                            )}
                          >
                            {opt.option_text && (
                              <Typography
                                variant="body4"
                                weight={opt.is_correct ? "bold" : "medium"}
                              >
                                {opt.option_text}
                              </Typography>
                            )}
                          </TableCell>
                        )}
                        {hasMedia && (
                          <TableCell className="py-2.5">
                            {opt.image_url && (
                              <div
                                className={cn(
                                  "relative w-20 h-12 border border-border overflow-hidden bg-white cursor-zoom-in group/opt-img",
                                  STYLE_CONFIG.innerCardRadius,
                                )}
                                onClick={() =>
                                  setPreviewImage({
                                    url: opt.image_url!,
                                    title: `Option ${opt.option_label || String.fromCharCode(65 + index)}`,
                                  })
                                }
                              >
                                <div className="absolute inset-0 bg-black/0 group-hover/opt-img:bg-black/5 transition-colors" />
                                <Image
                                  src={
                                    getCanonicalImageUrl(
                                      opt.image_url,
                                    ) as string
                                  }
                                  alt={`Option ${opt.option_label}`}
                                  fill
                                  className="object-contain"
                                  unoptimized
                                />
                              </div>
                            )}
                          </TableCell>
                        )}
                        <TableCell className="py-2.5 text-right pr-5">
                          <Badge
                            variant="outline"
                            color={opt.is_correct ? "success" : "error"}
                            shape="square"
                            className="font-black"
                          >
                            {opt.is_correct ? "CORRECT" : "INCORRECT"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              );
            })()}
          </div>
        )}

        {/* Model Answer for Subjective/Passage */}
        {isSubjective && (
          <div
            className={`p-5 pt-8 ${STYLE_CONFIG.innerCardRadius} bg-emerald-500/[0.02] border border-emerald-500/10 relative group/ans`}
          >
            <div
              className={`absolute -top-3.5 left-5 px-3 py-1.5 ${STYLE_CONFIG.badgeRadius} bg-white dark:bg-slate-900 border border-border flex items-center gap-2 shadow-sm group-hover/ans:border-emerald-500/30 transition-colors z-20`}
            >
              <CheckCircle2 size={12} className="text-emerald-500" />
              <Typography
                variant="body5"
                weight="black"
                className="text-muted-foreground uppercase tracking-widest text-[10px]"
              >
                {isPassage ? "Correct Answer" : "Expected Response"}
              </Typography>
            </div>
            <Typography
              variant="body4"
              className="text-foreground/80 leading-relaxed font-medium pl-1 relative z-10"
            >
              {question.answer?.answer_text || "No model answer provided."}
            </Typography>
          </div>
        )}

        <div
          className={`p-5 pt-8 ${STYLE_CONFIG.innerCardRadius} bg-brand-primary/[0.02] dark:bg-brand-primary/5 border border-brand-primary/10 relative group/expl`}
        >
          {/* Decor Trophy Icon clipped by inner wrapper */}
          <div
            className={`absolute inset-0 ${STYLE_CONFIG.innerCardRadius} overflow-hidden pointer-events-none`}
          >
            <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 opacity-[0.03] text-brand-primary group-hover/expl:scale-110 transition-transform duration-700">
              <Trophy size={100} />
            </div>
          </div>

          <div
            className={`absolute -top-3.5 left-5 px-3 py-1.5 ${STYLE_CONFIG.badgeRadius} bg-white dark:bg-slate-900 border border-border flex items-center gap-2 shadow-sm group-hover/expl:border-brand-primary/30 transition-colors z-20`}
          >
            <MessageSquareText size={12} className="text-brand-primary" />
            <Typography
              variant="body5"
              weight="black"
              className="text-muted-foreground uppercase tracking-widest text-[10px]"
            >
              Answer Explanation
            </Typography>
          </div>

          <Typography
            variant="body4"
            className="text-muted-foreground leading-relaxed relative z-10 pl-1"
          >
            {question.answer?.explanation ||
              "No advanced justification has been provided for this record."}
          </Typography>
        </div>
      </div>

      <ImageLightbox
        isOpen={!!previewImage}
        onClose={() => setPreviewImage(null)}
        src={previewImage?.url || ""}
        title={previewImage?.title}
      />
    </div>
  );
};
