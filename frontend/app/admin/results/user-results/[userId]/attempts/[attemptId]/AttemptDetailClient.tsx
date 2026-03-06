"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  CheckCircle2,
  CircleAlert,
  CircleOff,
  Trophy,
  PencilLine,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { PageHeader } from "@components/ui-elements/PageHeader";
import { MainCard } from "@components/ui-cards/MainCard";
import { Typography } from "@components/ui-elements/Typography";
import { Alert } from "@components/ui-elements/Alert";
import { Badge } from "@components/ui-elements/Badge";
import { Button } from "@components/ui-elements/Button";
import { Input } from "@components/ui-elements/Input";
import { resultsApi, type AdminUserResultDetail } from "@lib/api/results";

interface AttemptDetailClientProps {
  userId: number;
  attemptId: number;
}

interface ParsedOption {
  optionLabel: string;
  optionText: string;
  isCorrect: boolean;
}

const normalizeText = (value?: string | null) => (value || "").trim().toLowerCase();

const extractOptionKey = (value?: string | null) => {
  if (!value) return "";
  const match = value.trim().match(/^([a-z0-9]+)\s*[\.\):\-]?/i);
  return match ? match[1].toUpperCase() : "";
};

const parseQuestionOptions = (options: Array<Record<string, unknown>> | null | undefined) => {
  if (!Array.isArray(options)) return [] as ParsedOption[];

  return options.map((raw, index) => ({
    optionLabel:
      String(raw.option_label ?? String.fromCharCode(65 + index)).toUpperCase(),
    optionText: String(raw.option_text ?? ""),
    isCorrect: Boolean(raw.is_correct),
  }));
};

const getCanonicalImageUrl = (url?: string | null) => {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");
  if (!base) return url;
  return url.startsWith("/") ? `${base}${url}` : `${base}/${url}`;
};

