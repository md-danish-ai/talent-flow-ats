"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import {
  Users,
  RefreshCcw,
  LayoutGrid,
  List,
  UserCheck,
  UserX,
  Filter,
  Search,
  RotateCcw,
  Trophy,
  BadgeCheck,
  Target,
} from "lucide-react";
import { cn } from "@lib/utils";

import { PageContainer } from "@components/ui-layout/PageContainer";
import { Typography } from "@components/ui-elements/Typography";
import { Input } from "@components/ui-elements/Input";
import { Badge } from "@components/ui-elements/Badge";
import { Alert } from "@components/ui-elements/Alert";
import { Button } from "@components/ui-elements/Button";
import { Pagination } from "@components/ui-elements/Pagination";
import { DateRangePicker } from "@components/ui-elements/DateRangePicker";
import { MainCard } from "@components/ui-cards/MainCard";
import { TableColumnToggle } from "@components/ui-elements/Table";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { InlineDrawer } from "@components/ui-elements/InlineDrawer";
import { Tooltip } from "@components/ui-elements/Tooltip";

import {
  resultsApi,
  type AdminUserResultListItem,
  type PaginatedUserResults,
} from "@lib/api/results";
import { EmptyState } from "@components/ui-elements/EmptyState";
import { toast } from "@lib/toast";

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

