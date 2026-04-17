"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui-elements/Table";
import { TableIconButton } from "@components/ui-elements/TableIconButton";
import {
  Users,
  Eye,
  UserPlus,
  Search,
  Filter,
  RotateCcw,
  Mail,
  FileText,
  UserCog,
} from "lucide-react";
import { MainCard } from "@components/ui-cards/MainCard";
import Link from "next/link";
import { Button } from "@components/ui-elements/Button";
import {
  getUsersByRole,
  UserListResponse,
  toggleUserStatus,
} from "@lib/api/auth";
import { Badge } from "@components/ui-elements/Badge";
import { Switch } from "@components/ui-elements/Switch";
import { Modal } from "@components/ui-elements/Modal";
import { SignUpForm } from "@features/authforms/SignUpForm";
import { UpdateAccountInfoForm } from "@features/user-details/UpdateAccountInfoForm";
import { InlineDrawer } from "@components/ui-elements/InlineDrawer";
import { Input } from "@components/ui-elements/Input";
import { Typography } from "@components/ui-elements/Typography";
import { Pagination } from "@components/ui-elements/Pagination";
import { cn } from "@lib/utils";
import { Avatar } from "@components/ui-elements/Avatar";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { useDepartments } from "@lib/react-query/departments/use-departments";
import { useClassifications } from "@lib/react-query/classifications/use-classifications";

interface UserListingProps {
  initialData?: UserListResponse[];
}

export function UserListing({ initialData = [] }: UserListingProps) {
  const [users, setUsers] = useState<UserListResponse[]>(initialData);
  const [loading, setLoading] = useState(!initialData.length);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserListResponse | null>(null);

  // Search and Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [deptFilter, setDeptFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Fetch data via hooks
  const { data: allDepartments = [] } = useDepartments({ is_active: true });
  const classificationQuery = useClassifications({
    type: "exam_level",
    is_active: true,
  });
  const allLevels = classificationQuery.data?.data || [];

  const departmentOptions = [
    { id: "all", label: "All Departments" },
    ...allDepartments.map((dept) => ({
      id: dept.name,
      label: dept.name,
    })),
  ];

  const levelOptions = [
    { id: "all", label: "All Levels" },
    ...allLevels.map((lvl) => ({
      id: lvl.name,
      label: lvl.name,
    })),
  ];

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchUsers = React.useCallback(async () => {
    try {
      setLoading(true);
      const data = await getUsersByRole("user");
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!initialData.length) {
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [initialData, fetchUsers]);

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

  const handleEditUser = (user: UserListResponse) => {
    setEditingUser(user);
    setIsEditModalOpen(true);
  };

  // Filter logic
  const filteredUsers = users.filter((user) => {
    const searchMatch =
      (user.username || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (user.mobile || "").includes(searchQuery) ||
      (user.email &&
        user.email.toLowerCase().includes(searchQuery.toLowerCase()));

    const deptMatch =
      deptFilter === "all" ||
      user.department_name === deptFilter ||
      user.assignment?.department_name === deptFilter;

    const statusMatch =
      statusFilter === "all" ||
      (statusFilter === "active" && user.is_active) ||
      (statusFilter === "disabled" && !user.is_active);

    const levelMatch =
      levelFilter === "all" ||
      user.test_level_name === levelFilter ||
      user.assignment?.test_level_name === levelFilter;

    return searchMatch && deptMatch && statusMatch && levelMatch;
  });

  const totalItems = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

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
            <Button
              variant="action"
              size="rounded-icon"
              isActive={isFilterOpen}
              animate="scale"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter size={18} />
            </Button>

            <Button
              size="sm"
              variant="outline"
              color="primary"
              startIcon={<UserPlus size={16} />}
              onClick={() => setIsAddModalOpen(true)}
              animate="scale"
              className="font-bold uppercase tracking-wider text-[11px]"
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
                  <TableRow>
                    <TableCell colSpan={7} className="h-48 text-center">
                      <div className="flex items-center justify-center gap-3 text-muted-foreground opacity-50">
                        <RotateCcw className="animate-spin" />
                        <span className="font-bold italic">
                          Loading candidates...
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="h-48 text-center bg-muted/10"
                    >
                      <div className="flex flex-col items-center justify-center gap-2 opacity-40">
                        <Users size={32} />
                        <span className="text-sm font-bold italic uppercase tracking-widest">
                          No candidates found
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((row, idx) => (
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
                            <div className="flex items-center gap-1.5 text-slate-500 font-medium italic opacity-70 mt-0.5">
                              <Mail size={11} />
                              <span className="text-[11px] truncate max-w-[150px]">
                                {row.email || "-"}
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="align-middle py-3">
                        <span className="text-[12px] font-normal tracking-tight text-slate-800 dark:text-slate-200">
                          {row.mobile}
                        </span>
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
                          className="font-bold text-[9px] px-2 h-5 flex items-center justify-center w-fit border-slate-300 bg-slate-50 dark:bg-slate-900/40 uppercase"
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
          {totalItems > 0 && (
            <div className="border-t border-border bg-slate-50/30 dark:bg-slate-900/30">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                pageSize={pageSize}
                onPageChange={setCurrentPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setCurrentPage(1);
                }}
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
                className="uppercase tracking-widest text-[10px] text-muted-foreground/80 flex items-center gap-2"
              >
                <span className="w-4 h-px bg-muted-foreground/30" />
                Quick Search
              </Typography>
              <div className="relative group">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-brand-primary transition-colors"
                  size={18}
                />
                <Input
                  placeholder="Name, Mobile or Email..."
                  className="pl-11 h-12 border-border/60 hover:border-border focus:border-brand-primary transition-all bg-muted/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Department Filter */}
            <div className="flex flex-col gap-3">
              <Typography
                variant="body5"
                weight="bold"
                className="uppercase tracking-widest text-[10px] text-muted-foreground/80 flex items-center gap-2"
              >
                <span className="w-4 h-px bg-muted-foreground/30" />
                By Department
              </Typography>
              <SelectDropdown
                options={departmentOptions}
                value={deptFilter}
                onChange={(val) => setDeptFilter(val as string)}
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
                By Exam Level
              </Typography>
              <SelectDropdown
                options={levelOptions}
                value={levelFilter}
                onChange={(val) => setLevelFilter(val as string)}
                placeholder="Select Level"
                isLoading={classificationQuery.isLoading}
              />
            </div>

            {/* Account Status Filter */}
            <div className="flex flex-col gap-3">
              <Typography
                variant="body5"
                weight="bold"
                className="uppercase tracking-widest text-[10px] text-muted-foreground/80 flex items-center gap-2"
              >
                <span className="w-4 h-px bg-muted-foreground/30" />
                Account Status
              </Typography>
              <SelectDropdown
                options={[
                  { id: "all", label: "All Statuses" },
                  { id: "active", label: "Active Only" },
                  { id: "disabled", label: "Disabled Only" },
                ]}
                value={statusFilter}
                onChange={(val) => setStatusFilter(val as string)}
                placeholder="Select Status"
              />
            </div>

            <Button
              variant="outline"
              className="mt-auto w-full h-11 font-bold uppercase tracking-widest text-[10px] gap-2"
              onClick={() => {
                setSearchQuery("");
                setDeptFilter("all");
                setStatusFilter("all");
                setLevelFilter("all");
              }}
            >
              <RotateCcw size={14} />
              Reset All
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
              fetchUsers();
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
                fetchUsers();
              }}
            />
          )}
        </div>
      </Modal>
    </>
  );
}
