"use client";

import { Modal } from "@components/ui-elements/Modal";
import { Button } from "@components/ui-elements/Button";
import { UserListResponse } from "@types";
import { FileEdit, AlertTriangle } from "lucide-react";
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
      toast.success(
        `Application details reset for ${user.username}. They can now edit their form.`,
      );
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
      title="Reset Candidate Details"
      className="max-w-sm"
    >
      <div className="flex flex-col items-center text-center p-2">
        <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
          <FileEdit
            className="text-orange-600 dark:text-orange-400"
            size={32}
          />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
          Reset details for editing?
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
          This action will perform the following for{" "}
          <span className="font-bold text-slate-700 dark:text-slate-200">
            {user?.username}
          </span>
          :
        </p>

        <div className="w-full text-left space-y-2 mb-5 bg-orange-50 dark:bg-orange-900/20 rounded-xl p-4 border border-orange-200 dark:border-orange-800">
          <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
            <AlertTriangle
              size={14}
              className="text-orange-500 mt-0.5 shrink-0"
            />
            <span>
              <strong>is_details_submitted → false:</strong> Candidate can edit
              their personal/education details.
            </span>
          </div>
          <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
            <AlertTriangle
              size={14}
              className="text-orange-500 mt-0.5 shrink-0"
            />
            <span>
              <strong>Re-submission required:</strong> Candidate must re-save
              and submit their form to proceed.
            </span>
          </div>
        </div>

        <div className="w-full h-px bg-muted mb-4" />

        <div className="flex flex-col gap-3 w-full">
          <Button
            variant="primary"
            color="warning"
            className="w-full flex items-center justify-center gap-2 py-6 bg-orange-600 hover:bg-orange-700 text-white"
            onClick={handleReset}
            disabled={loading}
          >
            <FileEdit size={16} />
            {loading ? "Processing..." : "Confirm & Enable Edit"}
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
