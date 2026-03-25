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
          description="You can't jump back to this section again."
        />
        <Typography variant="body2" className="text-foreground">
          Please review all questions and answers of this section before moving
          to the next section. If you are sure, click on{" "}
          <span className="font-semibold text-brand-primary">
            Change Section
          </span>
          .
        </Typography>
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-1">
          <Button
            variant="outline"
            color="primary"
            animate="scale"
            onClick={onClose}
            className="w-full sm:w-auto"
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
