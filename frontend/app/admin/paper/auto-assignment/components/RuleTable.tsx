"use client";
import React, { useState } from "react";

import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@components/ui-elements/Table";
import { Typography } from "@components/ui-elements/Typography";
import { TableIconButton } from "@components/ui-elements/TableIconButton";
import { Button } from "@components/ui-elements/Button";
import { Modal } from "@components/ui-elements/Modal";
import { Edit2, Trash2, Layers, Calendar, AlertTriangle } from "lucide-react";
import {
  AutoAssignmentRuleResponse,
  paperAssignmentsApi,
} from "@lib/api/paper-assignments";
import { Badge } from "@components/ui-elements/Badge";
import { EmptyState } from "@components/ui-elements/EmptyState";
import { SimpleTableSkeleton } from "@components/ui-skeleton/SimpleTableSkeleton";
import { formatDate } from "@lib/utils";

interface RuleTableProps {
  rules: AutoAssignmentRuleResponse[];
  isLoading: boolean;
  onEdit: (rule: AutoAssignmentRuleResponse) => void;
  onRefresh: () => void;
}

export function RuleTable({
  rules,
  isLoading,
  onEdit,
  onRefresh,
}: RuleTableProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = (ruleId: number) => {
    setRuleToDelete(ruleId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!ruleToDelete) return;
    setIsDeleting(true);
    try {
      await paperAssignmentsApi.deleteAutoRule(ruleToDelete);
      setIsDeleteModalOpen(false);
      setRuleToDelete(null);
      onRefresh();
    } catch {
      // Handled automatically by apiClient global interceptor
    } finally {
      setIsDeleting(false);
    }
  };

  const isPastDate = (dateStr: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const ruleDate = new Date(dateStr);
    ruleDate.setHours(0, 0, 0, 0);
    return ruleDate < today;
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px] text-center">Sr. No.</TableHead>
            <TableHead>Department / Exam Level</TableHead>
            <TableHead className="text-center">Active Date</TableHead>
            <TableHead>Papers in Pool</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="w-[100px] text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <SimpleTableSkeleton columnCount={6} rowCount={5} />
          ) : rules.length === 0 ? (
            <EmptyState
              colSpan={6}
              variant="database"
              title="No auto-assignment rules found"
              description="You haven't created any auto-assignment rules for the selected date. Add a new rule to automate paper distribution."
            />
          ) : (
            rules.map((row, idx) => {
              const isPast = isPastDate(row.assigned_date);
              return (
                <TableRow key={row.id}>
                  <TableCell className="font-medium text-center align-middle text-slate-600 dark:text-white">
                    {String(idx + 1).padStart(2, "0")}
                  </TableCell>
                  <TableCell className="align-middle">
                    <div className="flex flex-col gap-1">
                      <Typography
                        variant="body4"
                        weight="extrabold"
                        className="text-slate-900 dark:text-white uppercase tracking-wider text-[11px]"
                      >
                        {row.department_name}
                      </Typography>
                      <div className="flex items-center gap-1.5">
                        <Layers className="h-3 w-3 text-brand-primary opacity-80 shrink-0" />
                        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none">
                          {row.test_level_name}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="align-middle text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 shadow-sm">
                      <Calendar className="h-3.5 w-3.5 text-brand-primary shrink-0" />
                      <Typography
                        variant="body5"
                        weight="bold"
                        className="text-slate-700 dark:text-slate-300 tracking-wide font-mono"
                      >
                        {formatDate(row.assigned_date)}
                      </Typography>
                    </div>
                  </TableCell>
                  <TableCell className="align-middle">
                    <div className="flex flex-wrap gap-2 py-1">
                      {row.paper_names && row.paper_names.length > 0 ? (
                        row.paper_names.map((name, i) => (
                          <div
                            key={i}
                            className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-brand-primary/[0.04] dark:bg-brand-primary/[0.08] border border-brand-primary/10 hover:border-brand-primary/30 text-[10px] font-bold text-brand-primary uppercase tracking-wide shadow-sm hover:scale-[1.02] transition-all duration-200"
                          >
                            <span>{name}</span>
                          </div>
                        ))
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/40 text-[10px] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
                          Empty Pool
                        </span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="align-middle text-center">
                    {isPast ? (
                      <Badge variant="outline" shape="square" color="secondary">
                        Completed
                      </Badge>
                    ) : row.is_active ? (
                      <Badge variant="outline" shape="square" color="success">
                        Running
                      </Badge>
                    ) : (
                      <Badge variant="outline" shape="square" color="warning">
                        Paused
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="align-middle text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <TableIconButton
                        iconColor={isPast ? "slate" : "blue"}
                        title={
                          isPast ? "Cannot edit completed rules" : "Edit Rule"
                        }
                        onClick={() => onEdit(row)}
                        disabled={isPast}
                        className={
                          isPast
                            ? "opacity-30 cursor-not-allowed shadow-none"
                            : "hover:scale-105 transition-transform"
                        }
                      >
                        <Edit2 size={15} />
                      </TableIconButton>
                      <TableIconButton
                        iconColor={isPast ? "slate" : "red"}
                        title={
                          isPast
                            ? "Cannot delete completed rules"
                            : "Delete Rule"
                        }
                        onClick={() => handleDeleteClick(row.id)}
                        disabled={isPast}
                        className={
                          isPast
                            ? "opacity-30 cursor-not-allowed shadow-none"
                            : "hover:scale-105 transition-transform"
                        }
                      >
                        <Trash2 size={15} />
                      </TableIconButton>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title={
          <div className="flex items-center gap-2 text-brand-error">
            <AlertTriangle className="h-5 w-5" />
            <span>Delete Auto-Assignment Rule</span>
          </div>
        }
        className="max-w-md"
        footer={
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              color="primary"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
              animate="scale"
            >
              Cancel
            </Button>
            <Button
              color="error"
              variant="primary"
              onClick={handleConfirmDelete}
              isLoading={isDeleting}
              animate="scale"
            >
              Delete
            </Button>
          </div>
        }
      >
        <div className="space-y-3">
          <Typography
            variant="body3"
            className="text-slate-600 dark:text-slate-400"
          >
            Are you sure you want to delete this auto-assignment rule? This
            action cannot be undone and sequential paper allocation for this
            slot will be removed.
          </Typography>
        </div>
      </Modal>
    </>
  );
}
