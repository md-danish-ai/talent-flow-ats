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
import { PaperOverviewCard } from "@components/features/paper-setup/PaperOverviewCard";

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
    <div className="w-full space-y-6">
      <PaperOverviewCard
        paper={paper}
        allClassifications={allClassifications}
        assignedQuestionsCount={assignedQuestions.length}
        modeLabel="PREVIEW MODE"
        modeColor="primary"
        backLabel="Back to Setup"
        onBack={() => router.push(`/admin/paper/setup/detail/${paperId}`)}
        rightCard={
          <div
            className={cn(
              "px-3.5 py-2 rounded-md h-[52px] border text-right flex flex-col justify-center space-y-0.5",
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
                  <CheckCircle
                    size={14}
                    className="text-emerald-600 dark:text-emerald-400"
                  />
                  <span>Answer Key Included</span>
                </>
              ) : (
                <span>Candidate Question Paper</span>
              )}
            </div>
          </div>
        }
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Show Answers Toggle Switch */}
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800/80 border border-border/80 cursor-pointer select-none transition-colors hover:bg-slate-200/70 dark:hover:bg-slate-800"
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
        }
      />

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
