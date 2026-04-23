import React from "react";
import { Modal } from "@components/ui-elements/Modal";
import { AddProjectLeadForm } from "@features/admin/AddProjectLeadForm";

interface AddProjectLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddProjectLeadModal: React.FC<AddProjectLeadModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Project Lead"
      className="max-w-md"
    >
      <AddProjectLeadForm onSuccess={onClose} onCancel={onClose} />
    </Modal>
  );
};
