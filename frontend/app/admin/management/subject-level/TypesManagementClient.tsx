"use client";

import React, { useState } from "react";
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
import { Plus, Edit, Trash2, Layers, Gauge } from "lucide-react";
import { Tabs, TabItem } from "@components/ui-elements/Tabs";
import { ManageTypeModal } from "./components/ManageTypeModal";
import { DeleteTypeModal } from "./components/DeleteTypeModal";
import { Badge } from "@components/ui-elements/Badge";
import { Switch } from "@components/ui-elements/Switch";
import { classificationsApi } from "@/lib/api/classifications";
import { Pagination } from "@components/ui-elements/Pagination";

interface BaseType {
  id: number;
  name: string;
  description: string;
  is_active: boolean;
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

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<BaseType | null>(null);
  const [typeToDelete, setTypeToDelete] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "" });

  const tabs: TabItem[] = [
    { label: "Subject", value: "subjects", icon: <Layers size={18} /> },
    { label: "Level", value: "levels", icon: <Gauge size={18} /> },
  ];

  const currentData = activeTab === "subjects" ? subjects : levels;
  const totalItems = currentData.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  // Sliced data based on pagination
  const paginatedData = currentData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const setTargetData = activeTab === "subjects" ? setSubjects : setLevels;
  const currentEntityName = activeTab === "subjects" ? "Subject" : "Level";
  const classificationType =
    activeTab === "subjects" ? "subject" : "exam_level";

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    setCurrentPage(1); // Reset page on tab change
  };

  const handleOpenModal = (item?: BaseType) => {
    if (item) {
      setEditingType(item);
      setFormData({ name: item.name, description: item.description });
    } else {
      setEditingType(null);
      setFormData({ name: "", description: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingType(null);
    setFormData({ name: "", description: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (editingType) {
        const response = await classificationsApi.updateClassification(
          editingType.id,
          {
            name: formData.name,
            metadata: { description: formData.description },
          },
        );
        const updatedItem = {
          id: response.id,
          name: response.name,
          description: (response.metadata?.description as string) || "",
          is_active: response.is_active,
        };
        setTargetData(
          currentData.map((t) => (t.id === editingType.id ? updatedItem : t)),
        );
      } else {
        const response = await classificationsApi.createClassification({
          type: classificationType,
          name: formData.name,
          metadata: { description: formData.description },
        });
        const newItem = {
          id: response.id,
          name: response.name,
          description: (response.metadata?.description as string) || "",
          is_active: response.is_active,
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

      <div className="mb-6">
        <Tabs tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />
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
        className="mb-6 flex-1 flex flex-col min-h-[500px]"
        bodyClassName="p-0 flex flex-col items-stretch flex-1"
        action={
          <Button
            variant="primary"
            size="md"
            color="primary"
            shadow
            animate="scale"
            iconAnimation="rotate-90"
            onClick={() => handleOpenModal()}
            disabled={isLoading}
            startIcon={<Plus size={18} />}
            className="font-bold"
          >
            Add {activeTab === "subjects" ? "Subject" : "Level"}
          </Button>
        }
      >
        <div className="flex-1 overflow-x-auto w-full">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] text-center">Sr. No.</TableHead>
                <TableHead>
                  {activeTab === "subjects" ? "Name" : "Level Name"}
                </TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead className="text-center w-[100px]">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No {activeTab} found.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((item, idx) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium text-center">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </TableCell>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.description}</TableCell>
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
                        <Button
                          variant="ghost"
                          color="primary"
                          size="icon"
                          animate="scale"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleOpenModal(item);
                          }}
                          title={`Edit ${currentEntityName}`}
                          className="h-8 w-8 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-500/10"
                        >
                          <Edit size={16} />
                        </Button>
                        <Button
                          variant="ghost"
                          color="error"
                          size="icon"
                          animate="scale"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleDeleteClick(item.id);
                          }}
                          title={`Delete ${currentEntityName}`}
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
