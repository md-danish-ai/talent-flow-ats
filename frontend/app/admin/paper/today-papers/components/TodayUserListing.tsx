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

interface TodayUserListingProps {
  initialData?: UserListResponse[];
}

export function TodayUserListing({ initialData = [] }: TodayUserListingProps) {
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedUser, setSelectedUser] = useState<UserListResponse | null>(null);
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
                  <TableHead>Name</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!Array.isArray(paginatedUsers) ||
                  paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No users found.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((row, idx) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium text-center">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </TableCell>
                      <TableCell>{row.username || "-"}</TableCell>
                      <TableCell>{row.mobile}</TableCell>
                      <TableCell>{row.email || "-"}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button
                            variant="ghost"
                            color={row.assignment?.is_attempted ? "success" : "primary"}
                            size="icon"
                            animate="scale"
                            disabled={row.assignment?.is_attempted}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedUser(row);
                              setIsModalOpen(true);
                            }}
                            title={row.assignment?.is_attempted ? "Attempted" : "Assign Paper Set"}
                            className={`h-8 w-8 ${row.assignment?.is_attempted
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
