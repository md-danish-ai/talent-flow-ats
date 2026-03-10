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
import {
  Plus,
  Edit,
  Eye,
  MoreVertical,
  Loader2,
  Filter,
  Search,
  RotateCcw,
  ListChecks,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { Typography } from "@components/ui-elements/Typography";
import { InlineDrawer } from "@components/ui-elements/InlineDrawer";
import { Input } from "@components/ui-elements/Input";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import ActionMenu, { ActionItem } from "@components/ui-elements/ActionMenu";
import { questionsApi, Question } from "@lib/api/questions";
import { QUESTION_TYPES } from "@lib/constants/questions";
import { classificationsApi, Classification } from "@lib/api/classifications";
import { cn } from "@lib/utils";
import { ViewQuestionModal } from "./components/ViewQuestionModal";
import { EditQuestionModal } from "./components/EditQuestionModal";
import { AddQuestionModal } from "./components/AddQuestionModal";
import { Badge } from "@components/ui-elements/Badge";

export function ImageSubjectiveClient() {
  const [data, setData] = useState<Question[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [viewingQuestion, setViewingQuestion] = useState<Question | null>(null);
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
        question_type: QUESTION_TYPES.IMAGE_SUBJECTIVE,
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
    } catch (error) {
      console.error("Failed to toggle question status:", error);
    } finally {
      setTogglingId(null);
    }
  };

  const RowActions = ({ row }: { row: Question }) => {
    const isActive = row.is_active !== false;
    const items: ActionItem[] = [
      {
        key: "view",
        label: "View Details",
        icon: <Eye size={16} />,
        onClick: (e) => {
          e.stopPropagation();
          setViewingQuestion(row);
        },
      },
      {
        key: "edit",
        label: "Edit Question",
        icon: <Edit size={16} />,
        onClick: (e) => {
          e.stopPropagation();
          setEditingQuestion(row);
        },
      },
      {
        key: "toggle",
        label:
          togglingId === row.id
            ? "Updating..."
            : isActive
              ? "Deactivate"
              : "Activate",
        icon:
          togglingId === row.id ? (
            <Loader2 size={16} className="animate-spin" />
          ) : isActive ? (
            <ToggleRight size={16} />
          ) : (
            <ToggleLeft size={16} />
          ),
        className: isActive
          ? "text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10"
          : "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10",
        onClick: (e) => {
          e.stopPropagation();
          handleToggleStatus(row.id);
        },
        disabled: togglingId === row.id,
      },
    ];

    return (
      <div className="relative flex justify-center items-center h-full px-2">
        <ActionMenu
          button={<MoreVertical size={20} />}
          items={items}
          buttonClassName={cn(
            "h-9 w-9 rounded-full transition-all duration-300 flex items-center justify-center",
            "text-muted-foreground hover:bg-muted hover:text-foreground",
          )}
          menuClassName="w-48 bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-border rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.4)]"
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
            Image Subjective Questions
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
              <TableHeader className="bg-muted/30">
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
                {data.length === 0 && !isLoading ? (
                  <TableRow>
                    <TableCell
                      colSpan={visibleColumns.length}
                      className="py-8 text-center text-muted-foreground"
                    >
                      No image subjective questions found. Click &quot;Add
                      Question&quot; to create one.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((row, index) => (
                    <TableRow
                      key={row.id}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      {visibleColumns.includes("srNo") && (
                        <TableCell className="font-medium text-center text-muted-foreground">
                          {(currentPage - 1) * pageSize + index + 1}
                        </TableCell>
                      )}
                      {visibleColumns.includes("question") && (
                        <TableCell className="max-w-[400px]">
                          <Typography
                            variant="body4"
                            weight="semibold"
                            className="line-clamp-2"
                          >
                            {row.question_text}
                          </Typography>
                        </TableCell>
                      )}
                      {visibleColumns.includes("subject") && (
                        <TableCell>
                          <Badge
                            variant="outline"
                            color={row.subject?.name ? "success" : "error"}
                            shape="square"
                          >
                            {typeof row.subject === "string"
                              ? row.subject
                              : (row.subject?.name ?? "N/A")}
                          </Badge>
                        </TableCell>
                      )}
                      {visibleColumns.includes("createdDate") && (
                        <TableCell className="text-muted-foreground">
                          {row.created_at
                            ? new Date(row.created_at).toLocaleDateString()
                            : "-"}
                        </TableCell>
                      )}
                      {visibleColumns.includes("actions") && (
                        <TableCell className="text-center">
                          <RowActions row={row} />
                        </TableCell>
                      )}
                    </TableRow>
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
                  ...(subjects.map((s) => ({ id: s.code, label: s.name })) ||
                    []),
                ]}
                value={subjectFilter || "all"}
                onChange={(val) => {
                  setSubjectFilter(val as string);
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

      {/* Modals */}
      <AddQuestionModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={fetchData}
      />

      {editingQuestion && (
        <EditQuestionModal
          questionData={editingQuestion}
          isOpen={true}
          onClose={() => setEditingQuestion(null)}
          onSuccess={fetchData}
        />
      )}

      {viewingQuestion && (
        <ViewQuestionModal
          questionId={viewingQuestion.id}
          isOpen={true}
          onClose={() => setViewingQuestion(null)}
        />
      )}
    </PageContainer>
  );
}
