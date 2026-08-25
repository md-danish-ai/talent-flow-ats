import React, { useState, useEffect, useCallback, useRef } from "react";
import { cn } from "@lib/utils";
import { Typography } from "@components/ui-elements/Typography";
import { Button } from "@components/ui-elements/Button";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { Checkbox } from "@components/ui-elements/Checkbox";
import { Badge } from "@components/ui-elements/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui-elements/Table";
import { EmptyState } from "@components/ui-elements/EmptyState";
import { Skeleton } from "@components/ui-elements/Skeleton";
import { X, RotateCw } from "lucide-react";
import { Pagination } from "@components/ui-elements/Pagination";
import { questionsApi } from "@lib/api/questions";
import { Question, Classification } from "@types";
import { classificationsApi } from "@lib/api/classifications";
import { MARKS_OPTIONS } from "@lib/constants/questions";

interface AddContentModalProps {
  subjectName: string;
  subjectCode: string;
  examLevel: string;
  onClose: () => void;
  onSave: (selectedIds: number[]) => void;
  initialSelectedIds?: number[];
  initialSelectedMarksMap?: Record<number, number>;
  targetQuestionCount: number;
  targetTotalMarks: number;
}

export const AddContentModal: React.FC<AddContentModalProps> = ({
  subjectName,
  subjectCode,
  examLevel,
  onClose,
  onSave,
  initialSelectedIds = [],
  initialSelectedMarksMap = {},
  targetQuestionCount,
  targetTotalMarks,
}) => {
  const [questionTypes, setQuestionTypes] = useState<Classification[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedMarks, setSelectedMarks] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] =
    useState<number[]>(initialSelectedIds);
  const [selectedMarksMap, setSelectedMarksMap] = useState<
    Record<number, number>
  >(initialSelectedMarksMap || {});
  const [isLoading, setIsLoading] = useState(false);
  const initializedRef = useRef(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  // Fetch Question Types
  useEffect(() => {
    const fetchData = async () => {
      try {
        const typesRes = await classificationsApi.getClassifications({
          type: "question_type",
          is_active: true,
          limit: 100,
        });
        setQuestionTypes(typesRes.data || []);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    if (!initializedRef.current) {
      fetchData();
      initializedRef.current = true;
    }
  }, []);

  // Fetch Questions
  const fetchQuestions = useCallback(async () => {
    if (!subjectCode) {
      setQuestions([]);
      setTotalRecords(0);
      return;
    }
    try {
      setIsLoading(true);
      const res = await questionsApi.getQuestions({
        subject: subjectCode,
        exam_level: examLevel,
        question_type: selectedType || undefined,
        marks: selectedMarks ? Number(selectedMarks) : undefined,
        page: currentPage,
        limit: pageSize,
      });
      setQuestions(res.data || []);
      setTotalRecords(res.pagination.total_records || 0);
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    } finally {
      setIsLoading(false);
    }
  }, [
    subjectCode,
    examLevel,
    selectedType,
    selectedMarks,
    currentPage,
    pageSize,
  ]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleTypeChange = (val: string) => {
    setSelectedType(val);
    setCurrentPage(1);
  };

  const handleMarksChange = (val: string) => {
    setSelectedMarks(val);
    setCurrentPage(1);
  };

  const handleToggleQuestion = (id: number, marks: number) => {
    setSelectedQuestions((prev) => {
      const isSelected = prev.includes(id);
      if (isSelected) {
        setSelectedMarksMap((prevMap) => {
          const newMap = { ...prevMap };
          delete newMap[id];
          return newMap;
        });
        return prev.filter((qId) => qId !== id);
      } else {
        setSelectedMarksMap((prevMap) => ({ ...prevMap, [id]: marks }));
        return [...prev, id];
      }
    });
  };

  const handleToggleAll = () => {
    const allCurrentSelected = questions.every((q) =>
      selectedQuestions.includes(q.id),
    );

    if (allCurrentSelected) {
      const currentIds = questions.map((q) => q.id);
      setSelectedQuestions((prev) =>
        prev.filter((id) => !currentIds.includes(id)),
      );
      setSelectedMarksMap((prevMap) => {
        const newMap = { ...prevMap };
        currentIds.forEach((id) => delete newMap[id]);
        return newMap;
      });
    } else {
      const currentQuestionsToSelect = questions.filter(
        (q) => !selectedQuestions.includes(q.id),
      );
      setSelectedQuestions((prev) => [
        ...prev,
        ...currentQuestionsToSelect.map((q) => q.id),
      ]);
      setSelectedMarksMap((prevMap) => {
        const newMap = { ...prevMap };
        currentQuestionsToSelect.forEach((q) => {
          newMap[q.id] = q.marks;
        });
        return newMap;
      });
    }
  };

  const currentSelectedCount = selectedQuestions.length;
  const currentSelectedMarks = Object.values(selectedMarksMap).reduce(
    (acc, m) => acc + m,
    0,
  );

  const isRequirementMet =
    currentSelectedCount === targetQuestionCount &&
    currentSelectedMarks === targetTotalMarks;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-[95vw] xl:max-w-[1500px] 2xl:max-w-[1600px] shadow-2xl flex flex-col h-[85vh] max-h-[90vh] overflow-hidden border border-border/50 rounded-md">
        {/* Header */}
        <div className="px-8 py-5 border-b border-border flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex-1">
            <Typography
              variant="h4"
              weight="black"
              className="text-slate-800 dark:text-white flex items-center gap-3"
            >
              <span className="w-1.5 h-6 bg-brand-primary rounded-full block shrink-0" />
              Assign Questions:{" "}
              <span className="text-brand-primary">{subjectName}</span>
            </Typography>
            <Typography
              variant="body5"
              className="text-muted-foreground/70 uppercase tracking-widest font-bold mt-1 ml-4 text-[10px]"
            >
              {examLevel} LEVEL ASSESSMENT
            </Typography>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={onClose}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={20} />
            </Button>
          </div>
        </div>

        {/* Unified Top Toolbar: Metrics + Filters + Status in Single Line */}
        <div className="px-8 py-3 bg-slate-50/80 dark:bg-slate-800/40 border-b border-border/60 flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          {/* Left Side: Target Cards + Filters */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Target Quantity Card */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-border shadow-xs">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Target Questions
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span
                    className={cn(
                      "text-base font-black font-mono leading-none",
                      currentSelectedCount === targetQuestionCount
                        ? "text-emerald-600 dark:text-emerald-400"
                        : currentSelectedCount > targetQuestionCount
                          ? "text-red-500"
                          : "text-slate-800 dark:text-slate-100",
                    )}
                  >
                    {currentSelectedCount}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    / {targetQuestionCount}
                  </span>
                </div>
              </div>
              {currentSelectedCount === targetQuestionCount ? (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  Ready
                </span>
              ) : (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 border border-amber-500/20">
                  {targetQuestionCount - currentSelectedCount > 0
                    ? `${targetQuestionCount - currentSelectedCount} Needed`
                    : `${currentSelectedCount - targetQuestionCount} Over`}
                </span>
              )}
            </div>

            {/* Target Marks Card */}
            <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-border shadow-xs">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Target Marks
                </span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span
                    className={cn(
                      "text-base font-black font-mono leading-none",
                      currentSelectedMarks === targetTotalMarks
                        ? "text-emerald-600 dark:text-emerald-400"
                        : currentSelectedMarks > targetTotalMarks
                          ? "text-red-500"
                          : "text-slate-800 dark:text-slate-100",
                    )}
                  >
                    {currentSelectedMarks}
                  </span>
                  <span className="text-[11px] font-semibold text-slate-400">
                    / {targetTotalMarks}
                  </span>
                </div>
              </div>
              {currentSelectedMarks === targetTotalMarks ? (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                  Matched
                </span>
              ) : (
                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-600 border border-amber-500/20">
                  {targetTotalMarks - currentSelectedMarks > 0
                    ? `${targetTotalMarks - currentSelectedMarks} Left`
                    : `${currentSelectedMarks - targetTotalMarks} Over`}
                </span>
              )}
            </div>

            {/* Subtle Divider */}
            <div className="h-6 w-px bg-border/80 hidden xl:block mx-0.5" />

            {/* Filter: Question Type */}
            <div className="w-[260px]">
              <SelectDropdown
                value={selectedType}
                onChange={(val) => handleTypeChange(String(val))}
                placeholder="All Question Types"
                options={[
                  { id: "", label: "All Question Types" },
                  ...questionTypes.map((t) => ({ id: t.code, label: t.name })),
                ]}
                className="h-9 min-h-0 px-3 py-0 border-slate-200 dark:border-slate-800 rounded-md text-xs font-medium"
              />
            </div>

            {/* Filter: Marks */}
            <div className="w-[180px]">
              <SelectDropdown
                value={selectedMarks}
                onChange={(val) => handleMarksChange(String(val))}
                placeholder="All Marks"
                options={[{ id: "", label: "All Marks" }, ...MARKS_OPTIONS]}
                className="h-9 min-h-0 px-3 py-0 border-slate-200 dark:border-slate-800 rounded-md text-xs font-medium"
              />
            </div>

            {/* Refresh Button */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={fetchQuestions}
              disabled={isLoading}
              title="Refresh Questions"
              className="text-slate-400 hover:text-brand-primary h-9 w-9"
            >
              <RotateCw size={15} className={isLoading ? "animate-spin" : ""} />
            </Button>
          </div>

          {/* Right Side: Total Matching Count & Status */}
          <div className="flex items-center gap-3.5 ml-auto">
            <span className="text-xs font-medium text-slate-400 hidden lg:inline-block">
              Found{" "}
              <strong className="font-bold text-slate-700 dark:text-slate-200">
                {totalRecords}
              </strong>{" "}
              questions
            </span>

            {/* Status Pill */}
            <div
              className={cn(
                "px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-2",
                isRequirementMet
                  ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                  : "bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 border-border",
              )}
            >
              <span
                className={cn(
                  "w-2 h-2 rounded-full",
                  isRequirementMet
                    ? "bg-emerald-500"
                    : "bg-amber-500 animate-pulse",
                )}
              />
              <span>
                {isRequirementMet
                  ? "Target Requirements Met"
                  : "Target Incomplete"}
              </span>
            </div>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto bg-slate-50/30 dark:bg-slate-950/20">
          {(() => {
            const hasPassage = questions.some((q) =>
              Boolean(q.passage && q.passage.trim().length > 0),
            );
            return (
              <Table>
                <TableHeader className="sticky top-0 z-10 bg-slate-50 dark:bg-slate-900 border-b border-border shadow-xs">
                  <TableRow>
                    <TableHead className="text-center w-20 pl-6">
                      Sr. No.
                    </TableHead>
                    {hasPassage && (
                      <TableHead className="w-[300px] pl-4">Passage</TableHead>
                    )}
                    <TableHead className="pl-4">Question Text</TableHead>
                    <TableHead className="text-center w-[180px]">
                      Question Type
                    </TableHead>
                    <TableHead className="text-center w-24">Marks</TableHead>
                    <TableHead className="text-center w-20 pr-6">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <span className="text-[10px] font-bold tracking-wider opacity-70">
                          ALL
                        </span>
                        <Checkbox
                          checked={
                            !isLoading &&
                            questions.length > 0 &&
                            questions.every((q) =>
                              selectedQuestions.includes(q.id),
                            )
                          }
                          disabled={isLoading || questions.length === 0}
                          onChange={() => handleToggleAll()}
                        />
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    Array.from({ length: 6 }).map((_, idx) => (
                      <TableRow
                        key={`skeleton-${idx}`}
                        className="border-b border-border/40 hover:bg-transparent min-h-16"
                      >
                        <TableCell className="text-center pl-6 w-20 py-4">
                          <Skeleton className="h-4 w-6 mx-auto rounded" />
                        </TableCell>
                        {hasPassage && (
                          <TableCell className="w-[300px] pl-4 py-4">
                            <div className="space-y-1.5 pl-3 border-l-2 border-slate-200 dark:border-slate-800">
                              <Skeleton className="h-3 w-4/5 rounded" />
                              <Skeleton className="h-3 w-3/5 rounded" />
                            </div>
                          </TableCell>
                        )}
                        <TableCell className="pl-4 py-4">
                          <div className="space-y-2">
                            <Skeleton className="h-4 w-full rounded" />
                            <Skeleton className="h-3.5 w-2/3 rounded" />
                          </div>
                        </TableCell>
                        <TableCell className="text-center w-[180px] py-4">
                          <Skeleton className="h-6 w-28 mx-auto rounded-sm" />
                        </TableCell>
                        <TableCell className="text-center w-24 py-4">
                          <Skeleton className="h-5 w-8 mx-auto rounded" />
                        </TableCell>
                        <TableCell className="text-center w-20 pr-6 py-4">
                          <Skeleton className="h-4 w-4 mx-auto rounded-sm" />
                        </TableCell>
                      </TableRow>
                    ))
                  ) : questions.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={hasPassage ? 6 : 5}
                        className="p-12 text-center border-none"
                      >
                        <EmptyState
                          variant="search"
                          title="No Questions Found"
                          description="Try adjusting your filters or check if questions exist for this subject."
                        />
                      </TableCell>
                    </TableRow>
                  ) : (
                    questions.map((q, index) => (
                      <TableRow key={q.id} className="group min-h-16">
                        <TableCell className="text-center text-slate-500 dark:text-slate-400 font-bold text-sm pl-6 w-20 font-mono">
                          {((currentPage - 1) * pageSize + index + 1)
                            .toString()
                            .padStart(2, "0")}
                        </TableCell>
                        {hasPassage && (
                          <TableCell className="max-w-[300px] pl-4">
                            {q.passage ? (
                              <div className="pl-3 border-l-2 border-brand-primary/40 dark:border-brand-primary/60 py-0.5">
                                <p
                                  className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2 leading-relaxed select-text"
                                  title={q.passage}
                                >
                                  {q.passage}
                                </p>
                              </div>
                            ) : (
                              <span className="text-slate-400 text-xs italic">
                                -
                              </span>
                            )}
                          </TableCell>
                        )}
                        <TableCell className="py-6 pl-4">
                          <Typography
                            variant="body4"
                            weight="bold"
                            className="text-slate-700 dark:text-slate-200 leading-relaxed line-clamp-2"
                          >
                            {q.question_text}
                          </Typography>
                        </TableCell>
                        <TableCell className="text-center w-[180px]">
                          <Badge
                            variant="outline"
                            shape="square"
                            color="primary"
                          >
                            {q.question_type?.name || "N/A"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center w-24">
                          <Typography
                            variant="body4"
                            weight="black"
                            className="text-brand-primary text-[13px]"
                          >
                            {q.marks}
                          </Typography>
                        </TableCell>
                        <TableCell className="text-center w-20 pr-6">
                          <div className="flex items-center justify-center">
                            <Checkbox
                              checked={selectedQuestions.includes(q.id)}
                              onChange={() =>
                                handleToggleQuestion(q.id, q.marks)
                              }
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            );
          })()}
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-border bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {totalRecords > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(totalRecords / pageSize) || 1}
                onPageChange={setCurrentPage}
                totalItems={totalRecords}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                className="border-none py-0"
              />
            )}

            <div className="flex gap-2 ml-auto">
              <Button
                variant="outline"
                color="primary"
                animate="scale"
                onClick={onClose}
                className="px-6 font-bold text-[10px] uppercase tracking-widest h-9 rounded-md"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                color="primary"
                animate="scale"
                onClick={() => onSave(selectedQuestions)}
                className="px-8 font-extrabold text-[10px] uppercase tracking-widest h-9 rounded-md shadow-lg shadow-brand-primary/20"
                disabled={isLoading || !isRequirementMet}
              >
                Save Selection
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
