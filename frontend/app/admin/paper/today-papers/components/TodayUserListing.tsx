"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui-elements/Table";
import { ClipboardCheck, Users, Phone, Mail } from "lucide-react";
import { MainCard } from "@components/ui-cards/MainCard";
import { UserListResponse } from "@lib/api/auth";
import { Pagination } from "@components/ui-elements/Pagination";
import { Button } from "@/components/ui-elements/Button";
import { Badge } from "@components/ui-elements/Badge";
import { useRouter } from "next/navigation";
import { Tooltip } from "@components/ui-elements/Tooltip";

import { AssignPaperModal as AssignPaperSetModal } from "./AssignPaperSetModal";
import { DateRangeHeaderActions } from "./DateRangeHeaderActions";
import { getUsersByRole } from "@lib/api/auth";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "@lib/toast";

interface TodayUserListingProps {
  initialData?: UserListResponse[];
  initialLabel?: string;
}

export function TodayUserListing({
  initialData = [],
  initialLabel = "Today",
}: TodayUserListingProps) {
  const searchParams = useSearchParams();
  const [users, setUsers] = useState<UserListResponse[]>(initialData);
  const [loading, setLoading] = useState(false);

  // Sync with initialData whenever it changes (e.g. on URL change)
  useEffect(() => {
    setUsers(initialData);
  }, [initialData]);

  // Manual API refresh function
  const handleRefresh = async () => {
    try {
      setLoading(true);
      const role = "user";
      const options = {
        date:
          searchParams.get("date") ||
          (!searchParams.get("date_from")
            ? new Date().toISOString().split("T")[0]
            : undefined),
        date_from: searchParams.get("date_from") || undefined,
        date_to: searchParams.get("date_to") || undefined,
      };

      const refreshedData = await getUsersByRole(role, options);
      setUsers(refreshedData);
      toast.success("List Refreshed");
    } catch (error) {
      console.error("Refresh failed:", error);
      toast.error("Refresh failed");
    } finally {
      setLoading(false);
    }
  };

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedUser, setSelectedUser] = useState<UserListResponse | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const totalItems = users.length;
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
  const paginatedUsers = users.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <>
      <MainCard
        title={
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground shrink-0">
              <Users size={20} />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold tracking-tight">
                CANDIDATES LIST
              </span>
              <span className="text-[10px] text-muted-foreground/60 font-medium">
                papers scheduled and active for filtered range.
              </span>
            </div>
          </div>
        }
        action={
          <DateRangeHeaderActions
            initialLabel={initialLabel}
            onRefresh={handleRefresh}
            isLoading={loading}
          />
        }
        className="mb-6 flex flex-col"
        bodyClassName="p-0 flex flex-col w-full"
      >
        <div className="flex-1 w-full flex flex-col min-w-0 overflow-hidden relative">
          <div className="flex-1 overflow-x-auto w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] text-center">
                    Sr. No.
                  </TableHead>
                  <TableHead>User Details</TableHead>
                  <TableHead>Contact Info</TableHead>
                  <TableHead>Dept / Level</TableHead>
                  <TableHead>Assigned Paper</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!Array.isArray(paginatedUsers) ||
                paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((row, idx) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium text-center align-middle">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </TableCell>
                      <TableCell className="align-middle">
                        <div className="flex flex-col justify-center">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight text-sm">
                              {row.username || "Unnamed Candidate"}
                            </span>
                            {row.is_reinterview ? (
                              <Badge
                                variant="outline"
                                color="violet"
                                animate="pulse"
                              >
                                RETURNING
                              </Badge>
                            ) : (
                              <Badge variant="outline" color="success">
                                NEW
                              </Badge>
                            )}
                          </div>
                          <span className="text-[10px] text-muted-foreground/60 italic font-medium -mt-1 opacity-70">
                            ID: #{row.id}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="align-middle">
                        <div className="flex flex-col justify-center gap-0.5">
                          <div className="flex items-center gap-1.5 text-xs text-foreground/70">
                            <span className="opacity-70 group-hover:scale-110 transition-transform">
                              <Phone size={12} />
                            </span>
                            <span className="font-bold text-slate-700 dark:text-slate-300">
                              {row.mobile}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground italic">
                            <span className="opacity-70 group-hover:scale-110 transition-transform">
                              <Mail size={12} />
                            </span>
                            <span className="opacity-80 truncate max-w-[150px]">
                              {row.email || "-"}
                            </span>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="align-middle">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            {row.assignment?.department_name ? (
                              <Badge
                                color="secondary"
                                className="bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 text-[10px] px-2 py-0"
                              >
                                {row.assignment.department_name}
                              </Badge>
                            ) : (
                              <span className="text-[10px] text-muted-foreground/60 italic">
                                No Dept
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant="outline"
                              className="border-border text-muted-foreground text-[9px] px-2 py-0 uppercase"
                            >
                              {row.assignment?.test_level_name ||
                                row.testlevel ||
                                "N/A"}
                            </Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="align-middle">
                        {row.assignment?.paper_name ? (
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-brand-primary">
                              {row.assignment.paper_name}
                            </span>
                            {row.assignment.is_attempted && (
                              <span className="text-[10px] text-green-600 font-bold uppercase tracking-wider">
                                ✓ Completed
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground/60 italic font-medium">
                            Not Assigned
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-center align-middle p-0">
                        <div className="flex items-center justify-center min-h-[70px]">
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
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
          />
        )}
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
