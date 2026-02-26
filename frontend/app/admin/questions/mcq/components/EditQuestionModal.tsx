"use client";

import React from "react";
import { Modal } from "@components/ui-elements/Modal";
import { AddQuestionForm } from "@features/questions/AddQuestionForm";
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
  const initialValues: MCQFormValues = {
    subject: typeof questionData.subject_type === "string"
      ? questionData.subject_type
      : questionData.subject_type?.code ?? "",
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
        onSuccess={onClose} 
      />
    </Modal>
  );
};
