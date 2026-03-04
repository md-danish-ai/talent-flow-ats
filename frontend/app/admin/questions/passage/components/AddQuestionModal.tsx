"use client";

import React from "react";
import { Modal } from "@components/ui-elements/Modal";
import { AddPassageQuestionForm } from "@/components/features/questions/AddPassageQuestionForm";
import { Typography } from "@components/ui-elements/Typography";

interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AddQuestionModal = ({
  isOpen,
  onClose,
  onSuccess,
}: AddQuestionModalProps) => {
  const [toast, setToast] = React.useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  React.useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timeout);
  }, [toast]);

  const handleSuccess = (mode: "created" | "updated") => {
    setToast({
      type: "success",
      message: `Passage question ${mode} successfully.`,
    });
    onSuccess();
    onClose();
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Add New Passage Question"
      >
        <div className="py-4">
          <AddPassageQuestionForm onSuccess={handleSuccess} />
        </div>
      </Modal>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-right-5 duration-300">
          <div className="rounded-2xl border border-emerald-500/20 px-5 py-4 shadow-xl bg-card backdrop-blur-md min-w-[300px] flex flex-col gap-1">
            <Typography
              variant="body5"
              weight="bold"
              className="text-emerald-500 uppercase tracking-[0.15em] text-[10px]"
            >
              Success
            </Typography>
            <Typography variant="body4" className="text-foreground/90 font-medium">
              {toast.message}
            </Typography>
          </div>
        </div>
      )}
    </>
  );
};
