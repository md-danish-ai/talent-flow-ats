"use client";

import React, { useState } from "react";
import { MainCard } from "@components/ui-cards/MainCard";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui-elements/Table";
import { Button } from "@components/ui-elements/Button";
import { TableIconButton } from "@components/ui-elements/TableIconButton";
import { Plus, Edit, Trash2, Building2 } from "lucide-react";
import { toast } from "@lib/toast";
import { cn } from "@lib/utils";
import { Badge } from "@components/ui-elements/Badge";
import { Switch } from "@components/ui-elements/Switch";
import { Pagination } from "@components/ui-elements/Pagination";
import { departmentsApi } from "@lib/api/departments";
import { type Department, PaginatedResponse } from "@types";
import { ManageDepartmentModal } from "./ManageDepartmentModal";
import { ConfirmModal } from "./ConfirmModal";
import { EmptyState } from "@components/ui-elements/EmptyState";
import { SimpleTableSkeleton } from "@components/ui-skeleton/SimpleTableSkeleton";
import { useListing } from "@hooks/useListing";
import { ListingFiltersDrawer } from "@components/ui-elements/ListingFiltersDrawer";
import { ListingTransition } from "@components/ui-elements/ListingTransition";
import { ListingHeaderActions } from "@components/ui-elements/ListingHeaderActions";
import { Tooltip } from "@components/ui-elements/Tooltip";

interface DepartmentListingProps {
  initialData?: PaginatedResponse<Department>;
}

export function DepartmentListing({ initialData }: DepartmentListingProps) {
  // Hook for standardized listing
  const {
    data: departments,
    isLoading,
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
  } = useListing<Department, { search: string }>({
    fetchFn: departmentsApi.getDepartments,
    initialFilters: { search: "" },
    initialData: initialData?.data,
    initialTotalItems: initialData?.pagination?.total_records,
    initialPageSize: 10,
    toastMessage: "Department list refreshed successfully",
  });

  // Modals Local State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null,
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenModal = (dept?: Department) => {
    setEditingDepartment(dept || null);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeptToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!deptToDelete) return;
    setIsDeleting(true);
    try {
      await departmentsApi.deleteDepartment(deptToDelete);
      void refresh();
      setIsDeleteModalOpen(false);
      toast.success("Department deleted successfully");
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (dept: Department) => {
    setTogglingId(dept.id);
    try {
      await departmentsApi.updateDepartment(dept.id, {
        is_active: !dept.is_active,
      });
      void refresh();
      toast.success(
        `Department ${!dept.is_active ? "activated" : "deactivated"}`,
      );
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
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
              <Building2 size={18} />
            </div>
            Departments
          </div>
        }
        className="mb-6 flex flex-col"
        bodyClassName="p-0 flex flex-row items-stretch w-full"
        action={
          <div className="flex items-center gap-4">
            <ListingHeaderActions
              isLoading={isLoading}
              isBackgroundLoading={isBackgroundLoading}
              totalItems={totalItems}
              itemLabel="Depts"
              onRefresh={refresh}
              onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
              isFilterOpen={isFilterOpen}
              activeFiltersCount={activeFiltersCount}
            />
            <Tooltip content="Add Department" side="top">
              <Button
                variant="action"
                color="primary"
                size="rounded-icon"
                animate="scale"
                iconAnimation="rotate-90"
                onClick={() => handleOpenModal()}
                disabled={isLoading}
              >
                <Plus size={20} />
              </Button>
            </Tooltip>
          </div>
        }
      >
        <div
          className={cn(
            "flex-1 flex flex-col min-w-0 relative",
            isFilterOpen && "border-r border-border/50",
          )}
        >
          <ListingTransition
            isLoading={isLoading}
            isBackgroundLoading={isBackgroundLoading}
          >
            <div className="flex-1 overflow-x-auto w-full h-full flex flex-col">
              <Table className="h-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px] text-center font-bold text-slate-500 text-xs uppercase">
                      Sr. No.
                    </TableHead>
                    <TableHead className="font-bold text-slate-500 text-xs uppercase">
                      Department Name
                    </TableHead>
                    <TableHead className="text-center font-bold text-slate-500 text-xs uppercase">
                      Status
                    </TableHead>
                    <TableHead className="font-bold text-slate-500 text-xs uppercase">
                      Created At
                    </TableHead>
                    <TableHead className="font-bold text-slate-500 text-xs uppercase">
                      Updated At
                    </TableHead>
                    <TableHead className="text-center w-[100px] font-bold text-slate-500 text-xs uppercase">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <SimpleTableSkeleton
                      rowCount={pageSize}
                      columnCount={6}
                      columnWidths={[
                        "w-[80px] text-center",
                        "font-semibold text-foreground",
                        "text-center",
                        "text-muted-foreground text-sm",
                        "text-muted-foreground text-sm",
                        "text-center w-[100px]",
                      ]}
                    />
                  ) : departments.length === 0 ? (
                    <EmptyState
                      colSpan={6}
                      variant="database"
                      title="No departments found"
                      description="You haven't added any departments yet. Click on the 'Add Department' button to get started."
                    />
                  ) : (
                    departments.map((dept, idx) => (
                      <TableRow key={dept.id}>
                        <TableCell className="font-medium text-center">
                          {(currentPage - 1) * pageSize + idx + 1}
                        </TableCell>
                        <TableCell className="font-semibold text-foreground">
                          {dept.name}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col items-center justify-center gap-1">
                            <Switch
                              checked={dept.is_active}
                              onChange={() => handleToggleStatus(dept)}
                              size="sm"
                              disabled={togglingId === dept.id}
                            />
                            <Badge
                              variant="outline"
                              shape="square"
                              color={dept.is_active ? "success" : "error"}
                            >
                              {dept.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {dept.created_at
                            ? new Date(dept.created_at).toLocaleString()
                            : "-"}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {dept.updated_at
                            ? new Date(dept.updated_at).toLocaleString()
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-1">
                            <TableIconButton
                              iconColor="brand"
                              btnSize="sm"
                              animate="scale"
                              onClick={() => handleOpenModal(dept)}
                              title="Edit Department"
                            >
                              <Edit size={16} />
                            </TableIconButton>
                            <TableIconButton
                              iconColor="red"
                              btnSize="sm"
                              animate="scale"
                              onClick={() => handleDeleteClick(dept.id)}
                              title="Delete Department"
                            >
                              <Trash2 size={16} />
                            </TableIconButton>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {!isLoading && departments.length > 0 && (
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
          registryKey="department-filters"
          filters={filters}
          onFilterChange={handleSingleFilterChange}
          onReset={resetFilters}
          isLoading={isLoading}
        />
      </MainCard>

      <ManageDepartmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingDepartment={editingDepartment}
        onSuccess={() => void refresh()}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Department"
        description="Are you sure you want to delete this department? This action cannot be undone."
        variant="danger"
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </>
  );
}