export function UserResultsClient() {
  const [items, setItems] = useState<AdminUserResultListItem[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [viewMode, setViewMode] = useState<"card" | "table">("table");

  // Filter states
  const [statusFilter, setStatusFilter] = useState("all");
  const [completionReasonFilter, setCompletionReasonFilter] = useState("all");
  const [gradeFilter, setGradeFilter] = useState("all");

  // Drawer
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Dynamic Subjects from data
  const allSubjects = useMemo(() => {
    const subjects = new Set<string>();
    items.forEach((item) => {
      item.latest_attempt?.subject_results?.forEach((s) =>
        subjects.add(s.section_name),
      );
    });
    return Array.from(subjects).sort();
  }, [items]);

  // Column Visibility
  const availableColumns = useMemo(() => {
    return [
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
    ];
  }, []);

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

  const toggleColumn = (id: string) => {
    setVisibleColumns((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchItems = useCallback(
    async (isRefresh = false) => {
      try {
        if (!isRefresh) setLoading(true);
        setError(null);
        const data = await resultsApi.getUserResults(
          search || undefined,
          page,
          limit,
          startDate || undefined,
          endDate || undefined,
          statusFilter !== "all" ? statusFilter : undefined,
          completionReasonFilter !== "all" ? completionReasonFilter : undefined,
          gradeFilter !== "all" ? gradeFilter : undefined,
        );
        setItems(data.items);
        setTotalItems(data.total);
        setTotalPages(data.total_pages);
        if (data.summary_stats) {
          setSummaryStatsData(data.summary_stats);
        }
        if (isRefresh) {
          toast.success(`${data.total} results loaded successfully.`, {
            title: "Data Refreshed",
            duration: 2500,
          });
        }
      } catch {
        setError("Failed to fetch user results. Please try again.");
      } finally {
        if (!isRefresh) setLoading(false);
      }
    },
    [
      search,
      page,
      limit,
      startDate,
      endDate,
      statusFilter,
      completionReasonFilter,
      gradeFilter,
    ],
  );

  const firstMountRef = useRef(true);

  useEffect(() => {
    if (firstMountRef.current) {
      firstMountRef.current = false;
      return;
    }
    const timer = setTimeout(() => {
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [
    search,
    startDate,
    endDate,
    statusFilter,
    completionReasonFilter,
    gradeFilter,
  ]);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  const resetAllFilters = () => {
    setSearch("");
    setStartDate("");
    setEndDate("");
    setStatusFilter("all");
    setCompletionReasonFilter("all");
    setGradeFilter("all");
    setPage(1);
  };

  const activeFilterCount = [
    search,
    startDate,
    statusFilter !== "all" ? statusFilter : "",
    completionReasonFilter !== "all" ? completionReasonFilter : "",
    gradeFilter !== "all" ? gradeFilter : "",
  ].filter(Boolean).length;

  const [summaryStatsData, setSummaryStatsData] =
    useState<PaginatedUserResults["summary_stats"]>(undefined);

  const summaryStats = useMemo(() => {
    return [
      {
        id: "total",
        label: "Total Candidates",
        value: summaryStatsData?.total || 0,
        icon: <Users size={20} />,
        color: "text-brand-primary",
        bg: "bg-brand-primary/10",
        border: "border-brand-primary/20",
        trend: "Overall batch",
        filter: { type: "reset", value: "all" },
      },
      {
        id: "active",
        label: "Active Attempts",
        value: summaryStatsData?.active || 0,
        icon: <UserCheck size={20} />,
        color: "text-emerald-600",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        trend: "Currently started",
        filter: { type: "status", value: "started" },
      },
      {
        id: "completed",
        label: "Completed Results",
        value: summaryStatsData?.completed || 0,
        icon: <BadgeCheck size={20} />,
        color: "text-amber-600",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        trend: "Submitted records",
        filter: { type: "status", value: "submitted" },
      },
    ];
  }, [summaryStatsData]);

  const gradeStats = useMemo(() => {
    return [
      {
        id: "excellent",
        label: "Excellent",
        value: summaryStatsData?.excellent || 0,
        color: "text-emerald-600",
        bg: "bg-emerald-600/10",
        border: "border-emerald-600/20",
        icon: <Trophy size={18} />,
      },
      {
        id: "good",
        label: "Good Performance",
        value: summaryStatsData?.good || 0,
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20",
        icon: <BadgeCheck size={18} />,
      },
      {
        id: "average",
        label: "Average Results",
        value: summaryStatsData?.average || 0,
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        icon: <Target size={18} />,
      },
      {
        id: "poor",
        label: "Poor Performance",
        value: summaryStatsData?.poor || 0,
        color: "text-rose-500",
        bg: "bg-rose-500/10",
        border: "border-rose-500/20",
        icon: <UserX size={18} />,
      },
    ];
  }, [summaryStatsData]);

  const handleStatClick = (filterObj: { type: string; value: string }) => {
    if (filterObj.type === "reset") {
      resetAllFilters();
    } else if (filterObj.type === "status") {
      setStatusFilter(filterObj.value);
      setGradeFilter("all");
    } else if (filterObj.type === "grade") {
      setGradeFilter(filterObj.value);
      setStatusFilter("all");
    }
    setPage(1);
    setIsFilterOpen(false);
  };

  return (
    <PageContainer className="py-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <Typography variant="h2" className="font-black tracking-tight">
            Interview Results
          </Typography>
        </div>
      </div>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {summaryStats.map((stat, idx) => (
          <div
            key={idx}
            onClick={() => handleStatClick(stat.filter)}
            className={cn(
              "group relative overflow-hidden rounded-2xl border bg-card p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer",
              stat.border,
              statusFilter === stat.filter.value &&
                "ring-2 ring-brand-primary ring-offset-2 dark:ring-offset-slate-900",
            )}
          >
            <div className="relative z-10 flex items-center gap-4">
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                  stat.bg,
                  stat.color,
                )}
              >
                {stat.icon}
              </div>
              <div className="flex-1 min-w-0">
                <Typography
                  variant="body5"
                  className="font-extrabold uppercase tracking-widest text-muted-foreground/80 truncate"
                >
                  {stat.label}
                </Typography>
                <div className="flex items-baseline gap-2 mt-0.5">
                  {loading ? (
                    <div className="h-8 w-16 bg-muted animate-pulse rounded mt-1" />
                  ) : (
                    <>
                      <Typography
                        variant="h2"
                        className="font-black leading-none"
                      >
                        {stat.value}
                      </Typography>
                      <Typography
                        variant="body5"
                        className="text-muted-foreground font-medium truncate"
                      >
                        {stat.trend}
                      </Typography>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div
              className={cn(
                "absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-40 transition-opacity group-hover:opacity-60",
                stat.bg,
              )}
            />
          </div>
        ))}
      </div>

      {/* Grade Quick Filters Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {gradeStats.map((stat, idx) => {
          const gradeValue =
            stat.id === "excellent"
              ? "Excellent"
              : stat.id === "good"
                ? "Good"
                : stat.id === "average"
                  ? "Average"
                  : "Poor";
          return (
            <div
              key={idx}
              onClick={() =>
                handleStatClick({ type: "grade", value: gradeValue })
              }
              className={cn(
                "group relative flex items-center gap-4 p-4 rounded-xl border bg-card/50 transition-all hover:-translate-y-1 cursor-pointer hover:shadow-sm",
                stat.border,
                gradeFilter === gradeValue &&
                  "ring-2 ring-brand-primary ring-offset-2 dark:ring-offset-slate-900 bg-card",
              )}
            >
              <div
                className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center shrink-0",
                  stat.bg,
                  stat.color,
                )}
              >
                {stat.icon}
              </div>
              <div>
                <Typography
                  variant="body5"
                  className="font-bold uppercase tracking-widest text-muted-foreground/60 text-[9px] truncate"
                >
                  {stat.label}
                </Typography>
                {loading ? (
                  <div className="h-6 w-10 bg-muted animate-pulse rounded mt-1" />
                ) : (
                  <Typography
                    variant="h3"
                    className="font-black leading-none mt-1"
                  >
                    {stat.value}
                  </Typography>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Content — MCQ-style layout */}
      <MainCard
        title={
          <>
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-brand-primary shrink-0">
              <Users size={18} />
            </div>
            Candidates Results
          </>
        }
        className="mb-6 flex flex-col"
        bodyClassName="p-0 flex flex-row items-stretch w-full"
        action={
          <div className="flex items-center gap-3">
            {/* Results count badge */}
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

            {/* All 4 icon buttons — same style, grouped */}
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
                  onClick={() => void fetchItems(true)}
                >
                  <RefreshCcw size={18} />
                </Button>
              </Tooltip>
              <Tooltip
                content={
                  activeFilterCount > 0
                    ? `Filters (${activeFilterCount} active)`
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
                  {activeFilterCount > 0 ? (
                    <span className="relative">
                      <Filter size={18} />
                      <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-brand-primary text-white text-[8px] font-black flex items-center justify-center leading-none">
                        {activeFilterCount}
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
        {/* Table column — sits next to InlineDrawer */}
        <div
          className={cn(
            "flex-1 w-full flex flex-col min-w-0 overflow-hidden relative",
            isFilterOpen && "border-r border-border",
          )}
        >
          {error && (
            <Alert variant="error" description={error} className="m-4" />
          )}

          <div className="flex-1 overflow-x-auto w-full min-h-0">
            {viewMode === "card" ? (
              loading ? (
                <ResultCardSkeleton rowCount={limit} />
              ) : items.length === 0 ? (
                <EmptyState
                  variant="search"
                  title="No results found"
                  description={`We couldn't find any candidates matching your criteria${search ? ` for "${search}"` : ""}. Try adjusting your search or filters.`}
                />
              ) : (
                <ResultCardView items={items} />
              )
            ) : (
              <ResultTableView
                items={items}
                allSubjects={allSubjects}
                visibleColumns={visibleColumns}
                isLoading={loading}
                limit={limit}
              />
            )}
          </div>

          {!loading && items.length > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={limit}
              onPageChange={setPage}
              onPageSizeChange={setLimit}
              className="mt-auto shrink-0"
            />
          )}
        </div>

        {/* Filter Drawer — renders inside MainCard body, exactly like MCQFilters */}
        <InlineDrawer
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          title="Filters"
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-40">
            {/* Search */}
            <div className="space-y-3">
              <Typography
                variant="body5"
                weight="bold"
                className="uppercase tracking-widest text-muted-foreground"
              >
                Search Candidates
              </Typography>
              <div className="relative group">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-brand-primary transition-colors"
                  size={18}
                />
                <Input
                  placeholder="Search by name, mobile..."
                  className="pl-11 h-12 border-border/60 hover:border-border focus:border-brand-primary transition-all bg-muted/20"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Date Range */}
            <div className="space-y-3">
              <Typography
                variant="body5"
                weight="bold"
                className="uppercase tracking-widest text-muted-foreground"
              >
                Date Range
              </Typography>
              <DateRangePicker
                onRangeChange={(range) => {
                  if (range) {
                    setStartDate(range.from);
                    setEndDate(range.to);
                  } else {
                    setStartDate("");
                    setEndDate("");
                  }
                }}
                initialLabel="All Time"
              />
            </div>

            {/* Status */}
            <div className="space-y-3">
              <Typography
                variant="body5"
                weight="bold"
                className="uppercase tracking-widest text-muted-foreground"
              >
                Attempt Status
              </Typography>
              <SelectDropdown
                options={STATUS_OPTIONS}
                value={statusFilter}
                onChange={(val) => {
                  setStatusFilter(val as string);
                  setPage(1);
                }}
                placeholder="All Statuses"
                className="h-12 border-border/60 hover:border-border bg-muted/20"
              />
            </div>

            {/* Completion Reason */}
            <div className="space-y-3">
              <Typography
                variant="body5"
                weight="bold"
                className="uppercase tracking-widest text-muted-foreground"
              >
                Completion Reason
              </Typography>
              <SelectDropdown
                options={COMPLETION_REASON_OPTIONS}
                value={completionReasonFilter}
                onChange={(val) => {
                  setCompletionReasonFilter(val as string);
                  setPage(1);
                }}
                placeholder="All Reasons"
                className="h-12 border-border/60 hover:border-border bg-muted/20"
              />
            </div>

            {/* Overall Grade */}
            <div className="space-y-3">
              <Typography
                variant="body5"
                weight="bold"
                className="uppercase tracking-widest text-muted-foreground"
              >
                Overall Grade
              </Typography>
              <SelectDropdown
                options={GRADE_OPTIONS}
                value={gradeFilter}
                onChange={(val) => {
                  setGradeFilter(val as string);
                  setPage(1);
                }}
                placeholder="All Grades"
                className="h-12 border-border/60 hover:border-border bg-muted/20"
                placement="top"
              />
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                color="primary"
                size="md"
                shadow
                animate="scale"
                iconAnimation="rotate-360"
                startIcon={<RotateCcw size={18} />}
                onClick={resetAllFilters}
                className="font-bold w-full"
                title="Reset Filters"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </InlineDrawer>
      </MainCard>
    </PageContainer>
  );
}
