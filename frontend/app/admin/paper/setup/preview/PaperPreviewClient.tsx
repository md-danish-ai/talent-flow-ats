"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@lib/utils";
import { STYLE_CONFIG } from "@lib/config/style";
import { Typography } from "@components/ui-elements/Typography";
import { Button } from "@components/ui-elements/Button";
import { Switch } from "@components/ui-elements/Switch";
import { Badge } from "@components/ui-elements/Badge";
import { papersApi } from "@lib/api/papers";
import { questionsApi } from "@lib/api/questions";
import { classificationsApi } from "@lib/api/classifications";
import { PaperSetup, Question, Classification } from "@types";
import { toast } from "@lib/toast";
import { PaperPreviewSection } from "./components/PaperPreviewSection";
import {
  ArrowLeft,
  Download,
  Loader2,
  Eye,
  EyeOff,
  Clock,
  Trophy,
  Layers,
  HelpCircle,
  CheckCircle,
} from "lucide-react";
import { useMe } from "@hooks/api/user/use-me";
import { PaperDetailSkeleton } from "@components/ui-skeleton/PaperDetailSkeleton";

interface PaperPreviewClientProps {
  paperId: number;
}

export function PaperPreviewClient({ paperId }: PaperPreviewClientProps) {
  const router = useRouter();
  const { data: currentUser } = useMe();
  const [paper, setPaper] = useState<PaperSetup | null>(null);
  const [allClassifications, setAllClassifications] = useState<
    Classification[]
  >([]);
  const [assignedQuestions, setAssignedQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);

  // View state options
  const [showAnswers, setShowAnswers] = useState(true);

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

        // Filter active subjects
        const filteredSubjectData = (paperData.subject_ids_data || []).filter(
          (ps) => activeSubjects.some((s) => s.id === ps.subject_id),
        );

        const updatedPaper = {
          ...paperData,
          subject_ids_data: filteredSubjectData,
        };

        setPaper(updatedPaper);

        // Fetch questions if any assigned
        if (updatedPaper.question_id && updatedPaper.question_id.length > 0) {
          try {
            const qData = await questionsApi.getQuestionsByIds(
              updatedPaper.question_id,
            );
            setAssignedQuestions(qData || []);
          } catch (qErr) {
            console.error("Failed to fetch questions:", qErr);
            toast.error("Failed to load some assigned questions");
          }
        }
      } catch (error) {
        console.error("Failed to load paper preview:", error);
        toast.error("Failed to load paper details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [paperId]);

  const getSubjectNameAndCode = (subjectId: number) => {
    const subject = allClassifications.find((s) => s.id === subjectId);
    return subject
      ? { name: subject.name, code: subject.code }
      : { name: `Subject ${subjectId}`, code: "" };
  };

  const handleDownloadPdf = async () => {
    if (!paper) return;
    try {
      setIsDownloading(true);
      await papersApi.downloadPaperPdf(paper.id, paper.paper_name, showAnswers);
      toast.success(
        `PDF downloaded successfully (${showAnswers ? "With Answer Key" : "Candidate Paper"})`,
      );
    } catch (err) {
      console.error("Failed to download paper PDF:", err);
      toast.error("Failed to generate and download PDF");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full py-2">
        <PaperDetailSkeleton />
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="flex h-[400px] flex-col items-center justify-center gap-4 text-center">
        <Typography variant="h4" className="text-muted-foreground">
          Paper not found or failed to load.
        </Typography>
        <Button
          variant="primary"
          color="primary"
          size="sm"
          animate="scale"
          onClick={() => router.push(`/admin/paper/setup/detail/${paperId}`)}
        >
          Back to Paper Setup
        </Button>
      </div>
    );
  }

  // Calculate ordered subjects
  const orderedSubjects = [...(paper.subject_ids_data || [])].sort(
    (a, b) => (a.order || 0) - (b.order || 0),
  );

  // Group questions by subject
  const questionsBySubject: Record<number, Question[]> = {};
  assignedQuestions.forEach((q) => {
    const sId = q.subject?.id;
    if (sId) {
      if (!questionsBySubject[sId]) questionsBySubject[sId] = [];
      questionsBySubject[sId].push(q);
    }
  });

  return (
    <div className="w-full space-y-4">
      {/* Unified Single Header Card */}
      <div
        className={cn(
          "bg-white dark:bg-slate-900 border border-border/80 shadow-sm p-5 sm:p-6 space-y-5 relative overflow-hidden",
          STYLE_CONFIG.cardRadius,
        )}
      >
        {/* Top Action Row: Navigation, Breadcrumb & Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-border/60">
          {/* Left: Back button */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              color="primary"
              size="sm"
              animate="scale"
              startIcon={<ArrowLeft size={16} />}
              onClick={() =>
                router.push(`/admin/paper/setup/detail/${paperId}`)
              }
            >
              Back to Setup
            </Button>
          </div>

          {/* Right: View Controls & Download PDF */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Show Answers Toggle Switch */}
            <div
              className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-border/80 cursor-pointer select-none transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setShowAnswers(!showAnswers)}
            >
              <Switch
                size="sm"
                color="success"
                checked={showAnswers}
                onChange={(checked) => setShowAnswers(checked)}
              />
              <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                {showAnswers ? (
                  <>
                    <Eye
                      size={14}
                      className="text-emerald-600 dark:text-emerald-400"
                    />
                    <span>Answers: Visible</span>
                  </>
                ) : (
                  <>
                    <EyeOff size={14} className="text-muted-foreground" />
                    <span className="text-muted-foreground">
                      Answers: Hidden
                    </span>
                  </>
                )}
              </span>
            </div>

            {Number(currentUser?.id) === 1 && (
              <Button
                variant="primary"
                color="primary"
                size="sm"
                animate="scale"
                disabled={isDownloading}
                startIcon={
                  isDownloading ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Download size={16} />
                  )
                }
                onClick={handleDownloadPdf}
              >
                {isDownloading ? "Downloading..." : "Download PDF"}
              </Button>
            )}
          </div>
        </div>

        {/* Paper Overview Details */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge
                variant="fill"
                color="primary"
                shape="square"
                className="font-extrabold uppercase text-[10px] tracking-wider"
              >
                Assessment Paper
              </Badge>
              {paper.department_name && (
                <Badge
                  variant="outline"
                  shape="square"
                  className="font-bold text-[11px]"
                >
                  Dept: {paper.department_name}
                </Badge>
              )}
              {paper.test_level_name && (
                <Badge
                  variant="outline"
                  shape="square"
                  color="primary"
                  className="font-bold text-[11px]"
                >
                  Level: {paper.test_level_name}
                </Badge>
              )}
            </div>

            <div className="flex items-center flex-wrap gap-2.5">
              <Typography
                variant="h2"
                weight="black"
                className="text-foreground tracking-tight text-2xl sm:text-3xl font-black"
              >
                {paper.paper_name}
              </Typography>
              <Badge
                variant="fill"
                color="secondary"
                shape="square"
                className="font-black uppercase text-[10px] tracking-wider"
              >
                Preview Mode
              </Badge>
            </div>

            {paper.description && (
              <Typography
                variant="body4"
                className="text-muted-foreground leading-relaxed italic max-w-4xl"
              >
                &quot;{paper.description}&quot;
              </Typography>
            )}
          </div>

          {/* Answer Key Indicator */}
          <div className="shrink-0">
            <div
              className={cn(
                "p-3 rounded-md border text-right space-y-0.5",
                showAnswers
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300"
                  : "bg-slate-100 dark:bg-slate-800 border-border text-muted-foreground",
              )}
            >
              <div className="text-[10px] font-black uppercase tracking-wider">
                Current View Mode
              </div>
              <div className="text-xs font-black flex items-center gap-1.5 justify-end">
                {showAnswers ? (
                  <>
                    <CheckCircle size={14} className="text-emerald-600" />
                    <span>Answer Key Included</span>
                  </>
                ) : (
                  <span>Candidate Question Paper</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Subjects List: Outline with Primary Badges */}
        {orderedSubjects.length > 0 && (
          <div className="pt-2 border-t border-border/50 flex flex-wrap items-center gap-2">
            {orderedSubjects.map((s, idx) => {
              const info = getSubjectNameAndCode(s.subject_id);
              return (
                <Badge
                  key={s.subject_id}
                  variant="outline"
                  color="primary"
                  shape="square"
                  className="font-semibold text-xs py-1 px-2.5 flex items-center gap-1.5"
                >
                  <span>
                    {idx + 1}. {info.name}
                  </span>
                </Badge>
              );
            })}
          </div>
        )}

        {/* Quick Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Total Duration */}
          <div className="p-3.5 bg-slate-50/80 dark:bg-slate-800/40 border border-border/70 rounded-xl flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-600">
              <Clock size={18} />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Total Duration
              </div>
              <div className="text-sm sm:text-base font-black text-foreground">
                {paper.total_time || "N/A"}
              </div>
            </div>
          </div>

          {/* Total Marks */}
          <div className="p-3.5 bg-slate-50/80 dark:bg-slate-800/40 border border-border/70 rounded-xl flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-600">
              <Trophy size={18} />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Total Marks
              </div>
              <div className="text-sm sm:text-base font-black text-foreground">
                {Number(paper.total_marks || 0) % 1 === 0
                  ? Number(paper.total_marks || 0).toString()
                  : Number(paper.total_marks || 0).toFixed(1)}{" "}
                Marks
              </div>
            </div>
          </div>

          {/* Total Questions */}
          <div className="p-3.5 bg-slate-50/80 dark:bg-slate-800/40 border border-border/70 rounded-xl flex items-center gap-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-600">
              <HelpCircle size={18} />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Assigned Qs
              </div>
              <div className="text-sm sm:text-base font-black text-foreground">
                {assignedQuestions.length} Questions
              </div>
            </div>
          </div>

          {/* Total Subjects */}
          <div className="p-3.5 bg-slate-50/80 dark:bg-slate-800/40 border border-border/70 rounded-xl flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-600">
              <Layers size={18} />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Sections
              </div>
              <div className="text-sm sm:text-base font-black text-foreground">
                {orderedSubjects.length} Subjects
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Render All Subject Sections */}
      <div className="space-y-6">
        {orderedSubjects.map((subjectConfig, sIdx) => {
          const info = getSubjectNameAndCode(subjectConfig.subject_id);
          const subjectQuestions =
            questionsBySubject[subjectConfig.subject_id] || [];
          const startIndex = orderedSubjects
            .slice(0, sIdx)
            .reduce(
              (acc, prev) =>
                acc + (questionsBySubject[prev.subject_id]?.length || 0),
              0,
            );

          return (
            <PaperPreviewSection
              key={subjectConfig.subject_id || sIdx}
              subjectConfig={subjectConfig}
              subjectName={info.name}
              subjectCode={info.code}
              questions={subjectQuestions}
              sectionIndex={sIdx}
              startIndex={startIndex}
              showAnswers={showAnswers}
            />
          );
        })}
      </div>
    </div>
  );
}
