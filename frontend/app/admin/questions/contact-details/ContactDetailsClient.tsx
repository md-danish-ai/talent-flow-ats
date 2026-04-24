"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { MainCard } from "@components/ui-cards/MainCard";
import { Button } from "@components/ui-elements/Button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableColumnToggle,
} from "@components/ui-elements/Table";
import { QuestionTableSkeleton } from "@components/ui-skeleton/QuestionTableSkeleton";
import { Pagination } from "@components/ui-elements/Pagination";
import {
  Plus,
  ListChecks,
  Upload,
  Sparkles as SparklesIcon,
} from "lucide-react";
import { questionsApi } from "@lib/api/questions";
import { Question, Classification } from "@types";
import { QUESTION_TYPES } from "@lib/constants/questions";
import { classificationsApi, ApiError } from "@lib/api";
import { cn } from "@lib/utils";
import { toast } from "@lib/toast";
import { filterSubjectsForQuestionType } from "@lib/utils/exclusivity";
import EditQuestionModal from "./components/EditContactDetailsModal";
import { ContactDetailsForm } from "@components/features/questions/ContactDetailsForm";
import { QuestionCreationModal } from "@components/features/questions/QuestionCreationModal";
import { ListingFiltersDrawer } from "@components/ui-elements/ListingFiltersDrawer";
import { ContactDetailsRow } from "./components/ContactDetailsRow";
import { BulkUploadModal } from "@components/features/questions/BulkUploadModal";
import { EmptyState } from "@components/ui-elements/EmptyState";
import { useListing } from "@hooks/useListing";
import { ListingTransition } from "@components/ui-elements/ListingTransition";
import { ListingHeaderActions, ListingBadge, ListingIcons } from "@components/ui-elements/ListingHeaderActions";
import { Tooltip } from "@components/ui-elements/Tooltip";

interface ContactDetailsListingFilters {
  search: string;
  subject: string;
  examLevel: string;
  marks: string;
  status: string;
}

