"use client";

import { useState } from "react";
import { cn, getTodayISODate, getYesterdayISODate } from "@lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui-elements/Table";
import { ResetUserListingSkeleton } from "@components/ui-skeleton/ResetUserListingSkeleton";
import { MainCard } from "@components/ui-cards/MainCard";
import { getUsersByRole } from "@lib/api/auth";
import { UserListResponse, PaginatedResponse } from "@types";
import { Pagination } from "@components/ui-elements/Pagination";
import { TableIconButton } from "@components/ui-elements/TableIconButton";
import { ResetConfirmModal } from "./ResetConfirmModal";
import { ResetDetailsModal } from "./ResetDetailsModal";
import { ReInterviewModal } from "./ReInterviewModal";
import { ResetSubjectsModal } from "./ResetSubjectsModal";
import { Badge } from "@components/ui-elements/Badge";
import { ListingFiltersDrawer } from "@components/ui-elements/ListingFiltersDrawer";
import { Avatar } from "@components/ui-elements/Avatar";
import { useDepartments } from "@hooks/api/departments/use-departments";
import { useClassifications } from "@hooks/api/classifications/use-classifications";
import { EmptyState } from "@components/ui-elements/EmptyState";
import { CopyableText } from "@components/ui-elements/CopyableText";
import {
  RefreshCw,
  FileEdit,
  RotateCcw,
  BookOpenCheck,
  Mail,
} from "lucide-react";

import { useListing } from "@hooks/useListing";
import { ListingTransition } from "@components/ui-elements/ListingTransition";
import { ListingHeaderActions } from "@components/ui-elements/ListingHeaderActions";

interface ResetUserListingProps {
  initialData?: PaginatedResponse<UserListResponse>;
}

type UserListingFilters = {
  search: string;
  department: string;
  level: string;
  status: string;
  date: { range?: { from?: string; to?: string }; label?: string } | null;
};

