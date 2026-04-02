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
import { ClipboardCheck, Users } from "lucide-react";
import { MainCard } from "@components/ui-cards/MainCard";
import { UserListResponse } from "@lib/api/auth";
import { Pagination } from "@components/ui-elements/Pagination";
import { Button } from "@/components/ui-elements/Button";
import { AssignPaperModal as AssignPaperSetModal } from "./AssignPaperSetModal";
import { useRouter } from "next/navigation";
import { Badge } from "@components/ui-elements/Badge";

interface TodayUserListingProps {
  initialData?: UserListResponse[];
}

export function TodayUserListing({ initialData = [] }: TodayUserListingProps) {
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedUser, setSelectedUser] = useState<UserListResponse | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const totalItems = initialData.length;
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
  const paginatedUsers = initialData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  return (
    <>
      <MainCard
        title={
          <>
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground shrink-0">
              <Users size={20} />
            </div>
            Users List
          </>
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
                      <TableCell className="font-medium text-center">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </TableCell>
                      <TableCell className="font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">
                        {row.username || "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1.5 text-xs text-foreground/70">
                            <span className="opacity-70">📱</span>
                            <span className="font-semibold">{row.mobile}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <span className="opacity-70">✉️</span>
                            <span>{row.email || "-"}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
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
                      <TableCell>
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
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
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
                            title={
                              row.assignment?.is_attempted
                                ? "Attempted"
                                : "Assign Paper Set"
                            }
                            className={`h-8 w-8 ${
                              row.assignment?.is_attempted
                                ? "text-green-600 cursor-not-allowed opacity-70"
                                : "text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10"
                            }`}
                          >
                            <ClipboardCheck size={16} />
                          </Button>
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
