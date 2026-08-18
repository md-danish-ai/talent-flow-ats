import React from "react";
import { Modal } from "@components/ui-elements/Modal";
import { EditProjectLeadForm } from "@features/admin/EditProjectLeadForm";
import { UserListResponse } from "@types";

interface EditProjectLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: UserListResponse | null;
}

export const EditProjectLeadModal: React.FC<EditProjectLeadModalProps> = ({
  isOpen,
  onClose,
  lead,
}) => {
  if (!lead) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Project Lead"
      className="max-w-md"
    >
      <EditProjectLeadForm lead={lead} onSuccess={onClose} onCancel={onClose} />
    </Modal>
  );
};
