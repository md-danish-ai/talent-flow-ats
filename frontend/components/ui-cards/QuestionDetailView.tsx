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

/**
 * Clean Border Animation Component
 */
function AnimatedBorder({ color, active }: { color: string; active: boolean }) {
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible">
      <motion.rect
        x="0"
        y="0"
        width="100%"
        height="100%"
        rx="16px"
        ry="16px"
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
  const typeCode =
    typeof question.question_type === "string"
      ? question.question_type
      : question.question_type?.code;

  const isPassage = typeCode === QUESTION_TYPES.PASSAGE_CONTENT;
  const isSubjective =
    typeCode === QUESTION_TYPES.SUBJECTIVE ||
    typeCode === QUESTION_TYPES.IMAGE_SUBJECTIVE ||
    isPassage;

  const getCanonicalImageUrl = (url?: string | null) => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(
      /\/$/,
      "",
    );
    if (!base) return url;
    return url.startsWith("/") ? `${base}${url}` : `${base}/${url}`;
  };

  return (
    <div
      className={cn(
        "relative rounded-2xl border border-border/60 bg-white dark:bg-slate-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.1)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden transition-all duration-300",
        isHovered && "scale-[1.01] border-brand-primary/30 shadow-2xl",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <AnimatedBorder color="var(--color-brand-primary)" active={isHovered} />
      <div className="flex items-center justify-between px-6 py-4 border-b border-border/50 bg-slate-50/50 dark:bg-slate-800/30">
        <div className="flex items-center gap-4">
          <div className="p-2.5 rounded-xl bg-brand-primary/10 text-brand-primary shadow-sm">
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

      <div className="p-6 space-y-10">
        {/* Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center gap-3 bg-emerald-50/30 dark:bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/10 shadow-sm">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
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
          <div className="flex items-center gap-3 bg-amber-50/30 dark:bg-amber-500/5 p-3 rounded-xl border border-amber-500/10 shadow-sm">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
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
          <div className="flex items-center gap-3 bg-brand-primary/5 p-3 rounded-xl border border-brand-primary/10 shadow-sm">
            <div className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary">
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
          <div className="p-5 pt-7 rounded-2xl bg-slate-50 dark:bg-slate-800/10 border border-slate-100 dark:border-slate-800 relative group/passage">
            <div className="absolute -top-3.5 left-5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-border flex items-center gap-2 shadow-sm group-hover/passage:border-brand-primary/30 transition-colors z-20">
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
        <div className="p-5 pt-8 rounded-2xl bg-brand-primary/[0.02] border border-brand-primary/10 relative group/ques">
          <div className="absolute -top-3.5 left-5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-border flex items-center gap-2 shadow-sm group-hover/ques:border-brand-primary/30 transition-colors z-20">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
            <Typography
              variant="body5"
              weight="black"
              className="text-muted-foreground uppercase tracking-widest text-[10px]"
            >
              {isPassage ? "Question Text" : "Primary Question"}
            </Typography>
          </div>
          {question.image_url && (
            <div className="mb-5 relative z-10">
              <div className="relative w-full h-[280px] border border-border/40 rounded-2xl overflow-hidden bg-white dark:bg-slate-900 shadow-inner">
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
                  Attachment Preview
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

        {/* Options Table for MCQs - UNTOUCHED as requested */}
        {!isSubjective && (
          <div className="rounded-xl border border-border/40 overflow-hidden bg-white dark:bg-slate-900/50 shadow-sm relative z-10">
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
                  <TableHead className="h-10">
                    <Typography
                      variant="body5"
                      weight="bold"
                      className="uppercase tracking-widest text-muted-foreground/60"
                    >
                      Option Content
                    </Typography>
                  </TableHead>
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
                {((question.options as QuestionOption[]) || []).map(
                  (opt: QuestionOption, index: number) => (
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
                            "flex items-center justify-center w-7 h-7 rounded-lg mx-auto border",
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
                      <TableCell
                        className={cn(
                          "py-2.5",
                          opt.is_correct
                            ? "text-emerald-600 dark:text-emerald-400 font-bold"
                            : "text-red-600/80 dark:text-red-400 font-medium",
                        )}
                      >
                        <Typography
                          variant="body4"
                          weight={opt.is_correct ? "bold" : "medium"}
                        >
                          {opt.option_text}
                        </Typography>
                      </TableCell>
                      <TableCell className="py-2.5 text-right pr-5">
                        <Badge
                          variant="outline"
                          color={opt.is_correct ? "success" : "error"}
                          shape="curve"
                          className="px-2.5 py-0 font-black text-[10px]"
                        >
                          {opt.is_correct ? "CORRECT" : "INCORRECT"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Model Answer for Subjective/Passage */}
        {isSubjective && (
          <div className="p-5 pt-8 rounded-2xl bg-emerald-500/[0.02] border border-emerald-500/10 relative group/ans">
            <div className="absolute -top-3.5 left-5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-border flex items-center gap-2 shadow-sm group-hover/ans:border-emerald-500/30 transition-colors z-20">
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

        <div className="p-5 pt-8 rounded-2xl bg-brand-primary/[0.02] dark:bg-brand-primary/5 border border-brand-primary/10 relative group/expl">
          {/* Decor Trophy Icon clipped by inner wrapper */}
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <div className="absolute right-[-20px] top-1/2 -translate-y-1/2 opacity-[0.03] text-brand-primary group-hover/expl:scale-110 transition-transform duration-700">
              <Trophy size={100} />
            </div>
          </div>

          <div className="absolute -top-3.5 left-5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-900 border border-border flex items-center gap-2 shadow-sm group-hover/expl:border-brand-primary/30 transition-colors z-20">
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
    </div>
  );
};
