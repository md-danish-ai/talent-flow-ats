"use client";

import React from "react";
import { Modal } from "@components/ui-elements/Modal";
import { Question } from "@lib/api/questions";
import { Typography } from "@components/ui-elements/Typography";
import { FileText, BookOpen, MessageSquareText } from "lucide-react";

interface ViewQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  question: Question;
}

export default function ViewQuestionModal({
  isOpen,
  onClose,
  question,
}: ViewQuestionModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Question Details"
      className="max-w-4xl"
    >
      <div className="p-1">
        <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
          {/* Header Section */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary">
                <FileText size={18} />
              </div>
              <div>
                <Typography variant="body3" weight="bold">
                  Subjective Question Details
                </Typography>
                <Typography variant="body5" className="text-muted-foreground">
                  Review the question, correct answer, and explanation.
                </Typography>
              </div>
            </div>
          </div>

          <div className="px-5 pt-5 pb-6 space-y-6">
            {/* Metadata Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <Typography
                  variant="body5"
                  weight="bold"
                  className="text-muted-foreground uppercase tracking-widest text-[10px]"
                >
                  Subject
                </Typography>
                <Typography variant="body3" weight="bold">
                  {question.subject?.name || "N/A"}
                </Typography>
              </div>
              <div className="space-y-1">
                <Typography
                  variant="body5"
                  weight="bold"
                  className="text-muted-foreground uppercase tracking-widest text-[10px]"
                >
                  Exam Level
                </Typography>
                <Typography variant="body3" weight="bold">
                  {question.exam_level?.name || "N/A"}
                </Typography>
              </div>
              <div className="space-y-1">
                <Typography
                  variant="body5"
                  weight="bold"
                  className="text-muted-foreground uppercase tracking-widest text-[10px]"
                >
                  Marks
                </Typography>
                <Typography
                  variant="body3"
                  weight="bold"
                  className="text-brand-primary"
                >
                  {question.marks} Points
                </Typography>
              </div>
            </div>

            <hr className="border-border/60" />

            {/* Question Text */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Typography
                  variant="body5"
                  weight="bold"
                  className="text-muted-foreground uppercase tracking-widest text-[10px]"
                >
                  Question
                </Typography>
              </div>
              <Typography variant="body3" className="leading-relaxed bg-muted/5 p-4 rounded-lg border border-border/40">
                {question.question_text}
              </Typography>
            </div>

            {/* Correct Answer Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <BookOpen size={14} className="text-green-500" />
                <Typography
                  variant="body5"
                  weight="bold"
                  className="text-green-600 dark:text-green-500 uppercase tracking-widest text-[10px]"
                >
                  Correct Answer
                </Typography>
              </div>
              <div className="bg-green-50/50 dark:bg-green-500/5 p-4 rounded-lg border border-green-100 dark:border-green-500/20">
                <Typography variant="body3" className="leading-relaxed whitespace-pre-wrap">
                  {question.answer?.answer_text || "No answer text provided."}
                </Typography>
              </div>
            </div>

            {/* Explanation Section */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MessageSquareText size={14} className="text-brand-primary" />
                <Typography
                  variant="body5"
                  weight="bold"
                  className="text-brand-primary uppercase tracking-widest text-[10px]"
                >
                  Explanation
                </Typography>
              </div>
              <div className="bg-brand-primary/5 p-4 rounded-lg border border-brand-primary/10">
                <Typography variant="body3" className="leading-relaxed text-muted-foreground whitespace-pre-wrap italic">
                  {question.answer?.explanation || "This question does not have an explanation attached yet."}
                </Typography>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}