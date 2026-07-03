"use client";

import React from "react";
import { Modal } from "@components/ui-elements/Modal";
import { Button } from "@components/ui-elements/Button";
import { Typography } from "@components/ui-elements/Typography";
import { Input } from "@components/ui-elements/Input";
import { Textarea } from "@components/ui-elements/Textarea";
import { Switch } from "@components/ui-elements/Switch";

interface BaseType {
  id: number;
  name: string;
  description: string;
}

interface ManageTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  editingType: BaseType | null;
  formData: {
    name: string;
    code: string;
    description: string;
    is_exclusive: boolean;
  };
  setFormData: (data: {
    name: string;
    code: string;
    description: string;
    is_exclusive: boolean;
  }) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading?: boolean;
}

export const ManageTypeModal: React.FC<ManageTypeModalProps> = ({
  isOpen,
  onClose,
  type,
  editingType,
  formData,
  setFormData,
  onSubmit,
  isLoading = false,
}) => {
    const typeLabel =
    type === "subject"
      ? "Subject"
      : type === "exam_level"
        ? "Level"
        : type === "interview_result"
          ? "Interview Result"
          : type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
          
  const nameLabel = "Name";
          
  const placeholder =
    type === "subject"
      ? "e.g. Technical"
      : type === "exam_level"
        ? "e.g. Senior Developer"
        : type === "interview_result"
          ? "e.g. Must Hire"
          : "e.g. Value";

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingType ? `Edit ${typeLabel}` : `Add ${typeLabel}`}
      className="max-w-[500px] w-full"
    >
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-2">
            <Typography variant="body4" weight="semibold">
              {nameLabel}
            </Typography>
            <Input
              required
              placeholder={placeholder}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Typography variant="body4" weight="semibold">
              Code
            </Typography>
            <Input
              required
              placeholder="e.g. TECH_01"
              value={formData.code}
              onChange={(e) =>
                setFormData({ ...formData, code: e.target.value.toUpperCase() })
              }
              disabled={isLoading}
            />
          </div>
        {(type === "subject" || type === "exam_level" || type === "interview_result") && (
          <div className="space-y-2">
            <Typography variant="body4" weight="semibold">
              Description
            </Typography>
            <Textarea
              placeholder="Brief description..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              disabled={isLoading}
              rows={3}
            />
          </div>
        )}
        {type === "subject" && (
          <div className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/20">
            <div className="space-y-0.5">
              <Typography variant="body4" weight="semibold">
                Exclusive Subject
              </Typography>
              <Typography
                variant="body5"
                className="text-muted-foreground leading-tight"
              >
                Restricts this subject only to its dedicated question type
                context.
              </Typography>
            </div>
            <Switch
              checked={formData.is_exclusive}
              onChange={() =>
                setFormData({
                  ...formData,
                  is_exclusive: !formData.is_exclusive,
                })
              }
              disabled={isLoading}
            />
          </div>
        )}
        <div className="flex justify-end gap-3 pt-4">
          <Button
            variant="outline"
            color="primary"
            type="button"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            color="primary"
            shadow
            animate="scale"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : editingType ? "Update" : "Save"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
