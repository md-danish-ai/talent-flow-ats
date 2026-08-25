import React, { useState, useEffect } from "react";
import { cn } from "@lib/utils";
import { STYLE_CONFIG } from "@lib/config/style";
import { Typography } from "@components/ui-elements/Typography";
import { Button } from "@components/ui-elements/Button";
import { Badge } from "@components/ui-elements/Badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableCollapsibleRow,
} from "@components/ui-elements/Table";
import { EmptyState } from "@components/ui-elements/EmptyState";
import {
  ArrowLeft,
  FileText,
  PlusCircle,
  Loader2,
  BookOpen,
  Layers,
  Trophy,
  Clock,
  Trash2,
  Eye,
} from "lucide-react";
import { AddContentModal } from "./AddContentModal";
import { papersApi } from "@lib/api/papers";
import { PaperSetup, Question, Classification } from "@types";
import { questionsApi } from "@lib/api/questions";
import { classificationsApi } from "@lib/api/classifications";
import { toast } from "@lib/toast";
import { PaperDetailSkeleton } from "@components/ui-skeleton/PaperDetailSkeleton";
import { PaperOverviewCard } from "@components/features/paper-setup/PaperOverviewCard";

interface PaperSetupDetailProps {
  paperId: number;
  onBack: () => void;
}

