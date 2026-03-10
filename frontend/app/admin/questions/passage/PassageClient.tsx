"use client";

import React, { useState, useEffect, useCallback } from "react";
import { PageContainer } from "@components/ui-layout/PageContainer";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableColumnToggle,
} from "@components/ui-elements/Table";
import { InlineDrawer } from "@components/ui-elements/InlineDrawer";
import { Button } from "@components/ui-elements/Button";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { Typography } from "@components/ui-elements/Typography";
import { Pagination } from "@components/ui-elements/Pagination";
import { ActionMenu } from "@components/ui-elements/ActionMenu";
import {
  Plus,
  MoreVertical,
  Eye,
  Edit3,
  Power,
  FileText,
  Filter,
  ListChecks,
  RotateCcw,
} from "lucide-react";
import { questionsApi, type Question } from "@lib/api/questions";
import {
  classificationsApi,
  type Classification,
} from "@lib/api/classifications";
import { cn } from "@lib/utils";
import { MainCard } from "@components/ui-cards/MainCard";
import { Badge } from "@components/ui-elements/Badge";
// Modals
import { AddQuestionModal } from "./components/AddQuestionModal";
import { EditQuestionModal } from "./components/EditQuestionModal";
import { ViewQuestionModal } from "./components/ViewQuestionModal";

