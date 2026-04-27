"use client";
import React, { useState, useEffect } from "react";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { Typography } from "@components/ui-elements/Typography";
import { Tabs, type TabItem } from "@components/ui-elements/Tabs";
import { evaluationsApi } from "@lib/api";
import { CandidateList } from "./CandidateList";
import { Clock, CheckCircle, Users } from "lucide-react";
import { useListing } from "@hooks/useListing";
import { MainCard } from "@components/ui-cards/MainCard";
import { Pagination } from "@components/ui-elements/Pagination";
import { ListingHeaderActions } from "@components/ui-elements/ListingHeaderActions";
import { ListingTransition } from "@components/ui-elements/ListingTransition";

import { EvaluationTask } from "@types";

interface ProjectLeadUsersClientProps {
  leadId: number;
}

export default function ProjectLeadUsersClient({
  leadId,
}: ProjectLeadUsersClientProps) {
  const [counts, setCounts] = useState({ pending: 0, completed: 0 });

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
  } = useListing<EvaluationTask, { status: string }>({
    fetchFn: (params) => evaluationsApi.getLeadTasks(leadId, params),
    initialFilters: { status: "pending" },
    toastMessage: "Candidate list updated",
  });

  // Fetch counts separately or just use the current tab's total
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [pendingRes, completedRes] = await Promise.all([
          evaluationsApi.getLeadTasks(leadId, { status: "pending", limit: 1 }),
          evaluationsApi.getLeadTasks(leadId, { status: "completed", limit: 1 }),
        ]);
        setCounts({
          pending: pendingRes.pagination?.total_records || 0,
          completed: completedRes.pagination?.total_records || 0,
        });
      } catch (err) {
        console.error("Failed to fetch counts", err);
      }
    };
    if (leadId) fetchCounts();
  }, [leadId, tasks]); // Refresh counts when tasks change

  const activeTab = filters.status;

  const TABS: TabItem[] = [
    {
      value: "pending",
      label: `Pending (${counts.pending})`,
      icon: <Clock size={16} />,
    },
    {
      value: "completed",
      label: `Completed (${counts.completed})`,
      icon: <CheckCircle size={16} />,
    },
  ];

  const handleTabChange = (val: string) => {
    handleFilterChange({ status: val });
  };

  return (
    <PageContainer className="space-y-6 max-w-7xl mx-auto" animate>
      <div className="flex flex-col gap-1">
        <Typography variant="h2" className="font-black tracking-tight">
          Assigned Candidates
        </Typography>
        <Typography variant="body4" className="text-muted-foreground">
          Manage and evaluate candidates assigned to you for Round 2 interviews.
        </Typography>
      </div>

      <MainCard
        title={
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
                <Users size={18} />
              </div>
              Candidates
            </div>
            <div className="h-8 w-px bg-border/50" />
            <Tabs
              tabs={TABS}
              activeTab={activeTab}
              onChange={handleTabChange}
              variant="pills"
              size="md"
            />
          </div>
        }
        bodyClassName="p-0"
        action={
          <ListingHeaderActions
            isLoading={loading}
            isBackgroundLoading={isBackgroundLoading}
            totalItems={totalItems}
            itemLabel="Candidates"
            onRefresh={refresh}
          />
        }
      >
        <ListingTransition isLoading={loading} isBackgroundLoading={isBackgroundLoading}>
          <CandidateList tasks={tasks} />
          
          {!loading && totalItems > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalItems / pageSize)}
              onPageChange={handlePageChange}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
              className="border-t border-border mt-auto"
            />
          )}
        </ListingTransition>
      </MainCard>
    </PageContainer>
  );
}
