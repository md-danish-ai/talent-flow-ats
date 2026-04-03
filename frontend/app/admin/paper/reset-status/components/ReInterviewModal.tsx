"use client";

import { Modal } from "@components/ui-elements/Modal";
import { Button } from "@components/ui-elements/Button";
import { UserListResponse } from "@lib/api/auth";
import { RotateCcw, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { resultsApi } from "@lib/api/results";
import { toast } from "@lib/toast";

interface ReInterviewModalProps {
  isOpen: boolean;
  user: UserListResponse | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ReInterviewModal({
  isOpen,
  user,
  onClose,
  onSuccess,
}: ReInterviewModalProps) {
  const [loading, setLoading] = useState(false);

  const handleEnable = async () => {
    if (!user) return;
    try {
      setLoading(true);
      setLoading(true);
      await resultsApi.enableReInterview(user.id);
      toast.success(
        `Re-interview enabled for ${user.username}. They will now appear in Today's Paper list.`,
      );
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Enable re-interview failed:", error);
      toast.error("Failed to enable re-interview.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Enable Re-Interview"
      className="max-w-sm"
    >
      <div className="flex flex-col items-center text-center p-2">
        <div className="w-16 h-16 bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mb-4">
          <RotateCcw
            className="text-violet-600 dark:text-violet-400"
            size={32}
          />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-1">
          Enable Re-Interview?
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
          This action will perform the following for{" "}
          <span className="font-bold text-slate-700 dark:text-slate-200">
            {user?.username}
          </span>
          :
        </p>

        <div className="w-full text-left space-y-2 mb-5 bg-violet-50 dark:bg-violet-900/20 rounded-xl p-4 border border-violet-200 dark:border-violet-800">
          <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
            <AlertTriangle
              size={14}
              className="text-violet-500 mt-0.5 shrink-0"
            />
            <span>
              <strong>is_submitted → false:</strong> Candidate can update their
              personal details again.
            </span>
          </div>
          <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
            <AlertTriangle
              size={14}
              className="text-violet-500 mt-0.5 shrink-0"
            />
            <span>
              <strong>is_interview_submitted → false:</strong> Candidate can
              retake the interview session.
            </span>
          </div>
          <div className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-400">
            <AlertTriangle
              size={14}
              className="text-violet-500 mt-0.5 shrink-0"
            />
            <span>
              <strong>Today&apos;s Papers:</strong> User will appear with a{" "}
              <span className="font-bold text-violet-600">RETURNING</span> badge
              today.
            </span>
          </div>
        </div>

        <div className="w-full h-px bg-muted mb-4" />

        <div className="flex flex-col gap-3 w-full">
          <Button
            variant="primary"
            color="secondary"
            className="w-full flex items-center justify-center gap-2 py-6 bg-violet-600 hover:bg-violet-700 text-white"
            onClick={handleEnable}
            disabled={loading}
          >
            <RotateCcw size={16} />
            {loading ? "Processing..." : "Confirm & Enable Re-Interview"}
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
