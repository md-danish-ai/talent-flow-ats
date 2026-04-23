"use client";

import { useMemo, useState } from "react";
import {
  Users,
  RefreshCcw,
  LayoutGrid,
  List,
  UserCheck,
  UserX,
  Filter,
  RotateCcw,
  Trophy,
  BadgeCheck,
  Target,
} from "lucide-react";
import { cn } from "@lib/utils";
import { motion } from "framer-motion";

import { PageContainer } from "@components/ui-layout/PageContainer";
import { Typography } from "@components/ui-elements/Typography";
import { SearchInput } from "@components/ui-elements/SearchInput";
import { Badge } from "@components/ui-elements/Badge";
import { Button } from "@components/ui-elements/Button";
import { Pagination } from "@components/ui-elements/Pagination";
import { DateRangePicker } from "@components/ui-elements/DateRangePicker";
import { MainCard } from "@components/ui-cards/MainCard";
import { TableColumnToggle } from "@components/ui-elements/Table";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { ListingFiltersDrawer } from "@components/ui-elements/ListingFiltersDrawer";
import { Tooltip } from "@components/ui-elements/Tooltip";
import { StatCard } from "@components/ui-cards/StatCard";
import { InsightCard } from "@components/ui-cards/InsightCard";

import { resultsApi } from "@lib/api/results";
import {
  type AdminUserResultListItem,
  type PaginatedUserResults,
} from "@types";
import { EmptyState } from "@components/ui-elements/EmptyState";
import { useListing } from "@hooks/useListing";

import { ResultCardView } from "./ResultCardView";
import { ResultTableView } from "./ResultTableView";
import { ResultCardSkeleton } from "@components/ui-skeleton/ResultCardSkeleton";

// ── Static filter option sets ──────────────────────────────────────────
const STATUS_OPTIONS = [
  { id: "all", label: "All Statuses" },
  { id: "started", label: "Started" },
  { id: "submitted", label: "Submitted (Manual)" },
  { id: "auto_submitted", label: "Auto Submitted" },
];

const COMPLETION_REASON_OPTIONS = [
  { id: "all", label: "All Reasons" },
  { id: "manual", label: "Manual" },
  { id: "time_over", label: "Time Over" },
];

const GRADE_OPTIONS = [
  { id: "all", label: "All Grades" },
  { id: "Excellent", label: "Excellent" },
  { id: "Good", label: "Good" },
  { id: "Average", label: "Average" },
  { id: "Poor", label: "Poor" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
} as const;

const itemVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
} as const;

type ResultsFilters = {
  search: string;
  startDate: string;
  endDate: string;
  status: string;
  completionReason: string;
  overallGrade: string;
};

