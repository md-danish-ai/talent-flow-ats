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
import { Plus, Pencil, Trash2, Layers, Gauge } from "lucide-react";
import { Alert } from "@components/ui-elements/Alert";
import { Tabs, TabItem } from "@components/ui-elements/Tabs";
import { ManageTypeModal } from "./components/ManageTypeModal";
import { DeleteTypeModal } from "./components/DeleteTypeModal";
import { ToggleTypeModal } from "./components/ToggleTypeModal";
import { ActionMenu } from "@components/ui-elements/ActionMenu";
import { MoreVertical, ToggleLeft, ToggleRight } from "lucide-react";
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
    const [typeToToggle, setTypeToToggle] = useState<BaseType | null>(null);
    const [isToggleModalOpen, setIsToggleModalOpen] = useState(false);
    const [formData, setFormData] = useState({ name: "", description: "" });
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

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
        currentPage * pageSize
    );

    const setTargetData = activeTab === "subjects" ? setSubjects : setLevels;
    const currentEntityName = activeTab === "subjects" ? "Subject" : "Level";
    const classificationType = activeTab === "subjects" ? "subject" : "exam_level";

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
        setErrorMessage(null);
        try {
            if (editingType) {
                const response = await classificationsApi.updateClassification(editingType.id, {
                    name: formData.name,
                    metadata: { description: formData.description }
                });
                const updatedItem = {
                    id: response.id,
                    name: response.name,
                    description: (response.metadata?.description as string) || "",
                    is_active: response.is_active
                };
                setTargetData(currentData.map((t) => (t.id === editingType.id ? updatedItem : t)));
                showSuccess(`${currentEntityName} updated successfully!`);
            } else {
                const response = await classificationsApi.createClassification({
                    type: classificationType,
                    name: formData.name,
                    metadata: { description: formData.description }
                });
                const newItem = {
                    id: response.id,
                    name: response.name,
                    description: (response.metadata?.description as string) || "",
                    is_active: response.is_active
                };
                setTargetData([...currentData, newItem]);
                showSuccess(`${currentEntityName} added successfully!`);
            }
            handleCloseModal();
        } catch (error) {
            setErrorMessage((error as Error).message || "Failed to save classification");
        } finally {
            setIsLoading(false);
        }
    };

    const showSuccess = (msg: string) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    const handleDeleteClick = (id: number) => {
        setTypeToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (typeToDelete !== null) {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                await classificationsApi.deleteClassification(typeToDelete);
                setTargetData(currentData.filter((t) => t.id !== typeToDelete));
                showSuccess(`${currentEntityName} permanently deleted successfully!`);
                setIsDeleteModalOpen(false);
                setTypeToDelete(null);
            } catch (error) {
                setErrorMessage((error as Error).message || "Failed to delete classification");
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleToggleClick = (item: BaseType) => {
        setTypeToToggle(item);
        setIsToggleModalOpen(true);
    };

    const confirmToggle = async () => {
        if (typeToToggle) {
            setIsLoading(true);
            setErrorMessage(null);
            try {
                const response = await classificationsApi.updateClassification(typeToToggle.id, {
                    is_active: !typeToToggle.is_active
                });
                const updatedItem = {
                    ...typeToToggle,
                    is_active: response.is_active
                };
                setTargetData(currentData.map((t) => (t.id === typeToToggle.id ? updatedItem : t)));
                showSuccess(`${currentEntityName} ${response.is_active ? 'enabled' : 'disabled'} successfully!`);
                setIsToggleModalOpen(false);
                setTypeToToggle(null);
            } catch (error) {
                setErrorMessage((error as Error).message || `Failed to ${typeToToggle.is_active ? 'disable' : 'enable'} classification`);
            } finally {
                setIsLoading(false);
            }
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

            {successMessage && (
                <Alert
                    variant="success"
                    description={successMessage}
                    className="mb-6"
                    onClose={() => setSuccessMessage(null)}
                />
            )}

            {errorMessage && (
                <Alert
                    variant="error"
                    description={errorMessage}
                    className="mb-6"
                    onClose={() => setErrorMessage(null)}
                />
            )}

            <MainCard
                title={
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground shrink-0">
                            {activeTab === "subjects" ? <Layers size={20} /> : <Gauge size={20} />}
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
                                <TableHead>{activeTab === "subjects" ? "Name" : "Level Name"}</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-center w-[100px]">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {paginatedData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
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
                                            <div className="flex items-center gap-2">
                                                <div className={`w-2 h-2 rounded-full ${item.is_active ? 'bg-emerald-500' : 'bg-red-500'}`} />
                                                <span className={item.is_active ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-red-600 dark:text-red-400 font-medium"}>
                                                    {item.is_active ? 'Active' : 'Disabled'}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center">
                                                <ActionMenu
                                                    button={
                                                        <div className="p-2 rounded-lg hover:bg-muted text-muted-foreground transition-colors">
                                                            <MoreVertical size={18} />
                                                        </div>
                                                    }
                                                    items={[
                                                        {
                                                            key: "edit",
                                                            label: "Edit",
                                                            icon: <Pencil size={16} />,
                                                            onClick: (event) => {
                                                                event.stopPropagation();
                                                                handleOpenModal(item);
                                                            }
                                                        },
                                                        {
                                                            key: "toggle",
                                                            label: item.is_active ? "Disable" : "Enable",
                                                            icon: item.is_active ? <ToggleRight size={16} /> : <ToggleLeft size={16} />,
                                                            onClick: (event) => {
                                                                event.stopPropagation();
                                                                handleToggleClick(item);
                                                            }
                                                        },
                                                        {
                                                            key: "delete",
                                                            label: "Delete",
                                                            icon: <Trash2 size={16} className="text-red-500" />,
                                                            className: "hover:!bg-red-50 hover:!text-red-600 dark:hover:!bg-red-900/20",
                                                            onClick: (event) => {
                                                                event.stopPropagation();
                                                                handleDeleteClick(item.id);
                                                            }
                                                        }
                                                    ]}
                                                />
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

            <ToggleTypeModal
                isOpen={isToggleModalOpen}
                onClose={() => setIsToggleModalOpen(false)}
                onConfirm={confirmToggle}
                isActive={typeToToggle?.is_active ?? false}
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
