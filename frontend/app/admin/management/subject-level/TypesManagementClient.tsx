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

interface BaseType {
    id: number;
    name: string;
    description: string;
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

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingType, setEditingType] = useState<BaseType | null>(null);
    const [typeToDelete, setTypeToDelete] = useState<number | null>(null);
    const [formData, setFormData] = useState({ name: "", description: "" });
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    const tabs: TabItem[] = [
        { label: "Subject", value: "subjects", icon: <Layers size={18} /> },
        { label: "Level", value: "levels", icon: <Gauge size={18} /> },
    ];

    const currentData = activeTab === "subjects" ? subjects : levels;
    const setTargetData = activeTab === "subjects" ? setSubjects : setLevels;
    const currentEntityName = activeTab === "subjects" ? "Subject" : "Level";

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingType) {
            setTargetData(
                currentData.map((t) =>
                    t.id === editingType.id ? { ...t, ...formData } : t
                )
            );
            showSuccess(`${currentEntityName} updated successfully!`);
        } else {
            const newItem = {
                id: Math.max(0, ...currentData.map((t) => t.id)) + 1,
                ...formData,
            };
            setTargetData([...currentData, newItem]);
            showSuccess(`${currentEntityName} added successfully!`);
        }
        handleCloseModal();
    };

    const showSuccess = (msg: string) => {
        setSuccessMessage(msg);
        setTimeout(() => setSuccessMessage(null), 3000);
    };

    const handleDeleteClick = (id: number) => {
        setTypeToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (typeToDelete !== null) {
            setTargetData(currentData.filter((t) => t.id !== typeToDelete));
            showSuccess(`${currentEntityName} deleted successfully!`);
            setIsDeleteModalOpen(false);
            setTypeToDelete(null);
        }
    };

    return (
        <PageContainer animate>
            <PageHeader
                title="Subject & Level Management"
                description="Configure and manage subject categories and seniority levels in one place."
            />

            <div className="mb-6">
                <Tabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
            </div>

            {successMessage && (
                <Alert
                    variant="success"
                    description={successMessage}
                    className="mb-6"
                    onClose={() => setSuccessMessage(null)}
                />
            )}

            <MainCard
                title={
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground shrink-0">
                            {activeTab === "subjects" ? <Layers size={20} /> : <Gauge size={20} />}
                        </div>
                        {activeTab === "subjects" ? "Subject List" : "Level List"}
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
                                <TableHead className="text-center w-[150px]">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {currentData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                        No {activeTab} found.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                currentData.map((item, idx) => (
                                    <TableRow key={item.id}>
                                        <TableCell className="font-medium text-center">
                                            {idx + 1}
                                        </TableCell>
                                        <TableCell>{item.name}</TableCell>
                                        <TableCell>{item.description}</TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center gap-2">
                                                <Button
                                                    variant="secondary"
                                                    color="primary"
                                                    size="icon-sm"
                                                    animate="scale"
                                                    onClick={() => handleOpenModal(item)}
                                                    title="Edit"
                                                >
                                                    <Pencil size={16} />
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    color="error"
                                                    size="icon-sm"
                                                    animate="scale"
                                                    onClick={() => handleDeleteClick(item.id)}
                                                    title="Delete"
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
            </MainCard>

            <ManageTypeModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                type={activeTab === "subjects" ? "subject" : "level"}
                editingType={editingType}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
            />

            <DeleteTypeModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={confirmDelete}
                description={`This ${currentEntityName} will be permanently removed.`}
            />
        </PageContainer>
    );
}
