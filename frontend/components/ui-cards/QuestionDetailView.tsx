"use client";
import React from "react";
import { Question, QuestionOption } from "@lib/api/questions";
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
  MessageSquareQuote,
  FileImage,
  CheckCircle2,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@lib/utils";
import { QUESTION_TYPES } from "@lib/constants/questions";

interface QuestionDetailViewProps {
  question: Question;
  className?: string;
}

export const QuestionDetailView: React.FC<QuestionDetailViewProps> = ({
  question,
  className,
}) => {
  const isSubjective =
    question.question_type?.code === QUESTION_TYPES.SUBJECTIVE ||
    question.question_type?.code === QUESTION_TYPES.IMAGE_SUBJECTIVE;

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
        "rounded-xl border border-border/60 bg-white dark:bg-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden transition-all duration-300",
        className,
      )}
    >
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border/50 bg-slate-50/50 dark:bg-slate-800/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary shadow-inner">
            <ListChecks size={18} />
          </div>
          <div>
            <Typography
              variant="body3"
              weight="bold"
              className="tracking-tight"
            >
              {isSubjective
                ? "Subjective Question Details"
                : "Question Details & Options"}
            </Typography>
            <Typography variant="body5" className="text-muted-foreground/80">
              {isSubjective
                ? "Overview of the selected subjective question."
                : "Overview of the selected question and its options."}
            </Typography>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Question Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-1.5 rounded-full bg-brand-primary shadow-[0_0_8px_rgba(249,99,49,0.4)]" />
            <Typography
              variant="body5"
              weight="bold"
              className="text-muted-foreground uppercase tracking-[0.15em]"
            >
              Primary Question
            </Typography>
          </div>
          {question.image_url && (
            <div className="mb-4">
              <div className="relative w-full h-[300px] border border-border/40 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-900/50">
                <Image
                  src={getCanonicalImageUrl(question.image_url) as string}
                  alt="Question material"
                  fill
                  className="object-contain p-2"
                  sizes="(max-width: 768px) 100vw, 800px"
                  unoptimized
                />
              </div>
              <div className="mt-2 flex items-center gap-2">
                <div className="px-2 py-1 rounded-md bg-muted text-[10px] font-mono text-muted-foreground flex items-center gap-1.5 border border-border/30">
                  <FileImage size={10} className="text-brand-primary/60" />
                  <span className="truncate max-w-[200px]">
                    {question.image_url
                      .split("/")
                      .pop()
                      ?.replace(/^[0-9a-f]{32}_/, "")}
                  </span>
                </div>
              </div>
            </div>
          )}
          <Typography
            variant="body3"
            weight="semibold"
            className="leading-relaxed pl-3 border-l-2 border-brand-primary/20"
          >
            {question.question_text}
          </Typography>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-slate-50/50 dark:bg-slate-800/30 p-3.5 rounded-xl border border-border/40">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <BookOpen size={14} />
            </div>
            <div className="flex flex-col">
              <Typography
                variant="body5"
                weight="bold"
                className="text-muted-foreground/60 uppercase tracking-widest"
              >
                Subject
              </Typography>
              <Typography variant="body3" weight="bold">
                {typeof question.subject === "string"
                  ? question.subject
                  : question.subject?.name || "N/A"}
              </Typography>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Layers size={14} />
            </div>
            <div className="flex flex-col">
              <Typography
                variant="body5"
                weight="bold"
                className="text-muted-foreground/60 uppercase tracking-widest"
              >
                Exam Level
              </Typography>
              <Typography variant="body3" weight="bold">
                {typeof question.exam_level === "string"
                  ? question.exam_level
                  : question.exam_level?.name || "N/A"}
              </Typography>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-brand-primary/10 text-brand-primary">
              <Trophy size={14} />
            </div>
            <div className="flex flex-col">
              <Typography
                variant="body5"
                weight="bold"
                className="text-muted-foreground/60 uppercase tracking-widest"
              >
                Marks Weightage
              </Typography>
              <div className="flex items-center gap-1">
                <Typography
                  variant="body3"
                  weight="black"
                  className="text-brand-primary"
                >
                  {question.marks}
                </Typography>
                <Typography
                  variant="body5"
                  weight="bold"
                  className="text-muted-foreground/40 uppercase"
                >
                  Points
                </Typography>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Content Based on Type */}
        {!isSubjective ? (
          /* Options Table for MCQs */
          <div className="rounded-xl border border-border/40 overflow-hidden bg-white dark:bg-slate-900/50 shadow-sm">
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
                {(question.options || []).map(
                  (opt: QuestionOption, index: number) => (
                    <TableRow
                      key={opt.option_label ?? index}
                      className="border-b border-border/30 last:border-0 transition-colors hover:bg-slate-50/30 dark:hover:bg-slate-800/20 shadow-none"
                    >
                      <TableCell className="py-2.5 font-bold text-slate-400 dark:text-slate-500 text-center">
                        <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-slate-100/50 dark:bg-slate-800/50 mx-auto border border-border/20">
                          <Typography variant="body4" weight="bold">
                            {opt.option_label ||
                              String.fromCharCode(65 + index)}
                          </Typography>
                        </div>
                      </TableCell>
                      <TableCell
                        className={cn(
                          "py-2.5 text-muted-foreground",
                          opt.is_correct &&
                            "text-emerald-600 dark:text-emerald-400 font-bold",
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
                          className="px-2.5 py-0"
                        >
                          {opt.is_correct ? "Correct" : "Incorrect"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          </div>
        ) : (
          /* Model Answer for Subjective Questions */
          <div className="p-4 rounded-xl bg-emerald-500/[0.03] border border-emerald-500/10 space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <CheckCircle2 size={16} />
              </div>
              <Typography
                variant="body4"
                weight="bold"
                className="text-emerald-700 dark:text-emerald-400 uppercase tracking-wider"
              >
                Answer
              </Typography>
            </div>
            <Typography
              variant="body4"
              className="text-muted-foreground leading-relaxed pl-1"
            >
              {question.answer?.answer_text || "No model answer provided."}
            </Typography>
          </div>
        )}

        {/* Explanation Section */}
        <div className="relative p-4 rounded-xl bg-brand-primary/[0.03] border border-brand-primary/10 overflow-hidden group mt-2">
          {/* Trophy background icon - right side */}
          <div className="absolute right-[30px] top-1/2 -translate-y-1/2 opacity-[0.04] group-hover:scale-110 transition-transform duration-700 pointer-events-none">
            <Trophy size={90} />
          </div>

          <div className="flex gap-3 relative z-10">
            <div className="p-2 rounded-lg bg-white dark:bg-slate-800 text-brand-primary h-fit shadow-sm border border-brand-primary/10">
              <MessageSquareQuote size={18} />
            </div>
            <div className="flex flex-col space-y-0.5">
              <Typography
                variant="body4"
                weight="bold"
                className="text-brand-primary uppercase tracking-wider"
              >
                Explanation
              </Typography>
              <Typography
                variant="body4"
                className="text-muted-foreground leading-relaxed"
              >
                {question.answer?.explanation
                  ? question.answer.explanation
                  : "No explanation has been provided for this question yet."}
              </Typography>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
