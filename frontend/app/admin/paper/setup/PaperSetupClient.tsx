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
import { PaperSetupForm } from "@components/features/paper-setup";
import { PaperSetupDetail } from "./components/PaperSetupDetail";
import { papersApi, PaperSetup, PaperSetupCreate } from "@lib/api/papers";

type ViewState = "listing" | "add" | "edit" | "detail";

export function PaperSetupClient() {
  const router = useRouter();
  const [view, setView] = useState<ViewState>("listing");
  const [papers, setPapers] = useState<Partial<PaperSetup>[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedPaper, setSelectedPaper] =
    useState<Partial<PaperSetup> | null>(null);
  const [selectedPaperId, setSelectedPaperId] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  const fetchPapers = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await papersApi.getPapers();
      setPapers(response.data);
      setTotalItems(response.pagination.total_records);
    } catch (error) {
      console.error("Failed to fetch papers:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPapers();
  }, [fetchPapers]);

  const handleUpdate = async (data: PaperSetupCreate) => {
    if (!selectedPaper?.id) return;
    setIsLoading(true);
    try {
      await papersApi.updatePaper(selectedPaper.id, data);
      toast.success("Paper updated successfully");
      setView("listing");
      fetchPapers();
    } catch {
      // toast.error("Failed to update paper");
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    setTogglingId(id);
    try {
      await papersApi.togglePaperStatus(id);
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

  const handleEditClick = (paper: Partial<PaperSetup>) => {
    setSelectedPaper(paper);
    setView("edit");
  };

  const handleViewDetails = (id: number) => {
    setSelectedPaperId(id);
    setView("detail");
  };

  return (
    <PageContainer animate>
      {view === "listing" && (
        <>
          <PageHeader
            title="Paper Setup"
            description="Create and manage your examination papers with granular control."
          />

          <MainCard
            title={
              <div className="flex items-center gap-2">
                <FileText size={20} className="text-brand-primary" />
                Paper Setup Listing
              </div>
            }
            action={
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
              onEdit={handleEditClick}
              onDelete={handleDelete}
              onViewDetails={handleViewDetails}
            />
          </MainCard>
        </>
      )}

      {view === "edit" && (
        <PaperSetupForm
          initialData={selectedPaper || undefined}
          onSubmit={handleUpdate}
          onCancel={() => setView("listing")}
          isLoading={isLoading}
        />
      )}

      {view === "detail" && selectedPaperId && (
        <PaperSetupDetail
          paperId={selectedPaperId}
          onBack={() => setView("listing")}
        />
      )}
    </PageContainer>
  );
}
