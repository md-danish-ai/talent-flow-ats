"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { PageHeader } from "@components/ui-elements/PageHeader";
import { MainCard } from "@components/ui-cards/MainCard";
import { Button } from "@components/ui-elements/Button";
import { Plus, FileText } from "lucide-react";
import { toast } from "@lib/toast";
import { PaperSetupTable } from "./components/PaperSetupTable";
import { papersApi, PaperSetup } from "@lib/api/papers";
import { TableColumnToggle } from "@components/ui-elements/Table";

export function PaperSetupClient() {
  const router = useRouter();
  const [papers, setPapers] = useState<Partial<PaperSetup>[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<string[]>([
    "sr_no",
    "paper_name",
    "department",
    "test_level",
    "timing",
    "total_marks",
    "active",
    "actions",
  ]);

  const columns = [
    { id: "sr_no", label: "Sr. No.", pinned: true },
    { id: "paper_name", label: "Test Paper", pinned: true },
    { id: "department", label: "Department" },
    { id: "test_level", label: "Test Level" },
    { id: "description", label: "Description" },
    { id: "timing", label: "Timing" },
    { id: "total_marks", label: "Total Marks" },
    { id: "active", label: "Active Status" },
    { id: "actions", label: "Actions", pinned: true },
  ];

  const handleToggleColumn = (id: string) => {
    setVisibleColumns((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const fetchPapers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await papersApi.getPapers({
        page: currentPage,
        limit: pageSize,
      });
      setPapers(response.data);
      setTotalItems(response.pagination.total_records);
    } catch (error) {
      console.error("Failed to fetch papers:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchPapers();
  }, [fetchPapers]);

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    setTogglingId(id);
    try {
      await papersApi.togglePaperStatus(id, !currentStatus);
      fetchPapers();
      toast.success(`Paper ${!currentStatus ? "activated" : "deactivated"}`);
    } catch {
      // toast.error("Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this paper?")) return;
    try {
      await papersApi.deletePaper(id);
      toast.success("Paper deleted successfully");
      fetchPapers();
    } catch {
      // toast.error("Failed to delete paper");
    }
  };

  const handleEditClick = (id: number) => {
    router.push(`/admin/paper/setup/edit/${id}`);
  };

  const handleViewDetails = (id: number) => {
    router.push(`/admin/paper/setup/detail/${id}`);
  };

  return (
    <PageContainer animate>
      <PageHeader
        title="Paper Management System"
        description="Configure and manage test papers, subject-wise weightage, and evaluation criteria with ease."
      />

      <MainCard
        title={
          <div className="flex items-center gap-2">
            <FileText size={20} className="text-brand-primary" />
            Active Test Papers
          </div>
        }
        action={
          <div className="flex items-center gap-3">
            <TableColumnToggle
              columns={columns}
              visibleColumns={visibleColumns}
              onToggle={handleToggleColumn}
            />
            <Button
              variant="primary"
              color="primary"
              size="md"
              shadow
              animate="scale"
              onClick={() => {
                router.push("/admin/paper/setup/create");
              }}
              startIcon={<Plus size={18} />}
              className="font-bold border-none"
            >
              Create New Paper
            </Button>
          </div>
        }
        className="mt-6 flex flex-col"
        bodyClassName="p-0 flex-1 overflow-hidden"
      >
        <PaperSetupTable
          data={papers}
          totalItems={totalItems}
          currentPage={currentPage}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          isLoading={isLoading}
          togglingId={togglingId}
          onToggleStatus={handleToggleStatus}
          onEdit={(paper) => handleEditClick(paper.id!)}
          onDelete={handleDelete}
          onViewDetails={handleViewDetails}
          visibleColumns={visibleColumns}
        />
      </MainCard>
    </PageContainer>
  );
}
