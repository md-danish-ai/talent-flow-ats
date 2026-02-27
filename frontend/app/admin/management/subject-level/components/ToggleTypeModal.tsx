"use client";

import React from "react";
import { Modal } from "@components/ui-elements/Modal";
import { Button } from "@components/ui-elements/Button";
import { Typography } from "@components/ui-elements/Typography";
import { AlertCircle } from "lucide-react";

interface ToggleTypeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isActive: boolean;
    title?: string;
    description?: string;
}

export const ToggleTypeModal: React.FC<ToggleTypeModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    isActive,
    title,
    description,
}) => {
    const defaultTitle = isActive ? "Confirm Disable" : "Confirm Enable";
    const defaultDescription = isActive
        ? "This item will be hidden from users but kept in the system."
        : "This item will become visible and available for use again.";

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title || defaultTitle}
            className="max-w-md"
        >
            <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                    <AlertCircle size={28} />
                </div>
                <div className="space-y-2">
                    <Typography variant="body2" weight="bold">
                        Are you sure?
                    </Typography>
                    <Typography variant="body4" className="text-muted-foreground">
                        {description || defaultDescription}
                    </Typography>
                </div>
                <div className="flex w-full gap-3 pt-2">
                    <Button variant="ghost" className="flex-1" onClick={onClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        color={isActive ? "warning" : "primary"}
                        className="flex-1"
                        shadow
                        animate="scale"
                        onClick={onConfirm}
                    >
                        {isActive ? "Disable" : "Enable"}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};
