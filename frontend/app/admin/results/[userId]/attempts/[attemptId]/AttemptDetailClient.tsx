"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Trophy,
  ChevronUp,
  Target,
  Activity,
  FileCheck2,
} from "lucide-react";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { Typography } from "@components/ui-elements/Typography";
import { Alert } from "@components/ui-elements/Alert";
import { Badge } from "@components/ui-elements/Badge";
import { Button } from "@components/ui-elements/Button";
import { resultsApi, type AdminUserResultDetail } from "@lib/api/results";
import { motion, AnimatePresence } from "framer-motion";

// Components
import { ProfileSummaryStrip } from "./components/ProfileSummaryStrip";
import { PerformanceGrid } from "./components/PerformanceGrid";
import { QuestionResultCard } from "./components/QuestionResultCard";

// Utils
import {
  normalizeText,
  extractOptionKey,
  parseQuestionOptions,
  getCanonicalImageUrl,
} from "./utils";

interface AttemptDetailClientProps {
  userId: number;
  attemptId: number;
}

export function AttemptDetailClient({
  userId,
  attemptId,
}: AttemptDetailClientProps) {
  const [data, setData] = useState<AdminUserResultDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [manualMarks, setManualMarks] = useState<Record<string, string>>({});
  const [manualMarksApplied, setManualMarksApplied] = useState<
    Record<string, string>
  >({});
  const [expandedSections, setExpandedSections] = useState({
    attempted: true,
    unattempted: false,
  });

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await resultsApi.getUserResultDetail(userId, attemptId);
        setData(result);
      } catch {
        setError("Failed to load selected attempt detail.");
      } finally {
        setLoading(false);
      }
    };

    void fetchDetail();
  }, [attemptId, userId]);

  useEffect(() => {
    if (!data) return;

    const initialMarks: Record<string, string> = {};
    data.answers.forEach((answer, index) => {
      initialMarks[`${answer.question_id}-${index}`] = String(
        answer.marks_obtained ?? "",
      );
    });
    setManualMarks(initialMarks);
    setManualMarksApplied({});
  }, [data]);

  const statusColor =
    data?.attempt.status === "auto_submitted"
      ? "warning"
      : data?.attempt.status === "submitted"
        ? "success"
        : "default";

  const handleManualMarksApply = (key: string) => {
    setManualMarksApplied((previous) => ({
      ...previous,
      [key]: manualMarks[key] ?? "",
    }));
  };

  const toggleSection = (section: "attempted" | "unattempted") => {
    setExpandedSections((previous) => ({
      ...previous,
      [section]: !previous[section],
    }));
  };

  if (loading) {
    return (
      <PageContainer className="py-8 space-y-8 animate-pulse">
        <div className="h-10 w-48 bg-muted rounded-lg" />
        <div className="h-32 w-full bg-muted rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-muted rounded-2xl" />
          ))}
        </div>
        <div className="h-96 w-full bg-muted rounded-2xl" />
      </PageContainer>
    );
  }

  if (error || !data) {
    return (
      <PageContainer className="py-8">
        <Alert
          variant="error"
          description={
            <div className="flex flex-col gap-3">
              <Typography variant="body5">
                {error || "Failed to load attempt details."}
              </Typography>
              <Button
                size="sm"
                variant="outline"
                className="w-fit"
                onClick={() => window.location.reload()}
              >
                Retry Loading
              </Button>
            </div>
          }
        />
      </PageContainer>
    );
  }

  const attemptedQuestionItems = data.answers
    .map((answer, index) => ({ answer, index }))
    .filter((o) => o.answer.is_attempted);

  const unattemptedQuestionItems = data.answers
    .map((answer, index) => ({ answer, index }))
    .filter((o) => !o.answer.is_attempted);

  const totalMaxMarks = data.answers.reduce(
    (acc, curr) => acc + curr.max_marks,
    0,
  );

  const scoreStats = [
    {
      label: "Total Score",
      value: data.summary.total_marks_obtained.toFixed(2),
      sub: `/ ${totalMaxMarks}`,
      icon: <Trophy size={20} />,
      color: "text-brand-primary",
      bg: "bg-brand-primary/10",
      border: "border-brand-primary/20",
    },
    {
      label: "Accuracy Rate",
      value: `${((data.summary.correct_count / data.attempt.attempted_count) * 100 || 0).toFixed(0)}%`,
      sub: "of attempted",
      icon: <Target size={20} />,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      label: "Completion",
      value: `${data.attempt.attempted_count}/${data.attempt.total_questions}`,
      sub: "Questions answered",
      icon: <Activity size={20} />,
      color: "text-amber-600",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
    },
  ];

  return (
    <PageContainer className="py-6 space-y-8 max-w-7xl mx-auto">
      {/* Dynamic Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <Link
            href={`/admin/results/${userId}`}
            className="group flex items-center gap-2 text-muted-foreground hover:text-brand-primary transition-colors mb-2"
          >
            <div className="p-1 rounded-lg bg-muted group-hover:bg-brand-primary/10 transition-colors border border-border">
              <ArrowLeft size={16} />
            </div>
            <Typography variant="body5" className="font-bold">
              Back to Attempt History
            </Typography>
          </Link>
          <div className="flex flex-wrap items-center gap-3">
            <Typography variant="h2" className="tracking-tight font-black">
              Attempt Report #{attemptId}
            </Typography>
            <Badge
              color={statusColor}
              variant="fill"
              className="rounded-full px-4 font-black text-[10px]"
            >
              {data.attempt.status.toUpperCase()}
            </Badge>
          </div>
        </div>
      </div>

      {/* Profile Summary Strip */}
      <ProfileSummaryStrip
        username={data.user.username}
        mobile={data.user.mobile}
        startedAt={data.attempt.started_at}
        submittedAt={data.attempt.submitted_at}
      />

      {/* Performance Grid */}
      <PerformanceGrid scoreStats={scoreStats} />

      {/* Detailed Result Breakdown */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-primary/10 text-brand-primary border border-brand-primary/20">
              <FileCheck2 size={20} />
            </div>
            <div>
              <Typography variant="h4" className="font-bold leading-none">
                Result Breakdown
              </Typography>
              <Typography
                variant="body5"
                className="text-muted-foreground mt-1 text-xs"
              >
                Question-by-question performance and scoring.
              </Typography>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              color="success"
              variant="outline"
              className="px-3 py-1 font-bold"
            >
              Correct: {data.summary.correct_count}
            </Badge>
            <Badge
              color="error"
              variant="outline"
              className="px-3 py-1 font-bold"
            >
              Incorrect: {data.summary.incorrect_count}
            </Badge>
            <Badge
              color="warning"
              variant="outline"
              className="px-3 py-1 font-bold"
            >
              Skipped: {data.summary.not_attempted_count}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {/* Attempted Questions Section */}
          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
            <button
              onClick={() => toggleSection("attempted")}
              className="w-full flex items-center justify-between p-5 hover:bg-muted/30 transition-colors border-b border-border"
            >
              <div className="flex items-center gap-3">
                <Typography variant="h4" className="font-bold tracking-tight">
                  Attempted Questions
                </Typography>
                <Badge variant="fill" className="rounded-full px-3">
                  {attemptedQuestionItems.length}
                </Badge>
              </div>
              <motion.div
                animate={{ rotate: expandedSections.attempted ? 0 : 180 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <ChevronUp size={20} />
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {expandedSections.attempted && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="p-4 md:p-6 space-y-6">
                    {attemptedQuestionItems.length > 0 ? (
                      attemptedQuestionItems.map((item) => (
                        <QuestionResultCard
                          key={`${item.answer.question_id}-${item.index}`}
                          answer={item.answer}
                          index={item.index}
                          manualMarksValue={
                            manualMarks[`${item.answer.question_id}-${item.index}`] ?? ""
                          }
                          isManualMarksApplied={
                            manualMarksApplied[`${item.answer.question_id}-${item.index}`] !==
                            undefined
                          }
                          onManualMarksChange={(val) =>
                            setManualMarks((p) => ({
                              ...p,
                              [`${item.answer.question_id}-${item.index}`]: val,
                            }))
                          }
                          onManualMarksApply={() =>
                            handleManualMarksApply(`${item.answer.question_id}-${item.index}`)
                          }
                          getCanonicalImageUrl={getCanonicalImageUrl}
                          parseQuestionOptions={parseQuestionOptions}
                          extractOptionKey={extractOptionKey}
                          normalizeText={normalizeText}
                        />
                      ))
                    ) : (
                      <div className="py-12 text-center text-muted-foreground">
                        No attempted questions.
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Unattempted Questions Section */}
          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
            <button
              onClick={() => toggleSection("unattempted")}
              className="w-full flex items-center justify-between p-5 hover:bg-muted/30 transition-colors border-b border-border"
            >
              <div className="flex items-center gap-3">
                <Typography variant="h4" className="font-bold tracking-tight">
                  Unattempted Questions
                </Typography>
                <Badge
                  variant="fill"
                  color="default"
                  className="rounded-full px-3"
                >
                  {unattemptedQuestionItems.length}
                </Badge>
              </div>
              <motion.div
                animate={{ rotate: expandedSections.unattempted ? 0 : 180 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <ChevronUp size={20} />
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {expandedSections.unattempted && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden"
                >
                  <div className="p-4 md:p-6 space-y-6">
                    {unattemptedQuestionItems.length > 0 ? (
                      unattemptedQuestionItems.map((item) => (
                        <QuestionResultCard
                          key={`${item.answer.question_id}-${item.index}`}
                          answer={item.answer}
                          index={item.index}
                          manualMarksValue={
                            manualMarks[`${item.answer.question_id}-${item.index}`] ?? ""
                          }
                          isManualMarksApplied={
                            manualMarksApplied[`${item.answer.question_id}-${item.index}`] !==
                            undefined
                          }
                          onManualMarksChange={(val) =>
                            setManualMarks((p) => ({
                              ...p,
                              [`${item.answer.question_id}-${item.index}`]: val,
                            }))
                          }
                          onManualMarksApply={() =>
                            handleManualMarksApply(`${item.answer.question_id}-${item.index}`)
                          }
                          getCanonicalImageUrl={getCanonicalImageUrl}
                          parseQuestionOptions={parseQuestionOptions}
                          extractOptionKey={extractOptionKey}
                          normalizeText={normalizeText}
                        />
                      ))
                    ) : (
                      <div className="py-12 text-center text-muted-foreground">
                        No unattempted questions.
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
