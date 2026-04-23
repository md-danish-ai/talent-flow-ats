"use client";

import React, { useState, useMemo } from "react";
import { PageHeader } from "@components/ui-elements/PageHeader";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { MainCard } from "@components/ui-cards/MainCard";
import { Button } from "@components/ui-elements/Button";
import { Layers, Gauge, RefreshCcw, Plus, Filter } from "lucide-react";
import { Tooltip } from "@components/ui-elements/Tooltip";
import { cn } from "@lib/utils";
import { ManageTypeModal } from "./components/ManageTypeModal";
import { DeleteTypeModal } from "./components/DeleteTypeModal";
import { Badge } from "@components/ui-elements/Badge";
import { classificationsApi } from "@lib/api/classifications";
import { Classification, PaginatedResponse } from "@types";
import { Pagination } from "@components/ui-elements/Pagination";
import { classificationSchema } from "@lib/validations/management";
import { Skeleton } from "@components/ui-elements/Skeleton";
import { useListing } from "@hooks/useListing";
import { ListingFiltersDrawer } from "@components/ui-elements/ListingFiltersDrawer";

import { TypeTable, type BaseType } from "./components/TypeTable";

type TypesListingFilters = {
  type: string;
  search: string;
  status: "all" | "active" | "inactive";
};

interface TypesManagementClientProps {
  initialSubjectData?: PaginatedResponse<Classification>;
  initialLevelData?: PaginatedResponse<Classification>;
}

export function TypesManagementClient({
  initialSubjectData,
}: TypesManagementClientProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const {
    data: items,
    isLoading: isFetching,
    totalItems,
    currentPage,
    pageSize,
    filters,
    activeFiltersCount,
    handleFilterChange,
    handleSingleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    resetFilters,
    refresh,
    fetchItems,
  } = useListing<Classification, TypesListingFilters>({
    fetchFn: (params) => classificationsApi.getClassifications(params),
    initialFilters: {
      type: "subjects",
      search: "",
      status: "all",
    },
    initialData: initialSubjectData?.data,
    initialTotalItems: initialSubjectData?.pagination.total_records,
    filterMapping: (f) => ({
      type: f.type === "subjects" ? "subject" : "exam_level",
      search: f.search || undefined,
      is_active:
        f.status === "active"
          ? true
          : f.status === "inactive"
            ? false
            : undefined,
    }),
    toastMessage: "Classification list refreshed successfully",
  });

  const activeTab = filters.type;

  const currentData = useMemo(
    () =>
      items.map((item) => ({
        id: item.id,
        name: item.name,
        code: item.code || "",
        description: (item.metadata?.description as string) || "",
        is_active: item.is_active,
        metadata: item.metadata,
      })),
    [items],
  );

  const [isLoading, setIsLoading] = useState(false);
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

  const classificationType =
    activeTab === "subjects" ? "subject" : "exam_level";

  const currentEntityName = activeTab === "subjects" ? "Subject" : "Level";

  const handleTabChange = (newTab: string) => {
    handleFilterChange({ type: newTab });
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
    const result = classificationSchema.safeParse(formData);
    if (!result.success) return;

    setIsLoading(true);
    try {
      const metadataToSubmit: Record<string, unknown> = {
        description: formData.description,
      };
      if (classificationType === "subject" && formData.is_exclusive) {
        metadataToSubmit.is_exclusive = true;
      }

      if (editingType) {
        await classificationsApi.updateClassification(editingType.id, {
          name: formData.name,
          metadata: metadataToSubmit,
        });
      } else {
        await classificationsApi.createClassification({
          type: classificationType,
          name: formData.name,
          metadata: metadataToSubmit,
        });
      }
      void fetchItems();
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
        void fetchItems();
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
      await classificationsApi.updateClassification(item.id, {
        is_active: !item.is_active,
      });
      void fetchItems();
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
        bodyClassName="p-0 flex flex-row items-stretch w-full"
        action={
          <div className="flex items-center gap-3">
            {isFetching ? (
              <Skeleton className="h-8 w-24 rounded-full" />
            ) : (
              <Badge
                variant="outline"
                color="default"
                className="font-bold border-border/50 bg-card"
              >
                {totalItems}{" "}
                {totalItems === 1
                  ? currentEntityName.toUpperCase()
                  : activeTab === "subjects"
                    ? "SUBJECTS"
                    : "LEVELS"}
              </Badge>
            )}
            <div className="h-6 w-px bg-border/50 mx-1" />

            <Tooltip content="Refresh Data" side="bottom">
              <Button
                variant="action"
                size="rounded-icon"
                animate="scale"
                onClick={refresh}
                disabled={isFetching}
                aria-label="Refresh list"
              >
                <div className={cn(isFetching && "animate-spin")}>
                  <RefreshCcw size={18} />
                </div>
              </Button>
            </Tooltip>

            <Tooltip
              content={
                activeFiltersCount > 0
                  ? `Filters (${activeFiltersCount} active)`
                  : "Filter"
              }
              side="bottom"
            >
              <Button
                variant="action"
                size="rounded-icon"
                isActive={isFilterOpen}
                animate="scale"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                {activeFiltersCount > 0 ? (
                  <span className="relative">
                    <Filter size={18} />
                    <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-brand-primary text-white text-[8px] font-black flex items-center justify-center leading-none border border-card">
                      {activeFiltersCount}
                    </span>
                  </span>
                ) : (
                  <Filter size={18} />
                )}
              </Button>
            </Tooltip>
            <div className="h-6 w-px bg-border/50 mx-1" />
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
              className="font-bold border-none"
              aria-label={`Add new ${currentEntityName}`}
            >
              Add {activeTab === "subjects" ? "Subject" : "Level"}
            </Button>
          </div>
        }
      >
        <div
          className={cn(
            "flex-1 flex flex-col min-w-0 relative",
            isFilterOpen && "border-r border-border/50",
          )}
        >
          <TypeTable
            activeTab={activeTab}
            currentData={currentData}
            isFetching={isFetching}
            currentPage={currentPage}
            pageSize={pageSize}
            togglingId={togglingId}
            onEdit={handleOpenModal}
            onDelete={handleDeleteClick}
            onToggleStatus={handleToggleStatus}
          />

          {!isFetching && totalItems > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(totalItems / pageSize)}
              onPageChange={handlePageChange}
              totalItems={totalItems}
              pageSize={pageSize}
              onPageSizeChange={handlePageSizeChange}
              className="mt-auto shrink-0 border-t border-border"
            />
          )}
        </div>
        <ListingFiltersDrawer
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          registryKey="type-management-filters"
          filters={filters}
          onFilterChange={handleSingleFilterChange}
          onReset={resetFilters}
          isLoading={isFetching}
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
        isLoading={isLoading}
      />
    </PageContainer>
  );
}
