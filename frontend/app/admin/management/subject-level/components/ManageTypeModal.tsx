"use client";

import React from "react";
import { Modal } from "@components/ui-elements/Modal";
import { Button } from "@components/ui-elements/Button";
import { Typography } from "@components/ui-elements/Typography";
import { Input } from "@components/ui-elements/Input";

interface BaseType {
    id: number;
    name: string;
    description: string;
}

interface ManageTypeModalProps {
    isOpen: boolean;
    onClose: () => void;
    type: "subject" | "level";
    editingType: BaseType | null;
    formData: { name: string; description: string };
    setFormData: (data: { name: string; description: string }) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export const ManageTypeModal: React.FC<ManageTypeModalProps> = ({
    isOpen,
    onClose,
    type,
    editingType,
    formData,
    setFormData,
    onSubmit,
}) => {
    const typeLabel = type === "subject" ? "Subject" : "Level";
    const nameLabel = type === "subject" ? "Name" : "Level Name";
    const placeholder = type === "subject" ? "e.g. Technical" : "e.g. Senior Developer";

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={editingType ? `Edit ${typeLabel}` : `Add ${typeLabel}`}
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
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <Typography variant="body4" weight="semibold">
                        Description
                    </Typography>
                    <Input
                        placeholder="Brief description..."
                        value={formData.description}
                        onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                        }
                    />
                </div>
                <div className="flex justify-end gap-3 pt-4">
                    <Button variant="ghost" type="button" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" type="submit" color="primary" shadow animate="scale">
                        {editingType ? "Update" : "Save"}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};
