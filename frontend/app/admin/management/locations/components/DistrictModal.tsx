"use client";

import React, { useState } from "react";
import { Modal } from "@components/ui-elements/Modal";
import { Input } from "@components/ui-elements/Input";
import { Button } from "@components/ui-elements/Button";
import { useCreateDistrict, useUpdateDistrict } from "@hooks/useLocations";
import { District } from "@lib/api/locations";

interface DistrictModalProps {
  isOpen: boolean;
  onClose: () => void;
  stateId: number;
  existingDistrict?: District | null;
}

export function DistrictModal({
  isOpen,
  onClose,
  stateId,
  existingDistrict,
}: DistrictModalProps) {
  const [name, setName] = useState("");
  const createDistrict = useCreateDistrict();
  const updateDistrict = useUpdateDistrict();

  const isEditing = !!existingDistrict;
  const isPending = createDistrict.isPending || updateDistrict.isPending;

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [prevDistrictId, setPrevDistrictId] = useState(existingDistrict?.id);

  if (isOpen !== prevIsOpen || existingDistrict?.id !== prevDistrictId) {
    setPrevIsOpen(isOpen);
    setPrevDistrictId(existingDistrict?.id);
    setName(isOpen ? (existingDistrict?.name || "") : "");
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) return;

    if (isEditing) {
      updateDistrict.mutate(
        { districtId: existingDistrict.id, data: { name: name.trim() } },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    } else {
      createDistrict.mutate(
        { stateId, data: { name: name.trim() } },
        {
          onSuccess: () => {
            onClose();
          },
        }
      );
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit District" : "Add District"}
      className="!max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            District Name <span className="text-destructive">*</span>
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter district name"
            required
            autoFocus
            disabled={isPending}
          />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            type="button"
            color="primary"
            variant="outline"
            onClick={onClose}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button color="primary" type="submit" disabled={isPending || !name.trim()}>
            {isPending ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
