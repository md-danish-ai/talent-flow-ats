"use client";
import React, { useState, useEffect } from "react";
import { Modal } from "@components/ui-elements/Modal";
import { questionsApi, Question, QuestionOption } from "@lib/api/questions";
import { Typography } from "@components/ui-elements/Typography";
import { Loader2, HelpCircle, CheckCircle2 } from "lucide-react";

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
            <Typography variant="body3" weight="bold">{error}</Typography>
          </div>
        ) : question ? (
          <div className="space-y-8">
            {/* Header Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-6 border-b border-border/50">
              <div className="space-y-1">
                <Typography variant="body5" weight="bold" className="text-muted-foreground uppercase tracking-widest">Subject</Typography>
                <Typography variant="body3" weight="bold">{typeof question.subject_type === "string" ? question.subject_type : question.subject_type?.name || "N/A"}</Typography>
              </div>
              <div className="space-y-1">
                <Typography variant="body5" weight="bold" className="text-muted-foreground uppercase tracking-widest">Exam Level</Typography>
                <Typography variant="body3" weight="bold">{typeof question.exam_level === "string" ? question.exam_level : question.exam_level?.name || "N/A"}</Typography>
              </div>
              <div className="space-y-1">
                <Typography variant="body5" weight="bold" className="text-muted-foreground uppercase tracking-widest">Marks</Typography>
                <Typography variant="body3" weight="bold" className="text-brand-primary">{question.marks} Points</Typography>
              </div>
            </div>

            {/* Question Text */}
            <div className="bg-muted/10 rounded-2xl p-6 border border-border/50">
              <div className="flex items-center gap-2 mb-4 text-brand-primary">
                <HelpCircle size={20} />
                <Typography variant="body3" weight="bold">Question</Typography>
              </div>
              <Typography variant="body2" className="leading-relaxed">
                {question.question_text}
              </Typography>
            </div>

            {/* Options */}
            <div className="space-y-4">
               <Typography variant="body4" weight="bold" className="text-muted-foreground uppercase tracking-wider px-1">Options</Typography>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {(question.options || []).map((opt: QuestionOption) => (
                   <div 
                    key={opt.option_label} 
                    className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                      opt.is_correct 
                        ? "bg-emerald-50/50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/30 ring-1 ring-emerald-500/20" 
                        : "bg-background border-border/50"
                    }`}
                   >
                     <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 font-bold ${
                       opt.is_correct ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"
                     }`}>
                       {opt.option_label}
                     </div>
                     <div className="flex-1 min-w-0">
                       <Typography variant="body4" className={opt.is_correct ? "text-foreground font-medium" : "text-muted-foreground"}>
                         {opt.option_text}
                       </Typography>
                     </div>
                     {opt.is_correct && <CheckCircle2 size={18} className="text-emerald-500 mt-1 shrink-0" />}
                   </div>
                 ))}
               </div>
            </div>

            {/* Explanation */}
            {question.answer?.explanation && (
              <div className="bg-brand-primary/5 rounded-2xl p-6 border border-brand-primary/10">
                <Typography variant="body5" weight="bold" className="text-brand-primary uppercase tracking-widest mb-2 block">Answer Explanation</Typography>
                <Typography variant="body4" className="text-foreground leading-relaxed">
                  {question.answer.explanation}
                </Typography>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </Modal>
  );
};
