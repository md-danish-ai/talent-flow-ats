"use client";

import React from "react";
import { Modal } from "@components/ui-elements/Modal";
import { Button } from "@components/ui-elements/Button";
import { Typography } from "@components/ui-elements/Typography";
import { AlertCircle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  variant?: "danger" | "info";
  confirmText: string;
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  variant = "info",
  confirmText,
  isLoading = false,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} className="max-w-md">
      <div className="flex flex-col items-center text-center space-y-4 pt-4">
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${variant === "danger" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}
        >
          <AlertCircle size={28} />
        </div>
        <div className="space-y-2">
          <Typography variant="body4" className="text-muted-foreground">
            {description}
          </Typography>
        </div>
        <div className="flex w-full gap-3 pt-4">
          <Button
            variant="ghost"
            className="flex-1"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            color={variant === "danger" ? "error" : "primary"}
            className="flex-1"
            disabled={isLoading}
            onClick={onConfirm}
          >
            {isLoading ? "Processing..." : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
