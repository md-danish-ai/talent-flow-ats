import { Modal } from "@components/ui-elements/Modal";
import { Alert } from "@components/ui-elements/Alert";
import { Typography } from "@components/ui-elements/Typography";
import { Button } from "@components/ui-elements/Button";

interface SectionChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function SectionChangeModal({
  isOpen,
  onClose,
  onConfirm,
}: SectionChangeModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Section Change"
      className="max-w-2xl"
    >
      <div className="space-y-4">
        <Alert
          variant="warning"
          className="border-amber-500/30 bg-amber-500/5"
          description={
            <div className="flex flex-col gap-1">
              <span className="font-semibold">Important Notice</span>
              <span>
                You cannot return to this section once you proceed. This section
                will be permanently locked.
              </span>
            </div>
          }
        />
        <Typography
          variant="body2"
          className="text-foreground/80 leading-relaxed"
        >
          Please review all your answers in the current section. For security
          and integrity, moving to the next section will
          <span className="text-amber-500 font-medium">
            {" "}
            disable access to all previous questions.
          </span>
        </Typography>
        <Typography variant="body2" className="text-foreground/80">
          If you are absolutely sure, click on{" "}
          <span className="font-semibold text-brand-primary">
            Change Section
          </span>{" "}
          to continue.
        </Typography>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-4">
          <Button
            variant="outline"
            color="primary"
            animate="scale"
            onClick={onClose}
            className="w-full sm:w-auto border-foreground/10 hover:bg-foreground/5"
          >
            Review Section
          </Button>
          <Button
            color="primary"
            animate="scale"
            variant="primary"
            onClick={onConfirm}
            className="w-full sm:w-auto"
          >
            Change Section
          </Button>
        </div>
      </div>
    </Modal>
  );
}
