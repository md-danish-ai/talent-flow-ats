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
  BookOpen,
  Star,
} from "lucide-react";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { Typography } from "@components/ui-elements/Typography";
import { Alert } from "@components/ui-elements/Alert";
import { Badge } from "@components/ui-elements/Badge";
import { resultsApi } from "@lib/api/results";
import { type AdminUserResultDetail } from "@types";
import { motion, AnimatePresence } from "framer-motion";
import { AttemptDetailSkeleton } from "@components/ui-skeleton/AttemptDetailSkeleton";

// Components
import { ProfileSummaryStrip } from "./components/ProfileSummaryStrip";
import { PerformanceGrid } from "./components/PerformanceGrid";
import { QuestionResultCard } from "./components/QuestionResultCard";

// Utils
import {
  normalizeText,
  extractOptionKey,
  parseQuestionOptions,
} from "@lib/utils";
import { getCanonicalImageUrl } from "@lib/utils/image";
import { Button } from "@components/ui-elements/Button";

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
  const [activeSection, setActiveSection] = useState<string | null>(null);

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
    const initialApplied: Record<string, string> = {};

    data.answers.forEach((answer, index) => {
      const key = `${answer.question_id}-${index}`;
      if (answer.manual_marks !== undefined && answer.manual_marks !== null) {
        initialMarks[key] = String(answer.manual_marks);
        initialApplied[key] = String(answer.manual_marks);
      } else {
        initialMarks[key] = String(answer.marks_obtained ?? "");
      }
    });
    setManualMarks(initialMarks);
    setManualMarksApplied(initialApplied);
  }, [data]);

  const statusColor =
    data?.attempt.status === "auto_submitted"
      ? "warning"
      : data?.attempt.status === "submitted"
        ? "success"
        : "default";

  const handleManualMarksApply = async (questionId: number, index: number) => {
    const key = `${questionId}-${index}`;
    const value = manualMarks[key];
    if (!value) return;

    try {
      await resultsApi.applyManualMarks(
        userId,
        attemptId,
        questionId,
        parseFloat(value),
      );

      setManualMarksApplied((previous) => ({
        ...previous,
        [key]: value,
      }));

      // Soft fetch to visually update aggregated counts and percentages immediately.
      const result = await resultsApi.getUserResultDetail(userId, attemptId);
      setData(result);
    } catch (e) {
      console.error("Failed to apply manual marks:", e);
    }
  };

  const toggleSection = (section: string) => {
    setActiveSection((previous) => (previous === section ? null : section));

    // Use a bit more delay to allow the accordion to expand significantly
    setTimeout(() => {
      const element = document.getElementById(`section-card-${section}`);
      if (element) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 300);
  };

  if (loading) {
    return (
      <PageContainer className="py-8 max-w-7xl mx-auto">
        <AttemptDetailSkeleton />
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

  // Group questions by subject
  const answersBySubject = data.answers.reduce(
    (acc, answer, index) => {
      const section = answer.section_name;
      if (!acc[section]) acc[section] = [];
      acc[section].push({ answer, index });
      return acc;
    },
    {} as Record<string, { answer: (typeof data.answers)[0]; index: number }[]>,
  );

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
    {
      label: "Final Grade",
      value: data.summary.overall_grade.toUpperCase() || "N/A",
      sub: `Performance: ${data.summary.overall_percentage}%`,
      icon: <Star size={20} />,
      color:
        data.summary.overall_grade === "Excellent"
          ? "text-emerald-600"
          : data.summary.overall_grade === "Good"
            ? "text-brand-primary"
            : data.summary.overall_grade === "Average"
              ? "text-amber-600"
              : data.summary.overall_grade === "Poor"
                ? "text-rose-600"
                : "text-indigo-600",
      bg:
        data.summary.overall_grade === "Excellent"
          ? "bg-emerald-500/10"
          : data.summary.overall_grade === "Good"
            ? "bg-brand-primary/10"
            : data.summary.overall_grade === "Average"
              ? "bg-amber-500/10"
              : data.summary.overall_grade === "Poor"
                ? "bg-rose-500/10"
                : "bg-indigo-500/10",
      border:
        data.summary.overall_grade === "Excellent"
          ? "border-emerald-500/20"
          : data.summary.overall_grade === "Good"
            ? "border-brand-primary/20"
            : data.summary.overall_grade === "Average"
              ? "border-amber-500/20"
              : data.summary.overall_grade === "Poor"
                ? "border-rose-500/20"
                : "border-indigo-500/20",
    },
  ];

  return (
    <PageContainer className="py-8 space-y-10 max-w-7xl mx-auto">
      {/* Dynamic Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-6"
      >
        <div className="space-y-4">
          <Link
            href={`/admin/results/${userId}`}
            className="group flex items-center gap-2 text-muted-foreground hover:text-brand-primary transition-all mb-4 w-fit"
          >
            <div className="p-1.5 rounded-xl bg-muted group-hover:bg-brand-primary/10 transition-colors border border-border group-hover:border-brand-primary/30">
              <ArrowLeft size={16} />
            </div>
            <Typography
              variant="body5"
              className="font-black uppercase tracking-widest text-[10px]"
            >
              Back to Attempt History
            </Typography>
          </Link>
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative">
              <Typography
                variant="h1"
                className="tracking-tight font-black sm:text-5xl"
              >
                Attempt{" "}
                <span className="text-brand-primary">
                  #{data.attempt.attempt_number}
                </span>
              </Typography>
              <div className="absolute -bottom-2 left-0 w-24 h-1.5 bg-brand-primary rounded-full opacity-20" />
            </div>
            <div className="flex flex-col gap-1 sm:ml-4">
              <Badge
                color={statusColor}
                variant="fill"
                className="rounded-full px-5 py-1.5 font-black text-[10px] tracking-[0.2em] shadow-lg shadow-brand-primary/10"
              >
                {data.attempt.status.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Profile Summary Strip */}
      <ProfileSummaryStrip
        username={data.user.username}
        mobile={data.user.mobile}
        paperName={data.attempt.paper_name}
        startedAt={data.attempt.started_at}
        submittedAt={data.attempt.submitted_at}
      />

      {/* Performance Grid */}
      <PerformanceGrid scoreStats={scoreStats} />

      {/* Grade Scale Reference */}
      {data.grade_settings && data.grade_settings.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="flex flex-col lg:flex-row lg:items-center gap-4 bg-card p-5 rounded-3xl border border-border/50 shadow-2xl shadow-slate-300/30 dark:shadow-none font-sans"
        >
          <div className="flex items-center gap-3 shrink-0">
            <Star size={20} className="text-brand-primary" />
            <Typography
              variant="h4"
              className="font-black uppercase tracking-widest text-muted-foreground whitespace-nowrap"
            >
              Grade Scale Matrix:
            </Typography>
          </div>
          <div className="flex flex-wrap items-center gap-3 w-full">
            {data.grade_settings.map((g, i) => {
              const gradeCol =
                g.grade_label.toLowerCase() === "excellent"
                  ? "text-emerald-700 bg-emerald-500/10 border-emerald-500/30"
                  : g.grade_label.toLowerCase() === "good"
                    ? "text-brand-primary bg-brand-primary/10 border-brand-primary/30"
                    : g.grade_label.toLowerCase() === "average"
                      ? "text-amber-700 bg-amber-500/10 border-amber-500/30"
                      : g.grade_label.toLowerCase() === "poor"
                        ? "text-rose-700 bg-rose-500/10 border-rose-500/30"
                        : "text-indigo-700 bg-indigo-500/10 border-indigo-500/30";
              return (
                <div
                  key={i}
                  className={`flex-1 min-w-max flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl border-2 ${gradeCol} shadow-sm`}
                >
                  <span className="font-black text-xs uppercase tracking-widest">
                    {g.grade_label}
                  </span>
                  <span className="font-bold text-xs tracking-wide opacity-90 whitespace-nowrap">
                    {g.min}% - {g.max}%
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* Detailed Result Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 bg-card p-5 rounded-3xl border border-border/50 shadow-2xl shadow-slate-300/30 dark:shadow-none">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-brand-primary/10 text-brand-primary border border-brand-primary/20 shadow-inner">
              <FileCheck2 size={20} />
            </div>
            <div>
              <Typography
                variant="h4"
                className="font-black leading-none mb-1.5"
              >
                Result Breakdown
              </Typography>
              <Typography
                variant="body5"
                className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest ml-0.5 opacity-60"
              >
                Subject-wise performance metrics.
              </Typography>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[
              {
                label: "Correct",
                val: data.summary.correct_count,
                col: "success" as const,
              },
              {
                label: "Incorrect",
                val: data.summary.incorrect_count,
                col: "error" as const,
              },
              {
                label: "Skipped",
                val: data.summary.not_attempted_count,
                col: "warning" as const,
              },
            ].map((b) => (
              <Badge
                key={b.label}
                color={b.col}
                variant="outline"
                className="px-4 py-1.5 font-black rounded-xl bg-background border-2 tracking-tight text-[11px]"
              >
                {b.label.toUpperCase()}: {b.val}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-5">
          {data.subject_results.map((subject, idx) => (
            <motion.div
              key={subject.section_name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.1 }}
              className="bg-card border border-border/50 rounded-3xl overflow-hidden shadow-2xl shadow-slate-300/30 dark:shadow-none hover:border-brand-primary/30 transition-all duration-500 scroll-mt-24"
              id={`section-card-${subject.section_name}`}
            >
              <button
                onClick={() => toggleSection(subject.section_name)}
                className="w-full flex items-center justify-between p-5 md:p-6 hover:bg-muted/30 transition-all duration-300 border-b border-border/50 group"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-5 text-left">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-500 group-hover:bg-brand-primary/10 group-hover:text-brand-primary transition-colors duration-500 shadow-inner">
                      <BookOpen size={20} />
                    </div>
                    <div>
                      <Typography
                        variant="h4"
                        className="font-black tracking-tight leading-none mb-1.5"
                      >
                        {subject.section_name}
                      </Typography>
                      <div className="flex items-center gap-3">
                        <Badge
                          variant="outline"
                          className="text-[9px] py-0 px-2 h-5 bg-background font-black tracking-widest border-border/50 rounded-lg"
                        >
                          TOTAL: {subject.total_questions}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="hidden lg:flex items-center gap-8 px-8 border-l border-r border-border/50 py-1">
                    <div className="text-center group-hover:scale-110 transition-transform">
                      <Typography
                        variant="body5"
                        className="text-muted-foreground font-black text-[8px] uppercase tracking-widest mb-1 opacity-50"
                      >
                        Correct
                      </Typography>
                      <Typography
                        variant="h4"
                        className="font-black text-emerald-600 leading-none"
                      >
                        {subject.correct_count}
                      </Typography>
                    </div>
                    <div className="text-center group-hover:scale-110 transition-transform delay-75">
                      <Typography
                        variant="body5"
                        className="text-muted-foreground font-black text-[8px] uppercase tracking-widest mb-1 opacity-50"
                      >
                        Incorrect
                      </Typography>
                      <Typography
                        variant="h4"
                        className="font-black text-rose-600 leading-none"
                      >
                        {subject.incorrect_count}
                      </Typography>
                    </div>
                    <div className="text-center group-hover:scale-110 transition-transform delay-100">
                      <Typography
                        variant="body5"
                        className="text-muted-foreground font-black text-[8px] uppercase tracking-widest mb-1 opacity-50"
                      >
                        Skipped
                      </Typography>
                      <Typography
                        variant="h4"
                        className="font-black text-amber-600 leading-none"
                      >
                        {subject.unattempted_count}
                      </Typography>
                    </div>
                  </div>

                  {/* Unified Performance & Grade Badge (Matrix Style) */}
                  {(() => {
                    const gradeLabel = subject.grade.toLowerCase();
                    const style =
                      gradeLabel === "excellent"
                        ? "text-emerald-700 bg-emerald-500/10 border-emerald-500/30"
                        : gradeLabel === "good"
                          ? "text-brand-primary bg-brand-primary/10 border-brand-primary/30"
                          : gradeLabel === "average"
                            ? "text-amber-700 bg-amber-500/10 border-amber-500/30"
                            : gradeLabel === "poor"
                              ? "text-rose-700 bg-rose-500/10 border-rose-500/30"
                              : "text-indigo-700 bg-indigo-500/10 border-indigo-500/30";

                    return (
                      <div
                        className={`flex items-center justify-between px-5 py-2.5 rounded-xl border-2 ${style} shadow-sm min-w-[170px] transition-transform duration-300 group-hover:scale-105`}
                      >
                        <span className="font-black text-xs uppercase tracking-widest leading-none">
                          {subject.grade}
                        </span>
                        <div className="w-1 h-3 rounded-full bg-current opacity-20 mx-3" />
                        <span className="font-bold text-xs tracking-wide leading-none">
                          {subject.percentage}%
                        </span>
                      </div>
                    );
                  })()}

                  <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 transition-colors group-hover:bg-brand-primary/10">
                    <motion.div
                      animate={{
                        rotate:
                          activeSection === subject.section_name ? 0 : 180,
                      }}
                      transition={{ duration: 0.4 }}
                    >
                      <ChevronUp size={18} />
                    </motion.div>
                  </div>
                </div>
              </button>

              <AnimatePresence initial={false}>
                {activeSection === subject.section_name && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 md:p-6 space-y-6 bg-slate-50/30 dark:bg-slate-900/10">
                      {(answersBySubject[subject.section_name] || []).map(
                        (item) => (
                          <QuestionResultCard
                            key={`${item.answer.question_id}-${item.index}`}
                            answer={item.answer}
                            index={item.index}
                            manualMarksValue={
                              manualMarks[
                                `${item.answer.question_id}-${item.index}`
                              ] ?? ""
                            }
                            isManualMarksApplied={
                              manualMarksApplied[
                                `${item.answer.question_id}-${item.index}`
                              ] !== undefined
                            }
                            onManualMarksChange={(val) =>
                              setManualMarks((p) => ({
                                ...p,
                                [`${item.answer.question_id}-${item.index}`]:
                                  val,
                              }))
                            }
                            onManualMarksApply={() =>
                              handleManualMarksApply(
                                item.answer.question_id,
                                item.index,
                              )
                            }
                            getCanonicalImageUrl={getCanonicalImageUrl}
                            parseQuestionOptions={parseQuestionOptions}
                            extractOptionKey={extractOptionKey}
                            normalizeText={normalizeText}
                          />
                        ),
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </PageContainer>
  );
}
