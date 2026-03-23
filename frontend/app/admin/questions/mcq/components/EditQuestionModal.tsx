"use client";

import React from "react";
import { Modal } from "@components/ui-elements/Modal";
import { AddQuestionForm } from "@components/features/questions/AddQuestionForm";
import { type MCQFormValues } from "@lib/validations/question";
import { Question, QuestionOption } from "@lib/api/questions";

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
  if (!questionData) return null;

  // Map backend data to form values
  const initialValues: Partial<MCQFormValues> = {
    subject_type_id: questionData.subject?.id || 0,
    exam_level_id: questionData.exam_level?.id || 0,
    marks: questionData.marks || 1,
    question_text: questionData.question_text || "",
    explanation: questionData.answer?.explanation || "",
    options: ((questionData.options as QuestionOption[]) || []).map(
      (opt: QuestionOption) => ({
        option_label: opt.option_label,
        option_text: opt.option_text,
        is_correct: opt.is_correct,
      }),
    ),
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Multiple Choice Question"
      className="max-w-5xl"
    >
      <AddQuestionForm
        questionId={questionData.id}
        initialData={initialValues as MCQFormValues}
        onSuccess={() => {
          onClose();
        }}
      />
    </Modal>
  );
};
