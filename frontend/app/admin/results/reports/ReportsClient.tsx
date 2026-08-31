"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { FileText } from "lucide-react";
import { cn, getTodayISODate, getYesterdayISODate } from "@lib/utils";

import { PageContainer } from "@components/ui-layout/PageContainer";
import { Pagination } from "@components/ui-elements/Pagination";
import { MainCard } from "@components/ui-cards/MainCard";
import { TableColumnToggle } from "@components/ui-elements/Table";
import { ListingFiltersDrawer } from "@components/ui-elements/ListingFiltersDrawer";
import { ListingTransition } from "@components/ui-elements/ListingTransition";
import {
  ListingBadge,
  ListingIcons,
} from "@components/ui-elements/ListingHeaderActions";

import {
  reportsApi,
  managementApi,
  departmentsApi,
  classificationsApi,
} from "@lib/api";
import {
  type ReportUserListItem,
  type PaginatedReportUsers,
  type FilterOption,
  type UserListResponse,
} from "@types";
import { useListing } from "@hooks/useListing";
import { ResultTableView } from "../components/ResultTableView";

type ResultsFilters = {
  search: string;
  date: { range?: { from?: string; to?: string }; label?: string } | null;
  status: string;
  completionReason: string;
  overallGrade: string;
  project_lead_id: string;
  department_id: string;
  test_level_id: string;
};

export function ReportsClient() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const searchParams = useSearchParams();

  // Column Visibility
  const availableColumns = useMemo(
    () => [
      { id: "candidate", label: "Candidate", pinned: true },
      { id: "department", label: "Department" },
      { id: "test_level", label: "Exam Level" },
      { id: "paper", label: "Assigned Paper" },
      { id: "attempts", label: "Attempts" },
      { id: "grade", label: "Grade" },
      { id: "typing_wpm", label: "Typing WPM" },
      { id: "typing_acc", label: "Accuracy" },
      { id: "status", label: "Interview Progress" },
      { id: "project_lead", label: "Project Lead" },
      { id: "date", label: "Interview Date" },
      { id: "actions", label: "Actions", pinned: true },
    ],
    [],
  );

  const DEFAULT_VISIBLE_COLUMNS = [
    "candidate",
    "department",
    "grade",
    "status",
    "project_lead",
    "date",
    "actions",
  ];
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    DEFAULT_VISIBLE_COLUMNS,
  );

  const [leadsOptions, setLeadsOptions] = useState<FilterOption[]>([]);
  const [departmentOptions, setDepartmentOptions] = useState<FilterOption[]>(
    [],
  );
  const [levelOptions, setLevelOptions] = useState<FilterOption[]>([]);

  useEffect(() => {
    managementApi.getProjectLeads({ limit: 100 }).then((res) => {
      const options = (res.data || []).map((l: UserListResponse) => ({
        id: l.id.toString(),
        label: l.username,
      }));
      setLeadsOptions([{ id: "all", label: "All Leads" }, ...options]);
    });

    departmentsApi.getDepartments({ limit: 100 }).then((res) => {
      const options = (res.data || []).map(
        (d: { id: number; name: string }) => ({
          id: d.id.toString(),
          label: d.name,
        }),
      );
      setDepartmentOptions([
        { id: "all", label: "All Departments" },
        ...options,
      ]);
    });

    classificationsApi
      .getClassifications({ type: "exam_level", is_active: true, limit: 100 })
      .then((res) => {
        const options = (res.data || []).map(
          (c: { id: number; name: string; code?: string }) => ({
            id: c.id.toString(),
            label: c.name || c.code || `Level ${c.id}`,
          }),
        );
        setLevelOptions([{ id: "all", label: "All Levels" }, ...options]);
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
  } = useListing<ReportUserListItem, ResultsFilters, PaginatedReportUsers>({
    fetchFn: reportsApi.getAllReports,
    initialFilters: {
      search: "",
      date: { label: "Today" },
      status: "all",
      completionReason: "all",
      overallGrade: "all",
      project_lead_id: "all",
      department_id: "all",
      test_level_id: "all",
    },
    filterMapping: (f) => {
      let dateFrom = f.date?.range?.from;
      let dateTo = f.date?.range?.to;

      if (!dateFrom && !dateTo) {
        if (
          f.date?.label === "Today" ||
          (!f.date?.label && !searchParams.get("startDate"))
        ) {
          dateFrom = getTodayISODate();
          dateTo = getTodayISODate();
        } else if (f.date?.label === "Yesterday") {
          dateFrom = getYesterdayISODate();
          dateTo = getYesterdayISODate();
        } else {
          dateFrom = searchParams.get("startDate") || undefined;
          dateTo = searchParams.get("endDate") || undefined;
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
        department_id: f.department_id !== "all" ? f.department_id : undefined,
        test_level_id: f.test_level_id !== "all" ? f.test_level_id : undefined,
      };
    },
    toastMessage: "Reports refreshed successfully.",
  });

  const toggleColumn = (id: string) => {
    setVisibleColumns((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  return (
    <PageContainer className="space-y-4">
      <MainCard
        icon={<FileText size={18} />}
        title="Result Reports"
        subtitle="View candidate results and download individual test evaluation reports."
        className="mb-6 flex flex-col"
        bodyClassName="p-0 flex flex-row items-stretch w-full"
        action={
          <div className="flex items-center gap-3">
            <ListingBadge
              isLoading={loading}
              isBackgroundLoading={isBackgroundLoading}
              totalItems={totalItems}
              itemLabel="Reports"
            />

            <div className="h-6 w-px bg-border/50 mx-1" />
            <TableColumnToggle
              columns={availableColumns}
              visibleColumns={visibleColumns}
              onToggle={toggleColumn}
              onReset={() => setVisibleColumns(DEFAULT_VISIBLE_COLUMNS)}
            />
            <div className="h-6 w-px bg-border/50 mx-1" />

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
              <ResultTableView
                items={items}
                visibleColumns={visibleColumns}
                isLoading={loading}
                limit={pageSize}
                currentPage={currentPage}
                pageSize={pageSize}
                onRefresh={refresh}
                onlyDownloadAction={true}
              />
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
          registryKey="reports-results-filters"
          filters={filters}
          onFilterChange={handleSingleFilterChange}
          onReset={resetFilters}
          isLoading={loading}
          dynamicOptions={{
            project_lead_id: leadsOptions,
            department_id: departmentOptions,
            test_level_id: levelOptions,
          }}
        />
      </MainCard>
    </PageContainer>
  );
}
