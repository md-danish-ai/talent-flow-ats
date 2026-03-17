import React from "react";
import { Modal } from "@components/ui-elements/Modal";
import { TypingTestForm } from "@components/features/questions/TypingTestForm";

interface AddTypingTestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddTypingTestModal: React.FC<AddTypingTestModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Typing Test"
      className="max-w-5xl"
    >
      <TypingTestForm
        onSuccess={() => {
          onClose();
          onSuccess?.();
        }}
      />
    </Modal>
  );
};
