"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@lib/utils";
import { Button } from "@components/ui-elements/Button";

import { toast } from "@lib/toast";
import { EditQuestionModal } from "./components/EditQuestionModal";
import { AddQuestionForm } from "@components/features/questions/AddQuestionForm";
import { QuestionCreationModal } from "@components/features/questions/QuestionCreationModal";
import { PageContainer } from "@components/ui-layout/PageContainer";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableColumnToggle,
} from "@components/ui-elements/Table";
import { QuestionTableSkeleton } from "@components/ui-skeleton/QuestionTableSkeleton";

import { Plus, ListChecks, Upload } from "lucide-react";
import { MainCard } from "@components/ui-cards/MainCard";
import { Pagination } from "@components/ui-elements/Pagination";
import { questionsApi } from "@lib/api/questions";
import { QUESTION_TYPES } from "@lib/constants/questions";
import { classificationsApi, ApiError } from "@lib/api";
import { Question, Classification } from "@types";
import { filterSubjectsForQuestionType } from "@lib/utils/exclusivity";

import { ListingFiltersDrawer } from "@components/ui-elements/ListingFiltersDrawer";
import { MCQRow } from "./components/MCQRow";
import { BulkUploadModal } from "@components/features/questions/BulkUploadModal";
import { EmptyState } from "@components/ui-elements/EmptyState";
import { useListing } from "@hooks/useListing";
import {
  ListingBadge,
  ListingIcons,
} from "@components/ui-elements/ListingHeaderActions";
import { ListingTransition } from "@components/ui-elements/ListingTransition";
import { Tooltip } from "@components/ui-elements/Tooltip";

type MCQListingFilters = {
  search: string;
  subject: string;
  examLevel: string;
  marks: string;
  status: string;
};

interface MCQClientProps {
  initialData?: Question[];
  totalItems?: number;
}

export function MCQClient({
  initialData = [],
  totalItems: initialTotalItems = 0,
}: MCQClientProps) {
  const router = useRouter();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const [subjects, setSubjects] = useState<Classification[]>([]);
  const [examLevels, setExamLevels] = useState<Classification[]>([]);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

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
  } = useListing<Question, MCQListingFilters>({
    fetchFn: (params) => questionsApi.getQuestions(params),
    initialFilters: {
      search: "",
      subject: "all",
      examLevel: "all",
      marks: "all",
      status: "all",
    },
    initialData,
    initialTotalItems,
    filterMapping: (f) => ({
      question_type: QUESTION_TYPES.MULTIPLE_CHOICE,
      search: f.search || undefined,
      subject: f.subject !== "all" ? f.subject : undefined,
      exam_level: f.examLevel !== "all" ? f.examLevel : undefined,
      marks: f.marks !== "all" ? Number(f.marks) : undefined,
      is_active: f.status !== "all" ? f.status === "true" : undefined,
    }),
    toastMessage: "MCQ list refreshed successfully",
    onError: handleAuthError,
  });

  // Column Visibility State
  const availableColumns = [
    { id: "srNo", label: "Sr. No.", pinned: true },
    { id: "question", label: "Question", pinned: true },
    { id: "subject", label: "Subject" },
    { id: "examLevel", label: "Exam Level" },
    { id: "marks", label: "Marks" },
    { id: "createdBy", label: "Created By" },
    { id: "createdDate", label: "Created Date" },
    { id: "status", label: "Status" },
    { id: "actions", label: "Action", pinned: true },
  ];

  const DEFAULT_VISIBLE_COLUMNS = [
    "srNo",
    "question",
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
          QUESTION_TYPES.MULTIPLE_CHOICE,
        );
        setSubjects(filteredSubjects);
        setExamLevels(examLevelsRes.data || []);
      } catch (error) {
        if (!handleAuthError(error)) {
          console.error("Failed to fetch classifications:", error);
        }
      }
    };
    void fetchClassifications();
  }, [handleAuthError]);

  const handleToggleStatus = async (id: number, currentStatus: boolean) => {
    setTogglingId(id);
    try {
      await questionsApi.toggleQuestionStatus(id);
      void refresh();
      toast.success(
        `Question ${!currentStatus ? "activated" : "deactivated"} successfully`,
      );
    } catch (error) {
      if (!handleAuthError(error)) {
        toast.error("Failed to update question status");
      }
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
              <ListChecks size={18} />
            </div>
            Multiple Choice Questions
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
              itemLabel="MCQs"
            />
            <TableColumnToggle
              columns={availableColumns}
              visibleColumns={visibleColumns}
              onToggle={toggleColumn}
              onReset={() => setVisibleColumns(DEFAULT_VISIBLE_COLUMNS)}
            />
            <ListingIcons
              isLoading={isLoading}
              isBackgroundLoading={isBackgroundLoading}
              onRefresh={refresh}
              onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
              isFilterOpen={isFilterOpen}
              activeFiltersCount={activeFiltersCount}
            />
            <Tooltip content="Bulk Upload" side="top">
              <Button
                variant="action"
                size="rounded-icon"
                isActive={isBulkUploadOpen}
                animate="scale"
                iconAnimation="none"
                onClick={() => setIsBulkUploadOpen(true)}
              >
                <Upload size={18} />
              </Button>
            </Tooltip>
            <Tooltip content="Add Question" side="top">
              <Button
                variant="action"
                color="primary"
                size="rounded-icon"
                animate="scale"
                iconAnimation="rotate-90"
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
            <div className="flex-1 overflow-x-auto w-full min-h-0 h-full flex flex-col">
              <Table className="h-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    {visibleColumns.includes("srNo") && (
                      <TableHead className="w-[80px] text-center">
                        Sr. No.
                      </TableHead>
                    )}
                    {visibleColumns.includes("question") && (
                      <TableHead>Question</TableHead>
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
                    {visibleColumns.includes("createdBy") && (
                      <TableHead>Created By</TableHead>
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
                      description="We couldn't find any MCQs matching your criteria."
                    />
                  ) : (
                    questions.map((row, index) => (
                      <MCQRow
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
          registryKey="mcq-filters"
          filters={filters}
          onFilterChange={handleSingleFilterChange}
          onReset={resetFilters}
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
        title="MCQ Question Management"
        questionType={QUESTION_TYPES.MULTIPLE_CHOICE}
        onSuccess={() => void refresh()}
        renderManualForm={(onSuccess) => (
          <AddQuestionForm onSuccess={onSuccess} />
        )}
      />

      {editingQuestion && (
        <EditQuestionModal
          isOpen={true}
          questionData={editingQuestion}
          onClose={() => {
            setEditingQuestion(null);
            void refresh();
          }}
        />
      )}

      <BulkUploadModal
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        onSuccess={() => void refresh()}
        questionType={QUESTION_TYPES.MULTIPLE_CHOICE}
      />
    </PageContainer>
  );
}
