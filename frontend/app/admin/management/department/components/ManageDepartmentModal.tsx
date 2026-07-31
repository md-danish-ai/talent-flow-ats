"use client";

import React, { useEffect, useState } from "react";
import { Modal } from "@components/ui-elements/Modal";
import { Button } from "@components/ui-elements/Button";
import { Input } from "@components/ui-elements/Input";
import { Typography } from "@components/ui-elements/Typography";
import { Switch } from "@components/ui-elements/Switch";
import { departmentsApi } from "@lib/api/departments";
import { type Department } from "@types";
import { departmentSchema } from "@lib/validations/management";

interface ManageDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingDepartment: Department | null;
  onSuccess: () => void;
}

export const ManageDepartmentModal: React.FC<ManageDepartmentModalProps> = ({
  isOpen,
  onClose,
  editingDepartment,
  onSuccess,
}) => {
  const [name, setName] = useState("");
  const [requiresInterview, setRequiresInterview] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (editingDepartment) {
      setName(editingDepartment.name);
      setRequiresInterview(editingDepartment.requires_interview ?? true);
    } else {
      setName("");
      setRequiresInterview(true);
    }
  }, [editingDepartment, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = departmentSchema.safeParse({ name });
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      if (editingDepartment) {
        await departmentsApi.updateDepartment(editingDepartment.id, {
          name,
          requires_interview: requiresInterview,
        });
      } else {
        await departmentsApi.createDepartment({
          name,
          requires_interview: requiresInterview,
        });
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to save department:", err);
      setError("Failed to save department. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={editingDepartment ? "Edit Department" : "Add Department"}
      className="max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Department Name */}
        <div className="space-y-2">
          <Typography variant="body4" weight="semibold">
            Department Name
          </Typography>
          <Input
            placeholder="Enter department name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={!!error}
            disabled={isLoading}
            required
          />
        </div>

        {/* Requires Interview Toggle */}
        <div className="flex items-center justify-between rounded-lg border border-border px-4 py-3 bg-muted/30">
          <div className="space-y-0.5">
            <Typography variant="body4" weight="semibold">
              Requires Interview
            </Typography>
            <Typography variant="body5" className="text-muted-foreground">
              Enable if candidates from this department go through an interview
              process
            </Typography>
          </div>
          <Switch
            checked={requiresInterview}
            onChange={() => setRequiresInterview((prev) => !prev)}
            size="sm"
            disabled={isLoading}
          />
        </div>

        {error && <p className="text-red-500 text-xs">{error}</p>}

        <div className="flex justify-end gap-3 mt-6">
          <Button
            type="button"
            variant="outline"
            color="primary"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            color="primary"
            disabled={isLoading}
          >
            {editingDepartment
              ? isLoading
                ? "Updating..."
                : "Update"
              : isLoading
                ? "Creating..."
                : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
