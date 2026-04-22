"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui-elements/Table";
import {
  Users,
  Eye,
  RefreshCcw,
  UserPlus,
  Filter,
  RotateCcw,
  Mail,
  UserCog,
  FileText,
} from "lucide-react";
import { MainCard } from "@components/ui-cards/MainCard";
import Link from "next/link";
import { Button } from "@components/ui-elements/Button";
import {
  getUsersByRole,
  type UserListResponse,
  toggleUserStatus,
} from "@lib/api/auth";
import { Badge } from "@components/ui-elements/Badge";
import { Switch } from "@components/ui-elements/Switch";
import { Modal } from "@components/ui-elements/Modal";
import { SignUpForm } from "@features/authforms/SignUpForm";
import { UpdateAccountInfoForm } from "@features/user-details/UpdateAccountInfoForm";
import { InlineDrawer } from "@components/ui-elements/InlineDrawer";
import { Typography } from "@components/ui-elements/Typography";
import { Pagination } from "@components/ui-elements/Pagination";
import { cn } from "@lib/utils";
import { Avatar } from "@components/ui-elements/Avatar";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { useDepartments } from "@lib/react-query/departments/use-departments";
import { useClassifications } from "@lib/react-query/classifications/use-classifications";
import { EmptyState } from "@components/ui-elements/EmptyState";
import { CopyableText } from "@components/ui-elements/CopyableText";
import { SearchInput } from "@components/ui-elements/SearchInput";
import { TableIconButton } from "@components/ui-elements/TableIconButton";
import { SimpleTableSkeleton } from "@components/ui-skeleton/SimpleTableSkeleton";
import { Tooltip } from "@components/ui-elements/Tooltip";
import { Skeleton } from "@components/ui-elements/Skeleton";
import { useListing } from "@hooks/useListing";

