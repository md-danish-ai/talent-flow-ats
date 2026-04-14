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
import {
  RefreshCw,
  Search,
  Settings2,
  Trash2,
  Users,
  X,
  FileEdit,
  RotateCcw,
  BookOpenCheck,
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUsers(initialData);
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

    return searchMatch && statusMatch;
  });

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
              <p className="text-[11px] text-muted-foreground -mt-1 font-medium italic opacity-70">
                Registered candidates listed from newest to oldest
              </p>
            </div>
          </div>
        }
        className="mb-6 flex flex-col overflow-hidden"
        bodyClassName="p-0 flex flex-row items-stretch w-full"
        action={
          <div className="flex items-center gap-3">
            <Tooltip content="Advanced Filters & Searching">
              <Button
                variant="action"
                size="rounded-icon"
                isActive={isFilterOpen}
                animate="scale"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Settings2 size={18} />
              </Button>
            </Tooltip>

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
                      Status / Progress
                    </TableHead>
                    <TableHead className="font-bold text-slate-500 text-xs uppercase tracking-wider text-center">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!Array.isArray(paginatedUsers) ||
                  paginatedUsers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={6}
                        className="h-48 text-center bg-muted/20"
                      >
                        <div className="flex flex-col items-center justify-center gap-2 opacity-50">
                          <Users size={32} />
                          <span className="text-sm font-medium italic">
                            No candidates found for today&apos;s session.
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedUsers.map((row, idx) => (
                      <TableRow
                        key={row.id}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors group"
                      >
                        <TableCell className="font-medium text-center align-middle">
                          {(currentPage - 1) * pageSize + idx + 1}
                        </TableCell>
                        <TableCell className="align-middle">
                          <div className="flex flex-col justify-center">
                            <span className="font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight text-sm">
                              {row.username || "Unnamed Candidate"}
                            </span>
                            <span className="text-[10px] text-muted-foreground/60 italic font-medium -mt-1 opacity-70">
                              ID: #{row.id}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="align-middle">
                          <div className="flex flex-col justify-center gap-0.5">
                            <div className="flex items-center gap-1.5 text-xs text-foreground/70">
                              <span className="opacity-70 group-hover:scale-110 transition-transform">
                                📱
                              </span>
                              <span className="font-bold text-slate-700 dark:text-slate-300">
                                {row.mobile}
                              </span>
                            </div>
                            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground italic">
                              <span className="opacity-70 group-hover:scale-110 transition-transform">
                                ✉️
                              </span>
                              <span className="opacity-80">
                                {row.email || "-"}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center p-0 align-middle">
                          <div className="flex flex-col items-center justify-center min-h-[80px] py-3">
                            {row.is_interview_submitted ||
                            row.assignment?.is_attempted ? (
                              <Badge
                                color="success"
                                variant="outline"
                                className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 text-[10px] px-3 font-bold uppercase tracking-wider h-6 flex items-center justify-center"
                              >
                                ✓ Submitted
                              </Badge>
                            ) : row.assignment?.has_started ? (
                              <Badge
                                color="warning"
                                variant="outline"
                                className="text-orange-500 border-orange-500/30 text-[10px] px-3 font-bold uppercase tracking-wider h-6 flex items-center justify-center italic"
                              >
                                In Progress
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="text-slate-500 border-slate-500/30 dark:text-slate-400 dark:border-slate-400/30 text-[10px] px-3 font-bold uppercase tracking-wider h-6 flex items-center justify-center italic"
                              >
                                Ready
                              </Badge>
                            )}
                            <span className="text-[9px] text-muted-foreground italic opacity-60 mt-1 uppercase tracking-tighter">
                              {row.is_interview_submitted ||
                              row.assignment?.is_attempted
                                ? "Interview process complete."
                                : row.assignment?.has_started
                                  ? "Interview session active."
                                  : row.is_details_submitted
                                    ? "Form Submitted"
                                    : "Awaiting first login."}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="text-center p-0 align-middle">
                          <div className="flex items-center justify-center gap-2 min-h-[80px] py-3">
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
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: "all", label: "All Candidates" },
                  { id: "submitted", label: "Submitted" },
                  { id: "inprogress", label: "In Progress" },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setStatusFilter(opt.id)}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg text-xs font-bold transition-all border ${
                      statusFilter === opt.id
                        ? "bg-brand-primary/10 border-brand-primary text-brand-primary shadow-sm"
                        : "bg-background border-border text-slate-500 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    {opt.label}
                    {statusFilter === opt.id && (
                      <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse" />
                    )}
                  </button>
                ))}
              </div>
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
              }}
            >
              <RotateCcw size={14} />
              Reset All
            </Button>

            <Button
              className="w-full h-11 font-bold uppercase tracking-widest text-[10px]"
              onClick={() => setIsFilterOpen(false)}
            >
              Apply Filters
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
