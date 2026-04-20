"use client";

import { useState } from "react";
import { cn } from "@lib/utils";
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
import { UserListResponse } from "@lib/api/auth";
import { Pagination } from "@components/ui-elements/Pagination";
import { Button } from "@components/ui-elements/Button";
import { TableIconButton } from "@components/ui-elements/TableIconButton";
import { Tooltip } from "@components/ui-elements/Tooltip";
import { Input } from "@components/ui-elements/Input";
import { ResetConfirmModal } from "./ResetConfirmModal";
import { ResetDetailsModal } from "./ResetDetailsModal";
import { ReInterviewModal } from "./ReInterviewModal";
import { ResetSubjectsModal } from "./ResetSubjectsModal";
import { useRouter } from "next/navigation";
import { Badge } from "@components/ui-elements/Badge";
import { InlineDrawer } from "@components/ui-elements/InlineDrawer";
import { Avatar } from "@components/ui-elements/Avatar";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { useDepartments } from "@lib/react-query/departments/use-departments";
import { useClassifications } from "@lib/react-query/classifications/use-classifications";
import { EmptyState } from "@components/ui-elements/EmptyState";
import { CopyableText } from "@components/ui-elements/CopyableText";
import {
  RefreshCw,
  Search,
  Filter,
  FileEdit,
  RotateCcw,
  BookOpenCheck,
  Mail,
  Copy,
} from "lucide-react";

import { Typography } from "@components/ui-elements/Typography";
import { getUsersByRole } from "@lib/api/auth";
import { toast } from "@lib/toast";
import { useEffect } from "react";

interface ResetUserListingProps {
  initialData?: UserListResponse[];
}

