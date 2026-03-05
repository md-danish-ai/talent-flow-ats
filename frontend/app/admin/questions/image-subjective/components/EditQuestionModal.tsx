"use client";

import React from "react";
import { Modal } from "@components/ui-elements/Modal";
import { AddImageSubjectiveQuestionForm } from "@components/features/questions/AddImageSubjectiveQuestionForm";
import { Question } from "@lib/api/questions";
import { ImageSubjectiveFormValues } from "@lib/validations/question";

interface EditImageQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionData: Question | null;
  onSuccess: () => void;
}

export const EditQuestionModal: React.FC<EditImageQuestionModalProps> = ({
  isOpen,
  onClose,
  questionData,
  onSuccess,
}) => {
  if (!questionData) return null;

  // Map backend data to form values
  const initialValues: ImageSubjectiveFormValues = {
    subject:
      typeof questionData.subject === "string"
        ? questionData.subject
        : questionData.subject?.code ?? "",
    examLevel:
      typeof questionData.exam_level === "string"
        ? questionData.exam_level
        : questionData.exam_level?.code ?? "",
    marks: questionData.marks || 1,
    questionImageUrl: questionData.image_url || "",
    questionText: questionData.question_text || "",
    answerText: questionData.answer?.answer_text || "",
    explanation: questionData.answer?.explanation || "",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Image Subjective Question"
      className="max-w-4xl"
    >
      <AddImageSubjectiveQuestionForm
        questionType={
          typeof questionData.question_type === "string"
            ? questionData.question_type
            : questionData.question_type?.code ?? "IMAGE_SUBJECTIVE"
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
