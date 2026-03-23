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
  // We use 0 as fallback IDs because the AddImageQuestionForm useEffect 
  // will handle the actual classification mapping/fetching.
  const initialValues: Partial<ImageMCQFormValues> = {
    subject_type_id: questionData.subject?.id || 0,
    exam_level_id: questionData.exam_level?.id || 0,
    marks: questionData.marks || 1,
    image_url: questionData.image_url || "",
    question_text: questionData.question_text || "",
    explanation: questionData.answer?.explanation || "",
    options: ((questionData.options as QuestionOption[]) || []).map((opt: QuestionOption) => ({
      option_label: opt.option_label,
      option_text: opt.option_text,
      is_correct: opt.is_correct,
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
        initialData={initialValues as ImageMCQFormValues}
        onSuccess={() => {
          onClose();
          onSuccess();
        }}
      />
    </Modal>
  );
};
