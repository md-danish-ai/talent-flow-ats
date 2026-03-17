"use client";

import React from "react";
import { Modal } from "@components/ui-elements/Modal";
import { AddImageQuestionForm } from "@components/features/questions/AddImageQuestionForm";
import { Question, QuestionOption } from "@lib/api/questions";
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
    // Use the canonical subject classification (not subject_type) so updates
    // send a valid subject code that the backend can resolve.
    subject:
      typeof questionData.subject === "string"
        ? questionData.subject
        : (questionData.subject?.code ?? ""),
    examLevel:
      typeof questionData.exam_level === "string"
        ? questionData.exam_level
        : (questionData.exam_level?.code ?? ""),
    marks: questionData.marks || 1,
    questionImageUrl: questionData.image_url || "",
    questionText: questionData.question_text || "",
    explanation: questionData.answer?.explanation || "",
    options: ((questionData.options as QuestionOption[]) || []).map((opt: QuestionOption, index: number) => ({
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
      className="max-w-5xl"
    >
      <AddImageQuestionForm
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
