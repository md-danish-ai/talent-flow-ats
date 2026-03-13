"use client";

import React, { useEffect, useState, useCallback } from "react";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { MainCard } from "@components/ui-cards/MainCard";
import { Button } from "@components/ui-elements/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableColumnToggle,
} from "@components/ui-elements/Table";
import { Pagination } from "@components/ui-elements/Pagination";
import { Plus, ListChecks, Loader2, Filter } from "lucide-react";
import { questionsApi, Question } from "@lib/api/questions";
import { QUESTION_TYPES } from "@lib/constants/questions";
import { classificationsApi, Classification } from "@lib/api/classifications";
import { cn } from "@lib/utils";
import { toast } from "@lib/toast";
import EditQuestionModal from "./component/EditQuestionModal";
import { AddQuestionModal } from "./component/AddQuestionModal";
import { SubjectiveFilters } from "./component/SubjectiveFilters";
import { SubjectiveRow } from "./component/SubjectiveRow";

export function SubjectiveClient() {
  const [data, setData] = useState<Question[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState<
    string | number | undefined
  >(undefined);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [subjects, setSubjects] = useState<Classification[]>([]);

  // Column visibility
  const allColumns = [
    { id: "srNo", label: "Sr. No.", pinned: true },
    { id: "question", label: "Question", pinned: true },
    { id: "subject", label: "Subject" },
    { id: "createdDate", label: "Created Date" },
    { id: "status", label: "Status" },
    { id: "actions", label: "Action", pinned: true },
  ];

  const DEFAULT_VISIBLE_COLUMNS = [
    "srNo",
    "question",
    "subject",
    "status",
    "actions",
  ];

  const [visibleColumns, setVisibleColumns] = useState(DEFAULT_VISIBLE_COLUMNS);

  const toggleColumn = (id: string) => {
    setVisibleColumns((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await questionsApi.getQuestions({
        page: currentPage,
        limit: pageSize,
        question_type: QUESTION_TYPES.SUBJECTIVE,
        search: debouncedSearch,
        subject:
          subjectFilter !== "all" ? (subjectFilter as string) : undefined,
      });

      setData(response.data || []);
      if (response.pagination) {
        setTotalItems(response.pagination.total_records);
      }
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, pageSize, debouncedSearch, subjectFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await classificationsApi.getClassifications({
          type: "subject",
          limit: 100,
        });
        setSubjects(response.data || []);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      }
    };
    if (subjects.length === 0) {
      fetchSubjects();
    }
  }, [subjects.length]);

  const handleToggleStatus = async (id: number) => {
    setTogglingId(id);
    try {
      await questionsApi.toggleQuestionStatus(id);
      await fetchData();
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
          <>
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground shrink-0">
              <ListChecks size={20} />
            </div>
            Subjective Questions
          </>
        }
        className="mb-6 flex flex-col"
        bodyClassName="p-0 flex flex-row items-stretch w-full"
        action={
          <div className="flex items-center gap-3">
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
              onClick={() => setIsAddOpen(true)}
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
          {isLoading && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
            </div>
          )}
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
                {data.length === 0 && !isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={visibleColumns.length + 1}
                      className="py-8 text-center text-muted-foreground"
                    >
                      No subjective questions found. Click &quot;Add
                      Question&quot; to create one.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((row, index) => (
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

          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(totalItems / pageSize)}
            onPageChange={setCurrentPage}
            totalItems={totalItems}
            pageSize={pageSize}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setCurrentPage(1);
            }}
            className="mt-auto shrink-0"
          />
        </div>

        <SubjectiveFilters
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          subjectFilter={subjectFilter}
          onSubjectFilterChange={setSubjectFilter}
          subjects={subjects}
          onReset={() => {
            setSearchQuery("");
            setSubjectFilter("all");
            setCurrentPage(1);
          }}
        />
      </MainCard>

      {/* Modals */}
      <AddQuestionModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={fetchData}
      />

      {editingQuestion && (
        <EditQuestionModal
          question={editingQuestion}
          isOpen={true}
          onClose={() => setEditingQuestion(null)}
          onSuccess={fetchData}
        />
      )}
    </PageContainer>
  );
}