export const PassageClient = () => {
  // Data State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [subjects, setSubjects] = useState<Classification[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Pagination State
  const [subjectFilter, setSubjectFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(
    null,
  );

  // Column Visibility State
  const allColumns = [
    { id: "srNo", label: "Sr. No." },
    { id: "question", label: "Question" },
    { id: "subject", label: "Subject" },
    { id: "createdDate", label: "Created Date" },
    { id: "actions", label: "Action" },
  ];

  const [visibleColumns, setVisibleColumns] = useState([
    "srNo",
    "question",
    "subject",
    "createdDate",
    "actions",
  ]);

  const toggleColumn = (id: string) => {
    setVisibleColumns((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await questionsApi.getQuestions({
        page: currentPage,
        limit: pageSize,
        subject: subjectFilter !== "all" ? subjectFilter : undefined,
        question_type: "PASSAGE_CONTENT",
      });
      setQuestions(response.data || []);
      if (response.pagination) {
        setTotalItems(response.pagination.total_records);
      }
    } catch (error) {
      console.error("Failed to fetch passage questions:", error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, subjectFilter]);

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
    fetchSubjects();
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleToggleStatus = async (id: number) => {
    try {
      await questionsApi.toggleQuestionStatus(id);
      fetchQuestions();
    } catch (error) {
      console.error("Failed to toggle status:", error);
    }
  };

  const menuActions = (q: Question) => [
    {
      key: "view",
      label: "View Question",
      icon: <Eye size={16} />,
      onClick: () => {
        setSelectedQuestionId(q.id);
        setIsViewModalOpen(true);
      },
    },
    {
      key: "edit",
      label: "Edit Question",
      icon: <Edit3 size={16} />,
      onClick: () => {
        setSelectedQuestionId(q.id);
        setIsEditModalOpen(true);
      },
    },
    {
      key: "status",
      label: q.is_active ? "Deactivate" : "Activate",
      icon: <Power size={16} />,
      className: q.is_active
        ? "text-red-500 hover:text-red-600 hover:bg-red-50"
        : "text-green-500 hover:text-green-600 hover:bg-green-50",
      onClick: () => handleToggleStatus(q.id),
    },
  ];

  return (
    <PageContainer animate>
      <MainCard
        title={
          <>
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground shrink-0">
              <ListChecks size={20} />
            </div>
            Passage Questions
          </>
        }
        className="mb-6 flex-1 flex flex-col min-h-[600px]"
        bodyClassName="p-0 flex flex-row items-stretch flex-1"
        action={
          <div className="flex items-center gap-3">
            <TableColumnToggle
              columns={allColumns}
              visibleColumns={visibleColumns}
              onToggle={toggleColumn}
            />
            <div className="h-6 w-px bg-border mx-1" />
            <Button
              variant="action"
              size="rounded-icon"
              className={cn(
                isFilterOpen && "text-brand-primary bg-brand-primary/10",
              )}
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
            "flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden relative",
            isFilterOpen && "border-r border-border",
          )}
        >
          <div className="flex-1 overflow-x-auto w-full min-h-0">
            <Table className="border-none">
              <TableHeader>
                <TableRow>
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
                  {visibleColumns.includes("actions") && (
                    <TableHead className="w-[140px] text-center">
                      Action
                    </TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={visibleColumns.length}
                      className="py-8 text-center"
                    >
                      <Typography
                        variant="body5"
                        className="text-muted-foreground"
                      >
                        Loading questions...
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : questions.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={visibleColumns.length}
                      className="py-8 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center justify-center py-10 px-4">
                        <div className="h-16 w-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4 border border-dashed border-border/60">
                          <FileText
                            size={32}
                            className="text-muted-foreground/30"
                          />
                        </div>
                        <Typography variant="h3" weight="bold" className="mb-2">
                          No passage questions found
                        </Typography>
                        <Typography
                          variant="body4"
                          className="text-muted-foreground max-w-sm mb-6"
                        >
                          {subjectFilter
                            ? "Try adjusting your filters to find what you're looking for."
                            : "Get started by adding your first passage-based subjective question."}
                        </Typography>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  questions.map((q, idx) => (
                    <TableRow key={q.id}>
                      {visibleColumns.includes("srNo") && (
                        <TableCell className="font-medium text-center text-muted-foreground">
                          {(currentPage - 1) * pageSize + idx + 1}
                        </TableCell>
                      )}
                      {visibleColumns.includes("question") && (
                        <TableCell>
                          <div className="flex items-center gap-3 py-1">
                            <div className="h-10 w-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500 shrink-0 border border-orange-500/10">
                              <FileText size={18} />
                            </div>
                            <div className="flex flex-col gap-0.5">
                              <Typography
                                variant="body4"
                                weight="semibold"
                                className="text-foreground line-clamp-1 leading-snug font-bold"
                              >
                                {q.question_text}
                              </Typography>
                              {q.passage && (
                                <Typography
                                  variant="body5"
                                  className="text-muted-foreground line-clamp-1 italic text-[11px]"
                                >
                                  {q.passage.substring(0, 60)}...
                                </Typography>
                              )}
                            </div>
                          </div>
                        </TableCell>
                      )}
                      {visibleColumns.includes("subject") && (
                        <TableCell>
                          <Badge
                            variant="outline"
                            color={q.subject?.name ? "success" : "error"}
                            shape="square"
                          >
                            {typeof q.subject === "string"
                              ? q.subject
                              : (q.subject?.name ?? "N/A")}
                          </Badge>
                        </TableCell>
                      )}
                      {visibleColumns.includes("createdDate") && (
                        <TableCell>
                          <Typography
                            variant="body5"
                            className="text-muted-foreground font-medium"
                          >
                            {q.created_at
                              ? new Date(q.created_at).toLocaleDateString()
                              : "N/A"}
                          </Typography>
                        </TableCell>
                      )}
                      {visibleColumns.includes("actions") && (
                        <TableCell className="text-center">
                          <ActionMenu
                            buttonClassName="h-9 w-9 flex items-center justify-center hover:bg-brand-primary/10 hover:text-brand-primary transition-all rounded-full group"
                            button={
                              <MoreVertical
                                size={18}
                                className="text-muted-foreground group-hover:text-brand-primary"
                              />
                            }
                            items={menuActions(q)}
                          />
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {/* Pagination */}
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
          </div>
        </div>

        <InlineDrawer
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          title="Filters"
        >
          <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-40">
            <div className="space-y-3">
              <Typography
                variant="body5"
                weight="bold"
                className="text-muted-foreground uppercase tracking-widest pl-1"
              >
                Subject Area
              </Typography>
              <SelectDropdown
                placeholder="All Subjects"
                value={subjectFilter || "all"}
                onChange={(val) => {
                  setSubjectFilter(val as string);
                  setCurrentPage(1);
                }}
                options={[
                  { id: "all", label: "All Subjects" },
                  ...subjects.map((s) => ({ id: s.code, label: s.name })),
                ]}
                className="h-12 border-border/60 hover:border-border bg-muted/20"
                placement="bottom"
              />
            </div>

            <div className="pt-2">
              <Button
                variant="outline"
                color="primary"
                size="md"
                shadow
                animate="scale"
                iconAnimation="rotate-360"
                startIcon={<RotateCcw size={18} />}
                onClick={() => {
                  setSubjectFilter("all");
                  setCurrentPage(1);
                }}
                className="font-bold w-full"
                title="Reset Filters"
              >
                Reset Filters
              </Button>
            </div>
          </div>
        </InlineDrawer>
      </MainCard>

      {/* Modal Components */}
      <AddQuestionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={() => fetchQuestions()}
      />

      {selectedQuestionId && (
        <>
          <EditQuestionModal
            isOpen={isEditModalOpen}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedQuestionId(null);
            }}
            questionId={selectedQuestionId}
            onSuccess={() => fetchQuestions()}
          />
          <ViewQuestionModal
            isOpen={isViewModalOpen}
            onClose={() => {
              setIsViewModalOpen(false);
              setSelectedQuestionId(null);
            }}
            questionId={selectedQuestionId}
          />
        </>
      )}
    </PageContainer>
  );
};
