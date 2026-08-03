"use client";

import React, { useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui-elements/Table";
import {
  RefreshCw,
  Mail,
  CheckCheck,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { MainCard } from "@components/ui-cards/MainCard";
import { Button } from "@components/ui-elements/Button";
import { getUsersByRole } from "@lib/api/auth";
import { UserListResponse } from "@types";
import { Badge } from "@components/ui-elements/Badge";
import { ListingFiltersDrawer } from "@components/ui-elements/ListingFiltersDrawer";
import { Pagination } from "@components/ui-elements/Pagination";
import { cn, getTodayISODate, getYesterdayISODate } from "@lib/utils";
import { Avatar } from "@components/ui-elements/Avatar";
import { useDepartments } from "@hooks/api/departments/use-departments";
import { useClassifications } from "@hooks/api/classifications/use-classifications";
import { EmptyState } from "@components/ui-elements/EmptyState";
import { CopyableText } from "@components/ui-elements/CopyableText";
import { SimpleTableSkeleton } from "@components/ui-skeleton/SimpleTableSkeleton";
import { useListing } from "@hooks/useListing";
import { ListingTransition } from "@components/ui-elements/ListingTransition";
import { ListingHeaderActions } from "@components/ui-elements/ListingHeaderActions";
import { Tooltip } from "@components/ui-elements/Tooltip";
import { Checkbox } from "@components/ui-elements/Checkbox";
import { useSyncJob } from "@hooks/api/sync/useSyncJob";
import {
  startBatchSync,
  startAllPendingSync,
  getUnsyncedCount,
} from "@lib/api/sync";
import { SyncProgressBanner } from "./SyncProgressBanner";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@lib/toast";

interface SyncUserListingProps {
  initialData?: {
    data: UserListResponse[];
    pagination: {
      total_records: number;
      total_pages: number;
      current_page: number;
      per_page: number;
      has_next: boolean;
      has_previous: boolean;
    };
  };
}

export function SyncUserListing({ initialData }: SyncUserListingProps) {
  // Hook for standardized listing
  const {
    data: users,
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
  } = useListing<
    UserListResponse,
    {
      search: string;
      department_id: string;
      test_level_id: string;
      status: string;
      sync_status: string;
      date: { range?: { from?: string; to?: string }; label?: string } | null;
    }
  >({
    fetchFn: (params) => getUsersByRole("user", params),
    initialFilters: {
      search: "",
      department_id: "all",
      test_level_id: "all",
      status: "all",
      sync_status: "all",
      date: { label: "All Time" },
    },
    initialData: initialData?.data,
    initialTotalItems: initialData?.pagination?.total_records,
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
        department_id:
          f.department_id === "all" ? undefined : Number(f.department_id),
        test_level_id:
          f.test_level_id === "all" ? undefined : Number(f.test_level_id),
        status: f.status !== "all" ? f.status : undefined,
        is_synced:
          f.sync_status === "synced"
            ? true
            : f.sync_status === "pending"
              ? false
              : undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
      };
    },
    toastMessage: "Candidate list refreshed successfully",
  });

  const { jobStatus, beginSync, clearJob } = useSyncJob();
  const [isProgressOpen, setIsProgressOpen] = useState(false);
  const [syncingId, setSyncingId] = useState<number | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: unsyncedCountData, refetch: refetchUnsyncedCount } = useQuery({
    queryKey: ["sync-unsynced-count"],
    queryFn: getUnsyncedCount,
    refetchInterval: 60_000,
  });
  const unsyncedCount = unsyncedCountData ?? 0;

  const refreshedJobIdRef = React.useRef<string | null>(null);
  const activeToastIdRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (
      jobStatus &&
      (jobStatus.status === "COMPLETED" || jobStatus.status === "FAILED") &&
      refreshedJobIdRef.current !== jobStatus.job_id
    ) {
      refreshedJobIdRef.current = jobStatus.job_id;
      setSelectedIds(new Set());

      if (activeToastIdRef.current) {
        toast.dismiss(activeToastIdRef.current);
        activeToastIdRef.current = null;
      }

      if (jobStatus.failed_count > 0 && jobStatus.success_count === 0) {
        toast.error(
          `Sync failed for ${jobStatus.failed_count} candidate(s). Check error logs.`,
        );
      } else if (jobStatus.failed_count > 0) {
        toast.warning(
          `Sync completed: ${jobStatus.success_count} verified, ${jobStatus.failed_count} failed.`,
        );
      } else if (jobStatus.success_count > 0) {
        toast.success(
          `Successfully synced & verified ${jobStatus.success_count} candidate(s) with ArcCRM!`,
        );
      }

      void refresh();
      void refetchUnsyncedCount();
    }
  }, [jobStatus, refresh, refetchUnsyncedCount]);

  // Fetch departments and levels for filters
  const { data: allDepartments = [] } = useDepartments({ is_active: true });
  const classificationQuery = useClassifications({
    type: "exam_level",
    is_active: true,
  });
  const allLevels = classificationQuery.data?.data || [];

  // ── Selection handlers ──────────────────────────────────────────────────────

  const handleToggleSelect = useCallback((id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    const unsyncedUsers = users.filter((u) => !u.is_synced);
    if (selectedIds.size === unsyncedUsers.length && unsyncedUsers.length > 0) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(unsyncedUsers.map((u) => u.id)));
    }
  }, [users, selectedIds.size]);

  const unsyncedUsers = users.filter((u) => !u.is_synced);
  const isAllSelected =
    unsyncedUsers.length > 0 && selectedIds.size === unsyncedUsers.length;

  // ── Sync handlers ───────────────────────────────────────────────────────────

  const openProgressModal = (jobId: string, total: number) => {
    beginSync(jobId, total);
    setIsProgressOpen(true);
  };

  /** Single-row sync */
  const handleSyncSingle = async (user: UserListResponse) => {
    setSyncingId(user.id);
    try {
      const result = await startBatchSync([user.id]);
      if (activeToastIdRef.current) toast.dismiss(activeToastIdRef.current);
      activeToastIdRef.current = toast.info(
        `Syncing ${user.username} with ArcCRM...`,
      );
      openProgressModal(result.job_id, 1);
    } catch {
      toast.error("Failed to start sync for this candidate.");
    } finally {
      setSyncingId(null);
    }
  };

  /** Bulk sync — selected candidates */
  const handleSyncSelected = async () => {
    const ids = Array.from(selectedIds);
    if (!ids.length) return;
    try {
      const result = await startBatchSync(ids);
      setSelectedIds(new Set());
      if (activeToastIdRef.current) toast.dismiss(activeToastIdRef.current);
      activeToastIdRef.current = toast.info(
        `Syncing ${ids.length} selected candidate(s)...`,
      );
      openProgressModal(result.job_id, ids.length);
    } catch {
      toast.error("Failed to start batch sync.");
    }
  };

  /** Sync all unsynced candidates */
  const handleSyncAllPending = async () => {
    try {
      const result = await startAllPendingSync();
      if (activeToastIdRef.current) toast.dismiss(activeToastIdRef.current);
      activeToastIdRef.current = toast.info(
        "Syncing all pending candidates...",
      );
      openProgressModal(result.job_id, result.total_records);
    } catch {
      toast.error("Failed to start pending sync.");
    }
  };

  const handleProgressClose = () => {
    setIsProgressOpen(false);
    clearJob();
    void refresh();
    void refetchUnsyncedCount();
  };

  return (
    <>
      <MainCard
        title={
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
              <RefreshCw size={18} />
            </div>
            Sync ArcCrm
          </div>
        }
        action={
          <div className="flex items-center gap-2">
            {/* Sync All Pending */}
            {unsyncedCount > 0 && (
              <Tooltip
                content={`Sync all ${unsyncedCount} unsynced candidates`}
                side="top"
              >
                <Button
                  variant="outline"
                  color="warning"
                  size="sm"
                  startIcon={<RefreshCw size={13} />}
                  onClick={handleSyncAllPending}
                >
                  Sync All Pending
                  <span className="ml-1 inline-flex items-center justify-center rounded-full bg-brand-warning text-slate-900 text-[10px] font-bold min-w-4 h-4 px-1">
                    {unsyncedCount > 99 ? "99+" : unsyncedCount}
                  </span>
                </Button>
              </Tooltip>
            )}

            {/* Sync Selected */}
            {selectedIds.size > 0 && (
              <Button
                variant="primary"
                color="primary"
                size="sm"
                startIcon={<CheckCheck size={14} />}
                onClick={handleSyncSelected}
              >
                Sync Selected ({selectedIds.size})
              </Button>
            )}

            <ListingHeaderActions
              isLoading={loading}
              isBackgroundLoading={isBackgroundLoading}
              totalItems={totalItems}
              itemLabel="Users"
              onRefresh={refresh}
              onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
              isFilterOpen={isFilterOpen}
              activeFiltersCount={activeFiltersCount}
            />
          </div>
        }
        bodyClassName="p-0 flex flex-row items-stretch w-full"
      >
        <div
          className={cn(
            "flex-1 flex flex-col min-w-0",
            isFilterOpen && "border-r border-border/50",
          )}
        >
          {/* Inline Sync Progress Banner */}
          {isProgressOpen && (
            <SyncProgressBanner
              jobStatus={jobStatus}
              onClose={handleProgressClose}
            />
          )}

          <ListingTransition
            isLoading={loading}
            isBackgroundLoading={isBackgroundLoading}
          >
            <div className="flex-1 overflow-x-auto w-full h-full flex flex-col">
              <Table className="h-full">
                <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-border">
                  <TableRow>
                    {/* Select All Checkbox */}
                    <TableHead className="w-[52px] text-center">
                      <Checkbox
                        checked={isAllSelected}
                        onChange={handleSelectAll}
                      />
                    </TableHead>
                    <TableHead className="w-[64px] text-center font-bold text-slate-500 text-xs uppercase">
                      Sr. No.
                    </TableHead>
                    <TableHead className="font-bold text-slate-500 text-xs uppercase">
                      Candidate Profile
                    </TableHead>
                    <TableHead className="font-bold text-slate-500 text-xs uppercase">
                      Mobile
                    </TableHead>
                    <TableHead className="font-bold text-slate-500 text-xs uppercase text-center">
                      Department / Exam Level
                    </TableHead>
                    <TableHead className="text-center font-bold text-slate-500 text-xs uppercase">
                      Sync Status
                    </TableHead>
                    <TableHead className="text-center font-bold text-slate-500 text-xs uppercase">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <SimpleTableSkeleton
                      rowCount={pageSize}
                      columnCount={7}
                      columnWidths={[
                        "w-[52px] text-center py-4",
                        "w-[64px] text-center py-4",
                        "py-4",
                        "py-4",
                        "text-center py-4",
                        "py-4 text-center",
                        "py-4 text-center",
                      ]}
                    />
                  ) : users.length === 0 ? (
                    <EmptyState
                      colSpan={7}
                      variant="search"
                      title="No candidates found"
                      description="We couldn't find any candidates matching your criteria. Try adjusting your search."
                    />
                  ) : (
                    users.map((row, idx) => {
                      const isSynced = row.is_synced ?? false;
                      const isSelected = selectedIds.has(row.id);
                      return (
                        <TableRow
                          key={row.id}
                          className={cn(
                            "hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors",
                            isSelected &&
                              "bg-brand-primary/5 dark:bg-brand-primary/10",
                          )}
                        >
                          {/* Row Checkbox */}
                          <TableCell className="text-center align-middle py-3">
                            <Checkbox
                              checked={isSelected}
                              disabled={isSynced}
                              onChange={() => handleToggleSelect(row.id)}
                            />
                          </TableCell>

                          {/* Sr No */}
                          <TableCell className="font-bold text-center align-middle py-3 text-slate-500">
                            {(currentPage - 1) * pageSize + idx + 1}
                          </TableCell>

                          {/* Candidate Profile */}
                          <TableCell className="align-middle py-3">
                            <div className="flex items-center gap-3">
                              <Avatar
                                name={row.username}
                                variant="brand"
                                size="sm"
                              />
                              <div className="flex flex-col">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-slate-950 dark:text-white uppercase tracking-tight text-[13px] whitespace-nowrap">
                                    {row.username || "Unnamed"}
                                  </span>
                                  {row.is_reinterview ? (
                                    <Badge
                                      variant="outline"
                                      color="violet"
                                      animate="pulse"
                                      shape="square"
                                    >
                                      RETURNING
                                    </Badge>
                                  ) : (
                                    <Badge
                                      variant="outline"
                                      color="success"
                                      animate="pulse"
                                      shape="square"
                                    >
                                      NEW
                                    </Badge>
                                  )}
                                </div>
                                <CopyableText
                                  value={row.email || "-"}
                                  className="text-slate-500 dark:text-slate-300 font-medium italic mt-0.5"
                                  title="Copy Email"
                                >
                                  <Mail size={11} />
                                  <span className="text-[11px] truncate max-w-[150px]">
                                    {row.email || "-"}
                                  </span>
                                </CopyableText>
                              </div>
                            </div>
                          </TableCell>

                          {/* Mobile */}
                          <TableCell className="align-middle py-3">
                            <CopyableText
                              value={row.mobile || ""}
                              className="inline-flex text-[12px] font-medium tracking-tight text-slate-800 dark:text-slate-200 hover:text-brand-primary dark:hover:text-brand-primary transition-colors"
                              title="Copy Phone Number"
                            >
                              <span>{row.mobile}</span>
                            </CopyableText>
                          </TableCell>

                          {/* Department / Level */}
                          <TableCell className="align-middle py-3 text-center">
                            <div className="flex flex-col items-center gap-1">
                              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-200 uppercase tracking-tight">
                                {row.department_name ||
                                  row.assignment?.department_name ||
                                  "N/A"}
                              </span>
                              <Badge
                                color="primary"
                                shape="square"
                                variant="outline"
                              >
                                {row.assignment?.test_level_name ||
                                  row.test_level_name ||
                                  "N/A"}
                              </Badge>
                            </div>
                          </TableCell>

                          {/* Sync Status Badge */}
                          <TableCell className="align-middle py-3 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <Badge
                                variant="outline"
                                shape="square"
                                color={isSynced ? "success" : "warning"}
                              >
                                {isSynced ? "VERIFIED" : "NOT SYNCED"}
                              </Badge>
                              {!isSynced && row.last_sync_error && (
                                <Tooltip
                                  content={`Error: ${row.last_sync_error}`}
                                  side="top"
                                >
                                  <AlertCircle
                                    size={14}
                                    className="text-rose-500 shrink-0 cursor-help"
                                  />
                                </Tooltip>
                              )}
                            </div>
                          </TableCell>

                          {/* Sync Action */}
                          <TableCell className="align-middle py-3 text-center">
                            <div className="flex items-center justify-center">
                              {isSynced ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  color="success"
                                  disabled
                                  startIcon={<CheckCircle2 size={13} />}
                                >
                                  Synced
                                </Button>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  color="primary"
                                  startIcon={
                                    <RefreshCw
                                      size={12}
                                      className={
                                        syncingId === row.id
                                          ? "animate-spin"
                                          : ""
                                      }
                                    />
                                  }
                                  onClick={() => handleSyncSingle(row)}
                                  disabled={syncingId === row.id}
                                >
                                  Sync
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
            {!loading && users.length > 0 && (
              <div className="border-t border-border bg-slate-50/30 dark:bg-slate-900/30">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                  onPageSizeChange={handlePageSizeChange}
                />
              </div>
            )}
          </ListingTransition>
        </div>

        <ListingFiltersDrawer
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          registryKey="sync-arccrm-filters"
          filters={filters}
          onFilterChange={handleSingleFilterChange}
          onReset={resetFilters}
          isLoading={loading}
          dynamicOptions={{
            department_id: [
              { id: "all", label: "All Departments" },
              ...allDepartments.map((dept) => ({
                id: String(dept.id),
                label: dept.name,
              })),
            ],
            test_level_id: [
              { id: "all", label: "All Levels" },
              ...allLevels.map((lvl) => ({
                id: String(lvl.id),
                label: lvl.name,
              })),
            ],
            sync_status: [
              { id: "all", label: "All Candidates" },
              { id: "synced", label: "✅ Verified (Synced)" },
              { id: "pending", label: "🟠 Pending Sync" },
            ],
          }}
        />
      </MainCard>
    </>
  );
}
