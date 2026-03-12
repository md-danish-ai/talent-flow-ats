"use client";

import React, { useState, useEffect } from "react";
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
import { Plus, Edit, Trash2, Building2, Loader2 } from "lucide-react";
import { Badge } from "@components/ui-elements/Badge";
import { Switch } from "@components/ui-elements/Switch";
import { departmentsApi, Department } from "@/lib/api/departments";
import { ManageDepartmentModal } from "./ManageDepartmentModal";
import { ConfirmModal } from "./ConfirmModal";

interface DepartmentListingProps {
  initialData: Department[];
}

export function DepartmentListing({ initialData }: DepartmentListingProps) {
  const [departments, setDepartments] = useState<Department[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department | null>(
    null,
  );

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deptToDelete, setDeptToDelete] = useState<number | null>(null);

  const [togglingId, setTogglingId] = useState<number | null>(null);

  const fetchDepartments = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await departmentsApi.getDepartments({
        page: currentPage,
        limit: pageSize,
        search: searchQuery,
      });
      setDepartments(response.data);
    } catch (error) {
      console.error("Failed to fetch departments:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, searchQuery]);

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
        className="mb-6 flex-1 flex flex-col min-h-[500px]"
        bodyClassName="p-0 flex flex-col items-stretch flex-1"
        action={
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
        }
      >
        <div className="flex-1 overflow-x-auto w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] text-center">Sr. No.</TableHead>
                <TableHead>Department Name</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead>Updated At</TableHead>
                <TableHead className="text-center w-[100px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {departments?.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No departments found.
                  </TableCell>
                </TableRow>
              ) : (
                departments?.map((dept, idx) => (
                  <TableRow key={dept.id}>
                    <TableCell className="font-medium text-center">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </TableCell>
                    <TableCell className="font-semibold">{dept.name}</TableCell>
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
                        <Button
                          variant="ghost"
                          color="primary"
                          size="icon"
                          animate="scale"
                          onClick={() => handleOpenModal(dept)}
                          title="Edit Department"
                          className="h-8 w-8 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          color="error"
                          size="icon"
                          animate="scale"
                          onClick={() => handleDeleteClick(dept.id)}
                          title="Delete Department"
                          className="h-8 w-8 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination would go here if backend supports meta in this structure */}
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
