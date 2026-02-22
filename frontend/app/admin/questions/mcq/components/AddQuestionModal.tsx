import React from "react";
import { Modal } from "@components/ui-elements/Modal";
import { AddQuestionForm } from "@components/features/questions/AddQuestionForm";

interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddQuestionModal: React.FC<AddQuestionModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Multiple Choice Question"
      className="max-w-4xl"
    >
      <AddQuestionForm />
    </Modal>
  );
};
