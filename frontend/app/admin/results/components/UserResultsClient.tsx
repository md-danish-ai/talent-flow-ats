"use client";

import { useEffect, useMemo, useState } from "react";
import { Users, HelpCircle, LayoutGrid, List } from "lucide-react";
import { cn, getTodayISODate, getYesterdayISODate } from "@lib/utils";

import { PageContainer } from "@components/ui-layout/PageContainer";
import { Button } from "@components/ui-elements/Button";
import { Pagination } from "@components/ui-elements/Pagination";
import { MainCard } from "@components/ui-cards/MainCard";
import { TableColumnToggle } from "@components/ui-elements/Table";
import { ListingFiltersDrawer } from "@components/ui-elements/ListingFiltersDrawer";
import { Tooltip } from "@components/ui-elements/Tooltip";
import { EmptyState } from "@components/ui-elements/EmptyState";
import { ListingTransition } from "@components/ui-elements/ListingTransition";
import {
  ListingBadge,
  ListingIcons,
} from "@components/ui-elements/ListingHeaderActions";

import { resultsApi, managementApi } from "@lib/api";
import {
  type AdminUserResultListItem,
  type PaginatedUserResults,
  type FilterOption,
  type UserListResponse,
} from "@types";
import { useListing } from "@hooks/useListing";

import { ResultCardView } from "./ResultCardView";
import { ResultTableView } from "./ResultTableView";
import { ResultCardSkeleton } from "@components/ui-skeleton/ResultCardSkeleton";

type ResultsFilters = {
  search: string;
  date: { range?: { from?: string; to?: string }; label?: string } | null;
  status: string;
  completionReason: string;
  overallGrade: string;
  project_lead_id: string;
};

import { ResultStatusLegend } from "@components/ui-elements/ResultStatusLegend";

