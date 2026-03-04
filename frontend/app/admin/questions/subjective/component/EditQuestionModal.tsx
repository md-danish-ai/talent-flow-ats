"use client";

import React from "react";
import { Modal } from "@components/ui-elements/Modal";
import { Typography } from "@components/ui-elements/Typography";
import { SubjectiveQuestionForm } from "@components/features/questions/SubjectiveQuestionForm";
import { Question } from "@lib/api/questions";
import { cn } from "@lib/utils";
import { type SubjectiveFormValues } from "@lib/validations/question";

interface EditQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  question: Question;
}

export default function EditQuestionModal({
  isOpen,
  onClose,
  onSuccess,
  question,
}: EditQuestionModalProps) {
  const [toast, setToast] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timeout);
  }, [toast]);

  const initialValues: SubjectiveFormValues = {
    subject: question.subject?.code || "",
    examLevel: question.exam_level?.code || "",
    marks: question.marks,
    questionText: question.question_text,
    answerText: question.answer?.answer_text || "",
    explanation: question.answer?.explanation || "",
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Edit Subjective Question"
        className="max-w-4xl"
      >
        <div className="p-4">
          <SubjectiveQuestionForm
            questionId={question.id}
            initialData={initialValues}
            onSuccess={(mode) => {
              setToast(
                mode === "created"
                  ? "Subjective question added successfully."
                  : "Subjective question updated successfully.",
              );
              // We delay closure slightly to let the user see the toast if we want, 
              // but standard behavior is to close immediately and let parent handle toast if needed.
              // However, since we have the toast here, we'll follow AddQuestionModal's logic.
              onSuccess();
              onClose();
            }}
          />
        </div>
      </Modal>

      {/* SUCCESS TOAST */}
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
}