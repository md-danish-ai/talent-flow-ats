"use client";

import { useState, useEffect, useCallback } from "react";
import { Modal } from "@components/ui-elements/Modal";
import { Button } from "@components/ui-elements/Button";
import { Typography } from "@components/ui-elements/Typography";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { managementApi, evaluationsApi } from "@lib/api";
import { UserCheck, ShieldAlert, X } from "lucide-react";
import { toast } from "@lib/toast";
import { Badge } from "@components/ui-elements/Badge";

import { EvaluationHistoryItem, UserListResponse } from "@types";

interface AssignLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId?: number;
  attemptId?: number;
  candidateName?: string;
  selectedItems?: { user_id: number; attempt_id: number; name: string }[];
  onSuccess?: () => void;
}

export function AssignLeadModal({
  isOpen,
  onClose,
  userId,
  attemptId,
  candidateName,
  selectedItems = [],
  onSuccess,
}: AssignLeadModalProps) {
  const isBulk = selectedItems.length > 0;
  const displayUserId = isBulk ? selectedItems[0].user_id : userId;
  const displayAttemptId = isBulk ? selectedItems[0].attempt_id : attemptId;
  const displayCandidateName = isBulk
    ? `${selectedItems.length} Candidates Selected`
    : candidateName;

  const [leads, setLeads] = useState<UserListResponse[]>([]);
  const [selectedLead, setSelectedLead] = useState<string | number>("");
  const [loading, setLoading] = useState(false);
  const [assignedLeads, setAssignedLeads] = useState<EvaluationHistoryItem[]>(
    [],
  );
  const [fetchingAssigned, setFetchingAssigned] = useState(false);

  const fetchLeads = useCallback(async () => {
    try {
      const res = await managementApi.getProjectLeads({ limit: 100 });
      setLeads(res.data || []);
    } catch (err) {
      console.error("Failed to fetch leads", err);
    }
  }, []);

  const fetchAssignedLeads = useCallback(async () => {
    try {
      setFetchingAssigned(true);
      if (!displayUserId || !displayAttemptId) return;
      const res = await evaluationsApi.getEvaluationHistory(
        displayUserId,
        displayAttemptId,
      );
      setAssignedLeads(res || []);
    } catch (err) {
      console.error("Failed to fetch assigned leads", err);
    } finally {
      setFetchingAssigned(false);
    }
  }, [displayUserId, displayAttemptId]);

  useEffect(() => {
    if (isOpen) {
      void fetchLeads();
      if (!isBulk && displayUserId && displayAttemptId) {
        void fetchAssignedLeads();
      }
    }
  }, [
    isOpen,
    displayUserId,
    displayAttemptId,
    isBulk,
    fetchLeads,
    fetchAssignedLeads,
  ]);

  const handleAssign = async () => {
    if (!selectedLead) {
      toast.error("Please select a Project Lead.");
      return;
    }

    try {
      setLoading(true);
      if (isBulk) {
        await evaluationsApi.bulkAssignLead({
          user_ids: selectedItems.map((i) => i.user_id),
          attempt_ids: selectedItems.map((i) => i.attempt_id),
          project_lead_id: Number(selectedLead),
        });
      } else {
        if (!displayUserId || !displayAttemptId) return;
        await evaluationsApi.assignLead({
          user_id: displayUserId,
          attempt_id: displayAttemptId,
          project_lead_id: Number(selectedLead),
        });
      }
      setSelectedLead("");
      if (!isBulk) void fetchAssignedLeads();
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error("Assignment failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnassign = async (evaluationId: number) => {
    try {
      await evaluationsApi.unassignLead(evaluationId);
      void fetchAssignedLeads();
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      console.error("Unassignment failed", err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Assign Project Lead (Round 2)"
      className="max-w-xl"
    >
      <div className="space-y-6">
        <div className="p-4 rounded-2xl bg-brand-primary/5 border border-brand-primary/10 flex items-center gap-3">
          <UserCheck className="text-brand-primary" size={24} />
          <div>
            <Typography
              variant="body5"
              className="text-brand-primary font-bold uppercase tracking-wider"
            >
              Assigning for Candidate
            </Typography>
            <Typography
              variant="body3"
              className="font-black uppercase tracking-tight"
            >
              {displayCandidateName}
            </Typography>
          </div>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Typography
              variant="body5"
              className="font-bold text-muted-foreground uppercase"
            >
              Select Project Lead
            </Typography>
            <SelectDropdown
              options={leads.map((l) => ({ id: l.id, label: l.username }))}
              placeholder="Choose a lead..."
              value={selectedLead}
              onChange={setSelectedLead}
            />
          </div>
          <Button
            color="primary"
            animate="scale"
            onClick={handleAssign}
            disabled={loading || !selectedLead}
            fullWidth
            className="py-3"
          >
            {loading ? "Assigning..." : "Assign to Project Lead"}
          </Button>
        </div>

        {!isBulk && (
          <div className="space-y-3">
            <Typography
              variant="body5"
              className="font-bold text-muted-foreground uppercase"
            >
              Currently Assigned Interviewers
            </Typography>
            <div className="space-y-2">
              {fetchingAssigned ? (
                <div className="h-10 w-full bg-muted animate-pulse rounded-xl" />
              ) : assignedLeads.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-border flex items-center justify-center gap-2 text-muted-foreground italic text-sm">
                  <ShieldAlert size={16} />
                  No leads assigned yet
                </div>
              ) : (
                assignedLeads.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-card border border-border shadow-sm group"
                  >
                    <div className="flex items-center gap-2">
                      <Typography variant="body4" className="font-bold">
                        {item.lead_name}
                      </Typography>
                      <Badge
                        variant="outline"
                        color={
                          item.status === "completed" ? "success" : "warning"
                        }
                        className="text-[9px] font-black uppercase"
                      >
                        {item.status}
                      </Badge>
                    </div>
                    {item.status !== "completed" && (
                      <button
                        onClick={() => handleUnassign(item.id)}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100"
                        title="Unassign Lead"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
