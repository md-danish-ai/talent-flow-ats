"use client";

import { useState } from "react";
import { Users } from "lucide-react";
import { MainCard } from "@components/ui-cards/MainCard";
import { getUsersByRole } from "@lib/api/auth";
import { UserListResponse, PaginatedResponse } from "@types";
import { Pagination } from "@components/ui-elements/Pagination";
import { cn } from "@lib/utils";
import { useDepartments } from "@hooks/api/departments/use-departments";
import { useClassifications } from "@hooks/api/classifications/use-classifications";
import { useSearchParams } from "next/navigation";
import { useListing } from "@hooks/useListing";
import { UserTable } from "./UserTable";
import { ListingFiltersDrawer } from "@components/ui-elements/ListingFiltersDrawer";
import { ListingTransition } from "@components/ui-elements/ListingTransition";
import { ListingHeaderActions } from "@components/ui-elements/ListingHeaderActions";
import { AssignPaperModal as AssignPaperSetModal } from "./AssignPaperSetModal";

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
      let dateFrom = f.date?.range?.from;
      let dateTo = f.date?.range?.to;

      // Handle presets like "Today", "Yesterday" etc.
      if (!dateFrom && !dateTo) {
        const today = new Date().toISOString().split("T")[0];
        if (f.date?.label === "Today" || (!f.date?.label && !searchParams.get("date_from"))) {
          dateFrom = today;
          dateTo = today;
        } else if (f.date?.label === "Yesterday") {
          const yesterdayRaw = new Date();
          yesterdayRaw.setDate(yesterdayRaw.getDate() - 1);
          const yesterday = yesterdayRaw.toISOString().split("T")[0];
          dateFrom = yesterday;
          dateTo = yesterday;
        } else {
          // Fallback to URL search params if any
          dateFrom = searchParams.get("date_from") || undefined;
          dateTo = searchParams.get("date_to") || undefined;
        }
      }

      // Convert department/level to IDs if they are numeric
      const deptId = f.department !== "all" ? allDepartments.find(d => d.name === f.department)?.id : undefined;
      const levelId = f.level !== "all" ? allLevels.find(l => l.name === f.level)?.id : undefined;

      return {
        search: f.search || undefined,
        department_id: deptId,
        test_level_id: levelId,
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
