import React from "react";
import { Modal } from "@components/ui-elements/Modal";
import { AddAdminForm } from "@components/features/admin/AddAdminForm";

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddAdminModal: React.FC<AddAdminModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Admin"
      className="max-w-md"
    >
      <AddAdminForm onSuccess={onClose} onCancel={onClose} />
    </Modal>
  );
};