interface UserListingProps {
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

export function UserListing({ initialData }: UserListingProps) {
  // Hook for standardized listing
  const {
    data: users,
    isLoading: loading,
    totalItems,
    totalPages,
    currentPage,
    pageSize,
    filters,
    activeFiltersCount,
    handleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    resetFilters,
    fetchItems,
    refresh,
  } = useListing<
    UserListResponse,
    { search: string; department_id: string; test_level_id: string }
  >({
    // Adaptation for getUsersByRole
    fetchFn: (params) => getUsersByRole("user", params),
    initialFilters: {
      search: "",
      department_id: "all",
      test_level_id: "all",
    },
    initialData: initialData?.data,
    initialTotalItems: initialData?.pagination?.total_records,
    filterMapping: (f) => ({
      search: f.search || undefined,
      department_id:
        f.department_id === "all" ? undefined : Number(f.department_id),
      test_level_id:
        f.test_level_id === "all" ? undefined : Number(f.test_level_id),
    }),
    toastMessage: "Candidate list refreshed successfully",
  });

  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserListResponse | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleToggleStatus = async (user: UserListResponse) => {
    setTogglingId(user.id);
    try {
      await toggleUserStatus(user.id);
      void fetchItems();
    } catch (error) {
      console.error("Toggle failed:", error);
    } finally {
      setTogglingId(null);
    }
  };

  const handleEditUser = (user: UserListResponse) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  // Fetch departments and levels
  const { data: allDepartments = [] } = useDepartments({ is_active: true });
  const classificationQuery = useClassifications({
    type: "exam_level",
    is_active: true,
  });
  const allLevels = classificationQuery.data?.data || [];

  const departmentOptions = [
    { id: "all", label: "All Departments" },
    ...allDepartments.map((dept) => ({
      id: String(dept.id),
      label: dept.name,
    })),
  ];

  const levelOptions = [
    { id: "all", label: "All Levels" },
    ...allLevels.map((lvl) => ({
      id: String(lvl.id),
      label: lvl.name,
    })),
  ];

  return (
    <>
      <MainCard
        title={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
              <Users size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight">
                Candidate Management
              </h2>
              <p className="text-[11px] text-muted-foreground -mt-1 font-medium italic opacity-70">
                Manage all registered users and their account status
              </p>
            </div>
          </div>
        }
        action={
          <div className="flex items-center gap-3">
            {loading ? (
              <Skeleton className="h-8 w-20 rounded-full" />
            ) : (
              <Badge
                variant="outline"
                color="default"
                className="font-bold border-border/50 bg-card"
              >
                {totalItems} USERS
              </Badge>
            )}
            <div className="h-6 w-px bg-border/50 mx-1" />

            <Tooltip content="Refresh Data" side="bottom">
              <Button
                variant="action"
                size="rounded-icon"
                animate="scale"
                onClick={refresh}
                disabled={loading}
              >
                <div className={cn(loading && "animate-spin")}>
                  <RefreshCcw size={18} />
                </div>
              </Button>
            </Tooltip>

            <Tooltip
              content={
                activeFiltersCount > 0
                  ? `Filters (${activeFiltersCount} active)`
                  : "Open Filters"
              }
              side="bottom"
            >
              <Button
                variant="action"
                size="rounded-icon"
                isActive={isFilterOpen}
                animate="scale"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                {activeFiltersCount > 0 ? (
                  <span className="relative">
                    <Filter size={18} />
                    <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-brand-primary text-white text-[8px] font-black flex items-center justify-center leading-none border border-white dark:border-slate-900">
                      {activeFiltersCount}
                    </span>
                  </span>
                ) : (
                  <Filter size={18} />
                )}
              </Button>
            </Tooltip>

            <Button
              variant="primary"
              color="primary"
              startIcon={<UserPlus size={16} />}
              onClick={() => setIsAddModalOpen(true)}
              animate="scale"
              className="font-bold border-none"
            >
              Add Candidate
            </Button>
          </div>
        }
        bodyClassName="p-0 flex flex-row items-stretch w-full"
      >
        <div
          className={cn(
            "flex-1 flex flex-col min-w-0",
            isFilterOpen && "border-r border-border/50",
          )}
        >
          <div className="flex-1 overflow-x-auto w-full">
            <Table>
              <TableHeader className="bg-slate-50/50 dark:bg-slate-900/50 border-b border-border">
                <TableRow>
                  <TableHead className="w-[80px] text-center font-bold text-slate-500 text-xs uppercase">
                    Sr. No.
                  </TableHead>
                  <TableHead className="font-bold text-slate-500 text-xs uppercase">
                    Candidate Profile
                  </TableHead>
                  <TableHead className="font-bold text-slate-500 text-xs uppercase">
                    Mobile
                  </TableHead>
                  <TableHead className="font-bold text-slate-500 text-xs uppercase">
                    Department
                  </TableHead>
                  <TableHead className="font-bold text-slate-500 text-xs uppercase text-center">
                    Level
                  </TableHead>
                  <TableHead className="text-center font-bold text-slate-500 text-xs uppercase">
                    Account Status
                  </TableHead>
                  <TableHead className="text-center font-bold text-slate-500 text-xs uppercase">
                    Action
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <SimpleTableSkeleton
                    rowCount={pageSize}
                    columnCount={7}
                    columnWidths={[
                      "w-[80px] text-center py-4",
                      "py-4",
                      "py-4",
                      "py-4",
                      "text-center py-4",
                      "py-4 text-center",
                      "py-4 text-center",
                    ]}
                  />
                ) : users.length === 0 ? (
                  <EmptyState
                    colSpan={7}
                    variant="search"
                    title="No candidates found"
                    description="We couldn't find any candidates matching your criteria. Try adjusting your search."
                  />
                ) : (
                  users.map((row, idx) => (
                    <TableRow
                      key={row.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-900/40 transition-colors"
                    >
                      <TableCell className="font-bold text-center align-middle py-3 text-slate-500">
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
                                {row.username || "Unnamed"}
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
                      <TableCell className="align-middle py-3">
                        <Badge
                          variant="outline"
                          color={
                            row.department_name ||
                            row.assignment?.department_name
                              ? "primary"
                              : "default"
                          }
                          shape="square"
                        >
                          {row.department_name ||
                            row.assignment?.department_name ||
                            "NO DEPT"}
                        </Badge>
                      </TableCell>
                      <TableCell className="align-middle py-3 text-center">
                        <Badge
                          variant="outline"
                          color="default"
                          shape="square"
                          className="font-bold text-[9px] px-2 h-5 inline-flex items-center justify-center border-slate-300 dark:border-slate-800 uppercase"
                        >
                          {row.assignment?.test_level_name ||
                            row.test_level_name ||
                            "N/A"}
                        </Badge>
                      </TableCell>
                      <TableCell className="align-middle py-3">
                        <div className="flex flex-col items-center justify-center gap-1.5">
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
                            className="text-[9px] font-bold uppercase tracking-tighter scale-90"
                          >
                            {row.is_active ? "Active" : "Disabled"}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell className="align-middle py-3">
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/admin/management/users/view-details/${row.id}`}
                            passHref
                          >
                            <TableIconButton
                              iconColor="brand"
                              btnSize="sm"
                              animate="scale"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </TableIconButton>
                          </Link>
                          <TableIconButton
                            iconColor="blue"
                            btnSize="sm"
                            animate="scale"
                            title="Edit Basic Info"
                            onClick={() => handleEditUser(row)}
                          >
                            <UserCog size={16} />
                          </TableIconButton>

                          <Link
                            href={`/admin/management/users/update-details/${row.id}`}
                            passHref
                          >
                            <TableIconButton
                              iconColor="violet"
                              btnSize="sm"
                              animate="scale"
                              title="Edit Recruitment Form"
                            >
                              <FileText size={16} />
                            </TableIconButton>
                          </Link>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          {!loading && users.length > 0 && (
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

        <InlineDrawer
          title="Filters"
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
        >
          <div className="p-6 flex flex-col gap-8">
            {/* Search */}
            <div className="flex flex-col gap-3">
              <Typography
                variant="body5"
                weight="bold"
                className="uppercase tracking-widest text-muted-foreground"
              >
                Quick Search
              </Typography>
              <SearchInput
                placeholder="Name, Mobile or Email..."
                value={filters.search}
                onSearch={(val) => handleFilterChange({ search: val })}
              />
            </div>

            {/* Department */}
            <div className="flex flex-col gap-3">
              <Typography
                variant="body5"
                weight="bold"
                className="uppercase tracking-widest text-muted-foreground"
              >
                Department
              </Typography>
              <SelectDropdown
                placeholder="All Departments"
                options={departmentOptions}
                value={filters.department_id}
                onChange={(val) =>
                  handleFilterChange({ department_id: String(val) })
                }
                isLoading={allDepartments.length === 0}
              />
            </div>

            {/* Level */}
            <div className="flex flex-col gap-3">
              <Typography
                variant="body5"
                weight="bold"
                className="uppercase tracking-widest text-muted-foreground"
              >
                Exam Level
              </Typography>
              <SelectDropdown
                placeholder="All Levels"
                options={levelOptions}
                value={filters.test_level_id}
                onChange={(val) =>
                  handleFilterChange({ test_level_id: String(val) })
                }
                isLoading={allLevels.length === 0}
              />
            </div>

            <Button
              variant="outline"
              color="primary"
              size="md"
              shadow
              animate="scale"
              iconAnimation="rotate-360"
              startIcon={<RotateCcw size={18} />}
              onClick={resetFilters}
              className="font-bold w-full mt-auto"
              title="Reset Filters"
            >
              Reset Filters
            </Button>
          </div>
        </InlineDrawer>
      </MainCard>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Candidate"
      >
        <div className="p-1 pb-4">
          <SignUpForm
            onSuccess={() => {
              setIsAddModalOpen(false);
              void fetchItems();
            }}
          />
        </div>
      </Modal>
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Candidate Information"
      >
        <div className="p-1 pb-4">
          {editingUser && (
            <UpdateAccountInfoForm
              userId={editingUser.id}
              initialData={{
                username: editingUser.username ?? undefined,
                mobile: editingUser.mobile ?? undefined,
                email: editingUser.email ?? undefined,
                test_level_id: editingUser.test_level_id ?? "",
                department_id: editingUser.department_id ?? "",
              }}
              onSuccess={() => {
                setIsEditModalOpen(false);
                void fetchItems();
              }}
            />
          )}
        </div>
      </Modal>
    </>
  );
}
