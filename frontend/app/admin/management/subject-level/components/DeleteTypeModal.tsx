"use client";

import React from "react";
import { Modal } from "@components/ui-elements/Modal";
import { Button } from "@components/ui-elements/Button";
import { Typography } from "@components/ui-elements/Typography";
import { AlertCircle } from "lucide-react";

interface DeleteTypeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title?: string;
    description?: string;
}

export const DeleteTypeModal: React.FC<DeleteTypeModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirm Deletion",
    description = "This action cannot be undone. This item will be permanently removed.",
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            className="max-w-md"
        >
            <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                    <AlertCircle size={28} />
                </div>
                <div className="space-y-2">
                    <Typography variant="body2" weight="bold">
                        Are you sure?
                    </Typography>
                    <Typography variant="body4" className="text-muted-foreground">
                        {description}
                    </Typography>
                </div>
                <div className="flex w-full gap-3 pt-2">
                    <Button variant="ghost" className="flex-1" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        color="error"
                        className="flex-1"
                        shadow
                        animate="scale"
                        onClick={onConfirm}
                    >
                        Delete
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
