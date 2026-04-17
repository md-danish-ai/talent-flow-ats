"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Modal } from "@components/ui-elements/Modal";
import { Typography } from "@components/ui-elements/Typography";
import { Button } from "@components/ui-elements/Button";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { UserListResponse } from "@lib/api/auth";
import { papersApi, PaperSetup } from "@lib/api/papers";
import { departmentsApi, Department } from "@lib/api/departments";
import { questionsApi } from "@lib/api/questions";
import { paperAssignmentsApi } from "@lib/api/paper-assignments";
import { toast } from "@lib/toast";
import {
  Loader2,
  User,
  Phone,
  Mail,
  BookOpen,
  Layers,
  Briefcase,
} from "lucide-react";

interface AssignPaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  user: UserListResponse;
}

export const AssignPaperModal: React.FC<AssignPaperModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  user,
}) => {
  const userLevel = user.test_level_name || user.assignment?.test_level_name;
  const testLevelId =
    user.test_level_id?.toString() ||
    user.assignment?.test_level_id?.toString();

  const [papers, setPapers] = useState<PaperSetup[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [selectedPaper, setSelectedPaper] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const fetchDepartments = useCallback(async () => {
    try {
      const response = await departmentsApi.getDepartments({
        is_active: true,
        limit: 100,
      });
      const deptList = response.data || [];
      setDepartments(deptList);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
      toast.error("Failed to fetch departments");
    }
  }, []);

  const fetchPapers = useCallback(async () => {
    if (!selectedDepartment) return;

    setIsLoading(true);
    try {
      const response = await papersApi.getPapers({
        is_active: true,
        limit: 100,
        department_id: selectedDepartment,
        test_level_id: testLevelId,
      });

      const papersList = (response.data || []) as PaperSetup[];

      // Filter papers that meet the "Total Selected Questions" condition
      // 1. Collect all unique question IDs from all papers to fetch their subject info
      const allQuestionIds = Array.from(
        new Set(papersList.flatMap((p) => p.question_id || [])),
      );

      if (allQuestionIds.length === 0) {
        setPapers([]);
        return;
      }

      // 2. Fetch question details for mapping
      const questionsList =
        await questionsApi.getQuestionsByIds(allQuestionIds);
      const questionIdToSubjectMap = new Map<number, number>();

      questionsList.forEach((q) => {
        if (q.id && q.subject?.id) {
          questionIdToSubjectMap.set(q.id, q.subject.id);
        }
      });

      // 3. Filter the papersList
      const readyPapers = papersList.filter((paper) => {
        // Must be active
        if (!paper.is_active) return false;

        const subjects = paper.subject_ids_data || [];
        const selectedSubjects = subjects.filter((s) => s.is_selected);

        // A valid paper must have at least one selected subject
        if (selectedSubjects.length === 0) return false;

        // ALL selected subjects must have their required question count met
        return selectedSubjects.every((subjectConfig) => {
          const requiredCount = subjectConfig.question_count;
          const assignedIds = paper.question_id || [];

          // Count questions in this paper that belong to this subject
          const actualCount = assignedIds.filter(
            (id) => questionIdToSubjectMap.get(id) === subjectConfig.subject_id,
          ).length;

          // Condition: actual count must match the required count (Green status)
          return actualCount === requiredCount && requiredCount > 0;
        });
      });

      setPapers(readyPapers);
    } catch (error) {
      console.error("Failed to fetch/filter papers:", error);
      toast.error("Failed to fetch paper sets");
    } finally {
      setIsLoading(false);
    }
  }, [selectedDepartment, testLevelId]);

  useEffect(() => {
    if (isOpen) {
      console.log(
        "Modal opened for user:",
        user.id,
        "Assignment:",
        user.assignment,
      );
      setIsInitialized(false);
      fetchDepartments();

      // Pre-fill department and paper
      if (user.assignment?.is_assigned) {
        const deptId = user.assignment.department_id || user.department_id;
        if (deptId) {
          setSelectedDepartment(deptId.toString());
        }
        if (user.assignment.paper_id) {
          setSelectedPaper(user.assignment.paper_id.toString());
        }
      } else if (user.department_id) {
        // Default to user's assigned department for new assignments
        setSelectedDepartment(user.department_id.toString());
        setSelectedPaper("");
        setPapers([]);
      } else {
        // Pure fresh state
        setSelectedDepartment("");
        setSelectedPaper("");
        setPapers([]);
      }

      // Mark as initialized after a short delay to allow states to settle
      const timer = setTimeout(() => setIsInitialized(true), 100);
      return () => clearTimeout(timer);
    }
  }, [isOpen, user.id, user.assignment, fetchDepartments]);

  // Fetch papers when department changes
  useEffect(() => {
    if (isOpen && selectedDepartment) {
      fetchPapers();
    } else if (isOpen && !selectedDepartment && isInitialized) {
      setPapers([]);
      setSelectedPaper("");
    }
  }, [isOpen, selectedDepartment, testLevelId, isInitialized, fetchPapers]);

  const handleAssign = async () => {
    if (!selectedPaper) {
      toast.error("Please select a paper set");
      return;
    }

    setIsSubmitting(true);
    try {
      const today = new Date().toISOString().split("T")[0];

      if (!testLevelId) {
        toast.error("Could not determine candidate's test level ID");
        return;
      }

      await paperAssignmentsApi.assignPaperToUser({
        user_id: user.id,
        paper_id: parseInt(selectedPaper),
        department_id: parseInt(selectedDepartment),
        test_level_id: parseInt(testLevelId),
        assigned_date: today,
      });

      onSuccess?.();
      onClose();
    } catch (error) {
      console.error("Failed to assign paper:", error);
      toast.error("Failed to assign paper set. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        user.assignment?.is_assigned
          ? "Edit Paper Assignment"
          : "Assign Paper Set"
      }
      className="max-w-md"
    >
      <div className="space-y-6">
        <div className="p-4 rounded-xl bg-muted/30 border border-border/50 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                <User size={20} />
              </div>
              <div>
                <Typography variant="body3" weight="semibold">
                  {user.username}
                </Typography>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Briefcase size={12} />
                  <Typography variant="body4" className="text-xs">
                    User ID: #{user.id}
                  </Typography>
                </div>
              </div>
            </div>
            {userLevel && (
              <div className="px-2.5 py-1 rounded-lg bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
                <Typography
                  variant="body4"
                  weight="bold"
                  className="uppercase tracking-wider text-[10px]"
                >
                  {userLevel}
                </Typography>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-2 pt-2 border-t border-border/50">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone size={14} />
              <Typography variant="body4" className="text-xs">
                {user.mobile}
              </Typography>
            </div>
            {user.email && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail size={14} />
                <Typography variant="body4" className="truncate text-xs">
                  {user.email}
                </Typography>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-5">
          <div className="space-y-2">
            <Typography
              variant="body4"
              weight="medium"
              className="flex items-center gap-2 text-foreground/80"
            >
              <Layers size={16} className="text-brand-primary" /> Select
              Department
            </Typography>
            <SelectDropdown
              placeholder="Choose Department"
              options={departments.map((dept) => ({
                id: dept.id,
                label: dept.name,
              }))}
              value={selectedDepartment}
              onChange={(val) => {
                setSelectedDepartment(val.toString());
                setSelectedPaper(""); // Clear paper when dept changes manually
              }}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2 border-t border-border/50 pt-5">
            <div className="flex items-center justify-between">
              <Typography
                variant="body4"
                weight="medium"
                className="flex items-center gap-2 text-foreground/80"
              >
                <BookOpen size={16} className="text-brand-primary" /> Select
                Paper Set
              </Typography>
            </div>

            <SelectDropdown
              placeholder={
                !selectedDepartment
                  ? "Select a department first"
                  : "Choose a paper set..."
              }
              options={papers.map((paper) => ({
                id: paper.id,
                label: `${paper.paper_name} (${paper.total_marks} Marks)`,
              }))}
              value={selectedPaper}
              onChange={(val) => setSelectedPaper(val.toString())}
              disabled={isLoading || isSubmitting || !selectedDepartment}
            />

            {isLoading && (
              <div className="flex items-center gap-2 text-muted-foreground text-xs pl-1">
                <Loader2 size={12} className="animate-spin" />
                Fetching matches...
              </div>
            )}

            {papers.length === 0 && selectedDepartment && !isLoading && (
              <Typography
                variant="body5"
                className="text-amber-600 dark:text-amber-400 pl-1 mt-1 font-medium"
              >
                No matching paper sets found for this Dept + Level
              </Typography>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 pt-4">
          <Button
            variant="outline"
            color="primary"
            animate="scale"
            className="flex-1"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            color="primary"
            animate="scale"
            className="flex-1"
            onClick={handleAssign}
            disabled={!selectedPaper || isLoading || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={16} className="animate-spin mr-2" />
                Processing...
              </>
            ) : user.assignment?.is_assigned ? (
              "Update Assignment"
            ) : (
              "Assign Paper"
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AssignPaperModal;