export function ContactDetailsClient() {
  const router = useRouter();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

  const [subjects, setSubjects] = useState<Classification[]>([]);
  const [examLevels, setExamLevels] = useState<Classification[]>([]);

  const handleAuthError = useCallback(
    (error: unknown): boolean => {
      if (error instanceof ApiError && error.status === 401) {
        if (typeof document !== "undefined") {
          document.cookie = "role=; Max-Age=0; path=/";
          document.cookie = "auth_token=; Max-Age=0; path=/";
          document.cookie = "user_info=; Max-Age=0; path=/";
        }
        router.push("/sign-in");
        return true;
      }
      return false;
    },
    [router],
  );

  const {
    data: questions,
    isLoading,
    isBackgroundLoading,
    totalItems,
    totalPages,
    currentPage,
    pageSize,
    filters,
    activeFiltersCount,
    handleSingleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    resetFilters,
    refresh,
  } = useListing<Question, ContactDetailsListingFilters>({
    fetchFn: (params) => questionsApi.getQuestions(params),
    initialFilters: {
      search: "",
      subject: "all",
      examLevel: "all",
      marks: "all",
      status: "all",
    },
    filterMapping: (f) => ({
      question_type: QUESTION_TYPES.CONTACT_DETAILS,
      search: f.search || undefined,
      subject: f.subject !== "all" ? (f.subject as string) : undefined,
      exam_level: f.examLevel !== "all" ? (f.examLevel as string) : undefined,
      marks: f.marks !== "all" ? Number(f.marks) : undefined,
      is_active: f.status !== "all" ? f.status === "true" : undefined,
    }),
    toastMessage: "Contact details refreshed successfully",
    onError: handleAuthError,
  });

  // Column visibility
  const allColumns = [
    { id: "srNo", label: "Sr. No.", pinned: true },
    { id: "websiteUrl", label: "WebSiteURL" },
    { id: "companyName", label: "Organization" },
    { id: "name", label: "Company Name" },
    { id: "title", label: "Title" },
    { id: "primaryEmail", label: "Communication Email" },
    { id: "secondaryEmail", label: "Secondary Email Address" },
    { id: "linkedInUrl", label: "LinkedIn URL" },
    { id: "subject", label: "Subject" },
    { id: "examLevel", label: "Exam Level" },
    { id: "marks", label: "Marks" },
    { id: "createdDate", label: "Created Date" },
    { id: "status", label: "Status" },
    { id: "actions", label: "Action", pinned: true },
  ];

  const DEFAULT_VISIBLE_COLUMNS = [
    "srNo",
    "name",
    "companyName",
    "primaryEmail",
    "subject",
    "examLevel",
    "marks",
    "actions",
  ];

  const [visibleColumns, setVisibleColumns] = useState(DEFAULT_VISIBLE_COLUMNS);

  const toggleColumn = (id: string) => {
    setVisibleColumns((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  useEffect(() => {
    const fetchClassifications = async () => {
      try {
        const [subjectsRes, examLevelsRes] = await Promise.all([
          classificationsApi.getClassifications({
            type: "subject",
            is_active: true,
            limit: 100,
          }),
          classificationsApi.getClassifications({
            type: "exam_level",
            is_active: true,
            limit: 100,
          }),
        ]);
        const filteredSubjects = filterSubjectsForQuestionType(
          subjectsRes.data || [],
          QUESTION_TYPES.CONTACT_DETAILS,
        );
        setSubjects(filteredSubjects);
        setExamLevels(examLevelsRes.data || []);
      } catch (error) {
        console.error("Failed to fetch classifications:", error);
      }
    };
    void fetchClassifications();
  }, []);

  const handleToggleStatus = async (id: number) => {
    setTogglingId(id);
    try {
      await questionsApi.toggleQuestionStatus(id);
      void refresh();
      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Failed to toggle question status:", error);
      toast.error("Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <PageContainer animate>
      <MainCard
        title={
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground shrink-0">
              <ListChecks size={20} />
            </div>
            Company Contact Details
          </div>
        }
        className="mb-6 flex flex-col"
        bodyClassName="p-0 flex flex-row items-stretch w-full"
        action={
          <div className="flex items-center gap-3">
            <ListingBadge
              isLoading={isLoading}
              isBackgroundLoading={isBackgroundLoading}
              totalItems={totalItems}
              itemLabel="Entries"
            />
            <div className="h-6 w-px bg-border/50 mx-1" />
            <TableColumnToggle
              columns={allColumns}
              visibleColumns={visibleColumns}
              onToggle={toggleColumn}
              onReset={() => setVisibleColumns(DEFAULT_VISIBLE_COLUMNS)}
            />
            <div className="h-6 w-px bg-border/50 mx-1" />
            <ListingIcons
              isLoading={isLoading}
              isBackgroundLoading={isBackgroundLoading}
              onRefresh={refresh}
              onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
              isFilterOpen={isFilterOpen}
              activeFiltersCount={activeFiltersCount}
            />
            <div className="h-6 w-px bg-border/50 mx-1" />
            <Tooltip content="Bulk Upload" side="top">
              <Button
                variant="action"
                size="rounded-icon"
                isActive={isBulkUploadOpen}
                animate="scale"
                iconAnimation="rotate-360"
                onClick={() => setIsBulkUploadOpen(true)}
              >
                <Upload size={18} />
              </Button>
            </Tooltip>
            <div className="h-6 w-px bg-border/50 mx-1" />
            <Tooltip content="Add Question" side="top">
              <Button
                variant="action"
                color="primary"
                size="rounded-icon"
                animate="scale"
                iconAnimation="rotate-360"
                onClick={() => setIsAddOpen(true)}
              >
                <Plus size={20} />
              </Button>
            </Tooltip>
          </div>
        }
      >
        <div
          className={cn(
            "flex-1 w-full flex flex-col min-w-0 overflow-hidden relative",
            isFilterOpen && "border-r border-border/50",
          )}
        >
          <ListingTransition
            isLoading={isLoading}
            isBackgroundLoading={isBackgroundLoading}
          >
            <div className="flex-1 overflow-x-auto w-full">
              <Table>
                <TableHeader className="bg-muted/30">
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    {visibleColumns.includes("srNo") && (
                      <TableHead className="w-[80px] text-center">
                        Sr. No.
                      </TableHead>
                    )}
                    {visibleColumns.includes("websiteUrl") && (
                      <TableHead>WebSiteURL</TableHead>
                    )}
                    {visibleColumns.includes("companyName") && (
                      <TableHead>Organization</TableHead>
                    )}
                    {visibleColumns.includes("name") && (
                      <TableHead>Company Name</TableHead>
                    )}
                    {visibleColumns.includes("title") && (
                      <TableHead>Title</TableHead>
                    )}
                    {visibleColumns.includes("primaryEmail") && (
                      <TableHead>Communication Email</TableHead>
                    )}
                    {visibleColumns.includes("secondaryEmail") && (
                      <TableHead>Secondary Email Address</TableHead>
                    )}
                    {visibleColumns.includes("linkedInUrl") && (
                      <TableHead>LinkedIn URL</TableHead>
                    )}
                    {visibleColumns.includes("subject") && (
                      <TableHead>Subject</TableHead>
                    )}
                    {visibleColumns.includes("examLevel") && (
                      <TableHead>Exam Level</TableHead>
                    )}
                    {visibleColumns.includes("marks") && (
                      <TableHead className="w-[80px] text-center">
                        Marks
                      </TableHead>
                    )}
                    {visibleColumns.includes("createdDate") && (
                      <TableHead>Created Date</TableHead>
                    )}
                    {visibleColumns.includes("status") && (
                      <TableHead className="w-[100px] text-center">
                        Status
                      </TableHead>
                    )}
                    {visibleColumns.includes("actions") && (
                      <TableHead className="w-[140px] text-center">
                        Action
                      </TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <QuestionTableSkeleton
                      visibleColumns={visibleColumns}
                      rowCount={pageSize}
                    />
                  ) : questions.length === 0 ? (
                    <EmptyState
                      colSpan={visibleColumns.length + 1}
                      variant="search"
                      title="No questions found"
                      description="Try adjusting your filters or adding a new entry."
                    />
                  ) : (
                    questions.map((row, index) => (
                      <ContactDetailsRow
                        key={row.id}
                        row={row}
                        index={index}
                        currentPage={currentPage}
                        pageSize={pageSize}
                        visibleColumns={visibleColumns}
                        togglingId={togglingId}
                        onToggleStatus={handleToggleStatus}
                        onEdit={setEditingQuestion}
                      />
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {!isLoading && questions.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={totalItems}
                pageSize={pageSize}
                onPageSizeChange={handlePageSizeChange}
                className="mt-auto shrink-0 border-t"
              />
            )}
          </ListingTransition>
        </div>

        <ListingFiltersDrawer
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          registryKey="question-bank-filters"
          filters={filters}
          onFilterChange={handleSingleFilterChange}
          onReset={resetFilters}
          isLoading={isLoading}
          dynamicOptions={{
            subject: [
              { id: "all", label: "All Subjects" },
              ...subjects.map((s) => ({ id: s.code || "", label: s.name })),
            ],
            examLevel: [
              { id: "all", label: "All Levels" },
              ...examLevels.map((e) => ({ id: e.code || "", label: e.name })),
            ],
          }}
        />
      </MainCard>

      <QuestionCreationModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Contact Details Management"
        questionType={QUESTION_TYPES.CONTACT_DETAILS}
        onSuccess={() => void refresh()}
        renderManualForm={(onSuccess) => (
          <ContactDetailsForm onSuccess={onSuccess} />
        )}
      />
    </PageContainer>
  );
}
