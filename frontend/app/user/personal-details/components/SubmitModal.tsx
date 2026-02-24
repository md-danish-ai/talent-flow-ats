import React from "react";
import { Button } from "@components/ui-elements/Button";
import { Modal } from "@components/ui-elements/Modal";
import { Typography } from "@components/ui-elements/Typography";
import { CheckCircle2, X } from "lucide-react";

export interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  incompleteSteps: number[];
}

export function SubmitModal({
  isOpen,
  onClose,
  onSubmit,
  incompleteSteps,
}: SubmitModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-xl">
      <div className="flex flex-col items-center py-6 w-full">
        {incompleteSteps.length > 0 ? (
          <div className="flex flex-col items-center w-full">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 ring-8 ring-red-500/5">
              <X size={48} className="text-red-500" />
            </div>

            <div className="text-center space-y-3 mb-8">
              <Typography variant="h2" weight="bold" className="text-gray-900">
                Incomplete Details
              </Typography>
              <Typography
                variant="body1"
                className="text-muted-foreground px-4"
              >
                Please complete the following timelines before submitting:
                <br />
                <span className="font-semibold text-red-600">
                  {incompleteSteps
                    .map((step) => {
                      const stepNames: Record<number, string> = {
                        1: "Personal Details",
                        2: "Family Details",
                        3: "Source of Information",
                        4: "Education Details",
                        5: "Work Experience",
                        6: "Other Details",
                      };
                      return stepNames[step] || `Timeline ${step}`;
                    })
                    .join(", ")}
                </span>
              </Typography>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                color="primary"
                size="md"
                animate="scale"
                shadow
                onClick={onClose}
                className="px-10 text-sm font-semibold"
              >
                Go Back & Complete
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center w-full">
            <div className="w-20 h-20 bg-brand-success/10 rounded-full flex items-center justify-center mb-6 ring-8 ring-brand-success/5">
              <CheckCircle2 size={48} className="text-brand-success" />
            </div>

            <div className="text-center space-y-3 mb-8">
              <Typography variant="h2" weight="bold" className="text-gray-900">
                Confirm Submission
              </Typography>
              <Typography
                variant="body1"
                className="text-muted-foreground px-4"
              >
                Are you sure you want to submit your details?
                <br />
                Please verify all information before proceeding.
              </Typography>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                color="primary"
                size="md"
                animate="scale"
                shadow
                onClick={onClose}
                className="px-10 text-sm font-semibold"
              >
                Cancel
              </Button>
              <Button
                type="button"
                color="primary"
                size="md"
                animate="scale"
                shadow
                onClick={() => {
                  onClose();
                  onSubmit();
                }}
                className="px-10 text-sm font-semibold"
              >
                Yes, Submit
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
