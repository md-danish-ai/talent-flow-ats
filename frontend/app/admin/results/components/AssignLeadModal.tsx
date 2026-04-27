"use client";

import { useState, useEffect } from "react";
import { Modal } from "@components/ui-elements/Modal";
import { Button } from "@components/ui-elements/Button";
import { Typography } from "@components/ui-elements/Typography";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { managementApi, evaluationsApi, ApiError } from "@lib/api";
import { UserCheck, ShieldAlert, X } from "lucide-react";
import { toast } from "@lib/toast";
import { Badge } from "@components/ui-elements/Badge";

import { EvaluationHistoryItem, UserListResponse } from "@types";

interface AssignLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  attemptId: number;
  candidateName: string;
  onSuccess?: () => void;
}

export function AssignLeadModal({
  isOpen,
  onClose,
  userId,
  attemptId,
  candidateName,
  onSuccess,
}: AssignLeadModalProps) {
  const [leads, setLeads] = useState<UserListResponse[]>([]);
  const [selectedLead, setSelectedLead] = useState<string | number>("");
  const [loading, setLoading] = useState(false);
  const [assignedLeads, setAssignedLeads] = useState<EvaluationHistoryItem[]>(
    [],
  );
  const [fetchingAssigned, setFetchingAssigned] = useState(false);

  useEffect(() => {
    if (isOpen) {
      void fetchLeads();
      void fetchAssignedLeads();
    }
  }, [isOpen, userId, attemptId]);

  const fetchLeads = async () => {
    try {
      const res = await managementApi.getProjectLeads({ limit: 100 });
      setLeads(res.data || []); // managementApi.getProjectLeads returns PaginatedResponse, so .data is correct here
    } catch (err) {
      console.error("Failed to fetch leads", err);
    }
  };

  const fetchAssignedLeads = async () => {
    try {
      setFetchingAssigned(true);
      const res = await evaluationsApi.getEvaluationHistory(userId, attemptId);
      setAssignedLeads(res || []);
    } catch (err) {
      console.error("Failed to fetch assigned leads", err);
    } finally {
      setFetchingAssigned(false);
    }
  };

  const handleAssign = async () => {
    if (!selectedLead) {
      toast.error("Please select a Project Lead.");
      return;
    }

    try {
      setLoading(true);
      await evaluationsApi.assignLead({
        user_id: userId,
        attempt_id: attemptId,
        project_lead_id: Number(selectedLead),
      });
      toast.success("Lead assigned successfully!");
      setSelectedLead("");
      void fetchAssignedLeads();
      if (onSuccess) onSuccess();
      onClose(); // Close the modal after success
    } catch (err) {
      console.error("Assignment failed", err);
      toast.error("Failed to assign lead.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnassign = async (evaluationId: number) => {
    try {
      await evaluationsApi.unassignLead(evaluationId);
      toast.success("Lead unassigned.");
      void fetchAssignedLeads();
      if (onSuccess) onSuccess();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof ApiError ? err.message : "Failed to unassign.";
      toast.error(errorMessage);
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
              {candidateName}
            </Typography>
          </div>
        </div>

        <div className="space-y-2">
          <Typography
            variant="body5"
            className="font-bold text-muted-foreground uppercase"
          >
            Select Project Lead
          </Typography>
          <div className="flex gap-2">
            <div className="flex-1">
              <SelectDropdown
                options={leads.map((l) => ({ id: l.id, label: l.username }))}
                placeholder="Choose a lead..."
                value={selectedLead}
                onChange={setSelectedLead}
              />
            </div>
            <Button color="primary" onClick={handleAssign} disabled={loading}>
              {loading ? "Assigning..." : "Assign"}
            </Button>
          </div>
        </div>

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
      </div>
    </Modal>
  );
}
