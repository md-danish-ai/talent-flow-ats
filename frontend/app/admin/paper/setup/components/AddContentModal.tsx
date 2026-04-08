import React, { useState, useEffect, useCallback } from "react";
import { Typography } from "@components/ui-elements/Typography";
import { Button } from "@components/ui-elements/Button";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { Checkbox } from "@components/ui-elements/Checkbox";
import { Badge } from "@components/ui-elements/Badge";
import { Alert } from "@components/ui-elements/Alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui-elements/Table";
import { X, Loader2, Search, RotateCw, Wand2, ListFilter, AlertCircle } from "lucide-react";
import { Pagination } from "@components/ui-elements/Pagination";
import { questionsApi, Question } from "@lib/api/questions";
import { classificationsApi, Classification } from "@lib/api/classifications";
import { toast } from "@lib/toast";

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
    fetchData();
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
    setCurrentPage(1);
  }, [selectedType, selectedMarks]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

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
      <div className="bg-white dark:bg-slate-900 w-full max-w-6xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-border/50 rounded-md">
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

        {/* Stats bar */}
        <div className="px-8 py-4 bg-slate-50/30 dark:bg-slate-800/10 border-b border-border/40 flex items-center justify-between">
            <div className="flex items-center gap-6">
                 <div className="flex items-center gap-2">
                    <Typography variant="body5" weight="black" className="text-slate-400 uppercase text-[8px]">Target Qty</Typography>
                    <Typography variant="body4" weight="black" className="text-brand-success font-mono">{targetQuestionCount}</Typography>
                 </div>
                 <div className="flex items-center gap-2">
                    <Typography variant="body5" weight="black" className="text-slate-400 uppercase text-[8px]">Target Marks</Typography>
                    <Typography variant="body4" weight="black" className="text-brand-success font-mono">{targetTotalMarks}</Typography>
                 </div>
            </div>

            <div className="flex items-center gap-8">
                <div className="flex flex-col items-end">
                    <Typography variant="body5" weight="black" className="text-slate-400 uppercase tracking-tighter text-[8px]">Selected Qty.</Typography>
                    <Typography variant="h5" weight="black" className={currentSelectedCount === targetQuestionCount ? "text-brand-success font-mono" : "text-red-500 font-mono"}>
                        {currentSelectedCount}
                    </Typography>
                </div>
                <div className="flex flex-col items-end">
                    <Typography variant="body5" weight="black" className="text-slate-400 uppercase tracking-tighter text-[8px]">Selected Marks</Typography>
                    <Typography variant="h5" weight="black" className={currentSelectedMarks === targetTotalMarks ? "text-brand-success font-mono" : "text-red-500 font-mono"}>
                        {currentSelectedMarks}
                    </Typography>
                </div>
            </div>
        </div>

        {/* Filters */}
        <div className="px-8 py-6 bg-white dark:bg-slate-900 border-b border-border/50 flex flex-wrap items-end gap-6">
          <div className="space-y-1.5 w-[200px]">
            <Typography variant="body5" weight="bold" className="text-muted-foreground uppercase tracking-wider ml-1 text-[10px]">Question Type</Typography>
            <SelectDropdown
              value={selectedType}
              onChange={(val) => setSelectedType(String(val))}
              placeholder="All Types"
              options={[
                { id: "", label: "All Question Types" },
                ...questionTypes.map((t) => ({ id: t.code, label: t.name })),
              ]}
              className="h-10 border-slate-200 dark:border-slate-800 rounded-md"
            />
          </div>
          <div className="space-y-1.5 w-[160px]">
            <Typography variant="body5" weight="bold" className="text-muted-foreground uppercase tracking-wider ml-1 text-[10px]">Filter by Marks</Typography>
            <SelectDropdown
              value={selectedMarks}
              onChange={(val) => setSelectedMarks(String(val))}
              placeholder="All Marks"
              options={[
                { id: "", label: "All Marks" },
                ...[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(m => ({ id: String(m), label: `${m} Mark${m > 1 ? 's' : ''}` }))
              ]}
              className="h-10 border-slate-200 dark:border-slate-800 rounded-md"
            />
          </div>
          <div className="flex items-center gap-2 pb-0.5">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={fetchQuestions}
              disabled={isLoading}
              title="Refresh Questions"
              className="text-slate-400 hover:text-brand-primary"
            >
              <RotateCw size={18} className={isLoading ? "animate-spin" : ""} />
            </Button>
            <Typography variant="body5" className="text-slate-400 italic">Found {totalRecords}</Typography>
          </div>
        </div>

        {/* Table Content */}
        <div className="flex-1 overflow-auto bg-slate-50/30 dark:bg-slate-950/20">
          {isLoading ? (
            <div className="h-[300px] flex flex-col items-center justify-center gap-4">
              <Loader2 size={40} className="text-brand-primary animate-spin" />
              <Typography variant="body4" className="text-muted-foreground animate-pulse">Loading Question Library...</Typography>
            </div>
          ) : questions.length === 0 ? (
            <div className="h-[300px] flex flex-col items-center justify-center text-center p-8">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
                <Search size={24} className="text-slate-400" />
              </div>
              <Typography variant="h4" weight="bold" className="text-slate-800 dark:text-slate-200 text-sm">No Questions Found</Typography>
              <Typography variant="body5" className="text-muted-foreground mt-2 max-w-xs uppercase tracking-widest text-[10px]">
                Try adjusting your filters or check if questions exist for this subject.
              </Typography>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center w-20 pl-6">Sr.</TableHead>
                  <TableHead className="pl-4">Question Details</TableHead>
                  <TableHead className="text-center w-[180px]">Question Type</TableHead>
                  <TableHead className="text-center w-24">Marks</TableHead>
                  <TableHead className="pr-6">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] opacity-70">ALL</span>
                      <Checkbox
                        checked={questions.length > 0 && questions.every((q) => selectedQuestions.includes(q.id))}
                        onChange={() => handleToggleAll()}
                      />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions.map((q, index) => (
                  <TableRow key={q.id} className="group border-b border-border/40 hover:bg-brand-primary/[0.02] dark:hover:bg-brand-primary/[0.04] transition-colors min-h-16">
                    <TableCell className="text-center text-slate-400 font-black text-[11px] pl-6 w-20">
                      {((currentPage - 1) * pageSize + index + 1).toString().padStart(2, "0")}
                    </TableCell>
                    <TableCell className="py-6 pl-4">
                      <Typography variant="body4" weight="bold" className="text-slate-700 dark:text-slate-200 leading-relaxed line-clamp-2">
                        {q.question_text}
                      </Typography>
                    </TableCell>
                    <TableCell className="text-center w-[180px]">
                      <Badge variant="outline" shape="square" color="primary" className="font-black text-[9px] px-3 py-1 border-brand-primary/20 uppercase tracking-widest whitespace-nowrap">
                        {q.question_type?.name || "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center w-24">
                      <Typography variant="body4" weight="black" className="text-brand-primary text-[13px]">{q.marks}</Typography>
                    </TableCell>
                    <TableCell className="text-center pr-6">
                        <Checkbox 
                            checked={selectedQuestions.includes(q.id)} 
                            onChange={() => handleToggleQuestion(q.id, q.marks)} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-4 border-t border-border bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(totalRecords / pageSize) || 1}
                onPageChange={setCurrentPage}
                totalItems={totalRecords}
                pageSize={pageSize}
                onPageSizeChange={setPageSize}
                className="border-none py-0"
            />

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
