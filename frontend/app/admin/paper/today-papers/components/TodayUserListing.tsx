"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui-elements/Table";
import { TodayUserListingSkeleton } from "@components/ui-skeleton/TodayUserListingSkeleton";
import {
  ClipboardCheck,
  Users,
  Mail,
  Filter,
  RotateCcw,
  Copy,
} from "lucide-react";
import { MainCard } from "@components/ui-cards/MainCard";
import { UserListResponse } from "@lib/api/auth";
import { Pagination } from "@components/ui-elements/Pagination";
import { InlineDrawer } from "@components/ui-elements/InlineDrawer";
import { Typography } from "@components/ui-elements/Typography";
import { cn } from "@lib/utils";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { Button } from "@components/ui-elements/Button";
import { useDepartments } from "@lib/react-query/departments/use-departments";
import { useClassifications } from "@lib/react-query/classifications/use-classifications";
import { Badge } from "@components/ui-elements/Badge";
import { useRouter } from "next/navigation";
import { Tooltip } from "@components/ui-elements/Tooltip";
import { Avatar } from "@components/ui-elements/Avatar";
import { SearchInput } from "@components/ui-elements/SearchInput";

import { AssignPaperModal as AssignPaperSetModal } from "./AssignPaperSetModal";
import { DateRangeHeaderActions } from "./DateRangeHeaderActions";
import { getUsersByRole } from "@lib/api/auth";
import { useSearchParams } from "next/navigation";
import { toast } from "@lib/toast";
import { EmptyState } from "@components/ui-elements/EmptyState";
import { CopyableText } from "@components/ui-elements/CopyableText";

interface TodayUserListingProps {
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
  initialLabel?: string;
}

