"use client";

import React from "react";
import { Modal } from "@components/ui-elements/Modal";
import { SubjectiveQuestionForm } from "@components/features/questions/SubjectiveQuestionForm";
import { Question } from "@types";
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
  const initialValues: SubjectiveFormValues = {
    subject: question.subject?.code || "",
    examLevel: question.exam_level?.code || "",
    marks: question.marks,
    questionText: question.question_text,
    answerText: question.answer?.answer_text || "",
    explanation: question.answer?.explanation || "",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Subjective Question"
      className="max-w-5xl"
    >
      <SubjectiveQuestionForm
        questionId={question.id}
        initialData={initialValues}
        onSuccess={() => {
          onSuccess();
          onClose();
        }}
      />
    </Modal>
  );
}