export function UserResultsClient() {
  const [viewMode, setViewMode] = useState<"card" | "table">("table");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Column Visibility
  const availableColumns = useMemo(
    () => [
      { id: "candidate", label: "Candidate", pinned: true },
      { id: "paper", label: "Assigned Paper" },
      { id: "attempts", label: "Attempts" },
      { id: "marks", label: "Score" },
      { id: "grade", label: "Grade" },
      { id: "typing_wpm", label: "Typing WPM" },
      { id: "typing_acc", label: "Accuracy" },
      { id: "status", label: "Status" },
      { id: "project_lead", label: "Project Lead" },
      { id: "date", label: "Interview Date" },
      { id: "actions", label: "Actions", pinned: true },
    ],
    [],
  );

  const DEFAULT_VISIBLE_COLUMNS = [
    "candidate",
    "paper",
    "marks",
    "grade",
    "status",
    "project_lead",
    "actions",
  ];
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    DEFAULT_VISIBLE_COLUMNS,
  );

  const [leadsOptions, setLeadsOptions] = useState<FilterOption[]>([]);

  useEffect(() => {
    managementApi.getProjectLeads({ limit: 100 }).then((res) => {
      const options = (res.data || []).map((l: UserListResponse) => ({
        id: l.id.toString(),
        label: l.username,
      }));
      setLeadsOptions([{ id: "all", label: "All Leads" }, ...options]);
    });
  }, []);

  const {
    data: items,
    isLoading: loading,
    isBackgroundLoading,
    totalItems,
    totalPages,
    currentPage,
    pageSize,
    filters,
    activeFiltersCount,
    handleSingleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    resetFilters,
    refresh,
  } = useListing<AdminUserResultListItem, ResultsFilters, PaginatedUserResults>(
    {
      fetchFn: resultsApi.getUserResults,
      initialFilters: {
        search: "",
        date: { label: "All Time" },
        status: "all",
        completionReason: "all",
        overallGrade: "all",
        project_lead_id: "all",
      },
      filterMapping: (f) => {
        let dateFrom = f.date?.range?.from;
        let dateTo = f.date?.range?.to;

        if (!dateFrom && !dateTo) {
          if (f.date?.label === "Today") {
            dateFrom = getTodayISODate();
            dateTo = getTodayISODate();
          } else if (f.date?.label === "Yesterday") {
            dateFrom = getYesterdayISODate();
            dateTo = getYesterdayISODate();
          }
        }

        return {
          search: f.search || undefined,
          startDate: dateFrom || undefined,
          endDate: dateTo || undefined,
          status: f.status !== "all" ? f.status : undefined,
          completionReason:
            f.completionReason !== "all" ? f.completionReason : undefined,
          overallGrade: f.overallGrade !== "all" ? f.overallGrade : undefined,
          project_lead_id:
            f.project_lead_id !== "all" ? f.project_lead_id : undefined,
        };
      },
      toastMessage: "Results refreshed successfully.",
    },
  );

  const toggleColumn = (id: string) => {
    setVisibleColumns((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  return (
    <PageContainer className="space-y-4">
      <ResultStatusLegend
        title="Round 1 Results"
        subtitle="Detailed interview results and performance metrics for all candidates."
      />
      <MainCard
        title={
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
              <Users size={18} />
            </div>
            <span>Round 1 Results</span>
          </div>
        }
        className="mb-6 flex flex-col"
        bodyClassName="p-0 flex flex-row items-stretch w-full"
        action={
          <div className="flex items-center gap-3">
            <ListingBadge
              isLoading={loading}
              isBackgroundLoading={isBackgroundLoading}
              totalItems={totalItems}
              itemLabel="Results"
            />

            {viewMode === "table" && (
              <>
                <div className="h-6 w-px bg-border/50 mx-1" />
                <TableColumnToggle
                  columns={availableColumns}
                  visibleColumns={visibleColumns}
                  onToggle={toggleColumn}
                  onReset={() => setVisibleColumns(DEFAULT_VISIBLE_COLUMNS)}
                />
                <div className="h-6 w-px bg-border/50 mx-1" />
              </>
            )}

            <div className="flex items-center gap-2">
              <Tooltip content="Switch to Card View" side="bottom">
                <Button
                  variant="action"
                  size="rounded-icon"
                  isActive={viewMode === "card"}
                  animate="scale"
                  onClick={() => setViewMode("card")}
                >
                  <LayoutGrid size={18} />
                </Button>
              </Tooltip>
              <Tooltip content="Switch to Table View" side="bottom">
                <Button
                  variant="action"
                  size="rounded-icon"
                  isActive={viewMode === "table"}
                  animate="scale"
                  onClick={() => setViewMode("table")}
                >
                  <List size={18} />
                </Button>
              </Tooltip>
            </div>

            <ListingIcons
              isLoading={loading}
              isBackgroundLoading={isBackgroundLoading}
              onRefresh={refresh}
              onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
              isFilterOpen={isFilterOpen}
              activeFiltersCount={activeFiltersCount}
            />
          </div>
        }
      >
        <div
          className={cn(
            "flex-1 w-full flex flex-col min-w-0 overflow-hidden relative",
            isFilterOpen && "border-r border-border/50",
          )}
        >
          <ListingTransition
            isLoading={loading}
            isBackgroundLoading={isBackgroundLoading}
          >
            <div className="flex-1 overflow-x-auto w-full min-h-0">
              {viewMode === "card" ? (
                loading ? (
                  <ResultCardSkeleton rowCount={pageSize} />
                ) : items.length === 0 ? (
                  <EmptyState
                    variant="search"
                    title="No results found"
                    description={`We couldn't find any candidates matching your criteria. Try adjusting your search or filters.`}
                  />
                ) : (
                  <ResultCardView items={items} />
                )
              ) : (
                <ResultTableView
                  items={items}
                  visibleColumns={visibleColumns}
                  isLoading={loading}
                  limit={pageSize}
                  onRefresh={refresh}
                />
              )}
            </div>

            {!loading && items.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={pageSize}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                className="mt-auto shrink-0 border-t"
              />
            )}
          </ListingTransition>
        </div>

        <ListingFiltersDrawer
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          registryKey="results-filters"
          filters={filters}
          onFilterChange={handleSingleFilterChange}
          onReset={resetFilters}
          isLoading={loading}
          dynamicOptions={{
            project_lead_id: leadsOptions,
          }}
        />
      </MainCard>
    </PageContainer>
  );
}
