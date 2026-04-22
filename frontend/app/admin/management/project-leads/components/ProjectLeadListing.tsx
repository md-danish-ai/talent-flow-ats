"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@components/ui-elements/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui-elements/Table";
import { Plus, Users, Search } from "lucide-react";
import { MainCard } from "@components/ui-cards/MainCard";
import { AddProjectLeadModal } from "./AddProjectLeadModal";
import {
  getUsersByRole,
  UserListResponse,
  toggleUserStatus,
} from "@lib/api/auth";
import { Badge } from "@components/ui-elements/Badge";
import { Switch } from "@components/ui-elements/Switch";
import { EmptyState } from "@components/ui-elements/EmptyState";
import { SimpleTableSkeleton } from "@components/ui-skeleton/SimpleTableSkeleton";
import { Skeleton } from "@components/ui-elements/Skeleton";
import { Pagination } from "@components/ui-elements/Pagination";

interface ProjectLeadListingProps {
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

export function ProjectLeadListing({ initialData }: ProjectLeadListingProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [users, setUsers] = useState<UserListResponse[]>(
    initialData?.data || [],
  );
  const [loading, setLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(
    initialData?.pagination?.total_records || 0,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [togglingId, setTogglingId] = useState<number | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getUsersByRole("project_lead", {
        page: currentPage,
        limit: pageSize,
        search: debouncedSearch,
      });
      setUsers(response.data || []);
      setTotalItems(response.pagination?.total_records || 0);
    } catch (error) {
      console.error("Failed to fetch project leads:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, debouncedSearch]);

  useEffect(() => {
    if (
      initialData &&
      initialData.data &&
      initialData.data.length > 0 &&
      currentPage === 1 &&
      !debouncedSearch
    ) {
      setUsers(initialData.data);
      setTotalItems(initialData.pagination?.total_records || 0);
      setLoading(false);
    } else {
      fetchUsers();
    }
  }, [initialData, fetchUsers, currentPage, debouncedSearch]);

  const handleToggleStatus = async (user: UserListResponse) => {
    setTogglingId(user.id);
    try {
      await toggleUserStatus(user.id);
      fetchUsers();
    } catch (error) {
      console.error("Toggle failed:", error);
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <>
      <MainCard
        title={
          <>
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground shrink-0">
              <Users size={20} />
            </div>
            Project Leads
          </>
        }
        className="mb-6 flex flex-col"
        bodyClassName="p-0 flex flex-col items-stretch w-full"
        action={
          <div className="flex items-center gap-3">
            {loading ? (
              <Skeleton className="h-8 w-24 rounded-full" />
            ) : (
              <Badge
                variant="outline"
                color="default"
                className="font-bold border-border/50 bg-card"
              >
                {totalItems} LEADS
              </Badge>
            )}
            <div className="h-6 w-px bg-border/50 mx-1" />
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search project leads..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all w-64"
              />
            </div>
            <Button
              variant="primary"
              color="primary"
              size="md"
              shadow
              animate="scale"
              iconAnimation="rotate-90"
              onClick={() => setIsAddModalOpen(true)}
              startIcon={<Plus size={18} />}
              className="font-bold"
            >
              Add Project Lead
            </Button>
          </div>
        }
      >
        <div className="flex-1 w-full flex flex-col min-w-0 overflow-hidden relative">
          <div className="flex-1 overflow-x-auto w-full">
            <Table>
              <TableHeader className="bg-muted/30">
                <TableRow>
                  <TableHead className="w-[80px] text-center font-bold text-slate-500 text-xs uppercase">
                    Sr. No.
                  </TableHead>
                  <TableHead className="font-bold text-slate-500 text-xs uppercase">
                    Name
                  </TableHead>
                  <TableHead className="font-bold text-slate-500 text-xs uppercase">
                    Mobile
                  </TableHead>
                  <TableHead className="font-bold text-slate-500 text-xs uppercase">
                    Email
                  </TableHead>
                  <TableHead className="text-center font-bold text-slate-500 text-xs uppercase">
                    Status
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <SimpleTableSkeleton
                    columnCount={5}
                    columnWidths={[
                      "w-[80px] text-center py-5",
                      "py-5",
                      "py-5",
                      "py-5",
                      "text-center py-5",
                    ]}
                    rowCount={pageSize}
                  />
                ) : !Array.isArray(users) || users.length === 0 ? (
                  <EmptyState
                    colSpan={5}
                    title="No project leads found"
                    description="There are currently no project lead accounts registered in the system."
                  />
                ) : (
                  users.map((row, idx) => (
                    <TableRow key={row.id}>
                      <TableCell className="font-medium text-center">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {row.username || "-"}
                      </TableCell>
                      <TableCell>{row.mobile}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {row.email || "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col items-center justify-center gap-1">
                          <Switch
                            checked={row.is_active}
                            onChange={() => handleToggleStatus(row)}
                            size="sm"
                            disabled={togglingId === row.id}
                          />
                          <Badge
                            variant="outline"
                            shape="square"
                            color={row.is_active ? "success" : "error"}
                          >
                            {row.is_active ? "Activate" : "Deactivate"}
                          </Badge>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {!loading && totalItems > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalItems / pageSize) || 1}
              onPageChange={setCurrentPage}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageSizeChange={(size) => {
                setPageSize(size);
                setCurrentPage(1);
              }}
              className="mt-auto shrink-0 border-t"
            />
          )}
        </div>
      </MainCard>

      <AddProjectLeadModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          fetchUsers();
        }}
      />
    </>
  );
}
