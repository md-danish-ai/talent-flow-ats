"use client";

import React, { useState } from "react";
import { Button } from "@components/ui-elements/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui-elements/Table";
import { Plus, Users } from "lucide-react";
import { MainCard } from "@components/ui-cards/MainCard";
import { cn } from "@lib/utils";
import { AddAdminModal } from "./AddAdminModal";
import { getUsersByRole } from "@lib/api/auth";
import { UserListResponse } from "@types";
import { EmptyState } from "@components/ui-elements/EmptyState";
import { Pagination } from "@components/ui-elements/Pagination";
import { useListing } from "@hooks/useListing";
import { ListingFiltersDrawer } from "@components/ui-elements/ListingFiltersDrawer";
import { ListingTransition } from "@components/ui-elements/ListingTransition";
import { ListingHeaderActions } from "@components/ui-elements/ListingHeaderActions";
import { SimpleTableSkeleton } from "@components/ui-skeleton/SimpleTableSkeleton";
import { Tooltip } from "@components/ui-elements/Tooltip";
import { CopyableText } from "@components/ui-elements/CopyableText";

interface AdminListingProps {
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

export function AdminListing({ initialData }: AdminListingProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
  } = useListing<UserListResponse, { search: string }>({
    fetchFn: (params) => getUsersByRole("admin", params),
    initialFilters: { search: "" },
    initialData: initialData?.data,
    initialTotalItems: initialData?.pagination?.total_records,
    toastMessage: "Admin list refreshed successfully",
  });

  return (
    <>
      <MainCard
        icon={<Users size={18} />}
        title="Admins"
        subtitle="Manage system administrators, security roles, and admin permissions."
        className="mb-6 flex flex-col"
        bodyClassName="p-0 flex flex-row items-stretch w-full"
        action={
          <div className="flex items-center gap-3">
            <ListingHeaderActions
              isLoading={loading}
              isBackgroundLoading={isBackgroundLoading}
              totalItems={totalItems}
              itemLabel="Admins"
              onRefresh={refresh}
              onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
              isFilterOpen={isFilterOpen}
              activeFiltersCount={activeFiltersCount}
            />
            <Tooltip content="Add Admin" side="top">
              <Button
                variant="action"
                color="primary"
                size="rounded-icon"
                animate="scale"
                iconAnimation="rotate-90"
                onClick={() => setIsAddModalOpen(true)}
              >
                <Plus size={20} />
              </Button>
            </Tooltip>
          </div>
        }
      >
        <div
          className={cn(
            "flex-1 w-full flex flex-col min-w-0 overflow-hidden relative",
            isFilterOpen && "border-r border-border/50",
          )}
        >
          <ListingTransition
            isLoading={loading}
            isBackgroundLoading={isBackgroundLoading}
          >
            <div className="flex-1 overflow-x-auto w-full h-full flex flex-col">
              <Table aria-label="Administrators list table">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px] text-center">
                      Sr. No.
                    </TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <SimpleTableSkeleton columnCount={4} rowCount={pageSize} />
                  ) : !Array.isArray(users) || users.length === 0 ? (
                    <EmptyState
                      colSpan={4}
                      title="No admins found"
                      description="There are currently no administrative accounts registered in the system."
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
                        <TableCell>
                          {row.mobile ? (
                            <CopyableText
                              value={row.mobile}
                              className="inline-flex text-[12px] font-medium tracking-tight text-slate-800 dark:text-slate-200"
                              title="Copy Mobile Number"
                            >
                              <span>{row.mobile}</span>
                            </CopyableText>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {row.email ? (
                            <CopyableText
                              value={row.email}
                              className="inline-flex text-xs text-muted-foreground"
                              title="Copy Email"
                            >
                              <span>{row.email}</span>
                            </CopyableText>
                          ) : (
                            "-"
                          )}
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
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={totalItems}
                pageSize={pageSize}
                onPageSizeChange={handlePageSizeChange}
                className="mt-auto shrink-0 border-t"
              />
            )}
          </ListingTransition>
        </div>
        <ListingFiltersDrawer
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          registryKey="admin-filters"
          filters={filters}
          onFilterChange={handleSingleFilterChange}
          onReset={resetFilters}
          isLoading={loading}
        />
      </MainCard>

      <AddAdminModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          void refresh();
        }}
      />
    </>
  );
}
