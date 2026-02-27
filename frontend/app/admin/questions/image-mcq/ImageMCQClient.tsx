"use client";

import React, { useState, useEffect } from "react";
import { cn } from "@lib/utils";
import { Button } from "@components/ui-elements/Button";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { Typography } from "@components/ui-elements/Typography";
import { InlineDrawer } from "@components/ui-elements/InlineDrawer";
import { Input } from "@components/ui-elements/Input";
import { AddImageQuestionModal } from "./components/AddImageQuestionModal";
import { EditImageQuestionModal } from "./components/EditImageQuestionModal";
import { ViewImageQuestionModal } from "./components/ViewImageQuestionModal";
import ImageLightbox from "./components/ImageLightbox";
import { PageContainer } from "@components/ui-layout/PageContainer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  // TableCollapsibleRow removed - using plain rows
  TableColumnToggle,
} from "@components/ui-elements/Table";
import {
  Filter,
  Search,
  RotateCcw,
  Plus,
  Image as ImageIcon,
  Edit as EditIcon,
} from "lucide-react";
import { MainCard } from "@components/ui-cards/MainCard";
import { Pagination } from "@components/ui-elements/Pagination";
import { questionsApi, Question } from "@lib/api/questions";
import { classificationsApi, Classification } from "@lib/api/classifications";
import ActionMenu, { type ActionItem } from "@components/ui-elements/ActionMenu";
import { ApiError } from "@lib/api/client";
import { Loader2, MoreVertical, ToggleLeft, ToggleRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface ImageMCQClientProps {
  initialData?: Question[];
  totalItems?: number;
}

export function ImageMCQClient({
  initialData = [],
  totalItems: initialTotalItems = 0,
}: ImageMCQClientProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const router = useRouter();
  const [subjectFilter, setSubjectFilter] = useState<
    string | number | undefined
  >(undefined);
  // We force IMAGE_MULTIPLE_CHOICE server-side; no UI filter required.
  const FORCED_QUESTION_TYPE = "IMAGE_MULTIPLE_CHOICE";
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<Question[]>(initialData || []);
  const [totalItems, setTotalItems] = useState<number>(initialTotalItems || 0);
  const [subjects, setSubjects] = useState<Classification[]>([]);
  const [togglingId, setTogglingId] = useState<number | null>(null);
  // deletingId and handleDelete removed because delete action was removed
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [editingQuestion, setEditingQuestion] = useState<null | Question>(null);
  const [viewingQuestionId, setViewingQuestionId] = useState<number | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!toastMessage) return;
    const t = setTimeout(() => setToastMessage(null), 4000);
    return () => clearTimeout(t);
  }, [toastMessage]);

  const handleAuthError = (error: unknown): boolean => {
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
  };

  // Column Visibility State
  const allColumns = [
    { id: "srNo", label: "Sr. No." },
    { id: "image", label: "Image" },
    { id: "question", label: "Question" },
    { id: "subject", label: "Subject" },
    { id: "createdBy", label: "Created By" },
    { id: "createdDate", label: "Created Date" },
    { id: "actions", label: "Action" },
  ];

  const [visibleColumns, setVisibleColumns] = useState([
    "srNo",
    "image",
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

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const resp = await classificationsApi.getClassifications({ type: "subject_type", limit: 100 });
        setSubjects(resp.data || []);
      } catch (err) {
        if (err instanceof ApiError) {
          console.error("Failed to fetch subjects (API):", err.status, err.data);
        } else {
          console.error("Failed to fetch subjects:", err);
        }
      }
    };
    fetchSubjects();
  // No question type fetch required since we force the IMAGE_MULTIPLE_CHOICE type.
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await questionsApi.getQuestions({
        page: currentPage,
        limit: pageSize,
        search: debouncedSearch,
        subject_type: subjectFilter !== "all" ? (subjectFilter as string) : undefined,
        // Force IMAGE_MULTIPLE_CHOICE for this client
        question_type: FORCED_QUESTION_TYPE,
      });

      setData(response.data || []);
      if (response.pagination) {
        setTotalItems(response.pagination.total_records);
      }
    } catch (error) {
      if (error instanceof ApiError) {
        console.error("API Error fetching questions:", error.status, error.data);
      } else {
        console.error("Error fetching questions:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch whenever pagination/search/subject changes
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, debouncedSearch, subjectFilter]);

  // Called after a new question is created from the Add modal
  const handleAddSuccess = async () => {
    setIsAddModalOpen(false);
    setToastMessage("Question added successfully.");
    // Reset to first page so user sees newest questions
    setCurrentPage(1);
    await fetchData();
  };

  const handleToggleStatus = async (id: number) => {
    setTogglingId(id);
    try {
      await questionsApi.toggleQuestionStatus(id);
      setToastMessage("Status updated");
      await fetchData();
    } catch (error) {
      if (handleAuthError(error)) return;
      if (error instanceof ApiError) {
        console.error("API Error toggling status:", error.status, error.data);
      } else {
        console.error("Failed to toggle status:", error);
      }
    } finally {
      setTogglingId(null);
    }
  };

  // delete functionality removed per request (no delete in actions)

  const RowActions = ({ id }: { id: number }) => {
    const q = data.find((d) => d.id === id);
    const isActive = q?.is_active !== false;
    const items: ActionItem[] = [
      {
        key: "view",
        label: "View",
        icon: <ImageIcon size={16} />,
        onClick: (e) => { e.stopPropagation(); setViewingQuestionId(id); },
      },
      {
        key: "edit",
        label: "Edit",
        icon: <EditIcon size={16} />,
        onClick: (e) => { e.stopPropagation(); const qd = data.find(d => d.id === id) || null; setEditingQuestion(qd); },
      },
      {
        key: "toggle",
        label: togglingId === id ? "Updating..." : isActive ? "Deactivate" : "Activate",
        icon: togglingId === id ? <Loader2 size={16} className="animate-spin" /> : isActive ? <ToggleRight size={16} /> : <ToggleLeft size={16} />,
        onClick: (e) => { e.stopPropagation(); handleToggleStatus(id); },
        disabled: togglingId === id,
      },
      // Delete action removed per request
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
              <ImageIcon size={20} />
            </div>
            Image-Based MCQs
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
            "flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden",
            isFilterOpen && "border-r border-border",
          )}
        >
              {/* header removed: question type is forced and no UI is needed */}
          <div className="flex-1 overflow-x-auto w-full min-h-0">
            <Table>
              <TableHeader>
                <TableRow>
                  {visibleColumns.includes("srNo") && (
                    <TableHead className="w-[80px] text-center">
                      Sr. No.
                    </TableHead>
                  )}
                  {visibleColumns.includes("image") && (
                    <TableHead className="w-[120px] text-center">Image</TableHead>
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
                    <TableHead className="w-[140px] text-center">Action</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={visibleColumns.length} className="py-8 text-center">
                      <Typography variant="body5" className="text-muted-foreground">Loading questions...</Typography>
                    </TableCell>
                  </TableRow>
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={visibleColumns.length} className="py-8 text-center text-muted-foreground">
                      No questions found.
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((row) => (
                    <TableRow key={row.id}>
                      {visibleColumns.includes("srNo") && (
                        <TableCell className="font-medium text-center">
                          {(currentPage - 1) * pageSize + (data.indexOf(row) + 1)}
                        </TableCell>
                      )}
                      {visibleColumns.includes("image") && (
                        <TableCell className="text-center">
                          {row.image_url ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!row.image_url) return;
                                // Ensure absolute URL so browser can load images served by the API server
                                const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000").replace(/\/$/, "");
                                const full = /^(https?:)?\//.test(row.image_url)
                                  ? row.image_url.startsWith("http")
                                    ? row.image_url
                                    : `${base}${row.image_url}`
                                  : row.image_url;
                                setLightboxUrl(full);
                              }}
                              className="inline-flex items-center gap-2 px-2 py-1 rounded hover:bg-muted/10"
                              title="Open image"
                            >
                              <ImageIcon size={18} />
                              <span className="sr-only">Open image</span>
                            </button>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
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

            {/* Question type is forced to IMAGE_MULTIPLE_CHOICE for this page; no UI filter. */}

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
                  ...subjects.map((s) => ({ id: s.code ?? s.id, label: s.name })),
                ]}
                value={subjectFilter || "all"}
                onChange={(val) => setSubjectFilter(val)}
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
                  setSubjectFilter(undefined);
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

      <AddImageQuestionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        questionType={FORCED_QUESTION_TYPE}
        onSuccess={handleAddSuccess}
      />
      {editingQuestion && (
        <EditImageQuestionModal
          isOpen={true}
          questionData={editingQuestion}
          onClose={() => setEditingQuestion(null)}
          onSuccess={async () => {
            // Try to refresh the updated question in-place to reflect changes immediately
            try {
              const updated = await questionsApi.getQuestion(editingQuestion.id);
              setData((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
              setToastMessage("Question updated successfully.");
            } catch (err) {
              console.error("Failed to fetch updated question after save:", err);
              // fallback to full refresh
              await fetchData();
            } finally {
              setEditingQuestion(null);
            }
          }}
        />
      )}

      {viewingQuestionId && (
        <ViewImageQuestionModal
          isOpen={true}
          onClose={() => setViewingQuestionId(null)}
          questionId={viewingQuestionId}
        />
      )}

      {/* Image lightbox: open when a row's image icon is clicked */}
      {lightboxUrl && (
        <ImageLightbox
          url={lightboxUrl}
          onClose={() => setLightboxUrl(null)}
        />
      )}
    </PageContainer>
  );
}
