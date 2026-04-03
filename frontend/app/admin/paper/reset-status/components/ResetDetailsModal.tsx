"use client";

import { Modal } from "@components/ui-elements/Modal";
import { Button } from "@components/ui-elements/Button";
import { UserListResponse } from "@lib/api/auth";
import { FileEdit } from "lucide-react";
import { useState } from "react";
import { resultsApi } from "@lib/api/results";
import { toast } from "@lib/toast";

interface ResetDetailsModalProps {
  isOpen: boolean;
  user: UserListResponse | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ResetDetailsModal({
  isOpen,
  user,
  onClose,
  onSuccess,
}: ResetDetailsModalProps) {
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!user) return;
    try {
      setLoading(true);
      await resultsApi.resetUserDetails(user.id);
      toast.success(`Application details reset for ${user.username}. They can now edit their form.`);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Reset failed:", error);
      toast.error("Failed to reset application details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reset Application Details"
      className="max-w-sm"
    >
      <div className="flex flex-col items-center text-center p-2">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
          <FileEdit className="text-orange-600" size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
          Enable Form Editing?
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          This will reset the submission status for{" "}
          <span className="font-bold text-slate-700 dark:text-slate-200">
            {user?.username}
          </span>
          . The candidate will be able to edit and re-submit their personal and education details from their dashboard.
        </p>

        <div className="w-full h-px bg-muted mb-6" />

        <div className="flex flex-col gap-3 w-full">
          <Button
            variant="primary"
            color="warning"
            className="w-full flex items-center justify-center gap-2 py-6 bg-orange-600 hover:bg-orange-700 text-white"
            onClick={handleReset}
            disabled={loading}
          >
            {loading ? "Resetting..." : "Confirm & Enable Edit"}
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
