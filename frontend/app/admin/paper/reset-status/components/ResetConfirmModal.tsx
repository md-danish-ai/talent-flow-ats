"use client";

import { Modal } from "@components/ui-elements/Modal";
import { Button } from "@components/ui-elements/Button";
import { UserListResponse } from "@types";
import { RefreshCw, AlertTriangle } from "lucide-react";
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
      title="Reset Interview Status"
      className="max-w-sm"
    >
      <div className="flex flex-col items-center text-center p-2">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
          <RefreshCw className="text-red-600 dark:text-red-400" size={32} />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
          Reset Current Interview?
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
          This action will perform the following for{" "}
          <span className="font-bold text-slate-700 dark:text-slate-200">
            {user?.username}
          </span>
          :
        </p>

        <div className="w-full text-left space-y-2 mb-5 bg-red-50 dark:bg-red-900/20 rounded-xl p-4 border border-red-200 dark:border-red-800">
          <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
            <AlertTriangle size={14} className="text-red-500 mt-0.5 shrink-0" />
            <span>
              <strong>is_interview_submitted → false:</strong> Candidate
              progress for the current paper will be deleted.
            </span>
          </div>
          <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
            <AlertTriangle size={14} className="text-red-500 mt-0.5 shrink-0" />
            <span>
              <strong>Paper Access:</strong> Candidate can re-start the assigned
              paper from the very beginning.
            </span>
          </div>
        </div>

        <div className="w-full h-px bg-muted mb-4" />

        <div className="flex flex-col gap-3 w-full">
          <Button
            variant="primary"
            color="error"
            className="w-full flex items-center justify-center gap-2 py-6 bg-red-600 hover:bg-red-700 text-white"
            onClick={handleReset}
            disabled={loading}
          >
            <RefreshCw size={16} />
            {loading ? "Processing..." : "Confirm & Reset Interview"}
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
