"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@lib/utils";
import { Button } from "@components/ui-elements/Button";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { Typography } from "@components/ui-elements/Typography";
import { InlineDrawer } from "@components/ui-elements/InlineDrawer";
import { Input } from "@components/ui-elements/Input";
import { AddQuestionModal } from "./components/AddQuestionModal";
import { EditQuestionModal } from "./components/EditQuestionModal";
import { ViewQuestionModal } from "./components/ViewQuestionModal";
import { PageContainer } from "@components/ui-layout/PageContainer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCollapsibleRow,
  TableColumnToggle,
} from "@components/ui-elements/Table";
import { Filter, Search, RotateCcw, Plus, ListChecks, Loader2, MoreVertical, Eye, Edit, ToggleLeft, ToggleRight } from "lucide-react";
import { MainCard } from "@components/ui-cards/MainCard";
import { Pagination } from "@components/ui-elements/Pagination";
import { questionsApi } from "@lib/api/questions";
import { classificationsApi, Classification } from "@lib/api/classifications";
import { AnimatePresence, motion } from "framer-motion";

import { Question, QuestionOption } from "@lib/api/questions";

interface MCQClientProps {
  initialData?: Question[];
  totalItems?: number;
}

export function MCQClient({
  initialData = [],
  totalItems: initialTotalItems = 0,
}: MCQClientProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState<string | number | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Question[]>(initialData);
  const [totalItems, setTotalItems] = useState(initialTotalItems);
  const [subjects, setSubjects] = useState<Classification[]>([]);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [viewingQuestionId, setViewingQuestionId] = useState<number | null>(null);


  // Column Visibility State
  const allColumns = [
    { id: "srNo", label: "Sr. No." },
    { id: "question", label: "Question" },
    { id: "subject", label: "Subject" },
    { id: "createdBy", label: "Created By" },
    { id: "createdDate", label: "Created Date" },
    { id: "actions", label: "Action" },
  ];

  const [visibleColumns, setVisibleColumns] = useState([
    "srNo",
    "question",
    "subject",
    "createdBy",
    "actions",
  ]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  const toggleColumn = (id: string) => {
    setVisibleColumns((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset page on search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await questionsApi.getQuestions({
        page: currentPage,
        limit: pageSize,
        search: debouncedSearch,
        subject_type: subjectFilter !== "all" ? (subjectFilter as string) : undefined,
        question_type: "MULTIPLE_CHOICE", // Optional filter
      });
      setData(response.data || []);
      if (response.pagination) {
        setTotalItems(response.pagination.total_records);
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, debouncedSearch, subjectFilter]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const response = await classificationsApi.getClassifications({ type: "subject_type", limit: 100 });
        setSubjects(response.data || []);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      }
    };
    fetchSubjects();
  }, []);

  const handleToggleStatus = async (id: number) => {
    setTogglingId(id);
    try {
      await questionsApi.toggleQuestionStatus(id);
      await fetchData();
    } catch (error) {
      console.error("Failed to toggle question status:", error);
    } finally {
      setTogglingId(null);
    }
  };

  const RowActions = ({ id }: { id: number }) => {
    const isOpen = openMenuId === id;

    return (
      <div className="relative flex justify-center items-center h-full px-2">
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-9 w-9 rounded-full transition-all duration-300",
            isOpen ? "bg-brand-primary/10 text-brand-primary ring-2 ring-brand-primary/20" : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
          onClick={(e) => {
            e.stopPropagation();
            setOpenMenuId(isOpen ? null : id);
          }}
        >
          <MoreVertical size={20} />
        </Button>

        <AnimatePresence>
          {isOpen && (
            <>
              {/* Backdrop for outside click */}
              <div 
                className="fixed inset-0 z-[60]" 
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuId(null);
                }}
              />
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                className="absolute right-full mr-3 top-[-10px] w-48 bg-card border border-border rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)] z-[70] py-2 overflow-hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl origin-right px-1.5"
              >
                <div className="space-y-0.5 px-1">
                  <button
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-muted-foreground hover:bg-brand-primary/10 hover:text-brand-primary transition-all text-left group/item"
                    onClick={(e) => {
                      e.stopPropagation();
                      setViewingQuestionId(id);
                      setOpenMenuId(null);
                    }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center group-hover/item:bg-background transition-colors text-muted-foreground group-hover/item:text-brand-primary shrink-0">
                      <Eye size={16} />
                    </div>
                    <span>View Details</span>
                  </button>

                  <button
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold text-muted-foreground hover:bg-brand-primary/10 hover:text-brand-primary transition-all text-left group/item"
                    onClick={(e) => {
                      e.stopPropagation();
                      const qData = data.find(q => q.id === id);
                      if (qData) {
                         setEditingQuestion(qData);
                      }
                      setOpenMenuId(null);
                    }}
                  >
                    <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center group-hover/item:bg-background transition-colors text-muted-foreground group-hover/item:text-brand-primary shrink-0">
                      <Edit size={16} />
                    </div>
                    <span>Edit Question</span>
                  </button>

                  <button
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-bold transition-all text-left group/item",
                      data.find(q => q.id === id)?.is_active !== false
                        ? "text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10"
                        : "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                    )}
                    disabled={togglingId === id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(null);
                      handleToggleStatus(id);
                    }}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0",
                      data.find(q => q.id === id)?.is_active !== false
                        ? "bg-amber-50 dark:bg-amber-500/10 text-amber-600"
                        : "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600"
                    )}>
                      {togglingId === id ? <Loader2 size={16} className="animate-spin" /> : data.find(q => q.id === id)?.is_active !== false ? <ToggleRight size={16} /> : <ToggleLeft size={16} />}
                    </div>
                    <span>{togglingId === id ? "Updating..." : data.find(q => q.id === id)?.is_active !== false ? "Deactivate" : "Activate"}</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <PageContainer animate>
      <MainCard
        title={
          <>
            <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-foreground shrink-0">
              <ListChecks size={20} />
            </div>
            Multiple Choice Questions
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
              onClick={() => {
                setIsAddModalOpen(true);
                // In a real app, refresh data after adding.
              }}
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
          {isLoading && (
             <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
                 <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
             </div>
          )}
          <div className="flex-1 overflow-x-auto w-full min-h-0">
            <Table>
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
                  {visibleColumns.includes("createdBy") && (
                    <TableHead>Created By</TableHead>
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
                {data.length === 0 && !isLoading ? (
                  <TableRow>
                    <TableCell colSpan={visibleColumns.length + 1} className="py-8 text-center text-muted-foreground">
                      No questions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((row) => (
                    <TableCollapsibleRow
                      key={row.id}
                      colSpan={visibleColumns.length + 1}
                      expandedContent={
                        <div className="m-4 md:my-4 rounded-xl border border-border bg-card shadow-sm overflow-hidden">
                          <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-muted/20">
                            <div className="flex items-center gap-3">
                              <div className="p-2 rounded-lg bg-brand-primary/10 text-brand-primary">
                                <ListChecks size={18} />
                              </div>
                              <div>
                                <Typography variant="body3" weight="bold">
                                  Question Details & Options
                                </Typography>
                                <Typography
                                  variant="body5"
                                  className="text-muted-foreground"
                                >
                                  Review all options and correct answer
                                  explanation.
                                </Typography>
                              </div>
                            </div>
                          </div>

                          <div className="p-5">
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-muted/30 border-b border-border">
                                  <TableHead className="w-[80px] h-10">
                                    Option
                                  </TableHead>
                                  <TableHead className="h-10">Content</TableHead>
                                  <TableHead className="w-[120px] text-right h-10">
                                    Status
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                 {row.options?.map((opt: QuestionOption, index: number) => (
                                  <TableRow key={index} className="border-b border-border transition-colors">
                                    <TableCell className="px-5 py-3 font-medium text-foreground">
                                      {opt.option_label || String.fromCharCode(65 + index)}
                                    </TableCell>
                                    <TableCell className={cn("px-5 py-3 text-muted-foreground", opt.is_correct && "font-bold text-green-600 dark:text-green-500")}>
                                      {opt.option_text}
                                    </TableCell>
                                    <TableCell className={cn("px-5 py-3 text-right font-medium", opt.is_correct ? "text-green-500" : "text-red-500")}>
                                      {opt.is_correct ? "Correct" : "Incorrect"}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>

                          <div className="px-5 py-3 bg-muted/20 border-t border-border">
                            <Typography
                              variant="body3"
                              weight="semibold"
                              className="inline-block mr-1"
                            >
                              Explanation:
                            </Typography>
                            <Typography
                              variant="body3"
                              className="text-muted-foreground inline-block"
                            >
                              This question does not have an explanation attached yet.
                            </Typography>
                          </div>
                        </div>
                      }
                    >
                      {visibleColumns.includes("srNo") && (
                        <TableCell className="font-medium text-center">
                          {row.id}
                        </TableCell>
                      )}
                      {visibleColumns.includes("question") && (
                        <TableCell>{row.question_text ?? row.question}</TableCell>
                      )}
                      {visibleColumns.includes("subject") && (
                        <TableCell>{row.subject_type?.name || row.subject || "N/A"}</TableCell>
                      )}
                      {visibleColumns.includes("createdBy") && (
                        <TableCell>{row.createdBy || "System"}</TableCell>
                      )}
                      {visibleColumns.includes("createdDate") && (
                        <TableCell>{row.createdDate || new Date(row.created_at).toLocaleDateString()}</TableCell>
                      )}
                      {visibleColumns.includes("actions") && (
                        <TableCell className="text-center">
                           <RowActions id={row.id} />
                        </TableCell>
                      )}
                    </TableCollapsibleRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

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
                className="uppercase tracking-widest text-muted-foreground"
              >
                Search Questions
              </Typography>
              <div className="relative group">
                <Search
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 group-focus-within:text-brand-primary transition-colors"
                  size={18}
                />
                <Input
                  placeholder="Search by keyword..."
                  className="pl-11 h-12 border-border/60 hover:border-border focus:border-brand-primary transition-all bg-muted/20"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-3">
              <Typography
                variant="body5"
                weight="bold"
                className="uppercase tracking-widest text-muted-foreground"
              >
                By Subject
              </Typography>
              <SelectDropdown
                placeholder="All Subjects"
                options={[
                  { id: "all", label: "All Subjects" },
                  ...(subjects.map(s => ({ id: s.code, label: s.name })) || [])
                ]}
                value={subjectFilter || "all"}
                onChange={(val) => {
                   setSubjectFilter(val);
                   setCurrentPage(1);
                }}
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
                  setSearchQuery("");
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

      <AddQuestionModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          fetchData();
        }}
      />

      <EditQuestionModal
        isOpen={!!editingQuestion}
        questionData={editingQuestion}
        onClose={() => {
          setEditingQuestion(null);
          fetchData();
        }}
      />

      <ViewQuestionModal
        isOpen={!!viewingQuestionId}
        onClose={() => setViewingQuestionId(null)}
        questionId={viewingQuestionId}
      />

    </PageContainer>
  );
}
