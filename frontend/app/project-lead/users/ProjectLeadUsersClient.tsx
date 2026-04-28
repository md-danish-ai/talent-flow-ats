"use client";
import React, { useState, useEffect } from "react";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { Typography } from "@components/ui-elements/Typography";
import { evaluationsApi } from "@lib/api";
import { UserList } from "./components/UserList";
import { Users } from "lucide-react";
import { useListing } from "@hooks/useListing";
import { MainCard } from "@components/ui-cards/MainCard";
import { Pagination } from "@components/ui-elements/Pagination";
import { ListingHeaderActions } from "@components/ui-elements/ListingHeaderActions";
import { ListingTransition } from "@components/ui-elements/ListingTransition";
import { ListingFiltersDrawer } from "@components/ui-elements/ListingFiltersDrawer";
import { EvaluationModal } from "./components/EvaluationModal";
import { cn } from "@lib/utils";

import { EvaluationTask } from "@types";

interface ProjectLeadUsersClientProps {
  leadId: number;
}

export default function ProjectLeadUsersClient({
  leadId,
}: ProjectLeadUsersClientProps) {
  const [counts, setCounts] = useState({ all: 0, pending: 0, completed: 0 });
  const [selectedTask, setSelectedTask] = useState<EvaluationTask | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
    fetchFn: (params) => evaluationsApi.getLeadTasks(leadId, params),
    initialFilters: { status: "all", search: "" },
    toastMessage: "User list updated",
  });

  // Fetch counts separately or just use the current tab's total
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [allRes, pendingRes, completedRes] = await Promise.all([
          evaluationsApi.getLeadTasks(leadId, { status: "all", limit: 1 }),
          evaluationsApi.getLeadTasks(leadId, { status: "pending", limit: 1 }),
          evaluationsApi.getLeadTasks(leadId, {
            status: "completed",
            limit: 1,
          }),
        ]);
        setCounts({
          all: allRes.pagination?.total_records || 0,
          pending: pendingRes.pagination?.total_records || 0,
          completed: completedRes.pagination?.total_records || 0,
        });
      } catch (err) {
        console.error("Failed to fetch counts", err);
      }
    };
    if (leadId) fetchCounts();
  }, [leadId, tasks]);



  const handleEvaluate = (task: EvaluationTask) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedTask(null);
  };

  const handleEvaluationSuccess = () => {
    void refresh();
  };

  return (
    <PageContainer className="space-y-6 max-w-7xl mx-auto" animate>
      <div className="flex flex-col gap-1">
        <Typography variant="h2" className="font-black tracking-tight">
          Assigned Users
        </Typography>
        <Typography variant="body4" className="text-muted-foreground">
          Manage and evaluate users assigned to you for Round 2 interviews.
        </Typography>
      </div>

      <MainCard
        title={
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                <Users size={18} />
              </div>
              Users
            </div>
          </div>
        }
        bodyClassName="p-0 flex flex-row items-stretch w-full"
        action={
          <ListingHeaderActions
            isLoading={loading}
            isBackgroundLoading={isBackgroundLoading}
            totalItems={totalItems}
            itemLabel="Users"
            onRefresh={refresh}
            onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
            isFilterOpen={isFilterOpen}
            activeFiltersCount={
              Object.entries(filters).filter(([key, val]) => val && val !== "all").length
            }
          />
        }
      >
        <div
          className={cn(
            "flex-1 flex flex-col min-w-0",
            isFilterOpen && "border-r border-border/50",
          )}
        >
          <ListingTransition
            isLoading={loading}
            isBackgroundLoading={isBackgroundLoading}
          >
            <div className="flex-1 overflow-x-auto w-full h-full flex flex-col">
              <UserList tasks={tasks} onEvaluate={handleEvaluate} />
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

        <ListingFiltersDrawer
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          registryKey="project-lead-users-filters"
          filters={filters}
          onFilterChange={(key, val) => handleFilterChange({ [key]: val })}
          onReset={() => handleFilterChange({ status: "all", search: "" })}
          dynamicOptions={{
            status: [
              { id: "all", label: `All (${counts.all})` },
              { id: "pending", label: `Pending (${counts.pending})` },
              { id: "completed", label: `Completed (${counts.completed})` },
            ],
          }}
        />
      </MainCard>



      <EvaluationModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        userId={selectedTask?.user_id || 0}
        evaluationId={selectedTask?.id || 0}
        onSuccess={handleEvaluationSuccess}
      />
    </PageContainer>
  );
}
