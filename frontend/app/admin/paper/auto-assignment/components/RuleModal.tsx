"use client";

import React, { useState, useEffect, useRef } from "react";
import { Modal } from "@components/ui-elements/Modal";
import { Typography } from "@components/ui-elements/Typography";
import { Button } from "@components/ui-elements/Button";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { MultiSelectDropdown } from "@components/ui-elements/MultiSelectDropdown";
import { DatePicker } from "@components/ui-elements/DatePicker";
import { Switch } from "@components/ui-elements/Switch";
import { useClassifications } from "@hooks/api/classifications/use-classifications";
import { useDepartments } from "@hooks/api/departments/use-departments";
import {
  paperAssignmentsApi,
  AutoAssignmentRuleResponse,
  AutoAssignmentRulePayload,
} from "@lib/api/paper-assignments";
import { papersApi } from "@lib/api/papers";
import { PaperSetup } from "@types";
import { toast } from "@lib/toast";
import { Loader2 } from "lucide-react";
import { Alert } from "@components/ui-elements/Alert";
import { getTodayISODate } from "@lib/utils";

interface RuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editingRule?: AutoAssignmentRuleResponse | null;
}

export function RuleModal({
  isOpen,
  onClose,
  onSuccess,
  editingRule,
}: RuleModalProps) {
  const { data: departmentsData, isLoading: isLoadingDepts } = useDepartments({
    is_active: true,
  });
  const { data: levelsData, isLoading: isLoadingLevels } = useClassifications({
    type: "exam_level",
    is_active: true,
  });

  const departments = departmentsData || [];
  const levels = levelsData?.data || [];

  const [formData, setFormData] = useState({
    department_id: "",
    test_level_id: "",
    assigned_date: getTodayISODate(),
    paper_ids: [] as number[],
    is_active: true,
  });

  const [availablePapers, setAvailablePapers] = useState<
    { id: number; label: string }[]
  >([]);
  const [isLoadingPapers, setIsLoadingPapers] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const initializedRef = useRef(false);
  const lastFetchedParamsRef = useRef<string>("");

  useEffect(() => {
    if (isOpen) {
      if (editingRule) {
        setFormData({
          department_id: editingRule.department_id.toString(),
          test_level_id: editingRule.test_level_id.toString(),
          assigned_date: editingRule.assigned_date,
          paper_ids: editingRule.paper_ids,
          is_active: editingRule.is_active,
        });
      } else {
        setFormData({
          department_id: "",
          test_level_id: "",
          assigned_date: getTodayISODate(),
          paper_ids: [],
          is_active: true,
        });
      }
      // Reset initialization on open
      initializedRef.current = false;
    }
  }, [editingRule, isOpen]);

  // Fetch papers when dept or level changes
  useEffect(() => {
    async function fetchPapers() {
      if (!formData.department_id || !formData.test_level_id) {
        setAvailablePapers([]);
        lastFetchedParamsRef.current = "";
        return;
      }

      // Prevent redundant calls if params haven't changed
      const currentParams = `${formData.department_id}-${formData.test_level_id}`;
      if (lastFetchedParamsRef.current === currentParams) return;

      lastFetchedParamsRef.current = currentParams;
      setIsLoadingPapers(true);
      try {
        const response = await papersApi.getPapers({
          department_id: formData.department_id,
          test_level_id: formData.test_level_id,
        });

        if (response && response.data) {
          setAvailablePapers(
            response.data.map((p: PaperSetup) => ({
              id: p.id,
              label: p.paper_name,
            })),
          );
        }
      } catch (error) {
        console.error("Failed to fetch papers:", error);
      } finally {
        setIsLoadingPapers(false);
      }
    }

    if (isOpen) {
      fetchPapers();
    }
  }, [formData.department_id, formData.test_level_id, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !formData.department_id ||
      !formData.test_level_id ||
      formData.paper_ids.length === 0
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSaving(true);
    try {
      const payload: AutoAssignmentRulePayload = {
        department_id: parseInt(formData.department_id),
        test_level_id: parseInt(formData.test_level_id),
        assigned_date: formData.assigned_date,
        paper_ids: formData.paper_ids,
        is_active: formData.is_active,
      };

      if (editingRule) {
        await paperAssignmentsApi.updateAutoRule(editingRule.id, payload);
        toast.success("Rule updated successfully");
      } else {
        await paperAssignmentsApi.createAutoRule(payload);
        toast.success("Auto-assignment rule created");
      }
      onSuccess();
    } catch (error: unknown) {
      const err = error as { response?: { data?: { detail?: string } } };
      toast.error(err.response?.data?.detail || "Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        editingRule ? "Edit Auto-Assignment Rule" : "Configure Auto-Assignment"
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Alert
          variant="warning"
          description="Set up a pool of papers to be automatically rotated for assigning to new candidates sequentially."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Typography variant="body4" weight="semibold">
              Department *
            </Typography>
            <SelectDropdown
              options={departments.map((d) => ({ id: d.id, label: d.name }))}
              value={formData.department_id}
              onChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  department_id: val.toString(),
                  paper_ids: [],
                }))
              }
              isLoading={isLoadingDepts}
              placeholder="Select Department"
            />
          </div>

          <div className="space-y-2">
            <Typography variant="body4" weight="semibold">
              Exam Level *
            </Typography>
            <SelectDropdown
              options={levels.map((l) => ({ id: l.id, label: l.name }))}
              value={formData.test_level_id}
              onChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  test_level_id: val.toString(),
                  paper_ids: [],
                }))
              }
              isLoading={isLoadingLevels}
              placeholder="Select Exam Level"
            />
          </div>

          <div className="space-y-2">
            <Typography variant="body4" weight="semibold">
              Assigned Date *
            </Typography>
            <DatePicker
              value={formData.assigned_date}
              onChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  assigned_date: val,
                }))
              }
            />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg border border-border">
            <div className="space-y-0.5">
              <Typography variant="body4" weight="semibold">
                Is Rule Active?
              </Typography>
              <Typography variant="body5" className="text-muted-foreground">
                Deactive rules will be ignored.
              </Typography>
            </div>
            <Switch
              checked={formData.is_active}
              onChange={(checked) =>
                setFormData((prev) => ({ ...prev, is_active: checked }))
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Typography variant="body4" weight="semibold">
              Paper Pool *
            </Typography>
            {isLoadingPapers && (
              <Loader2 className="h-4 w-4 animate-spin text-brand-primary" />
            )}
          </div>
          <MultiSelectDropdown
            options={availablePapers}
            value={formData.paper_ids}
            onChange={(ids) =>
              setFormData((prev) => ({ ...prev, paper_ids: ids as number[] }))
            }
            placeholder={
              !formData.department_id || !formData.test_level_id
                ? "Select Dept & Level first"
                : "Select Papers for rotation"
            }
            disabled={
              !formData.department_id ||
              !formData.test_level_id ||
              isLoadingPapers
            }
            isLoading={isLoadingPapers}
          />
          {availablePapers.length === 0 &&
            formData.department_id &&
            formData.test_level_id &&
            !isLoadingPapers && (
              <Typography variant="body5" className="text-red-500 italic mt-1">
                No active papers found for this combination.
              </Typography>
            )}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            color="primary"
            animate="scale"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            color="primary"
            animate="scale"
            disabled={isSaving}
          >
            {editingRule ? "Update Rule" : "Submit Rule"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
