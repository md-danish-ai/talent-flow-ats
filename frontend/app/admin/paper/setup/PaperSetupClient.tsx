"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { PageHeader } from "@components/ui-elements/PageHeader";
import { MainCard } from "@components/ui-cards/MainCard";
import { Button } from "@components/ui-elements/Button";
import { Plus, FileText, Filter, RotateCcw, RefreshCcw } from "lucide-react";
import { toast } from "@lib/toast";
import { PaperSetupTable } from "./components/PaperSetupTable";
import { papersApi, type PaperSetup } from "@lib/api/papers";
import { TableColumnToggle } from "@components/ui-elements/Table";
import { useDepartments } from "@lib/react-query/departments/use-departments";
import { useClassifications } from "@lib/react-query/classifications/use-classifications";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { Badge } from "@components/ui-elements/Badge";
import { Typography } from "@components/ui-elements/Typography";
import { InlineDrawer } from "@components/ui-elements/InlineDrawer";
import { cn } from "@lib/utils";
import { SearchInput } from "@components/ui-elements/SearchInput";
import { Tooltip } from "@components/ui-elements/Tooltip";
import { useListing } from "@hooks/useListing";

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
    totalItems,
    currentPage,
    pageSize,
    filters,
    activeFiltersCount,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    resetFilters,
    refresh,
    fetchItems,
  } = useListing<
    Partial<PaperSetup>,
    { search: string; department_id: string; test_level_id: string }
  >({
    fetchFn: papersApi.getPapers,
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

  const deptOptions = [
    { id: "all", label: "All Departments" },
    ...allDepartments.map((d) => ({ id: String(d.id), label: d.name })),
  ];

  const levelOptions = [
    { id: "all", label: "All Levels" },
    ...allLevels.map((l) => ({ id: String(l.id), label: l.name })),
  ];

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
      void fetchItems();
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
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-brand-primary" />
            Active Test Papers
          </div>
        }
        action={
          <div className="flex items-center gap-3">
            {isLoading ? (
              <div className="h-8 w-24 bg-muted animate-pulse rounded-full" />
            ) : (
              <Badge
                variant="outline"
                color="default"
                className="font-bold border-border/50 bg-card"
              >
                {totalItems} PAPERS
              </Badge>
            )}
            <div className="h-6 w-px bg-border/50 mx-1" />
            <TableColumnToggle
              columns={columns}
              visibleColumns={visibleColumns}
              onToggle={handleToggleColumn}
            />
            <div className="h-6 w-px bg-border/50 mx-1" />
            <Tooltip content="Refresh Data" side="bottom">
              <Button
                variant="action"
                size="rounded-icon"
                animate="scale"
                onClick={refresh}
                disabled={isLoading}
              >
                <div className={cn(isLoading && "animate-spin")}>
                  <RefreshCcw size={18} />
                </div>
              </Button>
            </Tooltip>
            <Tooltip
              content={
                activeFiltersCount > 0
                  ? `Filters (${activeFiltersCount} active)`
                  : "Open Filters"
              }
              side="bottom"
            >
              <Button
                variant="action"
                size="rounded-icon"
                isActive={isFilterOpen}
                animate="scale"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                {activeFiltersCount > 0 ? (
                  <span className="relative">
                    <Filter size={18} />
                    <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-brand-primary text-white text-[8px] font-black flex items-center justify-center leading-none border border-white dark:border-slate-900">
                      {activeFiltersCount}
                    </span>
                  </span>
                ) : (
                  <Filter size={18} />
                )}
              </Button>
            </Tooltip>
            <Button
              variant="primary"
              color="primary"
              size="md"
              shadow
              animate="scale"
              onClick={() => {
                router.push("/admin/paper/setup/create");
              }}
              startIcon={<Plus size={18} />}
              className="font-bold border-none"
            >
              Create New Paper
            </Button>
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
        </div>

        <InlineDrawer
          title="Filters"
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
        >
          <div className="p-6 flex flex-col gap-8">
            {/* Search */}
            <div className="flex flex-col gap-3">
              <Typography
                variant="body5"
                weight="bold"
                className="uppercase tracking-widest text-muted-foreground"
              >
                Quick Search
              </Typography>
              <SearchInput
                placeholder="Paper name..."
                value={filters.search}
                onSearch={(val) => handleFilterChange({ search: val })}
              />
            </div>

            {/* Department Filter */}
            <div className="flex flex-col gap-3">
              <Typography
                variant="body5"
                weight="bold"
                className="uppercase tracking-widest text-muted-foreground"
              >
                Department
              </Typography>
              <SelectDropdown
                options={deptOptions}
                value={filters.department_id}
                onChange={(val) =>
                  handleFilterChange({ department_id: String(val) })
                }
                placeholder="Select Department"
                isLoading={allDepartments.length === 0}
              />
            </div>

            {/* Exam Level Filter */}
            <div className="flex flex-col gap-3">
              <Typography
                variant="body5"
                weight="bold"
                className="uppercase tracking-widest text-muted-foreground"
              >
                Exam Level
              </Typography>
              <SelectDropdown
                options={levelOptions}
                value={filters.test_level_id}
                onChange={(val) =>
                  handleFilterChange({ test_level_id: String(val) })
                }
                placeholder="Select Level"
                isLoading={classificationQuery.isLoading}
              />
            </div>

            <Button
              variant="outline"
              color="primary"
              size="md"
              shadow
              animate="scale"
              iconAnimation="rotate-360"
              startIcon={<RotateCcw size={18} />}
              onClick={resetFilters}
              className="font-bold w-full mt-auto"
              title="Reset Filters"
            >
              Reset Filters
            </Button>
          </div>
        </InlineDrawer>
      </MainCard>
    </PageContainer>
  );
}
