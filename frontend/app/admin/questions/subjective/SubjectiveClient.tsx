"use client";

import React, { useEffect, useState } from "react";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { MainCard } from "@components/ui-cards/MainCard";
import { Button } from "@components/ui-elements/Button";
import { Badge } from "@components/ui-elements/Badge";
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
import { Plus, ListChecks, Filter, Upload, RefreshCcw } from "lucide-react";
import { questionsApi } from "@lib/api/questions";
import { QUESTION_TYPES } from "@lib/constants/questions";
import { classificationsApi } from "@lib/api/classifications";
import { Question, Classification } from "@types";
import { Tooltip } from "@components/ui-elements/Tooltip";
import { cn } from "@lib/utils";
import { toast } from "@lib/toast";
import { filterSubjectsForQuestionType } from "@lib/utils/exclusivity";
import EditQuestionModal from "./component/EditQuestionModal";
import { AddQuestionModal } from "./component/AddQuestionModal";
import { ListingFiltersDrawer } from "@components/ui-elements/ListingFiltersDrawer";
import { SubjectiveRow } from "./component/SubjectiveRow";
import { BulkUploadModal } from "@components/features/questions/BulkUploadModal";
import { EmptyState } from "@components/ui-elements/EmptyState";
import { useListing } from "@hooks/useListing";

type SubjectiveListingFilters = {
  search: string;
  subject: string;
  examLevel: string;
  marks: string;
  status: string;
};

export function SubjectiveClient() {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);

  const [subjects, setSubjects] = useState<Classification[]>([]);
  const [examLevels, setExamLevels] = useState<Classification[]>([]);

  // Hook for standardized listing
  const {
    data: questions,
    isLoading,
    totalItems,
    totalPages,
    currentPage,
    pageSize,
    filters,
    activeFiltersCount,
    handleFilterChange,
    handleSingleFilterChange,
    handlePageChange,
    handlePageSizeChange,
    resetFilters,
    fetchItems,
    refresh,
  } = useListing<Question, SubjectiveListingFilters>({
    fetchFn: (params) => questionsApi.getQuestions(params),
    initialFilters: {
      search: "",
      subject: "all",
      examLevel: "all",
      marks: "all",
      status: "all",
    },
    filterMapping: (f) => ({
      question_type: QUESTION_TYPES.SUBJECTIVE,
      search: f.search || undefined,
      subject: f.subject !== "all" ? f.subject : undefined,
      exam_level: f.examLevel !== "all" ? f.examLevel : undefined,
      marks: f.marks !== "all" ? Number(f.marks) : undefined,
      is_active: f.status !== "all" ? f.status === "true" : undefined,
    }),
    toastMessage: "Question list refreshed successfully",
  });

  // Column visibility
  const allColumns = [
    { id: "srNo", label: "Sr. No.", pinned: true },
    { id: "question", label: "Question", pinned: true },
    { id: "subject", label: "Subject" },
    { id: "examLevel", label: "Exam Level" },
    { id: "marks", label: "Marks" },
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
          QUESTION_TYPES.SUBJECTIVE,
          subjectsRes.data || [],
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
      void fetchItems();
      toast.success("Status updated successfully");
    } catch (error) {
      console.error("Failed to toggle question status:", error);
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
            Subjective Questions
          </div>
        }
        className="mb-6 flex flex-col"
        bodyClassName="p-0 flex flex-row items-stretch w-full"
        action={
          <div className="flex items-center gap-3">
            {isLoading ? (
              <div className="h-8 w-24 bg-muted animate-pulse rounded-full" />
            ) : (
              <Badge
                variant="outline"
                color="default"
                className="font-bold border-border/50 bg-card"
              >
                {totalItems} QUESTIONS
              </Badge>
            )}
            <div className="h-6 w-px bg-border/50 mx-1" />
            <TableColumnToggle
              columns={allColumns}
              visibleColumns={visibleColumns}
              onToggle={toggleColumn}
              onReset={() => setVisibleColumns(DEFAULT_VISIBLE_COLUMNS)}
            />
            <div className="h-6 w-px bg-border/50 mx-1" />
            <Tooltip content="Refresh Data" side="bottom">
              <Button
                variant="action"
                size="rounded-icon"
                animate="scale"
                onClick={refresh}
                disabled={isLoading}
              >
                <div className={cn(isLoading && "animate-spin")}>
                  <RefreshCcw size={18} />
                </div>
              </Button>
            </Tooltip>
            <div className="h-6 w-px bg-border mx-1" />
            <Button
              variant="action"
              size="rounded-icon"
              isActive={isBulkUploadOpen}
              animate="scale"
              onClick={() => setIsBulkUploadOpen(true)}
              title="Bulk Upload"
            >
              <Upload size={18} />
            </Button>
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
            <Button
              variant="primary"
              color="primary"
              size="md"
              shadow
              animate="scale"
              iconAnimation="rotate-90"
              onClick={() => setIsAddOpen(true)}
              startIcon={<Plus size={18} />}
              className="font-bold border-none"
            >
              Add Question
            </Button>
          </div>
        }
      >
        <div
          className={cn(
            "flex-1 w-full flex flex-col min-w-0 overflow-hidden relative",
            isFilterOpen && "border-r border-border/50",
          )}
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
                    description="We couldn't find any subjective questions matching your criteria."
                  />
                ) : (
                  questions.map((row, index) => (
                    <SubjectiveRow
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

      {/* Modals */}
      <AddQuestionModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={() => void fetchItems()}
      />

      {editingQuestion && (
        <EditQuestionModal
          question={editingQuestion}
          isOpen={true}
          onClose={() => setEditingQuestion(null)}
          onSuccess={() => void fetchItems()}
        />
      )}

      <BulkUploadModal
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        onSuccess={() => void fetchItems()}
        questionType={QUESTION_TYPES.SUBJECTIVE}
      />
    </PageContainer>
  );
}
