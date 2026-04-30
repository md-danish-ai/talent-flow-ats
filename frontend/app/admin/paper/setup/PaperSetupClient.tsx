"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { PageHeader } from "@components/ui-elements/PageHeader";
import { MainCard } from "@components/ui-cards/MainCard";
import { Tooltip } from "@components/ui-elements/Tooltip";
import { Button } from "@components/ui-elements/Button";
import { Plus, FileText } from "lucide-react";
import { toast } from "@lib/toast";
import { PaperSetupTable } from "./components/PaperSetupTable";
import { papersApi } from "@lib/api/papers";
import { PaperSetup } from "@types";
import { TableColumnToggle } from "@components/ui-elements/Table";
import { useDepartments } from "@hooks/api/departments/use-departments";
import { useClassifications } from "@hooks/api/classifications/use-classifications";
import { ListingFiltersDrawer } from "@components/ui-elements/ListingFiltersDrawer";
import { cn } from "@lib/utils";
import { useListing } from "@hooks/useListing";
import { ListingTransition } from "@components/ui-elements/ListingTransition";
import {
  ListingBadge,
  ListingIcons,
} from "@components/ui-elements/ListingHeaderActions";

export function PaperSetupClient() {
  const router = useRouter();
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "sr_no",
    "paper_name",
    "department",
    "test_level",
    "timing",
    "total_marks",
    "active",
    "actions",
  ]);

  // Hook for standardized listing
  const {
    data: papers,
    isLoading,
    isBackgroundLoading,
    totalItems,
    currentPage,
    pageSize,
    filters,
    activeFiltersCount,
    handleSingleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    resetFilters,
    refresh,
  } = useListing<
    Partial<PaperSetup>,
    { search: string; department_id: string; test_level_id: string }
  >({
    fetchFn: (params) => papersApi.getPapers(params),
    initialFilters: {
      search: "",
      department_id: "all",
      test_level_id: "all",
    },
    filterMapping: (f) => ({
      search: f.search || undefined,
      department_id: f.department_id === "all" ? undefined : f.department_id,
      test_level_id: f.test_level_id === "all" ? undefined : f.test_level_id,
    }),
    toastMessage: "Paper list refreshed successfully",
  });

  // Fetch all departments and levels for filters
  const { data: allDepartments = [] } = useDepartments({ is_active: true });
  const classificationQuery = useClassifications({
    type: "exam_level",
    is_active: true,
  });
  const allLevels = classificationQuery.data?.data || [];

  const columns = [
    { id: "sr_no", label: "Sr. No.", pinned: true },
    { id: "paper_name", label: "Test Paper", pinned: true },
    { id: "department", label: "Department" },
    { id: "test_level", label: "Test Level" },
    { id: "description", label: "Description" },
    { id: "timing", label: "Timing" },
    { id: "total_marks", label: "Total Marks" },
    { id: "active", label: "Active Status" },
    { id: "actions", label: "Actions", pinned: true },
  ];

  const handleToggleColumn = (id: string) => {
    setVisibleColumns((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    setTogglingId(id);
    try {
      await papersApi.togglePaperStatus(id, !currentStatus);
      void refresh();
      toast.success(`Paper ${!currentStatus ? "activated" : "deactivated"}`);
    } catch {
      // Error is handled by API client
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <PageContainer animate>
      <PageHeader
        title="Paper Management System"
        description="Configure and manage test papers, subject-wise weightage, and evaluation criteria with ease."
      />

      <MainCard
        title={
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
              <FileText size={18} />
            </div>
            Active Test Papers
          </div>
        }
        action={
          <div className="flex items-center gap-3">
            <ListingBadge
              isLoading={isLoading}
              isBackgroundLoading={isBackgroundLoading}
              totalItems={totalItems}
              itemLabel="Papers"
            />

            <div className="h-6 w-px bg-border/50 mx-1" />
            <TableColumnToggle
              columns={columns}
              visibleColumns={visibleColumns}
              onToggle={handleToggleColumn}
            />
            <div className="h-6 w-px bg-border/50 mx-1" />

            <div className="flex items-center gap-2">
              <ListingIcons
                isLoading={isLoading}
                isBackgroundLoading={isBackgroundLoading}
                onRefresh={refresh}
                onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
                isFilterOpen={isFilterOpen}
                activeFiltersCount={activeFiltersCount}
              />
              <Tooltip content="Create New Paper" side="top">
                <Button
                  variant="action"
                  color="primary"
                  size="rounded-icon"
                  animate="scale"
                  iconAnimation="rotate-90"
                  onClick={() => {
                    router.push("/admin/paper/setup/create");
                  }}
                >
                  <Plus size={20} />
                </Button>
              </Tooltip>
            </div>
          </div>
        }
        className="mt-6 flex flex-col"
        bodyClassName="p-0 flex flex-row items-stretch w-full"
      >
        <div
          className={cn(
            "flex-1 flex flex-col min-w-0",
            isFilterOpen && "border-r border-border/50",
          )}
        >
          <ListingTransition
            isLoading={isLoading}
            isBackgroundLoading={isBackgroundLoading}
          >
            <PaperSetupTable
              data={papers}
              totalItems={totalItems}
              currentPage={currentPage}
              pageSize={pageSize}
              onPageChange={handlePageChange}
              onPageSizeChange={handlePageSizeChange}
              isLoading={isLoading}
              togglingId={togglingId}
              onToggleStatus={handleToggleStatus}
              onEdit={(paper) =>
                router.push(`/admin/paper/setup/edit/${paper.id}`)
              }
              onViewDetails={(id) =>
                router.push(`/admin/paper/setup/detail/${id}`)
              }
              visibleColumns={visibleColumns}
            />
          </ListingTransition>
        </div>

        <ListingFiltersDrawer
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          registryKey="paper-setup-filters"
          filters={filters}
          onFilterChange={handleSingleFilterChange}
          onReset={resetFilters}
          isLoading={isLoading}
          dynamicOptions={{
            department_id: [
              { id: "all", label: "All Departments" },
              ...allDepartments.map((d) => ({
                id: String(d.id),
                label: d.name,
              })),
            ],
            test_level_id: [
              { id: "all", label: "All Levels" },
              ...allLevels.map((l) => ({ id: String(l.id), label: l.name })),
            ],
          }}
        />
      </MainCard>
    </PageContainer>
  );
}
