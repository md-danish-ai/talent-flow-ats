"use client";
import React, { useState, useEffect } from "react";
import { Modal } from "@components/ui-elements/Modal";
import { questionsApi, Question, QuestionOption } from "@lib/api/questions";
import { Typography } from "@components/ui-elements/Typography";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui-elements/Table";
import { ListChecks } from "lucide-react";
import { Loader2 } from "lucide-react";
import { cn } from "@lib/utils";

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

  useEffect(() => {
    if (isOpen && questionId) {
      const fetchQuestion = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await questionsApi.getQuestion(questionId);
          // API client returns the typed resource directly
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
      className="max-w-4xl"
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
                    Question Details & Options
                  </Typography>
                  <Typography
                    variant="body5"
                    className="text-muted-foreground"
                  >
                    Review all options and correct answer explanation.
                  </Typography>
                </div>
              </div>
            </div>

            <div className="px-5 pt-5 pb-2 space-y-4">
              <div className="space-y-1">
                <Typography
                  variant="body5"
                  weight="bold"
                  className="text-muted-foreground uppercase tracking-widest"
                >
                  Question
                </Typography>
                <Typography variant="body3" className="leading-relaxed">
                  {question.question_text}
                </Typography>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <Typography
                    variant="body5"
                    weight="bold"
                    className="text-muted-foreground uppercase tracking-widest"
                  >
                    Subject
                  </Typography>
                  <Typography variant="body3" weight="bold">
                    {typeof question.subject === "string"
                      ? question.subject
                      : question.subject?.name || "N/A"}
                  </Typography>
                </div>
                <div className="space-y-1">
                  <Typography
                    variant="body5"
                    weight="bold"
                    className="text-muted-foreground uppercase tracking-widest"
                  >
                    Exam Level
                  </Typography>
                  <Typography variant="body3" weight="bold">
                    {typeof question.exam_level === "string"
                      ? question.exam_level
                      : question.exam_level?.name || "N/A"}
                  </Typography>
                </div>
                <div className="space-y-1">
                  <Typography
                    variant="body5"
                    weight="bold"
                    className="text-muted-foreground uppercase tracking-widest"
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
            </div>

            <div className="p-5 pt-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 border-b border-border">
                    <TableHead className="w-[80px] h-10">Option</TableHead>
                    <TableHead className="h-10">Content</TableHead>
                    <TableHead className="w-[120px] text-right h-10">
                      Status
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(question.options || []).map(
                    (opt: QuestionOption, index: number) => (
                      <TableRow
                        key={opt.option_label ?? index}
                        className="border-b border-border transition-colors"
                      >
                        <TableCell className="px-5 py-3 font-medium text-foreground">
                          {opt.option_label || String.fromCharCode(65 + index)}
                        </TableCell>
                        <TableCell
                          className={cn(
                            "px-5 py-3 text-muted-foreground",
                            opt.is_correct &&
                            "font-bold text-green-600 dark:text-green-500",
                          )}
                        >
                          {opt.option_text}
                        </TableCell>
                        <TableCell
                          className={cn(
                            "px-5 py-3 text-right font-medium",
                            opt.is_correct
                              ? "text-green-500"
                              : "text-red-500",
                          )}
                        >
                          {opt.is_correct ? "Correct" : "Incorrect"}
                        </TableCell>
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="px-5 py-3 bg-muted/20 border-t border-border">
              <Typography
                variant="body3"
                weight="semibold"
                className="inline-block mr-1"
              >
                Explanation:
              </Typography>
              <Typography
                variant="body3"
                className="text-muted-foreground inline-block"
              >
                {question.answer?.explanation
                  ? question.answer.explanation
                  : "This question does not have an explanation attached yet."}
              </Typography>
            </div>
          </div>
        ) : null}
      </div>
    </Modal>
  );
};
