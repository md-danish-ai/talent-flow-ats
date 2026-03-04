import React from "react";
import { Modal } from "@components/ui-elements/Modal";
import { Typography } from "@components/ui-elements/Typography";
import { SubjectiveQuestionForm } from "@components/features/questions/SubjectiveQuestionForm";
import { cn } from "@lib/utils";

interface AddQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AddQuestionModal: React.FC<AddQuestionModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [toast, setToast] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!toast) return;
    const timeout = setTimeout(() => setToast(null), 4000);
    return () => clearTimeout(timeout);
  }, [toast]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Add Subjective Question"
        className="max-w-4xl"
      >
        <div className="p-4">
          <SubjectiveQuestionForm
            onSuccess={(mode) => {
              setToast(
                mode === "created"
                  ? "Subjective question added successfully."
                  : "Subjective question updated successfully.",
              );
              onClose();
              onSuccess?.();
            }}
          />
        </div>
      </Modal>

      {/* SUCCESS TOAST */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50">
          <div
            className={cn(
              "rounded-xl border px-4 py-3 shadow-lg bg-card min-w-[260px] max-w-sm",
              "border-emerald-300/80 dark:border-emerald-500/60",
            )}
          >
            <Typography
              variant="body5"
              weight="bold"
              className="mb-1 uppercase tracking-widest text-[11px] text-emerald-600 dark:text-emerald-400"
            >
              Success
            </Typography>

            <Typography variant="body4" className="text-foreground">
              {toast}
            </Typography>
          </div>
        </div>
      )}
    </>
  );
};