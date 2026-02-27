"use client";

import React from "react";
import { Modal } from "@components/ui-elements/Modal";
import { AddImageQuestionForm } from "@components/features/questions/AddImageQuestionForm";
import { Question } from "@lib/api/questions";
import { ImageMCQFormValues } from "@lib/validations/question";

interface EditImageQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionData: Question | null;
  onSuccess: () => void;
}

export const EditImageQuestionModal: React.FC<EditImageQuestionModalProps> = ({
  isOpen,
  onClose,
  questionData,
  onSuccess,
}) => {
  if (!questionData) return null;

  // Map backend data to form values
  const initialValues: ImageMCQFormValues = {
    subject:
      typeof questionData.subject_type === "string"
        ? questionData.subject_type
        : questionData.subject_type?.code ?? "",
    examLevel:
      typeof questionData.exam_level === "string"
        ? questionData.exam_level
        : questionData.exam_level?.code ?? "",
    marks: questionData.marks || 1,
    questionImageUrl: questionData.image_url || "",
    questionText: questionData.question_text || "",
    explanation: questionData.answer?.explanation || "",
    options: (questionData.options || []).map((opt, index) => ({
      id: opt.option_label || String.fromCharCode(65 + index),
      label: opt.option_label || String.fromCharCode(65 + index),
      content: opt.option_text || "",
      isCorrect: !!opt.is_correct,
    })),
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Image Multiple Choice Question"
      className="max-w-4xl"
    >
      <AddImageQuestionForm
        questionType={
          typeof questionData.question_type === "string"
            ? questionData.question_type
            : questionData.question_type?.code ?? undefined
        }
        questionId={questionData.id}
        initialData={initialValues}
        onSuccess={() => {
          onClose();
          onSuccess();
        }}
      />
    </Modal>
  );
};
