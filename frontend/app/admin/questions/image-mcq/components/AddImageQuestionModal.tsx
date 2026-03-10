import React from "react";
import { Modal } from "@components/ui-elements/Modal";
import { AddImageQuestionForm } from "@features/questions/AddImageQuestionForm";

interface AddImageQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddImageQuestionModal: React.FC<AddImageQuestionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Image-Based MCQ"
      className="max-w-4xl"
    >
      <AddImageQuestionForm onSuccess={onSuccess ?? onClose} />
    </Modal>
  );
};
