import React from "react";
import { Modal } from "@components/ui-elements/Modal";
import { ContactDetailsForm } from "@components/features/questions/ContactDetailsForm";

interface AddContactDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddContactDetailsModal: React.FC<AddContactDetailsModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Company Contact Details"
      className="max-w-5xl"
    >
      <ContactDetailsForm
        onSuccess={() => {
          onClose();
          onSuccess?.();
        }}
      />
    </Modal>
  );
};
