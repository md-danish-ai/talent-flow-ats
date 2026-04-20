"use client";

import React, { useState, useEffect, useCallback } from "react";
import { PageHeader } from "@components/ui-elements/PageHeader";
import { PageContainer } from "@components/ui-layout/PageContainer";
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
import { Plus, Edit, Trash2, Layers, Gauge } from "lucide-react";
import { Tabs, TabItem } from "@components/ui-elements/Tabs";
import { ManageTypeModal } from "./components/ManageTypeModal";
import { DeleteTypeModal } from "./components/DeleteTypeModal";
import { Badge } from "@components/ui-elements/Badge";
import { Switch } from "@components/ui-elements/Switch";
import {
  classificationsApi,
  type Classification,
} from "@/lib/api/classifications";
import { Pagination } from "@components/ui-elements/Pagination";
import { EmptyState } from "@components/ui-elements/EmptyState";

interface BaseType {
  id: number;
  name: string;
  code: string;
  description: string;
  is_active: boolean;
  metadata?: Record<string, unknown>;
}

interface TypesManagementClientProps {
  initialSubjectData: BaseType[];
  initialLevelData: BaseType[];
}

export function TypesManagementClient({
  initialSubjectData,
  initialLevelData,
}: TypesManagementClientProps) {
  const [activeTab, setActiveTab] = useState("subjects");
  const [subjects, setSubjects] = useState<BaseType[]>(initialSubjectData);
  const [levels, setLevels] = useState<BaseType[]>(initialLevelData);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<BaseType | null>(null);
  const [typeToDelete, setTypeToDelete] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    is_exclusive: false,
  });
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");

  const classificationType =
    activeTab === "subjects" ? "subject" : "exam_level";
  const setTargetData = activeTab === "subjects" ? setSubjects : setLevels;
  const currentData = activeTab === "subjects" ? subjects : levels;

  const fetchData = useCallback(async () => {
    setIsFetching(true);
    try {
      const params: {
        type?: string;
        is_active?: boolean;
        limit?: number;
      } = {
        type: classificationType,
        limit: 100,
      };

      if (statusFilter === "active") params.is_active = true;
      if (statusFilter === "inactive") params.is_active = false;

      const response = await classificationsApi.getClassifications(params);
      const formattedData = response.data.map((item: Classification) => ({
        id: item.id,
        name: item.name,
        code: item.code || "",
        description: (item.metadata?.description as string) || "",
        is_active: item.is_active,
        metadata: item.metadata,
      }));

      setTargetData(formattedData);
    } catch (error) {
      console.error("Failed to fetch classifications:", error);
    } finally {
      setIsFetching(false);
    }
  }, [classificationType, statusFilter, setTargetData]);

  // Refetch when tab or status filter changes
  useEffect(() => {
    // Skip initial fetch for the server-provided data if it's the first render
    // But for simplicity and correctness with filters, we can just fetch
    fetchData();
  }, [fetchData]);

  const tabs: TabItem[] = [
    { label: "Subject", value: "subjects", icon: <Layers size={18} /> },
    { label: "Level", value: "levels", icon: <Gauge size={18} /> },
  ];

  const totalItems = currentData.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  // Sliced data based on pagination
  const paginatedData = currentData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const currentEntityName = activeTab === "subjects" ? "Subject" : "Level";

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    setCurrentPage(1); // Reset page on tab change
  };

  const handleOpenModal = (item?: BaseType) => {
    if (item) {
      setEditingType(item);
      setFormData({
        name: item.name,
        description: item.description,
        is_exclusive: item.metadata?.is_exclusive === true,
      });
    } else {
      setEditingType(null);
      setFormData({ name: "", description: "", is_exclusive: false });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingType(null);
    setFormData({ name: "", description: "", is_exclusive: false });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const metadataToSubmit: Record<string, unknown> = {
        description: formData.description,
      };
      // For Subjects, allow saving the is_exclusive flag inside the record metadata
      if (classificationType === "subject" && formData.is_exclusive) {
        metadataToSubmit.is_exclusive = true;
      }

      if (editingType) {
        const response = await classificationsApi.updateClassification(
          editingType.id,
          {
            name: formData.name,
            metadata: metadataToSubmit,
          },
        );
        const updatedItem = {
          id: response.id,
          name: response.name,
          code: response.code || "",
          description: (response.metadata?.description as string) || "",
          is_active: response.is_active,
          metadata: response.metadata,
        };
        setTargetData(
          currentData.map((t) => (t.id === editingType.id ? updatedItem : t)),
        );
      } else {
        const response = await classificationsApi.createClassification({
          type: classificationType,
          name: formData.name,
          metadata: metadataToSubmit,
        });
        const newItem = {
          id: response.id,
          name: response.name,
          code: response.code || "",
          description: (response.metadata?.description as string) || "",
          is_active: response.is_active,
          metadata: response.metadata,
        };
        setTargetData([...currentData, newItem]);
      }
      handleCloseModal();
    } catch {
      // Error toast is handled globally
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    setTypeToDelete(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (typeToDelete !== null) {
      setIsLoading(true);
      try {
        await classificationsApi.deleteClassification(typeToDelete);
        setTargetData(currentData.filter((t) => t.id !== typeToDelete));
        setIsDeleteModalOpen(false);
        setTypeToDelete(null);
      } catch {
        // Error toast is handled globally
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleToggleStatus = async (item: BaseType) => {
    setTogglingId(item.id);
    try {
      const response = await classificationsApi.updateClassification(item.id, {
        is_active: !item.is_active,
      });
      const updatedItem = {
        ...item,
        is_active: response.is_active,
      };
      setTargetData(
        currentData.map((t) => (t.id === item.id ? updatedItem : t)),
      );
    } catch {
      // Error toast is handled globally
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <PageContainer animate>
      <PageHeader
        title="Subject & Level Management"
        description="Configure and manage subject categories and seniority levels in one place."
      />

      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1 rounded-lg border border-border shrink-0">
          <Button
            variant={statusFilter === "all" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setStatusFilter("all")}
            className="h-8 px-3 text-xs"
          >
            All
          </Button>
          <Button
            variant={statusFilter === "active" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setStatusFilter("active")}
            className="h-8 px-3 text-xs"
          >
            Active
          </Button>
          <Button
            variant={statusFilter === "inactive" ? "primary" : "ghost"}
            size="sm"
            onClick={() => setStatusFilter("inactive")}
            className="h-8 px-3 text-xs"
          >
            Inactive
          </Button>
        </div>
      </div>

      <MainCard
        title={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground shrink-0">
              {activeTab === "subjects" ? (
                <Layers size={20} />
              ) : (
                <Gauge size={20} />
              )}
            </div>
            {currentEntityName} List
          </div>
        }
        className="mb-6 flex flex-col"
        bodyClassName="p-0 flex flex-col items-stretch w-full"
        action={
          <Button
            variant="primary"
            size="md"
            color="primary"
            shadow
            animate="scale"
            iconAnimation="rotate-90"
            onClick={() => handleOpenModal()}
            disabled={isLoading || isFetching}
            startIcon={<Plus size={18} />}
            className="font-bold"
          >
            Add {activeTab === "subjects" ? "Subject" : "Level"}
          </Button>
        }
      >
        <div className="overflow-x-auto w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] text-center">Sr. No.</TableHead>
                <TableHead>
                  {activeTab === "subjects" ? "Subject Name" : "Level Name"}
                </TableHead>
                {activeTab === "subjects" && (
                  <TableHead>Subject Code</TableHead>
                )}
                <TableHead>Description</TableHead>
                {activeTab === "subjects" && (
                  <TableHead className="text-center">Exclusive</TableHead>
                )}
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center w-[100px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <EmptyState
                  colSpan={activeTab === "subjects" ? 7 : 5}
                  variant="database"
                  title={`No ${activeTab} found`}
                  description={`You haven't added any ${activeTab} yet. Click on the 'Add ${activeTab === "subjects" ? "Subject" : "Level"}' button to get started.`}
                />
              ) : (
                paginatedData.map((item, idx) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-center">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    {activeTab === "subjects" && (
                      <TableCell>
                        {item.code ? (
                          <Badge
                            variant="outline"
                            shape="square"
                            color="primary"
                            className="font-black text-[9px] px-2 py-0.5 border-brand-primary/20 uppercase tracking-widest"
                          >
                            {item.code}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-xs italic">
                            —
                          </span>
                        )}
                      </TableCell>
                    )}
                    <TableCell>{item.description}</TableCell>
                    {activeTab === "subjects" && (
                      <TableCell className="text-center">
                        {item.metadata?.is_exclusive ? (
                          <Badge
                            variant="outline"
                            color="success"
                            shape="square"
                          >
                            Yes
                          </Badge>
                        ) : (
                          <Badge variant="outline" color="error" shape="square">
                            No
                          </Badge>
                        )}
                      </TableCell>
                    )}
                    <TableCell>
                      <div className="flex flex-col items-center justify-center gap-1">
                        <Switch
                          checked={item.is_active}
                          onChange={() => handleToggleStatus(item)}
                          size="sm"
                          disabled={togglingId === item.id}
                        />
                        <Badge
                          variant="outline"
                          shape="square"
                          color={item.is_active ? "success" : "error"}
                        >
                          {item.is_active ? "Activate" : "Deactivate"}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <TableIconButton
                          iconColor="blue"
                          btnSize="sm"
                          animate="scale"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleOpenModal(item);
                          }}
                          title={`Edit ${currentEntityName}`}
                        >
                          <Edit size={16} />
                        </TableIconButton>
                        <TableIconButton
                          iconColor="red"
                          btnSize="sm"
                          animate="scale"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDeleteClick(item.id);
                          }}
                          title={`Delete ${currentEntityName}`}
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
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
            className="mt-auto shrink-0 border-t border-border"
          />
        )}
      </MainCard>

      <ManageTypeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        type={activeTab === "subjects" ? "subject" : "level"}
        editingType={editingType}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />

      <DeleteTypeModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        description={`This ${currentEntityName} will be permanently removed from the database.`}
      />
    </PageContainer>
  );
}
