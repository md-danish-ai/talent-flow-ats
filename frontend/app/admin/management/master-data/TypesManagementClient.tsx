"use client";

import React, { useState, useMemo } from "react";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { MainCard } from "@components/ui-cards/MainCard";
import { Button } from "@components/ui-elements/Button";
import { Layers, Gauge, Plus, ShieldCheck, Users, Heart, Droplet, GraduationCap, Globe, BookOpen, Tag } from "lucide-react";
import { cn } from "@lib/utils";
import { ManageTypeModal } from "./components/ManageTypeModal";

import { classificationsApi } from "@lib/api/classifications";
import { Classification, PaginatedResponse } from "@types";
import { Pagination } from "@components/ui-elements/Pagination";
import { classificationSchema } from "@lib/validations/management";
import { useListing } from "@hooks/useListing";
import { ListingFiltersDrawer } from "@components/ui-elements/ListingFiltersDrawer";
import { ListingTransition } from "@components/ui-elements/ListingTransition";
import { ListingHeaderActions } from "@components/ui-elements/ListingHeaderActions";
import { Tooltip } from "@components/ui-elements/Tooltip";
import { Tabs, type TabItem } from "@components/ui-elements/Tabs";
import { Select } from "@components/ui-elements/Select";

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
    isBackgroundLoading,
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
  } = useListing<Classification, TypesListingFilters>({
    fetchFn: (params) => classificationsApi.getClassifications(params),
    initialFilters: {
      type: "subject",
      search: "",
      status: "all",
    },
    initialData: initialSubjectData?.data,
    initialTotalItems: initialSubjectData?.pagination?.total_records,
    filterMapping: (f) => ({
      type: f.type,
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
  const [editingType, setEditingType] = useState<BaseType | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
    is_exclusive: false,
  });

  const classificationType = activeTab;

  const tabs: TabItem[] = [
    { label: "Subjects", value: "subject", icon: <Layers size={18} /> },
    { label: "Exam Levels", value: "exam_level", icon: <Gauge size={18} /> },
    { label: "Interview Results", value: "interview_result", icon: <ShieldCheck size={18} /> },
    { label: "Family Relation", value: "family_relation", icon: <Users size={18} /> },
    { label: "Marital Status", value: "marital_status", icon: <Heart size={18} /> },
    { label: "Blood Group", value: "blood_group", icon: <Droplet size={18} /> },
    { label: "Education", value: "education_category", icon: <GraduationCap size={18} /> },
    { label: "Language", value: "language", icon: <Globe size={18} /> },
    { label: "Religion", value: "religion", icon: <BookOpen size={18} /> },
    { label: "Category", value: "social_category", icon: <Tag size={18} /> },
  ];

  const handleTabChange = (newTab: string) => {
    handleFilterChange({ type: newTab });
  };

  const handleOpenModal = (item?: BaseType) => {
    if (item) {
      setEditingType(item);
      setFormData({
        name: item.name,
        code: item.code,
        description: item.description,
        is_exclusive: item.metadata?.is_exclusive === true,
      });
    } else {
      setEditingType(null);
      setFormData({ name: "", code: "", description: "", is_exclusive: false });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingType(null);
    setFormData({ name: "", code: "", description: "", is_exclusive: false });
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
          code: formData.code,
          metadata: metadataToSubmit,
        });
      } else {
        await classificationsApi.createClassification({
          type: classificationType,
          name: formData.name,
          code: formData.code,
          metadata: metadataToSubmit,
        });
      }
      void refresh();
      handleCloseModal();
    } catch {
      // Error toast is handled globally
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (item: BaseType) => {
    setTogglingId(item.id);
    try {
      await classificationsApi.updateClassification(item.id, {
        is_active: !item.is_active,
      });
      void refresh();
    } catch {
      // Error toast is handled globally
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <PageContainer animate>
      <MainCard
        title={
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
              <Layers size={18} />
            </div>
            Master Data
          </div>
        }
        className="mb-6 flex flex-col min-h-0"
        bodyClassName="p-0 flex flex-col md:flex-row items-stretch w-full flex-1 min-h-[500px]"
        action={
          <div className="flex items-center gap-3">
            <ListingHeaderActions
              isLoading={isFetching}
              isBackgroundLoading={isBackgroundLoading}
              totalItems={totalItems}
              itemLabel={tabs.find((t) => t.value === activeTab)?.label || "Records"}
              onRefresh={refresh}
              onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
              isFilterOpen={isFilterOpen}
              activeFiltersCount={activeFiltersCount}
            />
            <Tooltip
              content={`Add ${tabs.find((t) => t.value === activeTab)?.label || "Item"}`}
              side="top"
            >
              <Button
                variant="action"
                color="primary"
                size="rounded-icon"
                animate="scale"
                iconAnimation="rotate-90"
                onClick={() => handleOpenModal()}
                disabled={isLoading || isFetching}
              >
                <Plus size={20} />
              </Button>
            </Tooltip>
          </div>
        }
      >
        {/* Left Sidebar inside Card Body */}
        <div className="w-full md:w-[240px] shrink-0 border-r border-border/50 bg-muted/10 p-3">
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onChange={handleTabChange}
            variant="sidebar"
            orientation="vertical"
            size="md"
            fullWidth
          />
        </div>

        {/* Right Content Area inside Card Body */}
        <div
          className={cn(
            "flex-1 flex flex-col min-w-0 relative bg-background",
            isFilterOpen && "border-r border-border/50"
          )}
        >
          <ListingTransition
            isLoading={isFetching}
            isBackgroundLoading={isBackgroundLoading}
          >
            <TypeTable
              activeTab={activeTab}
              currentData={currentData}
              isFetching={isFetching}
              currentPage={currentPage}
              pageSize={pageSize}
              togglingId={togglingId}
              onEdit={handleOpenModal}
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
          </ListingTransition>
          <ListingFiltersDrawer
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            registryKey="type-management-filters"
            filters={filters}
            onFilterChange={handleSingleFilterChange}
            onReset={resetFilters}
            isLoading={isFetching}
          />
        </div>
      </MainCard>

      <ManageTypeModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        type={activeTab}
        editingType={editingType}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </PageContainer>
  );

}
