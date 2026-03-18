"use client";

import React from "react";
import { Modal } from "@components/ui-elements/Modal";
import { ContactDetailsForm } from "@components/features/questions/ContactDetailsForm";
import { Question } from "@lib/api/questions";
import { type ContactDetailsFormValues } from "@lib/validations/question";

interface EditContactDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  question: Question;
}

export default function EditContactDetailsModal({
  isOpen,
  onClose,
  onSuccess,
  question,
}: EditContactDetailsModalProps) {
  const initialValues: ContactDetailsFormValues = {
    subject: question.subject?.code || "",
    examLevel: question.exam_level?.code || "",
    marks: question.marks,
    questionText: question.question_text,
    websiteUrl: String(
      (question.options as Record<string, unknown>)?.websiteUrl || "",
    ),
    companyName: String(
      (question.options as Record<string, unknown>)?.companyName || "",
    ),
    streetAddress: String(
      (question.options as Record<string, unknown>)?.streetAddress || "",
    ),
    city: String((question.options as Record<string, unknown>)?.city || ""),
    state: String((question.options as Record<string, unknown>)?.state || ""),
    zipCode: String(
      (question.options as Record<string, unknown>)?.zipCode || "",
    ),
    companyPhoneNumber: String(
      (question.options as Record<string, unknown>)?.companyPhoneNumber || "",
    ),
    generalEmail: String(
      (question.options as Record<string, unknown>)?.generalEmail || "",
    ),
    facebookPage: String(
      (question.options as Record<string, unknown>)?.facebookPage || "",
    ),
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Company Contact Details"
      className="max-w-5xl"
    >
      <ContactDetailsForm
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
