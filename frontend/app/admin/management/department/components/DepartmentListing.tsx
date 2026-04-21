"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import { Plus, Edit, Trash2, Building2, Search } from "lucide-react";
import { Badge } from "@components/ui-elements/Badge";
import { Switch } from "@components/ui-elements/Switch";
import { Pagination } from "@components/ui-elements/Pagination";
import {
  departmentsApi,
  Department,
  PaginatedDepartmentsResponse,
} from "@/lib/api/departments";
import { ManageDepartmentModal } from "./ManageDepartmentModal";
import { ConfirmModal } from "./ConfirmModal";
import { EmptyState } from "@components/ui-elements/EmptyState";
import { SimpleTableSkeleton } from "@components/ui-skeleton/SimpleTableSkeleton";

interface DepartmentListingProps {
  initialData?: PaginatedDepartmentsResponse;
}

export function DepartmentListing({ initialData }: DepartmentListingProps) {
  // Data State
  const [departments, setDepartments] = useState<Department[]>(
    initialData?.data || [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [totalItems, setTotalItems] = useState(
    initialData?.pagination?.total_records || 0,
  );

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Modals State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null,
  );
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to first page on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchDepartments = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await departmentsApi.getDepartments({
        page: currentPage,
        limit: pageSize,
        search: debouncedSearch,
      });
      setDepartments(response.data || []);
      if (response.pagination) {
        setTotalItems(response.pagination.total_records);
      }
    } catch (error) {
      console.error("Failed to fetch departments:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, debouncedSearch]);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const handleOpenModal = (dept?: Department) => {
    setEditingDepartment(dept || null);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (id: number) => {
    setDeptToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (deptToDelete) {
      setIsLoading(true);
      try {
        await departmentsApi.deleteDepartment(deptToDelete);
        fetchDepartments();
        setIsDeleteModalOpen(false);
      } catch (error) {
        console.error("Delete failed:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleToggleStatus = async (dept: Department) => {
    setTogglingId(dept.id);
    try {
      await departmentsApi.updateDepartment(dept.id, {
        is_active: !dept.is_active,
      });
      fetchDepartments();
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
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground shrink-0">
              <Building2 size={20} />
            </div>
            Departments
          </div>
        }
        className="mb-6 flex flex-col"
        bodyClassName="p-0 flex flex-col items-stretch w-full"
        action={
          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="h-8 w-24 bg-muted animate-pulse rounded-full" />
            ) : (
              <Badge
                variant="outline"
                color="default"
                className="font-bold border-border/50 bg-card"
              >
                {totalItems} DEPTS
              </Badge>
            )}
            <div className="h-6 w-px bg-border/50 mx-1" />
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search departments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all w-64"
              />
            </div>
            <Button
              variant="primary"
              size="md"
              color="primary"
              shadow
              animate="scale"
              onClick={() => handleOpenModal()}
              disabled={isLoading}
              startIcon={<Plus size={18} />}
              className="font-bold"
            >
              Add Department
            </Button>
          </div>
        }
      >
        <div className="flex flex-col min-w-0 relative">
          <div className="overflow-x-auto w-full">
            <Table>
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
                            {dept.is_active ? "Activate" : "Deactivate"}
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
                            iconColor="blue"
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

          {totalItems > 0 && (
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

      <ManageDepartmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingDepartment={editingDepartment}
        onSuccess={fetchDepartments}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Department"
        description="Are you sure you want to delete this department? This action cannot be undone."
        variant="danger"
        confirmText="Delete"
        isLoading={isLoading}
      />
    </>
  );
}
