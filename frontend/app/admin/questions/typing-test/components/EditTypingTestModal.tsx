"use client";

import React from "react";
import { Modal } from "@components/ui-elements/Modal";
import { TypingTestForm } from "@components/features/questions/TypingTestForm";
import { Question } from "@types";
import { type TypingTestFormValues } from "@lib/validations/question";

interface EditTypingTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  question: Question;
}

export default function EditTypingTestModal({
  isOpen,
  onClose,
  onSuccess,
  question,
}: EditTypingTestModalProps) {
  const initialValues: TypingTestFormValues = {
    subject: question.subject?.code || "",
    examLevel: question.exam_level?.code || "",
    marks: question.marks,
    questionText: question.question_text,
    passage: question.passage || "",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Typing Test"
      className="max-w-5xl"
    >
      <TypingTestForm
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