export function ResetUserListing({ initialData = [] }: ResetUserListingProps) {
  const [users, setUsers] = useState<UserListResponse[]>(initialData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (initialData && initialData.length > 0) {
      setUsers(initialData);
      setLoading(false);
    } else {
      // If no initial data, trigger a refresh to load it
      handleRefresh();
    }
  }, [initialData]);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      const refreshedData = await getUsersByRole("user");
      setUsers(refreshedData);
      toast.success("List Refreshed");
    } catch (error) {
      console.error("Refresh failed:", error);
      toast.error("Refresh failed");
    } finally {
      setLoading(false);
    }
  };

  const [selectedUser, setSelectedUser] = useState<UserListResponse | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isReInterviewModalOpen, setIsReInterviewModalOpen] = useState(false);
  const [isResetSubjectsModalOpen, setIsResetSubjectsModalOpen] =
    useState(false);

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const router = useRouter();

  // Filter logic
  const filteredUsers = users.filter((user) => {
    const searchMatch =
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.mobile.includes(searchQuery) ||
      (user.email &&
        user.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const statusMatch =
      statusFilter === "all" ||
      (statusFilter === "submitted" && user.is_interview_submitted) ||
      (statusFilter === "inprogress" && !user.is_interview_submitted);

    const deptName = user.department_name || user.assignment?.department_name;
    const departmentMatch =
      departmentFilter === "all" || deptName === departmentFilter;

    const userLevel = user.test_level_name || user.assignment?.test_level_name;
    const levelMatch = levelFilter === "all" || userLevel === levelFilter;

    return searchMatch && statusMatch && departmentMatch && levelMatch;
  });

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
    { id: "submitted", label: "Submitted" },
    { id: "inprogress", label: "In Progress" },
  ];

  const totalItems = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Handlers for pagination
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page
  };

  // Sliced data for current page
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

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
          <div className="flex items-center gap-3">
            {loading ? (
              <div className="h-8 w-24 bg-muted animate-pulse rounded-full" />
            ) : (
              <Badge variant="outline" color="default" className="font-bold border-border/50 bg-card">
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
                <RefreshCw
                  size={18}
                  className={loading ? "animate-spin" : ""}
                />
              </Button>
            </Tooltip>
            <Tooltip content="Advanced Filters & Searching">
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
      >
        <div
          className={cn(
            "flex-1 flex flex-col min-w-0",
            isFilterOpen && "border-r border-border/50",
          )}
        >
          <div className="flex-1 w-full flex flex-col min-w-0 overflow-hidden relative">
            <div className="flex-1 overflow-x-auto w-full">
                {loading ? (
                  <Table>
                    <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-border">
                      <TableRow>
                        <TableHead className="w-[80px] text-center font-bold text-slate-500 text-xs uppercase tracking-wider">Sr. No.</TableHead>
                        <TableHead className="font-bold text-slate-500 text-xs uppercase tracking-wider">Candidate Profile</TableHead>
                        <TableHead className="font-bold text-slate-500 text-xs uppercase tracking-wider">Contact Info</TableHead>
                        <TableHead className="font-bold text-slate-500 text-xs uppercase tracking-wider text-center">Department</TableHead>
                        <TableHead className="font-bold text-slate-500 text-xs uppercase tracking-wider text-center">Test Level</TableHead>
                        <TableHead className="font-bold text-slate-500 text-xs uppercase tracking-wider text-center">Status</TableHead>
                        <TableHead className="font-bold text-slate-500 text-xs uppercase tracking-wider text-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <ResetUserListingSkeleton rowCount={pageSize} />
                    </TableBody>
                  </Table>
                ) : (
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
                        <TableHead className="font-bold text-slate-500 text-xs uppercase tracking-wider text-center">
                          Department
                        </TableHead>
                        <TableHead className="font-bold text-slate-500 text-xs uppercase tracking-wider text-center">
                          Test Level
                        </TableHead>
                        <TableHead className="font-bold text-slate-500 text-xs uppercase tracking-wider text-center">
                          Status
                        </TableHead>
                        <TableHead className="font-bold text-slate-500 text-xs uppercase tracking-wider text-center">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(!Array.isArray(paginatedUsers) || paginatedUsers.length === 0) ? (
                        <EmptyState
                          colSpan={7}
                          variant="search"
                          title="No candidates found"
                          description="We couldn't find any candidates matching your criteria for status reset. Try adjusting your filters."
                        />
                      ) : (
                    paginatedUsers.map((row, idx) => (
                      <TableRow
                        key={row.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors group"
                      >
                        <TableCell className="font-medium text-center align-middle">
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
                                    className="text-[9px] font-bold"
                                  >
                                    RETURNING
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    color="success"
                                    animate="pulse"
                                    shape="square"
                                    className="text-[9px] font-bold"
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
                            className="inline-flex text-[12px] font-medium tracking-tight text-slate-800 dark:text-slate-200 group-hover:text-brand-primary transition-colors hover:text-brand-primary dark:hover:text-brand-primary"
                            title="Copy Phone Number"
                          >
                            <span className="mb-[1px]">{row.mobile}</span>
                          </CopyableText>
                        </TableCell>
                        <TableCell className="align-middle py-3 text-center">
                          {row.department_name ||
                          row.assignment?.department_name ? (
                            <Badge
                              color="primary"
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
                        <TableCell className="align-middle py-3 text-center">
                          <Badge
                            variant="outline"
                            shape="square"
                            color="default"
                          >
                            {row.assignment?.test_level_name ||
                              row.test_level_name ||
                              "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center align-middle py-3">
                          <div className="flex flex-col items-center justify-center gap-1">
                            {row.is_interview_submitted ||
                            row.assignment?.is_attempted ? (
                              <Badge
                                color="success"
                                variant="outline"
                                animate="pulse"
                                shape="square"
                                className="text-[10px] px-3 font-bold uppercase tracking-wider h-5 flex items-center justify-center"
                              >
                                Submitted
                              </Badge>
                            ) : row.assignment?.has_started ? (
                              <Badge
                                color="warning"
                                variant="outline"
                                animate="pulse"
                                shape="square"
                                className="text-[10px] px-3 font-bold uppercase tracking-wider h-5 flex items-center justify-center"
                              >
                                In Progress
                              </Badge>
                            ) : (
                              <Badge
                                color="default"
                                variant="outline"
                                shape="square"
                                className="text-[10px] px-3 font-bold uppercase tracking-wider h-5 flex items-center justify-center"
                              >
                                Ready
                              </Badge>
                            )}
                            <span className="text-[9px] text-slate-600 dark:text-slate-300 font-bold italic opacity-80 uppercase tracking-tighter">
                              {row.is_interview_submitted ||
                              row.assignment?.is_attempted
                                ? "Process complete"
                                : row.assignment?.has_started
                                  ? "Attempt Active"
                                  : row.is_details_submitted
                                    ? "Form Done"
                                    : "Awaiting Login"}
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
            )}
          </div>
          {totalItems > 0 && (
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

      </div>

        {/* Filter Drawer - Now Inside MainCard for Side-by-Side Layout */}
        <InlineDrawer
          title="Filters"
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
        >
          <div className="p-6 flex flex-col gap-8">
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
              <div className="relative group">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-brand-primary transition-colors"
                  size={18}
                />
                <Input
                  placeholder="Search by name, mobile..."
                  className="pl-11 h-12 border-border/60 hover:border-border focus:border-brand-primary transition-all bg-muted/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Status Filter */}
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

            {/* Help Info */}
            <div className="mt-auto p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-border">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-lg bg-white dark:bg-black border border-border flex items-center justify-center shrink-0">
                  <Search size={18} className="text-brand-primary" />
                </div>
                <div className="flex flex-col gap-1">
                  <Typography
                    variant="body5"
                    weight="bold"
                    className="text-slate-800 dark:text-slate-100 uppercase tracking-tight"
                  >
                    Quick Search
                  </Typography>
                  <Typography
                    variant="body5"
                    className="text-[10px] text-muted-foreground italic leading-relaxed"
                  >
                    Search field looks through Name, Phone Number, and Email ID.
                  </Typography>
                </div>
              </div>
            </div>

            <Button
              variant="outline"
              color="primary"
              className="w-full h-11 font-bold uppercase tracking-widest text-[10px] gap-2"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setDepartmentFilter("all");
                setLevelFilter("all");
              }}
            >
              <RotateCcw size={14} />
              Reset All
            </Button>
          </div>
        </InlineDrawer>
      </MainCard>

      {selectedUser && (
        <ResetConfirmModal
          isOpen={isModalOpen}
          user={selectedUser}
          onSuccess={() => router.refresh()}
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
          onSuccess={() => router.refresh()}
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
          onSuccess={() => router.refresh()}
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
          onSuccess={() => router.refresh()}
          onClose={() => {
            setIsResetSubjectsModalOpen(false);
            setSelectedUser(null);
          }}
        />
      )}

      {/* Filter Drawer removed from here as it's now inside MainCard */}
    </>
  );
}