export function TodayUserListing({
  initialData,
  initialLabel = "Today",
}: TodayUserListingProps) {
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserListResponse | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [users, setUsers] = useState<UserListResponse[]>(
    initialData?.data || [],
  );
  const [loading, setLoading] = useState(false);
  const [totalItems, setTotalItems] = useState(
    initialData?.pagination?.total_records || 0,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const searchParams = useSearchParams();

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const role = "user";
      const options = {
        page: currentPage,
        limit: pageSize,
        search: searchQuery,
        date:
          searchParams.get("date") ||
          (!searchParams.get("date_from")
            ? new Date().toISOString().split("T")[0]
            : undefined),
        date_from: searchParams.get("date_from") || undefined,
        date_to: searchParams.get("date_to") || undefined,
      };

      const response = await getUsersByRole(role, options);
      setUsers(response.data || []);
      setTotalItems(response.pagination?.total_records || 0);
    } catch (error) {
      console.error("Fetch failed:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchQuery, searchParams]);

  useEffect(() => {
    if (
      initialData &&
      initialData.data &&
      currentPage === 1 &&
      searchQuery === ""
    ) {
      setUsers(initialData.data);
      setTotalItems(initialData.pagination?.total_records || 0);
      setLoading(false);
    } else {
      fetchData();
    }
  }, [initialData, fetchData, currentPage, searchQuery]);

  // Manual API refresh function
  const handleRefresh = async () => {
    await fetchData();
    toast.success("List Refreshed");
  };

  const router = useRouter();

  // Fetch all departments and levels from API
  const { data: allDepartments = [] } = useDepartments({ is_active: true });
  const classificationQuery = useClassifications({
    type: "exam_level",
    is_active: true,
  });
  const allLevels = classificationQuery.data?.data || [];

  const levelOptions = [
    { id: "all", label: "All Levels" },
    ...allLevels.map((lvl) => ({
      id: lvl.name,
      label: lvl.name,
    })),
  ];

  const departmentOptions = [
    { id: "all", label: "All Departments" },
    ...allDepartments.map((dept) => ({
      id: dept.name,
      label: dept.name,
    })),
  ];

  const statusOptions = [
    { id: "all", label: "All Statuses" },
    { id: "completed", label: "Completed" },
    { id: "inprogress", label: "In Progress" },
    { id: "pending", label: "Pending Assignment" },
  ];

  // Filter logic
  const filteredUsers = users.filter((user) => {
    // Search is handled by API now
    const deptName = user.department_name || user.assignment?.department_name;
    const departmentMatch =
      departmentFilter === "all" || deptName === departmentFilter;

    const userLevel = user.test_level_name || user.assignment?.test_level_name;
    const levelMatch = levelFilter === "all" || userLevel === levelFilter;

    const statusMatch =
      statusFilter === "all" ||
      (statusFilter === "completed" && user.assignment?.is_attempted) ||
      (statusFilter === "inprogress" &&
        user.assignment?.has_started &&
        !user.assignment?.is_attempted) ||
      (statusFilter === "pending" && !user.assignment?.paper_id);

    return departmentMatch && levelMatch && statusMatch;
  });

  const paginatedUsers = filteredUsers;

  return (
    <>
      <MainCard
        title={
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground shrink-0">
              <Users size={20} />
            </div>
            CANDIDATES LIST
          </div>
        }
        action={
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="h-8 w-24 bg-muted animate-pulse rounded-full" />
            ) : (
              <Badge
                variant="outline"
                color="default"
                className="font-bold border-border/50 bg-card"
              >
                {filteredUsers.length} USERS
              </Badge>
            )}
            <div className="h-6 w-px bg-border/50 mx-1" />
            <Tooltip content="Reload Candidate List">
              <Button
                variant="action"
                size="rounded-icon"
                animate="scale"
                onClick={handleRefresh}
                disabled={loading}
              >
                <div className={cn(loading && "animate-spin")}>
                  <RotateCcw size={18} />
                </div>
              </Button>
            </Tooltip>
            <Tooltip content="Filters & Searching">
              <Button
                variant="action"
                size="rounded-icon"
                isActive={isFilterOpen}
                animate="scale"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter size={18} />
              </Button>
            </Tooltip>
          </div>
        }
        className="mb-6 flex flex-col overflow-hidden"
        bodyClassName="p-0 flex flex-row items-stretch w-full"
      >
        <div
          className={cn(
            "flex-1 flex flex-col min-w-0",
            isFilterOpen && "border-r border-border/50",
          )}
        >
          <div className="flex-1 w-full flex flex-col min-w-0 overflow-hidden relative">
            <div className="flex-1 overflow-x-auto w-full">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px] text-center font-bold text-slate-500 text-xs uppercase">
                      Sr. No.
                    </TableHead>
                    <TableHead className="font-bold text-slate-500 text-xs uppercase">
                      Candidate Name
                    </TableHead>
                    <TableHead className="font-bold text-slate-500 text-xs uppercase">
                      Contact Info
                    </TableHead>
                    <TableHead className="font-bold text-slate-500 text-xs uppercase">
                      Department
                    </TableHead>
                    <TableHead className="font-bold text-slate-500 text-xs uppercase">
                      Test Level
                    </TableHead>
                    <TableHead className="font-bold text-slate-500 text-xs uppercase">
                      Assigned Paper
                    </TableHead>
                    <TableHead className="text-center font-bold text-slate-500 text-xs uppercase">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TodayUserListingSkeleton rowCount={pageSize} />
                  ) : !Array.isArray(paginatedUsers) ||
                    paginatedUsers.length === 0 ? (
                    <EmptyState
                      colSpan={7}
                      variant="search"
                      title="No candidates found"
                      description="There are no candidates found for the selected criteria. Try adjusting your filters or date range."
                    />
                  ) : (
                    paginatedUsers.map((row, idx) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-medium text-center align-middle py-3">
                          {(currentPage - 1) * pageSize + idx + 1}
                        </TableCell>
                        <TableCell className="align-middle py-3">
                          <div className="flex items-center gap-3">
                            <Avatar
                              name={row.username}
                              variant="brand"
                              size="sm"
                            />
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
                        <TableCell className="align-middle py-3">
                          <CopyableText
                            value={row.mobile}
                            className="inline-flex text-[12px] font-medium tracking-tight text-slate-800 dark:text-slate-200 group-hover:text-brand-primary hover:text-brand-primary dark:hover:text-brand-primary transition-colors"
                            title="Copy Phone Number"
                          >
                            <span className="mb-[1px]">{row.mobile}</span>
                          </CopyableText>
                        </TableCell>

                        <TableCell className="align-middle py-3 text-center">
                          {row.department_name ||
                          row.assignment?.department_name ? (
                            <Badge
                              color="secondary"
                              animate="pulse"
                              shape="square"
                              variant="outline"
                            >
                              {row.department_name ||
                                row.assignment?.department_name}
                            </Badge>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">
                              No Dept
                            </span>
                          )}
                        </TableCell>

                        <TableCell>
                          <Badge
                            variant="outline"
                            shape="square"
                            color="primary"
                          >
                            {row.assignment?.test_level_name ||
                              row.test_level_name ||
                              "N/A"}
                          </Badge>
                        </TableCell>

                        <TableCell className="align-middle py-3">
                          {row.assignment?.paper_name ? (
                            <div className="flex flex-col gap-1.5 items-start">
                              <span className="text-[13px] font-extrabold text-slate-900 dark:text-slate-100">
                                {row.assignment.paper_name}
                              </span>
                              {row.assignment.is_attempted ? (
                                <Badge
                                  variant="outline"
                                  color="success"
                                  animate="pulse"
                                  shape="square"
                                >
                                  COMPLETED
                                </Badge>
                              ) : (
                                <Badge
                                  variant="outline"
                                  color="violet"
                                  animate="pulse"
                                  shape="square"
                                >
                                  IN PROGRESS
                                </Badge>
                              )}
                            </div>
                          ) : (
                            <Badge
                              variant="outline"
                              shape="square"
                              color="warning"
                            >
                              PENDING ASSIGNMENT
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center align-middle py-3">
                          <div className="flex items-center justify-center">
                            <Tooltip
                              content={
                                row.assignment?.is_attempted
                                  ? "Assessment Already Completed"
                                  : "Assign Fresh Paper Set"
                              }
                            >
                              <Button
                                variant={
                                  row.assignment?.is_attempted
                                    ? "ghost"
                                    : "primary"
                                }
                                color={
                                  row.assignment?.is_attempted
                                    ? "success"
                                    : "primary"
                                }
                                size="icon"
                                animate="scale"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedUser(row);
                                  setIsModalOpen(true);
                                }}
                                className={`h-9 w-9 rounded-xl ${
                                  row.assignment?.is_attempted
                                    ? "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 cursor-not-allowed opacity-90 shadow-inner"
                                    : "text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-500/10"
                                }`}
                              >
                                <ClipboardCheck size={18} />
                              </Button>
                            </Tooltip>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          {totalItems > 0 && (
            <div className="border-t border-border bg-slate-50/30 dark:bg-slate-900/30">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
              />
            </div>
          )}
        </div>

        {/* Filter Drawer - Now Inside MainCard for Side-by-Side Layout */}
        <InlineDrawer
          title="Filters"
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
        >
          <div className="p-6 flex flex-col gap-8">
            {/* Date Range Filter */}
            <div className="flex flex-col gap-3">
              <Typography
                variant="body5"
                weight="bold"
                className="uppercase tracking-widest text-[10px] text-muted-foreground/80 flex items-center gap-2"
              >
                <span className="w-4 h-px bg-muted-foreground/30" />
                Select Date Range
              </Typography>
              <DateRangeHeaderActions
                initialLabel={initialLabel}
                onRefresh={handleRefresh}
                isLoading={loading}
                showRefresh={false}
              />
            </div>

            {/* Search Filter */}
            <div className="flex flex-col gap-3">
              <Typography
                variant="body5"
                weight="bold"
                className="uppercase tracking-widest text-[10px] text-muted-foreground/80 flex items-center gap-2"
              >
                <span className="w-4 h-px bg-muted-foreground/30" />
                Search Candidates
              </Typography>
              <SearchInput
                placeholder="Search by name, mobile..."
                value={searchQuery}
                onSearch={(val) => {
                  setSearchQuery(val);
                  setCurrentPage(1);
                }}
              />
            </div>

            {/* Attempt Status Filter */}
            <div className="flex flex-col gap-3">
              <Typography
                variant="body5"
                weight="bold"
                className="uppercase tracking-widest text-[10px] text-muted-foreground/80 flex items-center gap-2"
              >
                <span className="w-4 h-px bg-muted-foreground/30" />
                Attempt Status
              </Typography>
              <SelectDropdown
                options={statusOptions}
                value={statusFilter}
                onChange={(val) => setStatusFilter(val as string)}
                placeholder="Select Status"
              />
            </div>

            {/* Department Filter */}
            <div className="flex flex-col gap-3">
              <Typography
                variant="body5"
                weight="bold"
                className="uppercase tracking-widest text-[10px] text-muted-foreground/80 flex items-center gap-2"
              >
                <span className="w-4 h-px bg-muted-foreground/30" />
                Department
              </Typography>
              <SelectDropdown
                options={departmentOptions}
                value={departmentFilter}
                onChange={(val) => setDepartmentFilter(val as string)}
                placeholder="Select Department"
                isLoading={allDepartments.length === 0}
              />
            </div>

            {/* Exam Level Filter */}
            <div className="flex flex-col gap-3">
              <Typography
                variant="body5"
                weight="bold"
                className="uppercase tracking-widest text-[10px] text-muted-foreground/80 flex items-center gap-2"
              >
                <span className="w-4 h-px bg-muted-foreground/30" />
                Exam Level
              </Typography>
              <SelectDropdown
                options={levelOptions}
                value={levelFilter}
                onChange={(val) => setLevelFilter(val as string)}
                placeholder="Select Level"
                isLoading={classificationQuery.isLoading}
              />
            </div>

            <Button
              variant="outline"
              color="primary"
              className="mt-auto w-full h-11 font-bold uppercase tracking-widest text-[10px] gap-2"
              onClick={() => {
                setSearchQuery("");
                setDepartmentFilter("all");
                setLevelFilter("all");
                setStatusFilter("all");
              }}
            >
              <RotateCcw size={14} />
              Reset All
            </Button>
          </div>
        </InlineDrawer>
      </MainCard>

      {selectedUser && (
        <AssignPaperSetModal
          isOpen={isModalOpen}
          user={selectedUser}
          onSuccess={() => router.refresh()}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
        />
      )}
    </>
  );
}
