"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Badge } from "@components/ui-elements/Badge";
import { cn } from "@lib/utils";
import { Button } from "@components/ui-elements/Button";
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
import { Filter, Plus, Image as ImageIcon, Upload } from "lucide-react";
import { MainCard } from "@components/ui-cards/MainCard";
import { Pagination } from "@components/ui-elements/Pagination";
import { questionsApi, Question } from "@lib/api/questions";
import { QUESTION_TYPES } from "@lib/constants/questions";
import { classificationsApi, Classification } from "@lib/api/classifications";
import { ApiError } from "@lib/api/client";
import { useRouter } from "next/navigation";
import { filterSubjectsForQuestionType } from "@lib/utils/exclusivity";
import { toast } from "@lib/toast";
import { AddImageQuestionModal } from "./components/AddImageQuestionModal";
import { EditImageQuestionModal } from "./components/EditImageQuestionModal";
import ImageLightbox from "./components/ImageLightbox";
import { ImageMCQFilters } from "./components/ImageMCQFilters";
import { ImageMCQRow } from "./components/ImageMCQRow";
import { BulkUploadModal } from "@components/features/questions/BulkUploadModal";
import { EmptyState } from "@components/ui-elements/EmptyState";

interface ImageMCQClientProps {
  initialData?: Question[];
  totalItems?: number;
}