export const PaperSetupDetail: React.FC<PaperSetupDetailProps> = ({
  paperId,
  onBack,
}) => {
  const [paper, setPaper] = useState<PaperSetup | null>(null);
  const [allClassifications, setAllClassifications] = useState<
    Classification[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSubjectId, setExpandedSubjectId] = useState<number | null>(
    null,
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedSubjectForAdd, setSelectedSubjectForAdd] = useState<
    string | null
  >(null);
  const [selectedSubjectCodeForAdd, setSelectedSubjectCodeForAdd] = useState<
    string | null
  >(null);
  const [selectedSubjectIdForAdd, setSelectedSubjectIdForAdd] = useState<
    number | null
  >(null);
  const [targetCountForAdd, setTargetCountForAdd] = useState(0);
  const [targetMarksForAdd, setTargetMarksForAdd] = useState(0);
  const [assignedQuestions, setAssignedQuestions] = useState<Question[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchAssignedQuestions = async (ids: number[]) => {
    if (!ids || ids.length === 0) {
      setAssignedQuestions([]);
      return;
    }
    try {
      const res = await questionsApi.getQuestionsByIds(ids);
      setAssignedQuestions(res || []);
    } catch (error) {
      console.error("Failed to fetch assigned questions:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [paperData, subjectsRes] = await Promise.all([
          papersApi.getPaperById(paperId),
          classificationsApi.getClassifications({
            type: "subject",
            is_active: true,
            limit: 100,
          }),
        ]);

        const activeSubjects = subjectsRes.data || [];
        setAllClassifications(activeSubjects);

        // Filter paper subjects to only include active ones
        const filteredSubjectData = (paperData.subject_ids_data || []).filter(
          (ps) => activeSubjects.some((s) => s.id === ps.subject_id),
        );

        // Update paper object with only active subjects for this view
        const updatedPaper = {
          ...paperData,
          subject_ids_data: filteredSubjectData,
        };

        setPaper(updatedPaper);
      } catch (error) {
        console.error("Failed to fetch details:", error);
        toast.error("Failed to load paper details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [paperId]);

  useEffect(() => {
    if (paper?.question_id) {
      fetchAssignedQuestions(paper.question_id);
    } else {
      setAssignedQuestions([]);
    }
  }, [paper?.question_id]);

  const getSubjectNameAndCode = (subjectId: number) => {
    const subject = allClassifications.find((s) => s.id === subjectId);
    return subject
      ? { name: subject.name, code: subject.code }
      : { name: `Subject ${subjectId}`, code: "" };
  };

  const getSubjectName = (subjectId: number) =>
    getSubjectNameAndCode(subjectId).name;

  const handleSaveQuestions = async (newIds: number[]) => {
    console.log("Handle Save Questions - New IDs received:", newIds);
    if (!paper || selectedSubjectIdForAdd === null) return;

    try {
      setIsUpdating(true);
      // We need to merge the new selections for THIS subject with existing selections for OTHER subjects
      // 1. Get other subjects' questions (those that don't match the current subject's ID)
      const otherSubjectsQuestionIds = assignedQuestions
        .filter((q) => q.subject?.id !== selectedSubjectIdForAdd)
        .map((q) => q.id);

      // 2. Combine with new IDs
      const combinedIds = [...otherSubjectsQuestionIds, ...newIds];

      await papersApi.updatePaper(
        paper.id,
        { question_id: combinedIds },
        { silentSuccess: true },
      );

      // 3. Refresh paper data to trigger re-fetch of questions
      const updatedPaper = await papersApi.getPaperById(paper.id);
      setPaper(updatedPaper);

      toast.success("Questions updated successfully");
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Failed to update questions:", error);
      toast.error("Failed to update questions");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemoveQuestion = async (questionId: number) => {
    if (!paper) return;
    try {
      const updatedIds =
        paper.question_id?.filter((id) => id !== questionId) || [];
      await papersApi.updatePaper(
        paper.id,
        { question_id: updatedIds },
        { silentSuccess: true },
      );

      const updatedPaper = await papersApi.getPaperById(paper.id);
      setPaper(updatedPaper);
      toast.success("Question removed");
    } catch (error) {
      console.error("Failed to remove question:", error);
      toast.error("Failed to remove question");
    }
  };

  if (isLoading) {
    return <PaperDetailSkeleton />;
  }

  if (!paper) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-4 text-center">
        <Typography variant="h4" className="text-muted-foreground">
          Paper not found or failed to load.
        </Typography>
        <Button onClick={onBack}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <PaperOverviewCard
        paper={paper}
        allClassifications={allClassifications}
        assignedQuestionsCount={assignedQuestions.length}
        modeLabel="CONFIGURATION"
        modeColor="secondary"
        backLabel="Back to Listing"
        onBack={onBack}
        actions={
          <Button
            variant="outline"
            size="sm"
            animate="scale"
            onClick={() =>
              window.open(`/admin/paper/setup/preview/${paper.id}`, "_blank")
            }
            className="font-bold text-xs gap-1.5 border-brand-primary/40 text-brand-primary hover:bg-brand-primary/10 transition-all shadow-sm"
            startIcon={<Eye size={15} />}
          >
            Preview Paper
          </Button>
        }
      />

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 ml-2">
          <div className="h-6 w-1.5 rounded-full bg-brand-primary shadow-[0_0_10px_theme(colors.brand-primary/40%)]" />
          <Typography
            variant="h4"
            weight="bold"
            className="text-foreground tracking-tight"
          >
            Question Assignment Panel
          </Typography>
          <div className="h-[1px] flex-1 bg-gradient-to-r from-border/60 to-transparent" />
        </div>

        <div
          className={cn(
            "border border-border overflow-hidden shadow-[0_15px_40px_-15px_rgba(0,0,0,0.1)] bg-white dark:bg-slate-950",
            STYLE_CONFIG.cardRadius,
          )}
        >
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10 text-center">#</TableHead>
                <TableHead className="w-20">Sr. No.</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Total Selected Questions</TableHead>
                <TableHead>Question Count</TableHead>
                <TableHead>Question Marks</TableHead>
                <TableHead className="text-center pr-8 w-24">Order</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...paper.subject_ids_data]
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((config, index: number) => (
                  <TableCollapsibleRow
                    key={config.id || index}
                    colSpan={7}
                    className={cn(
                      "group/row transition-all duration-300",
                      expandedSubjectId === config.subject_id
                        ? "bg-slate-50/80 dark:bg-slate-900/40"
                        : "",
                    )}
                    isOpen={expandedSubjectId === config.subject_id}
                    onOpenChange={(open) =>
                      setExpandedSubjectId(open ? config.subject_id : null)
                    }
                    expandedContent={
                      <div className="bg-white dark:bg-slate-950 border-t border-border shadow-inner">
                        <div className="p-4 bg-slate-50/50 dark:bg-slate-900/30 border-b border-border flex justify-between items-center px-8">
                          <Typography
                            variant="body4"
                            className="text-slate-500 dark:text-slate-400 italic"
                          >
                            Select questions from the list below to assign them
                            to this subject.
                          </Typography>
                          <Button
                            variant="primary"
                            color="primary"
                            size="sm"
                            animate="scale"
                            startIcon={<PlusCircle size={16} />}
                            className="font-bold text-xs px-6"
                            onClick={(e) => {
                              e.stopPropagation();
                              const sInfo = getSubjectNameAndCode(
                                config.subject_id,
                              );
                              setSelectedSubjectForAdd(sInfo.name);
                              setSelectedSubjectCodeForAdd(sInfo.code);
                              setSelectedSubjectIdForAdd(config.subject_id);
                              setTargetCountForAdd(config.question_count);
                              setTargetMarksForAdd(config.total_marks);
                              setIsAddModalOpen(true);
                            }}
                            disabled={isUpdating}
                          >
                            {isUpdating &&
                            selectedSubjectCodeForAdd ===
                              getSubjectNameAndCode(config.subject_id).code ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              "Add Content"
                            )}
                          </Button>
                        </div>
                        {(() => {
                          const subjectQuestions = assignedQuestions.filter(
                            (q) => q.subject?.id === config.subject_id,
                          );
                          const hasPassage = subjectQuestions.some((q) =>
                            Boolean(q.passage && q.passage.trim().length > 0),
                          );
                          return (
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="text-center w-20 pl-8">
                                    Sr. No.
                                  </TableHead>
                                  {hasPassage && (
                                    <TableHead className="w-[300px] pl-4">
                                      Passage
                                    </TableHead>
                                  )}
                                  <TableHead className="pl-4">
                                    Question Text
                                  </TableHead>
                                  <TableHead className="text-center w-[180px]">
                                    Question Type
                                  </TableHead>
                                  <TableHead className="text-center w-24">
                                    Marks
                                  </TableHead>
                                  <TableHead className="text-center w-[100px] pr-8">
                                    Action
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {subjectQuestions.length > 0 ? (
                                  subjectQuestions.map((q, qIndex) => (
                                    <TableRow key={q.id}>
                                      <TableCell className="text-center text-slate-500 dark:text-slate-400 font-bold text-sm pl-8 font-mono">
                                        {String(qIndex + 1).padStart(2, "0")}
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
                                      <TableCell className="py-5 pl-4">
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
                                      <TableCell className="text-center w-[100px] pr-8">
                                        <Button
                                          variant="ghost"
                                          size="icon-sm"
                                          onClick={() =>
                                            handleRemoveQuestion(q.id)
                                          }
                                          className="text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                                          title="Remove Question"
                                        >
                                          <Trash2 size={16} />
                                        </Button>
                                      </TableCell>
                                    </TableRow>
                                  ))
                                ) : (
                                  <EmptyState
                                    colSpan={hasPassage ? 6 : 5}
                                    title="No questions assigned"
                                    description="Click Add Content to select questions."
                                  />
                                )}
                              </TableBody>
                            </Table>
                          );
                        })()}
                      </div>
                    }
                  >
                    <TableCell>
                      <Typography
                        variant="body4"
                        weight="bold"
                        className="text-slate-500 dark:text-slate-400 font-mono text-sm"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </Typography>
                    </TableCell>
                    <TableCell className="font-bold text-brand-primary text-sm hover:text-brand-hover cursor-pointer transition-all">
                      {getSubjectName(config.subject_id)}
                    </TableCell>
                    {/* Total Selected Questions Badge (Square Shape) */}
                    <TableCell>
                      {(() => {
                        const selectedCount = assignedQuestions.filter(
                          (q) => q.subject?.id === config.subject_id,
                        ).length;
                        const isComplete =
                          selectedCount === config.question_count;
                        const isOver = selectedCount > config.question_count;
                        return (
                          <div
                            className={cn(
                              "inline-flex items-center gap-2 px-2.5 py-1 rounded-md border text-xs font-mono font-bold transition-all shadow-2xs",
                              isComplete
                                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                                : isOver
                                  ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30"
                                  : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
                            )}
                          >
                            <span
                              className={cn(
                                "w-2 h-2 rounded-full shrink-0",
                                isComplete
                                  ? "bg-emerald-500"
                                  : isOver
                                    ? "bg-red-500"
                                    : "bg-amber-500 animate-pulse",
                              )}
                            />
                            <span className="font-black">
                              {selectedCount} / {config.question_count}
                            </span>
                            <span
                              className={cn(
                                "text-[9px] uppercase font-black tracking-wider px-1.5 py-0.5 rounded",
                                isComplete
                                  ? "bg-emerald-500/20 text-emerald-700 dark:text-emerald-300"
                                  : isOver
                                    ? "bg-red-500/20 text-red-700 dark:text-red-300"
                                    : "bg-amber-500/20 text-amber-700 dark:text-amber-300",
                              )}
                            >
                              {isComplete
                                ? "Done"
                                : isOver
                                  ? "Over"
                                  : `${config.question_count - selectedCount} Left`}
                            </span>
                          </div>
                        );
                      })()}
                    </TableCell>

                    {/* Question Count Chip (Colorful Blue) */}
                    <TableCell>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-500/10 dark:bg-blue-500/15 border border-blue-500/25 text-blue-600 dark:text-blue-400">
                        <span className="font-mono font-black text-sm">
                          {config.question_count}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-blue-500/70 dark:text-blue-400/70 tracking-wider">
                          Questions
                        </span>
                      </div>
                    </TableCell>

                    {/* Question Marks Chip (Colorful Brand Primary) */}
                    <TableCell>
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-brand-primary/10 dark:bg-brand-primary/15 border border-brand-primary/20 text-brand-primary">
                        <span className="font-mono font-black text-sm">
                          {Number(config.total_marks.toFixed(2))}
                        </span>
                        <span className="text-[10px] uppercase font-bold text-brand-primary/70 tracking-wider">
                          Marks
                        </span>
                      </div>
                    </TableCell>

                    {/* Order Sequence Tag (Colorful Purple) */}
                    <TableCell className="text-center pr-8">
                      <div className="inline-flex items-center justify-center w-7 h-7 rounded-md bg-purple-500/10 dark:bg-purple-500/20 border border-purple-500/30 text-purple-600 dark:text-purple-400 font-mono font-black text-xs shadow-2xs group-hover/row:bg-purple-500/20 transition-all">
                        {config.order}
                      </div>
                    </TableCell>
                  </TableCollapsibleRow>
                ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {isAddModalOpen && selectedSubjectForAdd && (
        <AddContentModal
          subjectName={selectedSubjectForAdd || ""}
          subjectCode={selectedSubjectCodeForAdd || ""}
          examLevel={paper.test_level_id}
          targetQuestionCount={targetCountForAdd}
          targetTotalMarks={targetMarksForAdd}
          initialSelectedIds={assignedQuestions
            .filter((q) => q.subject?.id === selectedSubjectIdForAdd)
            .map((q) => q.id)}
          initialSelectedMarksMap={assignedQuestions
            .filter((q) => q.subject?.id === selectedSubjectIdForAdd)
            .reduce((acc, q) => ({ ...acc, [q.id]: q.marks }), {})}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleSaveQuestions}
        />
      )}
    </div>
  );
};

const StatsCard = ({
  icon,
  label,
  value,
  bgColor,
  borderColor,
  labelColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  bgColor: string;
  borderColor: string;
  labelColor: string;
}) => (
  <div
    className={cn(
      "flex items-center gap-4 p-4 border shadow-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-md",
      STYLE_CONFIG.innerCardRadius,
      bgColor,
      borderColor,
    )}
  >
    <div
      className={cn(
        "p-2.5 bg-white dark:bg-slate-900 shadow-sm",
        STYLE_CONFIG.iconRadius,
      )}
    >
      {icon}
    </div>
    <div className="flex flex-col">
      <Typography
        variant="body5"
        weight="black"
        className={cn("uppercase tracking-widest text-[9px]", labelColor)}
      >
        {label}
      </Typography>
      <Typography
        variant="body3"
        weight="black"
        className="text-slate-900 dark:text-slate-100"
      >
        {value}
      </Typography>
    </div>
  </div>
);
