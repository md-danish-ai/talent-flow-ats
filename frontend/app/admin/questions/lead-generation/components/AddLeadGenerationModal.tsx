import React from "react";
import { Modal } from "@components/ui-elements/Modal";
import { LeadGenerationForm } from "@components/features/questions/LeadGenerationForm";

interface AddLeadGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddLeadGenerationModal: React.FC<AddLeadGenerationModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Lead Generation"
      className="max-w-5xl"
    >
      <LeadGenerationForm
        onSuccess={() => {
          onClose();
          onSuccess?.();
        }}
      />
    </Modal>
  );
};
