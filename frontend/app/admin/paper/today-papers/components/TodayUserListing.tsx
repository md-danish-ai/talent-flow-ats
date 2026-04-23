"use client";

import { useState } from "react";
import { Users, RefreshCcw, Filter, Loader2 } from "lucide-react";
import { MainCard } from "@components/ui-cards/MainCard";
import { getUsersByRole } from "@lib/api/auth";
import { UserListResponse, PaginatedResponse } from "@types";
import { Pagination } from "@components/ui-elements/Pagination";
import { cn } from "@lib/utils";
import { Button } from "@components/ui-elements/Button";
import { useDepartments } from "@hooks/api/departments/use-departments";
import { useClassifications } from "@hooks/api/classifications/use-classifications";
import { Badge } from "@components/ui-elements/Badge";
import { useSearchParams } from "next/navigation";
import { Tooltip } from "@components/ui-elements/Tooltip";

import { AssignPaperModal as AssignPaperSetModal } from "./AssignPaperSetModal";
import { useListing } from "@hooks/useListing";

interface TodayUserListingProps {
  initialData?: PaginatedResponse<UserListResponse>;
  initialLabel?: string;
}

type UserListingFilters = {
  search: string;
  department: string;
  level: string;
  status: string;
  date: { range?: { from?: string; to?: string }; label?: string } | null;
};

import { UserTable } from "./UserTable";
import { ListingFiltersDrawer } from "@components/ui-elements/ListingFiltersDrawer";

import { ListingTransition } from "@components/ui-elements/ListingTransition";
import { ListingHeaderActions } from "@components/ui-elements/ListingHeaderActions";

export function TodayUserListing({
  initialData,
  initialLabel = "Today",
}: TodayUserListingProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserListResponse | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const searchParams = useSearchParams();

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
    handleFilterChange,
    handleSingleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    resetFilters,
    refresh,
    fetchItems,
  } = useListing<UserListResponse, UserListingFilters>({
    fetchFn: (params) => getUsersByRole("user", params),
    initialFilters: {
      search: "",
      department: "all",
      level: "all",
      status: "all",
      date: { label: initialLabel },
    },
    initialData: initialData?.data,
    initialTotalItems: initialData?.pagination?.total_records,
    filterMapping: (f) => {
      const dateFrom = f.date?.range?.from || searchParams.get("date_from");
      const dateTo = f.date?.range?.to || searchParams.get("date_to");
      const specificDate =
        !dateFrom && !dateTo
          ? f.date?.label === "Today" ||
            (!f.date?.label && !searchParams.get("date"))
            ? new Date().toISOString().split("T")[0]
            : searchParams.get("date")
          : undefined;

      return {
        search: f.search || undefined,
        department_name: f.department !== "all" ? f.department : undefined,
        test_level_name: f.level !== "all" ? f.level : undefined,
        status: f.status !== "all" ? f.status : undefined,
        date: specificDate || undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
      };
    },
    toastMessage: "List Refreshed",
  });

  // Fetch options for dynamic dropdowns in Drawer
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
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground shrink-0">
              <Users size={20} />
            </div>
            CANDIDATES LIST
          </div>
        }
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
            <ListingTransition
              isLoading={loading}
              isBackgroundLoading={isBackgroundLoading}
            >
              <UserTable
                users={users}
                loading={loading}
                currentPage={currentPage}
                pageSize={pageSize}
                onAssignPaper={(user) => {
                  setSelectedUser(user);
                  setIsModalOpen(true);
                }}
              />
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
          registryKey="today-users"
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
        <AssignPaperSetModal
          isOpen={isModalOpen}
          user={selectedUser}
          onSuccess={() => void refresh()}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedUser(null);
          }}
        />
      )}
    </>
  );
}
