"use client";

import React from "react";
import { Modal } from "@components/ui-elements/Modal";
import { AddQuestionForm } from "@features/questions/AddQuestionForm";
import { type MCQFormValues } from "@lib/validations/question";
import { Question, QuestionOption } from "@lib/api/questions";
import { Typography } from "@components/ui-elements/Typography";
import { cn } from "@lib/utils";

interface EditQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionData: Question | null;
}

export const EditQuestionModal: React.FC<EditQuestionModalProps> = ({
  isOpen,
  onClose,
  questionData,
}) => {
  const [toast, setToast] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timeout);
  }, [toast]);

  if (!questionData) return null;

  // Map backend data to form values
  const initialValues: MCQFormValues = {
    subject: typeof questionData.subject === "string"
      ? questionData.subject
      : questionData.subject?.code ?? "",
    examLevel: typeof questionData.exam_level === "string"
      ? questionData.exam_level
      : questionData.exam_level?.code ?? "",
    marks: questionData.marks || 1,
    questionText: questionData.question_text || "",
    explanation: questionData.answer?.explanation || "",
    options: (questionData.options || []).map((opt: QuestionOption, index: number) => ({
      id: opt.option_label || String.fromCharCode(65 + index),
      label: opt.option_label || String.fromCharCode(65 + index),
      content: opt.option_text || "",
      isCorrect: !!opt.is_correct,
    })),
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Edit Multiple Choice Question"
        className="max-w-4xl"
      >
        <AddQuestionForm
          questionType="MULTIPLE_CHOICE"
          questionId={questionData.id}
          initialData={initialValues}
          onSuccess={() => {
            setToast("Question updated successfully.");
            onClose();
          }}
        />
      </Modal>
      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className={cn(
              "rounded-xl border px-4 py-3 shadow-lg bg-card min-w-[260px] max-w-sm",
              "border-emerald-300/80 dark:border-emerald-500/60",
            )}
          >
            <Typography
              variant="body5"
              weight="bold"
              className="mb-1 uppercase tracking-widest text-[11px] text-emerald-600 dark:text-emerald-400"
            >
              Success
            </Typography>
            <Typography variant="body4" className="text-foreground">
              {toast}
            </Typography>
          </div>
        </div>
      )}
    </>
  );
};