export function AttemptDetailClient({
  userId,
  attemptId,
}: AttemptDetailClientProps) {
  const [data, setData] = useState<AdminUserResultDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [manualMarks, setManualMarks] = useState<Record<string, string>>({});
  const [manualMarksApplied, setManualMarksApplied] = useState<Record<string, string>>(
    {},
  );
  const [expandedSections, setExpandedSections] = useState({
    attempted: false,
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
    if (!data) {
      return;
    }

    const initialMarks: Record<string, string> = {};
    data.answers.forEach((answer, index) => {
      initialMarks[`${answer.question_id}-${index}`] = String(answer.marks_obtained ?? "");
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

  const scoreCards = data
    ? [
        {
          key: "attempted",
          label: "Attempted",
          value: `${data.attempt.attempted_count}/${data.attempt.total_questions}`,
          icon: <CheckCircle2 size={16} />,
          tone: "from-brand-primary/15 to-brand-primary/5",
          iconTone: "bg-brand-primary/15 text-brand-primary",
        },
        {
          key: "not_attempted",
          label: "Not Attempted",
          value: data.attempt.unattempted_count,
          icon: <CircleOff size={16} />,
          tone: "from-amber-500/15 to-amber-500/5",
          iconTone: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
        },
        {
          key: "marks",
          label: "Marks Obtained",
          value: data.summary.total_marks_obtained.toFixed(2),
          icon: <Trophy size={16} />,
          tone: "from-emerald-500/15 to-emerald-500/5",
          iconTone: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
        },
      ]
    : [];

  const performanceCards = data
    ? [
        {
          key: "correct",
          label: "Correct",
          value: data.summary.correct_count,
          icon: <CheckCircle2 size={16} />,
          tone: "from-emerald-500/15 to-emerald-500/5",
          iconTone: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
        },
        {
          key: "incorrect",
          label: "Incorrect",
          value: data.summary.incorrect_count,
          icon: <CircleAlert size={16} />,
          tone: "from-red-500/15 to-red-500/5",
          iconTone: "bg-red-500/15 text-red-600 dark:text-red-400",
        },
        {
          key: "unattempted",
          label: "Unattempted",
          value: data.summary.not_attempted_count,
          icon: <CircleOff size={16} />,
          tone: "from-slate-500/15 to-slate-500/5",
          iconTone: "bg-slate-500/15 text-slate-700 dark:text-slate-300",
        },
      ]
    : [];

  const statusCounts = data
    ? {
        correct: data.answers.filter((answer) => answer.status === "correct").length,
        incorrect: data.answers.filter((answer) => answer.status === "incorrect").length,
        notAttempted: data.answers.filter((answer) => answer.status === "not_attempted")
          .length,
      }
    : {
        correct: 0,
        incorrect: 0,
        notAttempted: 0,
      };

  const handleManualMarksApply = (key: string) => {
    setManualMarksApplied((previous) => ({
      ...previous,
      [key]: manualMarks[key] ?? "",
    }));
  };

  const questionItems = data
    ? data.answers.map((answer, index) => ({ answer, index }))
    : [];
  const attemptedQuestionItems = questionItems.filter((item) => item.answer.is_attempted);
  const unattemptedQuestionItems = questionItems.filter((item) => !item.answer.is_attempted);

  const toggleSection = (section: "attempted" | "unattempted") => {
    setExpandedSections((previous) => ({
      ...previous,
      [section]: !previous[section],
    }));
  };

  const renderQuestionCard = (
    answer: AdminUserResultDetail["answers"][number],
    index: number,
  ) => {
    const options = parseQuestionOptions(answer.options || []);
    const optionSelectedByKey = extractOptionKey(answer.user_answer);
    const normalizedUserAnswer = normalizeText(answer.user_answer);
    const isChoiceType =
      options.length > 0 ||
      String(answer.question_type || "").toUpperCase().includes("MCQ") ||
      String(answer.question_type || "").toUpperCase().includes("MULTIPLE_CHOICE");

    return (
      <div
        key={`${answer.question_id}-${index}`}
        className={`rounded-2xl border bg-gradient-to-br from-background to-muted/10 p-5 ${
          answer.status === "correct"
            ? "border-emerald-500/30"
            : answer.status === "incorrect"
              ? "border-red-500/30"
              : "border-amber-500/30"
        }`}
      >
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <Typography
            variant="body4"
            className="font-semibold text-foreground lg:max-w-[75%]"
          >
            Q{index + 1}. {answer.question_text}
          </Typography>
          <Badge
            variant="outline"
            color={
              answer.status === "correct"
                ? "success"
                : answer.status === "incorrect"
                  ? "error"
                  : "warning"
            }
          >
            {answer.status}
          </Badge>
        </div>

        {answer.passage && (
          <div className="mb-4 rounded-xl border border-border bg-muted/20 p-3 sm:p-4 max-h-56 sm:max-h-60 overflow-y-auto">
            <Typography variant="body4" className="text-foreground">
              Passage
            </Typography>
            <Typography variant="body3" className="mt-2 leading-relaxed">
              {answer.passage}
            </Typography>
          </div>
        )}

        {answer.image_url && (
          <div className="mb-4 rounded-xl border border-border bg-muted/20 p-4">
            <Typography variant="body5" className="mb-2">
              Reference Image
            </Typography>
            <Image
              src={getCanonicalImageUrl(answer.image_url) as string}
              alt={`Question ${index + 1} reference`}
              width={640}
              height={360}
              className="w-full max-w-[640px] h-auto rounded-lg border border-border object-contain bg-white"
              unoptimized
            />
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
          <div className="rounded-xl border border-border bg-card p-4 xl:col-span-2">
            <Typography variant="body5" className="font-semibold text-foreground">
              {isChoiceType ? "Option Review" : "Answer Review"}
            </Typography>

            {isChoiceType ? (
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {options.map((option) => {
                  const isSelected =
                    optionSelectedByKey === option.optionLabel ||
                    normalizeText(option.optionText) === normalizedUserAnswer;
                  const optionTone = option.isCorrect
                    ? "border-emerald-500/35 bg-emerald-500/8"
                    : isSelected
                      ? "border-red-500/35 bg-red-500/8"
                      : "border-border bg-card";

                  return (
                    <div
                      key={`${answer.question_id}-${option.optionLabel}`}
                      className={`rounded-xl border px-3 py-3 transition-all ${optionTone}`}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="flex items-start gap-3">
                          <div
                            className={`mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border text-[10px] font-bold ${
                              isSelected
                                ? "border-brand-primary bg-brand-primary/15 text-brand-primary"
                                : "border-border text-muted-foreground"
                            }`}
                          >
                            {option.optionLabel}
                          </div>
                          <Typography variant="body4">{option.optionText}</Typography>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {isSelected && (
                            <Badge variant="outline" color="default">
                              User Choice
                            </Badge>
                          )}
                          {option.isCorrect && (
                            <Badge variant="outline" color="success">
                              Correct
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="mt-3 space-y-2">
                <div className="rounded-lg border border-border bg-muted/10 p-3">
                  <Typography
                    variant="body5"
                    className="font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    User Answer
                  </Typography>
                  <Typography variant="body4" className="mt-1 whitespace-pre-wrap">
                    {answer.user_answer || "Not answered"}
                  </Typography>
                </div>
                <div className="rounded-lg border border-border bg-emerald-500/5 p-3">
                  <Typography
                    variant="body5"
                    className="font-semibold uppercase tracking-wide text-muted-foreground"
                  >
                    Expected Answer
                  </Typography>
                  <Typography variant="body4" className="mt-1 whitespace-pre-wrap">
                    {answer.correct_answer || "N/A"}
                  </Typography>
                </div>
              </div>
            )}

            <div className="mt-3 rounded-lg border border-border bg-muted/20 px-3 py-2">
              <Typography variant="body5" className="text-muted-foreground">
                Auto Marks
              </Typography>
              <Typography variant="body4" className="text-foreground">
                {answer.marks_obtained}/{answer.max_marks}
              </Typography>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <Typography variant="body5" className="font-semibold text-foreground">
              Manual Evaluation
            </Typography>
            <div className="mt-3 space-y-3">
              <Input
                type="number"
                min={0}
                max={answer.max_marks}
                step="0.5"
                value={manualMarks[`${answer.question_id}-${index}`] ?? ""}
                onChange={(event) =>
                  setManualMarks((previous) => ({
                    ...previous,
                    [`${answer.question_id}-${index}`]: event.target.value,
                  }))
                }
                startIcon={<PencilLine size={14} />}
                placeholder={`0 - ${answer.max_marks}`}
              />
              <Typography variant="body5" className="text-muted-foreground">
                Max allowed: {answer.max_marks}
              </Typography>
              <Button
                size="sm"
                variant="outline"
                color="default"
                className="w-full"
                onClick={() => handleManualMarksApply(`${answer.question_id}-${index}`)}
              >
                Apply Manual Marks
              </Button>

              {manualMarksApplied[`${answer.question_id}-${index}`] !== undefined && (
                <div className="rounded-lg border border-brand-primary/25 bg-brand-primary/10 px-3 py-2">
                  <Typography variant="body5" className="text-brand-primary">
                    Manual marks set: {manualMarksApplied[`${answer.question_id}-${index}`]}
                  </Typography>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <PageContainer className="py-2 space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <PageHeader
          title={`Attempt #${attemptId} Detail`}
          description="Question-wise interview result for selected attempt."
          className="mb-0"
        />
        <Link href={`/admin/results/user-results/${userId}`}>
          <Button variant="outline" color="default" startIcon={<ArrowLeft size={14} />}>
            Back to Attempts
          </Button>
        </Link>
      </div>

      {loading && <Typography variant="body4">Loading selected attempt detail...</Typography>}
      {error && <Alert variant="error" description={error} />}

      {!loading && data && (
        <>
          <div className="rounded-2xl border border-border bg-gradient-to-r from-brand-primary/10 via-background to-background p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <Typography variant="h4" className="text-foreground">
                  {data.user.username} ({data.user.mobile})
                </Typography>
                <Typography variant="body5" className="mt-1">
                  Detailed breakdown of answers and scoring for this attempt.
                </Typography>
              </div>
              <Badge variant="outline" color={statusColor}>
                {data.attempt.status}
              </Badge>
            </div>
          </div>

          <MainCard
            title="Attempt Summary"
            bodyClassName="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {scoreCards.map((stat) => (
                <div
                  key={stat.key}
                  className={`rounded-2xl border border-border bg-gradient-to-br ${stat.tone} p-4`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2 ${stat.iconTone}`}>{stat.icon}</div>
                    <div>
                      <Typography variant="body5">{stat.label}</Typography>
                      <Typography variant="h3" className="mt-0.5">
                        {stat.value}
                      </Typography>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
              {performanceCards.map((stat) => (
                <div
                  key={stat.key}
                  className={`rounded-2xl border border-border bg-gradient-to-br ${stat.tone} p-4`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`rounded-lg p-2 ${stat.iconTone}`}>{stat.icon}</div>
                    <div>
                      <Typography variant="body5">{stat.label}</Typography>
                      <Typography variant="h3" className="mt-0.5">
                        {stat.value}
                      </Typography>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </MainCard>

          <MainCard
            title="Question Wise Result"
            bodyClassName="space-y-4"
            action={
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" color="success">
                  Correct: {statusCounts.correct}
                </Badge>
                <Badge variant="outline" color="error">
                  Incorrect: {statusCounts.incorrect}
                </Badge>
                <Badge variant="outline" color="warning">
                  Not Attempted: {statusCounts.notAttempted}
                </Badge>
              </div>
            }
          >
            <div className="space-y-3">
              <div className="overflow-hidden rounded-2xl border border-border">
                <button
                  type="button"
                  onClick={() => toggleSection("attempted")}
                  className="flex w-full items-center justify-between gap-3 bg-muted/20 px-4 py-3 text-left transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-center gap-2">
                    <Typography variant="body4" className="font-semibold text-foreground">
                      Attempted Questions
                    </Typography>
                    <Badge variant="outline" color="success">
                      {attemptedQuestionItems.length}
                    </Badge>
                  </div>
                  {expandedSections.attempted ? (
                    <ChevronUp size={18} className="text-muted-foreground" />
                  ) : (
                    <ChevronDown size={18} className="text-muted-foreground" />
                  )}
                </button>

                {expandedSections.attempted && (
                  <div className="space-y-3 border-t border-border bg-background p-4">
                    {attemptedQuestionItems.length > 0 ? (
                      attemptedQuestionItems.map((item) =>
                        renderQuestionCard(item.answer, item.index),
                      )
                    ) : (
                      <div className="rounded-xl border border-dashed border-border bg-muted/10 p-4 text-center">
                        <Typography variant="body5">No attempted questions found.</Typography>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="overflow-hidden rounded-2xl border border-border">
                <button
                  type="button"
                  onClick={() => toggleSection("unattempted")}
                  className="flex w-full items-center justify-between gap-3 bg-muted/20 px-4 py-3 text-left transition-colors hover:bg-muted/30"
                >
                  <div className="flex items-center gap-2">
                    <Typography variant="body4" className="font-semibold text-foreground">
                      Unattempted Questions
                    </Typography>
                    <Badge variant="outline" color="warning">
                      {unattemptedQuestionItems.length}
                    </Badge>
                  </div>
                  {expandedSections.unattempted ? (
                    <ChevronUp size={18} className="text-muted-foreground" />
                  ) : (
                    <ChevronDown size={18} className="text-muted-foreground" />
                  )}
                </button>

                {expandedSections.unattempted && (
                  <div className="space-y-3 border-t border-border bg-background p-4">
                    {unattemptedQuestionItems.length > 0 ? (
                      unattemptedQuestionItems.map((item) =>
                        renderQuestionCard(item.answer, item.index),
                      )
                    ) : (
                      <div className="rounded-xl border border-dashed border-border bg-muted/10 p-4 text-center">
                        <Typography variant="body5">No unattempted questions found.</Typography>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </MainCard>
        </>
      )}
    </PageContainer>
  );
}