export function ResetUserListing({ initialData }: ResetUserListingProps) {
  const [selectedUser, setSelectedUser] = useState<UserListResponse | null>(
    null,
  );
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isReInterviewModalOpen, setIsReInterviewModalOpen] = useState(false);
  const [isResetSubjectsModalOpen, setIsResetSubjectsModalOpen] =
    useState(false);

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
  } = useListing<UserListResponse, UserListingFilters>({
    fetchFn: (params) => getUsersByRole("user", params),
    initialFilters: {
      search: "",
      department: "all",
      level: "all",
      status: "all",
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
        department_name: f.department !== "all" ? f.department : undefined,
        test_level_name: f.level !== "all" ? f.level : undefined,
        status: f.status !== "all" ? f.status : undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
      };
    },
    toastMessage: "Candidate list refreshed successfully",
  });

  const { data: allDepartments = [] } = useDepartments({ is_active: true });
  const classificationQuery = useClassifications({
    type: "exam_level",
    is_active: true,
  });
  const allLevels = classificationQuery.data?.data || [];

  return (
    <>
      <MainCard
        title={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-600 shrink-0">
              <RefreshCw size={22} className="animate-spin-slow" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">
                All Candidates
              </h2>
              <p className="text-[11px] text-muted-foreground dark:text-slate-300 -mt-1 font-medium italic">
                Registered candidates listed from newest to oldest
              </p>
            </div>
          </div>
        }
        className="mb-6 flex flex-col overflow-hidden"
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
            activeFiltersCount={activeFiltersCount}
          />
        }
      >
        <div
          className={cn(
            "flex-1 flex flex-col min-w-0",
            isFilterOpen && "border-r border-border/50",
          )}
        >
          <div className="flex-1 w-full flex flex-col min-w-0 overflow-hidden relative">
            <ListingTransition
              isLoading={loading}
              isBackgroundLoading={isBackgroundLoading}
            >
              <div className="flex-1 overflow-x-auto w-full">
                <Table>
                  <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-border">
                    <TableRow>
                      <TableHead className="w-[80px] text-center font-bold text-slate-500 text-xs uppercase tracking-wider">
                        Sr. No.
                      </TableHead>
                      <TableHead className="font-bold text-slate-500 text-xs uppercase tracking-wider">
                        Candidate Profile
                      </TableHead>
                      <TableHead className="font-bold text-slate-500 text-xs uppercase tracking-wider">
                        Contact Info
                      </TableHead>
                      <TableHead className="font-bold text-slate-500 text-xs uppercase text-center">
                        Target Profile
                      </TableHead>
                      <TableHead className="font-bold text-slate-500 text-xs uppercase text-center">
                        Attempt Status
                      </TableHead>
                      <TableHead className="font-bold text-slate-500 text-xs uppercase tracking-wider text-center">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <ResetUserListingSkeleton rowCount={pageSize} />
                    ) : users.length === 0 ? (
                      <EmptyState
                        colSpan={7}
                        variant="search"
                        title="No candidates found"
                        description="Try adjusting your filters."
                      />
                    ) : (
                      users.map((row, idx) => (
                        <TableRow
                          key={row.id}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors group"
                        >
                          <TableCell className="font-medium text-center align-middle">
                            {(currentPage - 1) * pageSize + idx + 1}
                          </TableCell>
                          <TableCell className="align-middle py-3">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                <Avatar
                                  name={row.username}
                                  variant="brand"
                                  size="sm"
                                />
                                {/* Status Dot Indicators */}
                                {(row.process_status === "submitted" ||
                                  row.assignment?.is_attempted) && (
                                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white dark:border-slate-950 rounded-full shadow-sm" />
                                )}
                                {(row.process_status === "inprogress" ||
                                  row.assignment?.has_started) && (
                                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-orange-500 border-2 border-white dark:border-slate-950 rounded-full animate-pulse shadow-sm" />
                                )}
                                {row.process_status === "ready" &&
                                  !row.assignment?.has_started && (
                                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-blue-500 border-2 border-white dark:border-slate-950 rounded-full shadow-sm" />
                                  )}
                                {row.process_status === "expired" && (
                                  <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 border-2 border-white dark:border-slate-950 rounded-full shadow-sm" />
                                )}
                                {(!row.process_status ||
                                  row.process_status === "pending" ||
                                  !row.assignment?.is_assigned) &&
                                  row.process_status !== "submitted" &&
                                  row.process_status !== "inprogress" &&
                                  row.process_status !== "ready" &&
                                  row.process_status !== "expired" && (
                                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-500 border-2 border-white dark:border-slate-950 rounded-full shadow-sm" />
                                  )}
                              </div>
                              <div className="flex flex-col">
                                <div className="flex items-center gap-3">
                                  <span className="font-bold text-slate-950 dark:text-white uppercase tracking-tight text-[13px] whitespace-nowrap">
                                    {row.username || "Unnamed Candidate"}
                                  </span>
                                  {row.is_reinterview ? (
                                    <Badge
                                      variant="outline"
                                      color="violet"
                                      animate="pulse"
                                      shape="square"
                                      className="text-[9px] font-bold uppercase tracking-tight"
                                    >
                                      RETURNING
                                    </Badge>
                                  ) : (
                                    <Badge
                                      variant="outline"
                                      color="success"
                                      animate="pulse"
                                      shape="square"
                                      className="text-[9px] font-bold uppercase tracking-tight"
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
                          <TableCell className="align-middle py-3">
                            <CopyableText
                              value={row.mobile || ""}
                              className="inline-flex text-[12px] font-medium tracking-tight text-slate-800 dark:text-slate-200 group-hover:text-brand-primary"
                              title="Copy Phone Number"
                            >
                              <span className="mb-[1px]">{row.mobile}</span>
                            </CopyableText>
                          </TableCell>
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
                                className="text-[9px] font-bold py-0 h-4 px-1"
                              >
                                {row.assignment?.test_level_name ||
                                  row.test_level_name ||
                                  "N/A"}
                              </Badge>
                            </div>
                          </TableCell>
                          <TableCell className="text-center align-middle py-3">
                            <div className="flex flex-col items-center justify-center gap-1">
                              {row.process_status === "submitted" ||
                              row.is_interview_submitted ||
                              row.assignment?.is_attempted ? (
                                <Badge
                                  color="success"
                                  variant="outline"
                                  animate="pulse"
                                  shape="square"
                                  className="text-[10px] px-3 font-bold uppercase tracking-wider h-5 flex items-center justify-center whitespace-nowrap"
                                >
                                  SUBMITTED
                                </Badge>
                              ) : row.process_status === "inprogress" ||
                                row.assignment?.has_started ? (
                                <Badge
                                  color="violet"
                                  variant="outline"
                                  animate="pulse"
                                  shape="square"
                                  className="text-[10px] px-3 font-bold uppercase tracking-wider h-5 flex items-center justify-center whitespace-nowrap"
                                >
                                  IN PROGRESS
                                </Badge>
                              ) : row.process_status === "ready" ? (
                                <Badge
                                  color="primary"
                                  variant="outline"
                                  shape="square"
                                  className="text-[10px] px-3 font-bold uppercase tracking-wider h-5 flex items-center justify-center whitespace-nowrap"
                                >
                                  READY
                                </Badge>
                              ) : row.process_status === "expired" ? (
                                <Badge
                                  color="error"
                                  variant="outline"
                                  shape="square"
                                  className="text-[10px] px-3 font-bold uppercase tracking-wider h-5 flex items-center justify-center whitespace-nowrap"
                                >
                                  EXPIRED
                                </Badge>
                              ) : (
                                <Badge
                                  color="warning"
                                  variant="outline"
                                  shape="square"
                                  className="text-[10px] px-3 font-bold uppercase tracking-wider h-5 flex items-center justify-center whitespace-nowrap"
                                >
                                  PENDING
                                </Badge>
                              )}
                              <span className="text-[9px] text-slate-600 dark:text-slate-300 font-bold italic opacity-80 uppercase tracking-tighter">
                                {row.process_status === "submitted" ||
                                row.is_interview_submitted ||
                                row.assignment?.is_attempted
                                  ? "Process complete"
                                  : row.process_status === "inprogress"
                                    ? "Attempt Active"
                                    : row.process_status === "ready"
                                      ? "Awaiting Login"
                                      : row.process_status === "expired"
                                        ? "Session Expired"
                                        : "Awaiting Assignment"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-center align-middle py-3">
                            <div className="flex items-center justify-center gap-2">
                              {row.is_details_submitted && (
                                <TableIconButton
                                  iconColor="orange"
                                  animate="scale"
                                  title="Enable candidate to edit personal details"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedUser(row);
                                    setIsDetailsModalOpen(true);
                                  }}
                                >
                                  <FileEdit size={16} />
                                </TableIconButton>
                              )}
                              <TableIconButton
                                iconColor="red"
                                animate="scale"
                                title="Delete current attempt and allow re-start"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedUser(row);
                                  setIsModalOpen(true);
                                }}
                              >
                                <RefreshCw size={16} />
                              </TableIconButton>
                              <TableIconButton
                                iconColor="violet"
                                animate="scale"
                                title="Assign a fresh session (Returning Candidate)"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedUser(row);
                                  setIsReInterviewModalOpen(true);
                                }}
                              >
                                <RotateCcw size={16} />
                              </TableIconButton>
                              <TableIconButton
                                iconColor="blue"
                                animate="scale"
                                title="Reset specific subjects data"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedUser(row);
                                  setIsResetSubjectsModalOpen(true);
                                }}
                              >
                                <BookOpenCheck size={16} />
                              </TableIconButton>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </ListingTransition>
          </div>
          {!loading && totalItems > 0 && (
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
        </div>
        <ListingFiltersDrawer
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          registryKey="reset-status-filters"
          filters={filters}
          onFilterChange={handleSingleFilterChange}
          onReset={resetFilters}
          isLoading={loading}
          dynamicOptions={{
            department: [
              { id: "all", label: "All Departments" },
              ...allDepartments.map((dept) => ({
                id: dept.name,
                label: dept.name,
              })),
            ],
            level: [
              { id: "all", label: "All Levels" },
              ...allLevels.map((lvl) => ({ id: lvl.name, label: lvl.name })),
            ],
          }}
        />
      </MainCard>

      {selectedUser && (
        <ResetConfirmModal
          isOpen={isModalOpen}
          user={selectedUser}
          onSuccess={() => void refresh()}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
        />
      )}

      {selectedUser && (
        <ResetDetailsModal
          isOpen={isDetailsModalOpen}
          user={selectedUser}
          onSuccess={() => void refresh()}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedUser(null);
          }}
        />
      )}

      {selectedUser && (
        <ReInterviewModal
          isOpen={isReInterviewModalOpen}
          user={selectedUser}
          onSuccess={() => void refresh()}
          onClose={() => {
            setIsReInterviewModalOpen(false);
            setSelectedUser(null);
          }}
        />
      )}

      {selectedUser && (
        <ResetSubjectsModal
          isOpen={isResetSubjectsModalOpen}
          user={selectedUser}
          onSuccess={() => void refresh()}
          onClose={() => {
            setIsResetSubjectsModalOpen(false);
            setSelectedUser(null);
          }}
        />
      )}
    </>
  );
}
