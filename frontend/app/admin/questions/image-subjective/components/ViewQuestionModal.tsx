"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@components/ui-elements/Modal";
import { questionsApi, Question } from "@lib/api/questions";
import { Typography } from "@components/ui-elements/Typography";
import { ListChecks, Loader2, FileImage, BookOpen, MessageSquareText } from "lucide-react";
import Image from "next/image";

interface ViewQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionId: number | null;
}

export const ViewQuestionModal: React.FC<ViewQuestionModalProps> = ({
  isOpen,
  onClose,
  questionId,
}) => {
  const [question, setQuestion] = useState<Question | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCanonicalImageUrl = (url?: string | null) => {
    if (!url) return null;
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
    if (!base) return url;
    return url.startsWith("/") ? `${base}${url}` : `${base}/${url}`;
  };

  useEffect(() => {
    if (isOpen && questionId) {
      const fetchQuestion = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await questionsApi.getQuestion(questionId);
          setQuestion(response);
        } catch (err) {
          console.error("Failed to fetch question:", err);
          setError("Failed to load question details.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchQuestion();
    } else if (!isOpen) {
      setQuestion(null);
    }
  }, [isOpen, questionId]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Question Details"
      className="max-w-3xl"
    >
      <div className="p-1">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="h-10 w-10 text-brand-primary animate-spin" />
            <Typography variant="body4" className="text-muted-foreground animate-pulse">
              Fetching question details...
            </Typography>
          </div>
        ) : error ? (
          <div className="py-12 text-center text-red-500">
            <Typography variant="body3" weight="bold">
              {error}
            </Typography>
          </div>
        ) : question ? (
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/20">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary">
                  <ListChecks size={18} />
                </div>
                <div>
                  <Typography variant="body3" weight="bold">
                    Image Subjective Question
                  </Typography>
                </div>
              </div>
            </div>

            <div className="px-5 py-5 space-y-6">
              {/* Image Section */}
              {question.image_url && (
                <div className="space-y-2">
                  <Typography
                    variant="body5"
                    weight="bold"
                    className="text-muted-foreground uppercase tracking-widest"
                  >
                    Reference Image
                  </Typography>
                  <div className="relative w-full h-[300px] bg-muted/30 rounded-lg overflow-hidden border border-border/50">
                    <Image
                      src={getCanonicalImageUrl(question.image_url) as string}
                      alt="question"
                      fill
                      className="object-contain"
                      sizes="(max-width: 768px) 100vw, 600px"
                      unoptimized
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-2 py-1 rounded-md bg-muted text-[11px] font-mono text-muted-foreground flex items-center gap-1.5 border border-border/50 shadow-sm">
                      <FileImage size={10} className="text-brand-primary/60" />
                      <span>{question.image_url.split("/").pop()?.replace(/^[0-9a-f]{32}_/, "")}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Question Text */}
              <div className="space-y-2">
                <Typography
                  variant="body5"
                  weight="bold"
                  className="text-muted-foreground uppercase tracking-widest"
                >
                  Question Text
                </Typography>
                <div className="p-4 rounded-lg bg-muted/20 border border-border/40">
                  <Typography variant="body3" className="leading-relaxed whitespace-pre-wrap">
                    {question.question_text}
                  </Typography>
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-1">
                  <Typography variant="body5" weight="bold" className="text-muted-foreground uppercase tracking-widest">
                    Subject
                  </Typography>
                  <Typography variant="body3" weight="bold">
                    {typeof question.subject === "string" ? question.subject : question.subject?.name || "N/A"}
                  </Typography>
                </div>
                <div className="space-y-1">
                  <Typography variant="body5" weight="bold" className="text-muted-foreground uppercase tracking-widest">
                    Exam Level
                  </Typography>
                  <Typography variant="body3" weight="bold">
                    {typeof question.exam_level === "string" ? question.exam_level : question.exam_level?.name || "N/A"}
                  </Typography>
                </div>
                <div className="space-y-1">
                  <Typography variant="body5" weight="bold" className="text-muted-foreground uppercase tracking-widest">
                    Marks
                  </Typography>
                  <Typography variant="body3" weight="bold" className="text-brand-primary">
                    {question.marks} Points
                  </Typography>
                </div>
              </div>

              {/* Correct Answer */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                   <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-500">
                      <BookOpen size={16} />
                   </div>
                   <Typography variant="body4" weight="bold">Correct Answer</Typography>
                </div>
                <div className="p-4 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-emerald-700 dark:text-emerald-400">
                  <Typography variant="body4" className="whitespace-pre-wrap leading-relaxed">
                    {question.answer?.answer_text || "No answer text provided."}
                  </Typography>
                </div>
              </div>

              {/* Explanation */}
              {question.answer?.explanation && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-brand-primary/10 text-brand-primary">
                      <MessageSquareText size={16} />
                    </div>
                    <Typography variant="body4" weight="bold">Explanation</Typography>
                  </div>
                  <div className="p-4 rounded-lg bg-brand-primary/5 border border-brand-primary/10 italic text-muted-foreground">
                    <Typography variant="body4" className="whitespace-pre-wrap leading-relaxed">
                      {question.answer.explanation}
                    </Typography>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </Modal>
  );
};
