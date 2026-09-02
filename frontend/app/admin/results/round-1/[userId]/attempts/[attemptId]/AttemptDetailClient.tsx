"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronUp,
  FileCheck2,
  BookOpen,
  CheckCircle2,
  XCircle,
  MinusCircle,
} from "lucide-react";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { Typography } from "@components/ui-elements/Typography";
import { Alert } from "@components/ui-elements/Alert";
import { Badge } from "@components/ui-elements/Badge";
import { GradeBadge } from "@components/ui-elements/GradeBadge";
import { STYLE_CONFIG } from "@lib/config/style";
import { resultsApi } from "@lib/api/results";
import { type AdminUserResultDetail } from "@types";
import { motion, AnimatePresence } from "framer-motion";
import { AttemptDetailSkeleton } from "@components/ui-skeleton/AttemptDetailSkeleton";

// Components
import { AttemptSummaryCard } from "./components/AttemptSummaryCard";
import { QuestionResultCard } from "./components/QuestionResultCard";

// Utils
import {
  normalizeText,
  extractOptionKey,
  parseQuestionOptions,
} from "@lib/utils";
import { getCanonicalImageUrl } from "@lib/utils/image";
import { getGradeCardStyles } from "@lib/utils/gradeUtils";
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

  const handleManualMarksApply = async (questionId: number, index: number) => {
    const key = `${questionId}-${index}`;
    const value = manualMarks[key];
    if (value === undefined || value === "") return;

    const parsedNumber = parseFloat(value);
    if (isNaN(parsedNumber) || parsedNumber < 0) return;

    try {
      await resultsApi.applyManualMarks(
        userId,
        attemptId,
        questionId,
        parsedNumber,
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
      <PageContainer className="py-8">
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

  return (
    <PageContainer className="py-4 space-y-4">
      {/* Back to Attempt History link */}
      <Link
        href={`/admin/results/round-1/${userId}`}
        className="group flex items-center gap-2 text-muted-foreground hover:text-brand-primary transition-all w-fit"
      >
        <div
          className={`p-1 ${STYLE_CONFIG.iconRadius} bg-muted group-hover:bg-brand-primary/10 transition-colors border border-border group-hover:border-brand-primary/30`}
        >
          <ArrowLeft size={14} />
        </div>
        <Typography
          variant="body5"
          className="font-bold uppercase tracking-widest text-[10px]"
        >
          Back to Attempt History
        </Typography>
      </Link>

      {/* Unified Attempt Summary Card (with Profile, Metrics & Grade Scale Matrix) */}
      <AttemptSummaryCard
        attemptNumber={data.attempt.attempt_number}
        status={data.attempt.status}
        username={data.user.username}
        mobile={data.user.mobile}
        paperName={data.attempt.paper_name}
        startedAt={data.attempt.started_at}
        submittedAt={data.attempt.submitted_at}
        totalScore={data.summary.total_marks_obtained}
        totalMaxMarks={totalMaxMarks}
        correctCount={data.summary.correct_count}
        attemptedCount={data.attempt.attempted_count}
        totalQuestions={data.attempt.total_questions}
        overallGrade={data.summary.overall_grade}
        overallPercentage={data.summary.overall_percentage}
        gradeSettings={data.grade_settings}
      />

      {/* Detailed Result Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="space-y-3.5"
      >
        <div
          className={`flex flex-col md:flex-row md:items-center justify-between gap-3 bg-card p-3.5 px-4 md:p-4 ${STYLE_CONFIG.cardRadius} border border-border/50 shadow-sm`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 ${STYLE_CONFIG.iconRadius} bg-brand-primary/10 text-brand-primary border border-brand-primary/20 shadow-inner`}
            >
              <FileCheck2 size={18} />
            </div>
            <div>
              <Typography
                variant="h4"
                className="font-bold leading-none mb-1 text-sm md:text-base"
              >
                Result Breakdown
              </Typography>
              <Typography
                variant="body5"
                className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest opacity-60"
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
                shape="square"
              >
                {b.label.toUpperCase()}: {b.val}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3.5">
          {data.subject_results.map((subject, idx) => {
            const styles = getGradeCardStyles(subject.grade);
            const sectionAnswers = data.answers.filter(
              (a) => a.section_name === subject.section_name,
            );
            const typingAnswer = sectionAnswers.find(
              (a) => a.typing_stats?.time_taken,
            );
            const sectionDuration = subject.time_minutes
              ? `${subject.time_minutes}m`
              : subject.duration_minutes
                ? `${subject.duration_minutes}m`
                : typingAnswer?.typing_stats?.time_taken
                  ? `${Math.round(typingAnswer.typing_stats.time_taken)}s`
                  : null;

            return (
              <motion.div
                key={subject.section_name}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.05 }}
                className={`bg-card border ${styles.card} ${STYLE_CONFIG.cardRadius} overflow-hidden transition-all duration-300 scroll-mt-20`}
                id={`section-card-${subject.section_name}`}
              >
                <button
                  onClick={() => toggleSection(subject.section_name)}
                  className="w-full flex items-center justify-between p-3.5 px-4 sm:px-5 hover:bg-muted/30 transition-all duration-200 border-b border-border/50 group"
                >
                  {/* Left: Subject Name + Question Count + Time (Single Line) */}
                  <div className="flex items-center gap-3 text-left min-w-0">
                    <div
                      className={`w-1.5 h-6 rounded-full transition-all duration-300 shrink-0 ${styles.bar}`}
                    />
                    <div
                      className={`p-2 ${STYLE_CONFIG.iconRadius} ${styles.icon} transition-colors duration-300 shadow-inner shrink-0`}
                    >
                      <BookOpen size={16} />
                    </div>
                    <div className="flex items-center gap-2.5 flex-nowrap shrink-0">
                      <Typography
                        variant="h4"
                        className="font-bold tracking-tight text-foreground text-base md:text-lg whitespace-nowrap"
                      >
                        {subject.section_name}
                      </Typography>
                      <Badge
                        variant="outline"
                        color={styles.badgeColor}
                        shape="square"
                        className="shrink-0"
                      >
                        {subject.total_questions} Questions
                      </Badge>
                      {sectionDuration && (
                        <Badge
                          variant="outline"
                          color="violet"
                          shape="square"
                          className="shrink-0"
                        >
                          Time: {sectionDuration}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Right: GradeBadge + Compact Metrics HUD + Chevron (Single Line) */}
                  <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
                    {/* Unified Performance & Grade Badge */}
                    <GradeBadge
                      gradeLabel={subject.grade}
                      value={`${subject.percentage}%`}
                      className="min-w-[130px] h-9 px-3.5 py-0 text-xs shrink-0"
                    />

                    {/* Compact Metric HUD (Matching GradeBadge Height, Width, & Font Size) */}
                    <div className="flex items-center justify-between min-w-[130px] h-9 px-3.5 bg-slate-50 dark:bg-slate-900/60 border-2 border-border/80 rounded-sm text-xs shrink-0 select-none shadow-sm">
                      {/* Correct */}
                      <span
                        className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400"
                        title={`Correct: ${subject.correct_count}`}
                      >
                        <CheckCircle2
                          size={14}
                          className="text-emerald-500 shrink-0 stroke-[2.5]"
                        />
                        <span className="font-bold text-xs">
                          {subject.correct_count}
                        </span>
                      </span>

                      <div className="w-1 h-3 bg-muted-foreground/20 mx-1 shrink-0 rounded-sm" />

                      {/* Incorrect */}
                      <span
                        className="flex items-center gap-1.5 text-rose-600 dark:text-rose-400"
                        title={`Incorrect: ${subject.incorrect_count}`}
                      >
                        <XCircle
                          size={14}
                          className="text-rose-500 shrink-0 stroke-[2.5]"
                        />
                        <span className="font-bold text-xs">
                          {subject.incorrect_count}
                        </span>
                      </span>

                      <div className="w-1 h-3 bg-muted-foreground/20 mx-1 shrink-0 rounded-sm" />

                      {/* Skipped */}
                      <span
                        className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400"
                        title={`Skipped: ${subject.unattempted_count}`}
                      >
                        <MinusCircle
                          size={14}
                          className="text-amber-500 shrink-0 stroke-[2.5]"
                        />
                        <span className="font-bold text-xs">
                          {subject.unattempted_count}
                        </span>
                      </span>
                    </div>

                    <div
                      className={`p-1.5 ${STYLE_CONFIG.iconRadius} bg-slate-100 dark:bg-slate-800 transition-colors group-hover:bg-brand-primary/10`}
                    >
                      <motion.div
                        animate={{
                          rotate:
                            activeSection === subject.section_name ? 0 : 180,
                        }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronUp size={16} />
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
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="p-3 md:p-4 space-y-3.5 bg-slate-50/30 dark:bg-slate-900/10">
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
            );
          })}
        </div>
      </motion.div>
    </PageContainer>
  );
}