export function UserResultsClient() {
  const [viewMode, setViewMode] = useState<"card" | "table">("table");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [summaryStatsData, setSummaryStatsData] =
    useState<PaginatedUserResults["summary_stats"]>(undefined);

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
      { id: "date", label: "Interview Date" },
      { id: "actions", label: "Actions", pinned: true },
    ],
    [],
  );

  const DEFAULT_VISIBLE_COLUMNS = [
    "candidate",
    "paper",
    "attempts",
    "marks",
    "grade",
    "typing_wpm",
    "status",
    "date",
    "actions",
  ];
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    DEFAULT_VISIBLE_COLUMNS,
  );

  const {
    data: items,
    isLoading: loading,
    totalItems,
    totalPages,
    currentPage,
    pageSize,
    filters,
    activeFiltersCount,
    handleFilterChange,
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
        startDate: "",
        endDate: "",
        status: "all",
        completionReason: "all",
        overallGrade: "all",
      },
      filterMapping: (f) => ({
        search: f.search || undefined,
        startDate: f.startDate || undefined,
        endDate: f.endDate || undefined,
        status: f.status !== "all" ? f.status : undefined,
        completionReason:
          f.completionReason !== "all" ? f.completionReason : undefined,
        overallGrade: f.overallGrade !== "all" ? f.overallGrade : undefined,
      }),
      onSuccess: (res) => {
        if (res.summary_stats) setSummaryStatsData(res.summary_stats);
      },
      toastMessage: "Results refreshed successfully.",
    },
  );

  const toggleColumn = (id: string) => {
    setVisibleColumns((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const summaryStats = useMemo(
    () => [
      {
        id: "total",
        label: "Total Candidates",
        value: summaryStatsData?.total || 0,
        icon: <Users />,
        color: "text-brand-primary",
        bg: "bg-brand-primary/10",
        filter: { type: "reset", value: "all" },
      },
      {
        id: "active",
        label: "Active Attempts",
        value: summaryStatsData?.active || 0,
        icon: <UserCheck size={20} />,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        filter: { type: "status", value: "started" },
      },
      {
        id: "completed",
        label: "Completed Results",
        value: summaryStatsData?.completed || 0,
        icon: <BadgeCheck size={20} />,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        filter: { type: "status", value: "submitted" },
      },
    ],
    [summaryStatsData],
  );

  const gradeStats = useMemo(
    () => [
      {
        id: "excellent",
        label: "Excellent",
        value: summaryStatsData?.excellent || 0,
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        icon: <Trophy />,
      },
      {
        id: "good",
        label: "Good",
        value: summaryStatsData?.good || 0,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        icon: <BadgeCheck />,
      },
      {
        id: "average",
        label: "Average",
        value: summaryStatsData?.average || 0,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        icon: <Target />,
      },
      {
        id: "poor",
        label: "Poor",
        value: summaryStatsData?.poor || 0,
        color: "text-rose-500",
        bg: "bg-rose-500/10",
        border: "border-rose-500/20",
        icon: <UserX />,
      },
    ],
    [summaryStatsData],
  );

  const handleStatClick = (filterObj: { type: string; value: string }) => {
    if (filterObj.type === "reset") {
      resetFilters();
    } else if (filterObj.type === "status") {
      handleFilterChange({ status: filterObj.value, overallGrade: "all" });
    } else if (filterObj.type === "grade") {
      handleFilterChange({ overallGrade: filterObj.value, status: "all" });
    }
    setIsFilterOpen(false);
  };

  return (
    <PageContainer className="space-y-8 max-w-7xl mx-auto">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        {summaryStats.map((stat) => (
          <motion.div key={stat.id} variants={itemVariants}>
            <StatCard
              label={stat.label}
              value={stat.value.toLocaleString()}
              icon={stat.icon}
              color={stat.color}
              bgColor={stat.bg}
              isLoading={loading}
              onClick={() => handleStatClick(stat.filter)}
            />
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {gradeStats.map((stat) => {
          const gradeValue = stat.label;
          return (
            <motion.div key={stat.id} variants={itemVariants}>
              <InsightCard
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
                color={stat.color}
                bgColor={stat.bg}
                borderColor={stat.border}
                isLoading={loading}
                onClick={() =>
                  handleStatClick({ type: "grade", value: gradeValue })
                }
              />
            </motion.div>
          );
        })}
      </motion.div>

      <MainCard
        title={
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
              <Users size={18} />
            </div>
            Candidates Results
          </div>
        }
        className="mb-6 flex flex-col"
        bodyClassName="p-0 flex flex-row items-stretch w-full"
        action={
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="h-9 w-24 bg-muted animate-pulse rounded-full" />
            ) : (
              <Badge
                variant="outline"
                color="default"
                className="font-black text-[10px] h-9 px-3 bg-card"
              >
                {totalItems} RESULTS
              </Badge>
            )}

            {viewMode === "table" && (
              <>
                <div className="h-6 w-px bg-border mx-1" />
                <TableColumnToggle
                  columns={availableColumns}
                  visibleColumns={visibleColumns}
                  onToggle={toggleColumn}
                  onReset={() => setVisibleColumns(DEFAULT_VISIBLE_COLUMNS)}
                />
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
              <div className="h-6 w-px bg-border mx-1" />
              <Tooltip content="Refresh Data" side="bottom">
                <Button
                  variant="action"
                  size="rounded-icon"
                  animate="scale"
                  onClick={refresh}
                  disabled={loading}
                >
                  <div className={cn(loading && "animate-spin")}>
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
                      <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-brand-primary text-white text-[8px] font-black flex items-center justify-center leading-none border border-card">
                        {activeFiltersCount}
                      </span>
                    </span>
                  ) : (
                    <Filter size={18} />
                  )}
                </Button>
              </Tooltip>
            </div>
          </div>
        }
      >
        <div
          className={cn(
            "flex-1 w-full flex flex-col min-w-0 overflow-hidden relative",
            isFilterOpen && "border-r border-border/50",
          )}
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
        </div>

        <ListingFiltersDrawer
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          registryKey="results-filters"
          filters={filters}
          onFilterChange={(key, val) => {
            if (key === "date") {
              const dateVal = val as { range?: { from: string; to: string } };
              handleFilterChange({
                startDate: dateVal?.range?.from || "",
                endDate: dateVal?.range?.to || "",
              });
            } else {
              handleSingleFilterChange(key, val);
            }
          }}
          onReset={resetFilters}
          isLoading={loading}
        />
      </MainCard>
    </PageContainer>
  );
}
