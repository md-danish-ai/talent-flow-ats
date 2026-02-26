"use client";

import React from "react";
import { Modal } from "@components/ui-elements/Modal";
import { AddQuestionForm } from "@features/questions/AddQuestionForm";
import { type MCQFormValues } from "@lib/validations/question";

interface EditQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionData: any;
}

export const EditQuestionModal: React.FC<EditQuestionModalProps> = ({
  isOpen,
  onClose,
  questionData,
}) => {
  if (!questionData) return null;

  // Map backend data to form values
  const initialValues: MCQFormValues = {
    subject: questionData.subject_type?.code || questionData.subject_type || "",
    examLevel: questionData.exam_level?.code || questionData.exam_level || "",
    marks: questionData.marks || 1,
    questionText: questionData.question_text || "",
    explanation: questionData.answer?.explanation || "",
    options: (questionData.options || []).map((opt: any, index: number) => ({
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
