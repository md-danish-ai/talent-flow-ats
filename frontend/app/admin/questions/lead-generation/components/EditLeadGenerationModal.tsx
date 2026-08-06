"use client";

import React from "react";
import { Modal } from "@components/ui-elements/Modal";
import { LeadGenerationForm } from "@components/features/questions/LeadGenerationForm";
import { Question } from "@types";
import { type LeadGenerationFormValues } from "@lib/validations/question";

interface EditLeadGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  question: Question;
}

export default function EditLeadGenerationModal({
  isOpen,
  onClose,
  onSuccess,
  question,
}: EditLeadGenerationModalProps) {
  const initialValues: LeadGenerationFormValues = {
    subject: question.subject?.code || "",
    examLevel: question.exam_level?.code || "",
    marks: question.marks,
    companyName:
      question.question_text ||
      String((question.options as Record<string, unknown>)?.company_name || ""),
    website: String(
      (question.options as Record<string, unknown>)?.website || "",
    ),
    name: String(
      (question.options as Record<string, unknown>)?.contact_name || "",
    ),
    title: String(
      (question.options as Record<string, unknown>)?.designation || "",
    ),
    email: String((question.options as Record<string, unknown>)?.email || ""),
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Lead Generation"
      className="max-w-5xl"
    >
      <LeadGenerationForm
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
