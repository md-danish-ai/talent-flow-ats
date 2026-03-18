import React from "react";
import { Modal } from "@components/ui-elements/Modal";
import { AddImageSubjectiveQuestionForm } from "@components/features/questions/AddImageSubjectiveQuestionForm";

interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddQuestionModal: React.FC<AddQuestionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Image Subjective Question"
      className="max-w-5xl"
    >
      <AddImageSubjectiveQuestionForm
        onSuccess={() => {
          onClose();
          onSuccess?.();
        }}
      />
    </Modal>
  );
};
