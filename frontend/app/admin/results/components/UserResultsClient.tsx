"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import {
  Search,
  Users,
  RefreshCcw,
  LayoutGrid,
  List,
  UserCheck,
  UserX,
} from "lucide-react";

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

import { resultsApi, type AdminUserResultListItem } from "@lib/api/results";

import { ResultCardView } from "./ResultCardView";
import { ResultTableView } from "./ResultTableView";

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

  // Column Visibility State for Table
  const availableColumns = useMemo(() => {
    const baseColumns = [
      { id: "candidate", label: "Candidate", pinned: true },
      { id: "date", label: "Interview Date" },
      { id: "paper", label: "Paper" },
      { id: "marks", label: "Marks" },
    ];

    const subjectColumns = allSubjects.map((s) => ({
      id: `subject_${s}`,
      label: s,
    }));

    const endColumns = [
      { id: "typing_wpm", label: "Typing WPM" },
      { id: "typing_acc", label: "Accuracy" },
      { id: "status", label: "Status" },
      { id: "actions", label: "Actions", pinned: true },
    ];

    return [...baseColumns, ...subjectColumns, ...endColumns];
  }, [allSubjects]);

  const DEFAULT_VISIBLE_COLUMNS = useMemo(() => {
    return [
      "candidate",
      "date",
      "paper",
      "marks",
      "typing_wpm",
      "status",
      "actions",
    ];
  }, []);

  const [visibleColumns, setVisibleColumns] = useState<string[]>([]);

  // Initialize visible columns when they change or first load
  useEffect(() => {
    if (visibleColumns.length === 0 && DEFAULT_VISIBLE_COLUMNS.length > 0) {
      setVisibleColumns(DEFAULT_VISIBLE_COLUMNS);
    }
  }, [DEFAULT_VISIBLE_COLUMNS, visibleColumns.length]);

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
        );
        setItems(data.items);
        setTotalItems(data.total);
        setTotalPages(data.total_pages);
      } catch {
        setError("Failed to fetch user results. Please try again.");
      } finally {
        if (!isRefresh) setLoading(false);
      }
    },
    [search, page, limit, startDate, endDate],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1); // Reset to page 1 on new search/date
    }, 500);
    return () => clearTimeout(timer);
  }, [search, startDate, endDate]);

  useEffect(() => {
    void fetchItems();
  }, [fetchItems]);

  const stats = useMemo(() => {
    const completed = items.filter((item) =>
      ["submitted", "auto_submitted"].includes(
        item.latest_attempt?.status || "",
      ),
    ).length;
    const active = items.filter(
      (item) => item.latest_attempt?.status === "started",
    ).length;

    return [
      {
        label: "Total Candidates (Filtered)",
        value: totalItems,
        icon: <Users size={20} />,
        color: "text-brand-primary",
        bg: "bg-brand-primary/10",
        border: "border-brand-primary/20",
        trend: "Latest records",
      },
      {
        label: "Active Attempts",
        value: active,
        icon: <UserCheck size={20} />,
        color: "text-emerald-600",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20",
        trend: "Currently started",
      },
      {
        label: "Completed Results",
        value: completed,
        icon: <UserX size={20} />,
        color: "text-amber-600",
        bg: "bg-amber-500/10",
        border: "border-amber-500/20",
        trend: "Submitted records",
      },
    ];
  }, [items, totalItems]);

  return (
    <PageContainer className="py-6 space-y-8 max-w-7xl mx-auto">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <Typography variant="h2" className="font-black tracking-tight">
            Interview Results
          </Typography>
          <Typography
            variant="body4"
            className="text-muted-foreground max-w-md"
          >
            Manage candidate performance, track interview progress, and generate
            detailed assessment reports.
          </Typography>
        </div>
      </div>

      {/* Modern Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className={`group relative overflow-hidden rounded-2xl border ${stat.border} bg-card p-5 shadow-sm transition-all hover:shadow-md hover:-translate-y-1`}
          >
            <div className="relative z-10 flex items-center gap-4">
              <div
                className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110`}
              >
                {stat.icon}
              </div>
              <div className="flex-1 min-w-0">
                <Typography
                  variant="body5"
                  className="font-bold uppercase tracking-wider text-muted-foreground/80 truncate"
                >
                  {stat.label}
                </Typography>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <Typography variant="h2" className="font-black leading-none">
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body5"
                    className="text-muted-foreground font-medium truncate"
                  >
                    {stat.trend}
                  </Typography>
                </div>
              </div>
            </div>
            <div
              className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full ${stat.bg} blur-2xl opacity-40 transition-opacity group-hover:opacity-60`}
            />
          </div>
        ))}
      </div>

      {/* Main Content & Search */}
      <MainCard
        title={
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center text-brand-primary shrink-0">
              <Users size={18} />
            </div>
            <span className="font-black tracking-tight">
              Candidates Results
            </span>
          </div>
        }
        action={
          <div className="flex items-center gap-3">
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
              <Button
                variant="action"
                size="rounded-icon"
                isActive={viewMode === "card"}
                onClick={() => setViewMode("card")}
                title="Grid View"
              >
                <LayoutGrid size={18} />
              </Button>
              <Button
                variant="action"
                size="rounded-icon"
                isActive={viewMode === "table"}
                onClick={() => setViewMode("table")}
                title="Table View"
              >
                <List size={18} />
              </Button>
            </div>

            <div className="h-6 w-px bg-border mx-1" />

            <Button
              variant="outline"
              color="primary"
              size="md"
              className="font-bold shadow-sm"
              onClick={() => void fetchItems(true)}
              startIcon={<RefreshCcw size={16} />}
            >
              Refresh
            </Button>
          </div>
        }
        bodyClassName="p-0 overflow-visible"
      >
        <div className="flex flex-col w-full">
          {/* Filters Bar */}
          <div className="p-4 border-b border-border/50 flex flex-col md:flex-row items-center justify-between gap-4 bg-muted/5">
            <div className="w-full md:w-96 relative">
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search candidates..."
                className="rounded-xl border border-border/60 bg-card shadow-sm h-11"
                startIcon={
                  <Search size={18} className="text-muted-foreground" />
                }
              />
            </div>

            <div className="flex items-center gap-3">
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
              <Badge
                variant="outline"
                color="default"
                className="font-black text-[10px] h-9 px-3 bg-card"
              >
                {totalItems} RESULTS
              </Badge>
            </div>
          </div>

          {error && (
            <Alert variant="error" description={error} className="mb-6" />
          )}

          {loading ? (
            <LoadingSkeleton />
          ) : items.length === 0 ? (
            <EmptyState search={search} onClear={() => setSearch("")} />
          ) : viewMode === "card" ? (
            <ResultCardView items={items} />
          ) : (
            <ResultTableView
              items={items}
              allSubjects={allSubjects}
              visibleColumns={visibleColumns}
            />
          )}

          {!loading && items.length > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              totalItems={totalItems}
              pageSize={limit}
              onPageChange={setPage}
              onPageSizeChange={setLimit}
            />
          )}
        </div>
      </MainCard>
    </PageContainer>
  );
}

function LoadingSkeleton() {
  return (
    <div className="p-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-44 bg-muted rounded-2xl border border-border"
          />
        ))}
      </div>
    </div>
  );
}

function EmptyState({
  search,
  onClear,
}: {
  search: string;
  onClear: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 border border-dashed border-border">
      <div className="p-4 bg-muted/20 mb-4">
        <Users size={40} className="text-muted-foreground/40" />
      </div>
      <Typography variant="h4" className="font-bold">
        No results found
      </Typography>
      <Typography
        variant="body4"
        className="text-muted-foreground mt-2 text-center max-w-sm"
      >
        We couldn&apos;t find any candidates matching &quot;{search}&quot;. Try
        searching with a different name or phone number.
      </Typography>
      {search ? (
        <Button variant="outline" size="sm" className="mt-5" onClick={onClear}>
          Clear Search
        </Button>
      ) : null}
    </div>
  );
}
