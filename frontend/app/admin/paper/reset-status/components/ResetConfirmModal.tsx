"use client";

import { Modal } from "@components/ui-elements/Modal";
import { Button } from "@components/ui-elements/Button";
import { UserListResponse } from "@lib/api/auth";
import { Trash2, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { resultsApi } from "@lib/api/results";
import { toast } from "@lib/toast";

interface ResetConfirmModalProps {
  isOpen: boolean;
  user: UserListResponse | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ResetConfirmModal({
  isOpen,
  user,
  onClose,
  onSuccess,
}: ResetConfirmModalProps) {
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!user) return;
    try {
      setLoading(true);
      await resultsApi.resetUserStatus(user.id);
      toast.success(`Reset status for ${user.username} successfully.`);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Reset failed:", error);
      toast.error("Failed to reset user status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Reset"
      className="max-w-sm"
    >
      <div className="flex flex-col items-center text-center p-2">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <Trash2 className="text-red-600" size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
          Are you sure?
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          This will delete <strong>today&apos;s interview attempt</strong> and
          responses for{" "}
          <span className="font-bold text-slate-700 dark:text-slate-200">
            {user?.username}
          </span>
          . Older records will not be affected. The user will be able to
          re-start the test.
        </p>

        <div className="w-full h-px bg-muted mb-6" />

        <div className="flex flex-col gap-3 w-full">
          <Button
            variant="primary"
            color="secondary"
            className="w-full flex items-center justify-center gap-2 py-6 bg-red-600 hover:bg-red-700 text-white"
            onClick={handleReset}
            disabled={loading}
          >
            {loading ? "Resetting..." : "Confirm & Reset"}
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