export function ImageMCQClient({
  initialData = [],
  totalItems: initialTotalItems = 0,
}: ImageMCQClientProps) {
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState<
    string | number | undefined
  >("all");
  const [examLevelFilter, setExamLevelFilter] = useState<
    string | number | undefined
  >("all");
  const [marksFilter, setMarksFilter] = useState<string | number | undefined>(
    "all",
  );
  const [statusFilter, setStatusFilter] = useState<string | number | undefined>(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<Question[]>(initialData || []);
  const [totalItems, setTotalItems] = useState<number>(initialTotalItems || 0);
  const [subjects, setSubjects] = useState<Classification[]>([]);
  const [examLevels, setExamLevels] = useState<Classification[]>([]);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<null | Question>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
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

  // Column Visibility State
  const allColumns = [
    { id: "srNo", label: "Sr. No.", pinned: true },
    { id: "image", label: "Image" },
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
    "image",
    "question",
    "subject",
    "examLevel",
    "marks",
    "actions",
  ];

  const [visibleColumns, setVisibleColumns] = useState(DEFAULT_VISIBLE_COLUMNS);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const toggleColumn = (id: string) => {
    setVisibleColumns((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset page on search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await questionsApi.getQuestions({
        page: currentPage,
        limit: pageSize,
        search: debouncedSearch,
        subject:
          subjectFilter && subjectFilter !== "all"
            ? (subjectFilter as string)
            : undefined,
        exam_level:
          examLevelFilter && examLevelFilter !== "all"
            ? (examLevelFilter as string)
            : undefined,
        marks:
          marksFilter && marksFilter !== "all"
            ? Number(marksFilter)
            : undefined,
        is_active:
          statusFilter && statusFilter !== "all"
            ? statusFilter === "true"
            : undefined,
        question_type: QUESTION_TYPES.IMAGE_MULTIPLE_CHOICE,
      });

      setData(response.data || []);
      if (response.pagination) {
        setTotalItems(response.pagination.total_records);
      }
    } catch (error) {
      if (handleAuthError(error)) return;
      console.error("Error fetching questions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [
    currentPage,
    pageSize,
    debouncedSearch,
    subjectFilter,
    examLevelFilter,
    marksFilter,
    statusFilter,
    handleAuthError,
  ]);

  const isFirstMount = React.useRef(true);
  useEffect(() => {
    if (isFirstMount.current && initialData.length > 0) {
      isFirstMount.current = false;
      setIsLoading(false);
      return;
    }
    fetchData();
  }, [fetchData, initialData.length]);

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
          QUESTION_TYPES.IMAGE_MULTIPLE_CHOICE,
          subjectsRes.data || [],
        );
        setSubjects(filteredSubjects);
        setExamLevels(examLevelsRes.data || []);
      } catch (err) {
        if (handleAuthError(err)) return;
        console.error("Failed to fetch classifications:", err);
      }
    };
    fetchClassifications();
  }, [handleAuthError]);

  const handleToggleStatus = async (id: number) => {
    setTogglingId(id);
    try {
      await questionsApi.toggleQuestionStatus(id);
      await fetchData();
      toast.success("Question status updated successfully");
    } catch (error) {
      if (handleAuthError(error)) return;
      toast.error("Failed to update status");
      console.error("Failed to toggle status:", error);
    } finally {
      setTogglingId(null);
    }
  };

  const handleAddSuccess = async () => {
    setIsAddModalOpen(false);
    setCurrentPage(1);
    await fetchData();
  };

  return (
    <PageContainer animate>
      <MainCard
        title={
          <>
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground shrink-0">
              <ImageIcon size={20} />
            </div>
            Image-Based MCQs
          </>
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
            <Button
              variant="action"
              size="rounded-icon"
              isActive={isFilterOpen}
              animate="scale"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              title="Filter"
            >
              <Filter size={18} />
            </Button>
            <Button
              variant="primary"
              color="primary"
              size="md"
              shadow
              animate="scale"
              iconAnimation="rotate-90"
              onClick={() => setIsAddModalOpen(true)}
              startIcon={<Plus size={18} />}
              className="font-bold"
            >
              Add Question
            </Button>
          </div>
        }
      >
        <div
          className={cn(
            "flex-1 w-full flex flex-col min-w-0 overflow-hidden relative",
            isFilterOpen && "border-r border-border",
          )}
        >
          <div className="flex-1 overflow-x-auto w-full min-h-0">
            {isLoading ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    {visibleColumns.includes("srNo") && (
                      <TableHead className="w-[80px] text-center">
                        Sr. No.
                      </TableHead>
                    )}
                    {visibleColumns.includes("image") && (
                      <TableHead className="w-[80px] text-center">
                        Image
                      </TableHead>
                    )}
                    {visibleColumns.includes("question") && (
                      <TableHead>Question</TableHead>
                    )}
                    {visibleColumns.includes("subject") && (
                      <TableHead>Subject</TableHead>
                    )}
                    {visibleColumns.includes("marks") && (
                      <TableHead className="w-[80px] text-center">
                        Marks
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
                  <QuestionTableSkeleton
                    visibleColumns={visibleColumns}
                    rowCount={pageSize}
                    hasImage
                  />
                </TableBody>
              </Table>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]"></TableHead>
                    {visibleColumns.includes("srNo") && (
                      <TableHead className="w-[80px] text-center">
                        Sr. No.
                      </TableHead>
                    )}
                    {visibleColumns.includes("image") && (
                      <TableHead className="w-[80px] text-center">
                        Image
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
                  {data.length === 0 ? (
                    <EmptyState
                      colSpan={visibleColumns.length + 1}
                      variant="search"
                      title="No questions found"
                      description="We couldn't find any image questions matching your criteria. Try adjusting your filters or adding a new question."
                    />
                  ) : (
                    data.map((row, index) => (
                      <ImageMCQRow
                        key={row.id}
                        row={row}
                        index={index}
                        currentPage={currentPage}
                        pageSize={pageSize}
                        visibleColumns={visibleColumns}
                        togglingId={togglingId}
                        onToggleStatus={handleToggleStatus}
                        onEdit={setEditingQuestion}
                        onImageClick={setLightboxUrl}
                      />
                    ))
                  )}
                </TableBody>
              </Table>
            )}
          </div>

          {!isLoading && data.length > 0 && (
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
              className="mt-auto shrink-0"
            />
          )}
        </div>

        <ImageMCQFilters
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          subjectFilter={subjectFilter}
          onSubjectFilterChange={(val) => {
            setSubjectFilter(val as string);
            setCurrentPage(1);
          }}
          subjects={subjects}
          examLevelFilter={examLevelFilter}
          onExamLevelFilterChange={(val) => {
            setExamLevelFilter(val as string);
            setCurrentPage(1);
          }}
          examLevels={examLevels}
          marksFilter={marksFilter}
          onMarksFilterChange={(val) => {
            setMarksFilter(val as string);
            setCurrentPage(1);
          }}
          statusFilter={statusFilter}
          onStatusFilterChange={(val) => {
            setStatusFilter(val as string);
            setCurrentPage(1);
          }}
          onReset={() => {
            setSearchQuery("");
            setSubjectFilter("all");
            setExamLevelFilter("all");
            setMarksFilter("all");
            setStatusFilter("all");
            setCurrentPage(1);
          }}
        />
      </MainCard>

      <AddImageQuestionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />
      {editingQuestion && (
        <EditImageQuestionModal
          isOpen={true}
          questionData={editingQuestion}
          onClose={() => setEditingQuestion(null)}
          onSuccess={async () => {
            await fetchData();
            setEditingQuestion(null);
          }}
        />
      )}

      {/* Image lightbox: open when a row's image icon is clicked */}
      {lightboxUrl && (
        <ImageLightbox url={lightboxUrl} onClose={() => setLightboxUrl(null)} />
      )}

      <BulkUploadModal
        isOpen={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
        onSuccess={fetchData}
        questionType={QUESTION_TYPES.IMAGE_MULTIPLE_CHOICE}
      />
    </PageContainer>
  );
}
