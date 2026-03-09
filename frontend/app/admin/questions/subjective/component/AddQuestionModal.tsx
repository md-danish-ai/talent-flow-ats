import React from "react";
import { Modal } from "@components/ui-elements/Modal";
import { SubjectiveQuestionForm } from "@components/features/questions/SubjectiveQuestionForm";

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
      title="Add Subjective Question"
      className="max-w-4xl"
    >
      <div className="p-4">
        <SubjectiveQuestionForm
          onSuccess={() => {
            onClose();
            onSuccess?.();
          }}
        />
      </div>
    </Modal>
  );
};
