"use client";
import { useRouter } from "next/navigation";
import React, { useState, useCallback, useMemo } from "react";
import { evaluationsApi } from "@lib/api";
import {
  UserCheck,
  Eye,
  Phone,
  ShieldCheck,
  Calendar,
  Users,
  Clock,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@components/ui-elements/Badge";
import { EmptyState } from "@components/ui-elements/EmptyState";
import { TableIconButton } from "@components/ui-elements/TableIconButton";
import { Avatar } from "@components/ui-elements/Avatar";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@components/ui-elements/Table";
import { useListing } from "@hooks/useListing";
import { MainCard } from "@components/ui-cards/MainCard";
import { Pagination } from "@components/ui-elements/Pagination";
import { ListingTransition } from "@components/ui-elements/ListingTransition";
import { EvaluationModal } from "./EvaluationModal";
import { getGradeConfig } from "@lib/utils";
import { EvaluationTask } from "@types";

import { SearchInput } from "@components/ui-elements/SearchInput";
import { Tabs } from "@components/ui-elements/Tabs";
import { ListingHeaderActions } from "@components/ui-elements/ListingHeaderActions";

interface UserListingProps {
  leadId: number;
}

export const UserListing = React.memo(({ leadId }: UserListingProps) => {
  const router = useRouter();
  const [selectedTask, setSelectedTask] = useState<EvaluationTask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Optimized fetch function reference
  const fetchFn = useCallback(
    (params: Parameters<typeof evaluationsApi.getLeadTasks>[1]) =>
      evaluationsApi.getLeadTasks(leadId, params),
    [leadId],
  );

  const {
    data: tasks,
    isLoading: loading,
    isBackgroundLoading,
    totalItems,
    currentPage,
    pageSize,
    filters,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    refresh,
  } = useListing<EvaluationTask, { status: string; search?: string }>({
    fetchFn,
    initialFilters: { status: "all", search: "" },
    toastMessage: "User list updated",
  });

  const handleEvaluate = useCallback((task: EvaluationTask) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  }, []);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
    setSelectedTask(null);
  }, []);

  const handleEvaluationSuccess = useCallback(() => {
    void refresh();
  }, [refresh]);

  const onFilterChange = useCallback(
    (key: string, val: unknown) => {
      handleFilterChange({ [key]: val });
    },
    [handleFilterChange],
  );

  const dynamicOptions = useMemo(
    () => ({
      status: [
        { id: "all", label: "All" },
        { id: "pending", label: "Pending" },
        { id: "completed", label: "Completed" },
      ],
    }),
    [],
  );

  return (
    <>
      <MainCard
        title={
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 w-full">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                <Users size={18} />
              </div>
              <span className="font-black text-foreground">Users</span>
            </div>

            {/* Original Tabs Component for Status */}
            <Tabs
              tabs={dynamicOptions.status.map((opt) => {
                let icon: React.ReactNode = null;
                if (opt.id === "all") icon = <Users size={14} />;
                if (opt.id === "pending") icon = <Clock size={14} />;
                if (opt.id === "completed") icon = <CheckCircle2 size={14} />;
                return {
                  label: opt.label,
                  value: opt.id,
                  icon,
                };
              })}
              activeTab={filters.status}
              onChange={(val) => onFilterChange("status", val)}
              size="sm"
              variant="pills"
            />
          </div>
        }
        bodyClassName="p-0 flex flex-col w-full"
        action={
          <div className="flex items-center gap-4">
            {/* Original Listing Header Actions (Refresh & Count) */}
            <ListingHeaderActions
              isLoading={loading}
              isBackgroundLoading={isBackgroundLoading}
              totalItems={totalItems}
              itemLabel="Users"
              onRefresh={refresh}
            />

            {/* Original Search Input */}
            <SearchInput
              placeholder="Search candidates..."
              value={filters.search || ""}
              onSearch={(val) => onFilterChange("search", val)}
              className="w-56 sm:w-64"
            />
          </div>
        }
      >
        <div className="flex-1 flex flex-col min-w-0">
          <ListingTransition
            isLoading={loading}
            isBackgroundLoading={isBackgroundLoading}
          >
            <div className="flex-1 overflow-x-auto w-full h-full flex flex-col">
              <div className="flex flex-col space-y-2">
                {tasks.length === 0 ? (
                  <EmptyState
                    variant="database"
                    title="No users found"
                    description="You don't have any assigned users in this category."
                  />
                ) : (
                  <Table>
                    <TableHeader className="bg-muted/30">
                      <TableRow>
                        <TableHead>Candidate</TableHead>
                        <TableHead className="text-center">Status</TableHead>
                        <TableHead className="text-center">Grade</TableHead>
                        <TableHead>Result</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tasks.map((task) => (
                        <TableRow
                          key={task.id}
                          className="hover:bg-muted/20 transition-colors"
                        >
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar
                                name={task.candidate_name}
                                variant="brand"
                                size="sm"
                              />
                              <div className="flex flex-col">
                                <span className="font-bold text-[13px] uppercase tracking-tight">
                                  {task.candidate_name}
                                </span>
                                <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                  <Phone size={10} /> {task.candidate_mobile}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant="outline"
                              shape="square"
                              color={
                                task.status === "completed"
                                  ? "success"
                                  : "warning"
                              }
                              className="uppercase tracking-widest text-[9px] font-black"
                            >
                              {task.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            {task.overall_grade ? (
                              <Badge
                                variant="outline"
                                shape="square"
                                color={
                                  getGradeConfig(task.overall_grade).badgeColor
                                }
                                className="font-bold uppercase"
                              >
                                {task.overall_grade}
                              </Badge>
                            ) : (
                              "-"
                            )}
                          </TableCell>
                          <TableCell>
                            {task.result_name ? (
                              <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[13px]">
                                <ShieldCheck size={14} />
                                {task.result_name}
                              </div>
                            ) : (
                              <span className="text-muted-foreground italic text-xs">
                                Pending Decision
                              </span>
                            )}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs">
                            <div className="flex items-center gap-1">
                              <Calendar size={12} />
                              {new Date(task.created_at).toLocaleDateString()}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <TableIconButton
                                title="View Results"
                                iconColor="amber"
                                btnSize="sm"
                                onClick={() =>
                                  router.push(
                                    `/project-lead/users/${task.user_id}`,
                                  )
                                }
                              >
                                <Eye size={18} />
                              </TableIconButton>
                              <TableIconButton
                                title={
                                  task.status === "completed"
                                    ? "View Evaluation"
                                    : "Start Evaluation"
                                }
                                iconColor="brand"
                                btnSize="sm"
                                onClick={() => handleEvaluate(task)}
                              >
                                <UserCheck size={18} />
                              </TableIconButton>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>

            {!loading && totalItems > 0 && (
              <div className="border-t border-border bg-slate-50/30 dark:bg-slate-900/30 mt-auto">
                <Pagination
                  currentPage={currentPage}
                  totalPages={Math.ceil(totalItems / pageSize)}
                  onPageChange={handlePageChange}
                  totalItems={totalItems}
                  pageSize={pageSize}
                  onPageSizeChange={handlePageSizeChange}
                />
              </div>
            )}
          </ListingTransition>
        </div>
      </MainCard>

      <EvaluationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        userId={selectedTask?.user_id || 0}
        evaluationId={selectedTask?.id || 0}
        onSuccess={handleEvaluationSuccess}
      />
    </>
  );
});

UserListing.displayName = "UserListing";
