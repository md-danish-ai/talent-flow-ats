"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
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
  TableColumnToggle,
} from "@components/ui-elements/Table";
import {
  Filter,
  Search,
  RotateCcw,
  Plus,
  ListChecks,
  Loader2,
  MoreVertical,
  Eye,
  Edit,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { MainCard } from "@components/ui-cards/MainCard";
import { Pagination } from "@components/ui-elements/Pagination";
import { questionsApi } from "@lib/api/questions";
import { classificationsApi, Classification } from "@lib/api/classifications";
// framer-motion is not used directly in this file anymore
import ActionMenu, { type ActionItem } from "@components/ui-elements/ActionMenu";
import { ApiError } from "@lib/api/client";

import { Question } from "@lib/api/questions";

interface MCQClientProps {
  initialData?: Question[];
  totalItems?: number;
}


export function MCQClient({
  initialData = [],
  totalItems: initialTotalItems = 0,
}: MCQClientProps) {
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [subjectFilter, setSubjectFilter] = useState<string | number | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Question[]>(initialData);
  const [totalItems, setTotalItems] = useState(initialTotalItems);
  const [subjects, setSubjects] = useState<Classification[]>([]);
  // ActionMenu manages its open state internally; no global openMenuId needed
  const [togglingId, setTogglingId] = useState<number | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [viewingQuestionId, setViewingQuestionId] = useState<number | null>(null);

  // body overflow lock is handled by overlay/portal components when necessary
useEffect(() => {
  if (!toastMessage) return;
  const timeout = setTimeout(() => setToastMessage(null), 4000);
  return () => clearTimeout(timeout);
}, [toastMessage]);
  const handleAuthError = useCallback((error: unknown): boolean => {
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
  }, [router]);


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
      if (handleAuthError(error)) {
        return;
      }
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
        if (handleAuthError(error)) {
          return;
        }
        console.error("Failed to fetch subjects:", error);
      }
    };
    fetchSubjects();
  }, [handleAuthError]);

  const handleToggleStatus = async (id: number) => {
    setTogglingId(id);
    try {
      await questionsApi.toggleQuestionStatus(id);
      await fetchData();
    } catch (error) {
      if (handleAuthError(error)) {
        return;
      }
      console.error("Failed to toggle question status:", error);
    } finally {
      setTogglingId(null);
    }
  };

  const RowActions = ({ id }: { id: number }) => {
    const isActive = data.find((q) => q.id === id)?.is_active !== false;

    const items: ActionItem[] = [
      {
        key: "view",
        label: "View Details",
        icon: <Eye size={16} />,
        onClick: (e) => {
          e.stopPropagation();
          setViewingQuestionId(id);
        },
      },
      {
        key: "edit",
        label: "Edit Question",
        icon: <Edit size={16} />,
        onClick: (e) => {
          e.stopPropagation();
          const qData = data.find((q) => q.id === id);
          if (qData) setEditingQuestion(qData);
        },
      },
      {
        key: "toggle",
        label: togglingId === id ? "Updating..." : isActive ? "Deactivate" : "Activate",
        icon: togglingId === id ? <Loader2 size={16} className="animate-spin" /> : isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />,
        onClick: (e) => {
          e.stopPropagation();
          handleToggleStatus(id);
        },
        disabled: togglingId === id,
      },
    ];

    return (
      <div className="relative flex justify-center items-center h-full px-2">
        <ActionMenu
          button={<MoreVertical size={20} />}
          items={items}
          buttonClassName={"h-9 w-9 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground flex items-center justify-center"}
          menuClassName={"bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl"}
        />
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
                    <TableCell colSpan={visibleColumns.length} className="py-8 text-center text-muted-foreground">
                      No questions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((row, index) => (
                    <TableRow key={row.id}>
                      {visibleColumns.includes("srNo") && (
                        <TableCell className="font-medium text-center">
                          {(currentPage - 1) * pageSize + index + 1}
                        </TableCell>
                      )}
                      {visibleColumns.includes("question") && (
                        <TableCell>{row.question_text}</TableCell>
                      )}
                      {visibleColumns.includes("subject") && (
                        <TableCell>{typeof row.subject_type === "string" ? row.subject_type : row.subject_type?.name ?? "N/A"}</TableCell>
                      )}
                      {visibleColumns.includes("createdBy") && (
                        <TableCell>{"System"}</TableCell>
                      )}
                      {visibleColumns.includes("createdDate") && (
                        <TableCell>{row.created_at ? new Date(row.created_at).toLocaleDateString() : "N/A"}</TableCell>
                      )}
                      {visibleColumns.includes("actions") && (
                        <TableCell className="text-center">
                           <RowActions id={row.id} />
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
{toastMessage && (
  <div className="fixed bottom-6 right-6 z-50">
    <div className="rounded-xl border px-4 py-3 shadow-lg bg-card min-w-[260px] max-w-sm border-emerald-300/80 dark:border-emerald-500/60">
      <p className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-1">
        Success
      </p>
      <p className="text-sm text-foreground">
        {toastMessage}
      </p>
    </div>
  </div>
)}
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
  onClose={() => setIsAddModalOpen(false)}
  onSuccess={() => {
    setIsAddModalOpen(false);
    setToastMessage("Question added successfully.");
    fetchData();
  }}
/>

{editingQuestion && (
  <EditQuestionModal
    isOpen={true}
    questionData={editingQuestion}
    onClose={() => setEditingQuestion(null)}
    onSuccess={() => {
      setEditingQuestion(null); // ✅ CLOSE MODAL
      setToastMessage("Question updated successfully.");
      fetchData();
    }}
  />
)}

     {viewingQuestionId && (
  <ViewQuestionModal
    isOpen={true}
    onClose={() => setViewingQuestionId(null)}
    questionId={viewingQuestionId}
  />
)}

    </PageContainer>
  );
}
