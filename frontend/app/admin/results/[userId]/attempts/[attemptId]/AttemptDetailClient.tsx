"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Trophy,
  PencilLine,
  ChevronUp,
  Target,
  Activity,
  User,
  FileCheck2,
} from "lucide-react";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { Typography } from "@components/ui-elements/Typography";
import { Alert } from "@components/ui-elements/Alert";
import { Badge, type BadgeColor } from "@components/ui-elements/Badge";
import { Button } from "@components/ui-elements/Button";
import { Input } from "@components/ui-elements/Input";
import { resultsApi, type AdminUserResultDetail } from "@lib/api/results";
import { motion, AnimatePresence } from "framer-motion";

interface AttemptDetailClientProps {
  userId: number;
  attemptId: number;
}

interface ParsedOption {
  optionLabel: string;
  optionText: string;
  isCorrect: boolean;
}

const normalizeText = (value?: string | null) =>
  (value || "").trim().toLowerCase();

const extractOptionKey = (value?: string | null) => {
  if (!value) return "";
  const match = value.trim().match(/^([a-z0-9]+)\s*[\.\):\-]?/i);
  return match ? match[1].toUpperCase() : "";
};

const parseQuestionOptions = (
  options: Array<Record<string, unknown>> | null | undefined,
) => {
  if (!Array.isArray(options)) return [] as ParsedOption[];

  return options.map((raw, index) => ({
    optionLabel: String(
      raw.option_label ?? String.fromCharCode(65 + index),
    ).toUpperCase(),
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

  const renderQuestionCard = (
    answer: AdminUserResultDetail["answers"][number],
    index: number,
  ) => {
    const options = parseQuestionOptions(answer.options || []);
    const optionSelectedByKey = extractOptionKey(answer.user_answer);
    const normalizedUserAnswer = normalizeText(answer.user_answer);
    const isChoiceType = options.length > 0;

    const statusConfig =
      answer.status === "correct"
        ? {
            border: "border-emerald-500/20",
            bg: "bg-emerald-500/[0.02]",
            text: "text-emerald-700",
            badge: "success",
          }
        : answer.status === "incorrect"
          ? {
              border: "border-rose-500/20",
              bg: "bg-rose-500/[0.02]",
              text: "text-rose-700",
              badge: "error",
            }
          : {
              border: "border-amber-500/20",
              bg: "bg-amber-500/[0.02]",
              text: "text-amber-700",
              badge: "warning",
            };

    return (
      <div
        key={`${answer.question_id}-${index}`}
        className={`group relative overflow-hidden rounded-[2rem] border transition-all hover:shadow-xl hover:shadow-brand-primary/5 ${statusConfig.border} ${statusConfig.bg} p-6 md:p-8`}
      >
        {/* Question Header */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-foreground/5 text-[11px] font-black text-foreground/70 border border-foreground/5">
                {index + 1}
              </span>
              <Badge
                variant="outline"
                color={statusConfig.badge as BadgeColor}
                className="px-4 py-1 font-black text-[9px] uppercase tracking-widest border-none bg-card/50 shadow-sm"
              >
                {answer.status.replace("_", " ")}
              </Badge>
              {answer.question_type && (
                <Badge
                  variant="outline"
                  color="default"
                  className="px-4 py-1 font-black text-[9px] uppercase tracking-widest opacity-60"
                >
                  {answer.question_type.replace("_", " ")}
                </Badge>
              )}
            </div>
            <Typography
              variant="h3"
              className="font-black leading-[1.3] text-foreground tracking-tight"
            >
              {answer.question_text}
            </Typography>
          </div>
        </div>

        {answer.image_url && (
          <div className="mb-8 rounded-[1.5rem] border border-border/50 bg-white/50 p-2 shadow-inner group-hover:scale-[1.01] transition-transform duration-500">
            <Image
              src={getCanonicalImageUrl(answer.image_url) as string}
              alt="Question Content"
              width={1200}
              height={600}
              className="w-full rounded-[1.25rem] object-contain bg-white h-auto max-h-[500px]"
              unoptimized
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
              <Typography
                variant="body5"
                className="font-black uppercase tracking-[0.2em] text-muted-foreground/60 whitespace-nowrap"
              >
                Response Review
              </Typography>
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />
            </div>

            {isChoiceType ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {options.map((opt) => {
                  const isSelected =
                    optionSelectedByKey === opt.optionLabel ||
                    normalizeText(opt.optionText) === normalizedUserAnswer;
                  const isCorrect = opt.isCorrect;
                  const isWrong = isSelected && !isCorrect;

                  let cardStyle = "border-border bg-card/50";
                  let labelStyle = "border-border text-muted-foreground/60";

                  if (isCorrect) {
                    cardStyle =
                      "border-emerald-500/30 bg-emerald-500/[0.04] shadow-sm shadow-emerald-500/10";
                    labelStyle =
                      "border-emerald-500/30 bg-emerald-500/10 text-emerald-600";
                  } else if (isWrong) {
                    cardStyle =
                      "border-rose-500/30 bg-rose-500/[0.04] shadow-sm shadow-rose-500/10";
                    labelStyle =
                      "border-rose-500/30 bg-rose-500/10 text-rose-600";
                  } else if (isSelected) {
                    cardStyle =
                      "border-brand-primary/30 bg-brand-primary/[0.04]";
                    labelStyle =
                      "border-brand-primary/30 bg-brand-primary/10 text-brand-primary";
                  }

                  return (
                    <div
                      key={opt.optionLabel}
                      className={`group/opt relative rounded-2xl border p-4 transition-all duration-300 hover:scale-[1.02] ${cardStyle}`}
                    >
                      <div className="flex items-start gap-4">
                        <div
                          className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[11px] font-black transition-colors ${labelStyle}`}
                        >
                          {opt.optionLabel}
                        </div>
                        <div className="flex-1 min-w-0">
                          <Typography
                            variant="body4"
                            className="font-bold leading-snug"
                          >
                            {opt.optionText}
                          </Typography>
                          <div className="mt-2.5 flex flex-wrap gap-2">
                            {isSelected && (
                              <div
                                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider ${isWrong ? "bg-rose-500/10 text-rose-600" : "bg-brand-primary/10 text-brand-primary"}`}
                              >
                                <div
                                  className={`w-1 h-1 rounded-full ${isWrong ? "bg-rose-600" : "bg-brand-primary"}`}
                                />
                                Candidate Answer
                              </div>
                            )}
                            {isCorrect && (
                              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-[9px] font-black uppercase tracking-wider">
                                <div className="w-1 h-1 rounded-full bg-emerald-600" />
                                Correct Choice
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {answer.typing_stats && (
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-in fade-in slide-in-from-top-2 duration-1000">
                    {[
                      {
                        label: "Speed",
                        value: `${answer.typing_stats.wpm} WPM`,
                        bg: "bg-brand-primary/5",
                        color: "text-brand-primary",
                      },
                      {
                        label: "Accuracy",
                        value: `${answer.typing_stats.accuracy}%`,
                        bg: "bg-emerald-500/5",
                        color: "text-emerald-600",
                      },
                      {
                        label: "Errors",
                        value: answer.typing_stats.errors,
                        bg: "bg-rose-500/5",
                        color: "text-rose-600",
                      },
                      {
                        label: "Duration",
                        value: `${Math.round(answer.typing_stats.time_taken)}s`,
                        bg: "bg-amber-500/5",
                        color: "text-amber-600",
                      },
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className={`p-4 rounded-2xl border border-border/50 ${stat.bg} transition-all hover:scale-[1.05]`}
                      >
                        <Typography
                          variant="body5"
                          className="font-black text-muted-foreground/60 uppercase tracking-widest text-[9px] mb-1"
                        >
                          {stat.label}
                        </Typography>
                        <Typography
                          variant="body3"
                          className={`font-black ${stat.color} tracking-tight`}
                        >
                          {stat.value}
                        </Typography>
                      </div>
                    ))}
                  </div>
                )}
                <div className="rounded-2xl border border-emerald-500/10 bg-emerald-500/[0.03] p-5 animate-in fade-in slide-in-from-top-4 duration-500">
                  <Typography
                    variant="body5"
                    className="font-black text-emerald-600/60 mb-2 uppercase tracking-widest font-mono"
                  >
                    {answer.question_type === "TYPING_TEST"
                      ? "SOURCE PASSAGE"
                      : "EXPECTED ANSWER"}
                  </Typography>
                  <Typography
                    variant="body4"
                    className="font-mono leading-relaxed italic text-muted-foreground whitespace-pre-wrap text-xs"
                  >
                    {answer.correct_answer || answer.passage || "N/A"}
                  </Typography>
                </div>
                <div className="rounded-2xl border border-black/[0.03] bg-black/[0.02] p-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  <Typography
                    variant="body5"
                    className="font-black text-muted-foreground/60 mb-2 uppercase tracking-widest"
                  >
                    {answer.question_type === "TYPING_TEST"
                      ? "TYPED TEXT (ERROR TRACKING)"
                      : "CANDIDATE RESPONSE"}
                  </Typography>
                  <Typography
                    variant="body4"
                    className="font-mono leading-relaxed whitespace-pre-wrap select-all text-xs"
                  >
                    {answer.question_type === "TYPING_TEST" &&
                    answer.user_answer &&
                    (answer.correct_answer || answer.passage) ? (
                      (answer.user_answer as string)
                        .split("")
                        .map((char, i) => {
                          const source =
                            answer.correct_answer || (answer.passage as string);
                          const isCorrect = char === source[i];
                          return (
                            <span
                              key={i}
                              className={
                                isCorrect
                                  ? "text-foreground"
                                  : "text-rose-600 bg-rose-500/10 font-black underline decoration-rose-500/50 underline-offset-[3px]"
                              }
                            >
                              {char}
                            </span>
                          );
                        })
                    ) : (
                      answer.user_answer || "No response recorded."
                    )}
                  </Typography>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-6">
            <div className="flex items-center gap-3">
              <Typography
                variant="body5"
                className="font-black uppercase tracking-[0.2em] text-muted-foreground/60 whitespace-nowrap"
              >
                Evaluation
              </Typography>
              <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent opacity-50" />
            </div>

            <div className="rounded-[1.75rem] border border-border/50 bg-card/80 backdrop-blur-md p-6 shadow-sm space-y-6">
              <div className="p-4 rounded-2xl bg-foreground/5 space-y-2">
                <Typography
                  variant="body5"
                  className="font-black text-muted-foreground/60 uppercase tracking-widest"
                >
                  SYSTEM SCORE
                </Typography>
                <div className="flex items-baseline gap-2">
                  <Typography
                    variant="h2"
                    className="font-black tracking-tighter"
                  >
                    {answer.marks_obtained}
                  </Typography>
                  <Typography
                    variant="h4"
                    className="text-muted-foreground/40 font-black"
                  >
                    / {answer.max_marks}
                  </Typography>
                </div>
                <div className="w-full h-1.5 bg-foreground/5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${(answer.marks_obtained / (answer.max_marks || 1)) * 100}%`,
                    }}
                    className={`h-full ${answer.status === "correct" ? "bg-emerald-500" : "bg-rose-500"}`}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Typography
                    variant="body5"
                    className="font-black text-muted-foreground/60 uppercase tracking-widest"
                  >
                    MANUAL OVERRIDE
                  </Typography>
                  <PencilLine size={14} className="text-muted-foreground/40" />
                </div>
                <div className="space-y-3">
                  <Input
                    type="number"
                    max={answer.max_marks}
                    value={manualMarks[`${answer.question_id}-${index}`] ?? ""}
                    onChange={(e) =>
                      setManualMarks((p) => ({
                        ...p,
                        [`${answer.question_id}-${index}`]: e.target.value,
                      }))
                    }
                    startIcon={<PencilLine size={16} className="opacity-40" />}
                    placeholder={`Score (0-${answer.max_marks})`}
                    className="rounded-[1.25rem] border-none bg-foreground/5 h-12 font-black transition-all focus:bg-white shadow-inner"
                  />
                  <Button
                    variant="outline"
                    className="w-full rounded-[1.25rem] h-12 border-2 hover:bg-brand-primary hover:text-white transition-all duration-300 font-black shadow-sm"
                    onClick={() =>
                      handleManualMarksApply(`${answer.question_id}-${index}`)
                    }
                  >
                    Adjust Marks
                  </Button>

                  <AnimatePresence>
                    {manualMarksApplied[`${answer.question_id}-${index}`] !==
                      undefined && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2 p-3 text-[10px] font-black text-emerald-600 bg-emerald-500/10 rounded-xl border border-emerald-500/20"
                      >
                        <FileCheck2 size={12} />
                        MARKS APPLIED:{" "}
                        {manualMarksApplied[`${answer.question_id}-${index}`]}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        {answer.status === "correct" && (
          <div className="absolute top-0 right-0 p-4 opacity-[0.03] pointer-events-none group-hover:scale-110 transition-transform duration-700">
            <Trophy size={200} />
          </div>
        )}
      </div>
    );
  };

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
      <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-r from-card to-brand-primary/5 p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary border border-brand-primary/20">
              <User size={28} />
            </div>
            <div>
              <Typography variant="h4" className="font-bold">
                {data.user.username}
              </Typography>
              <Typography variant="body5" className="text-muted-foreground">
                {data.user.mobile}
              </Typography>
            </div>
          </div>
          <div className="h-10 w-px bg-border hidden lg:block" />
          <div className="flex flex-wrap items-center gap-8">
            <div>
              <Typography
                variant="body5"
                className="text-muted-foreground font-bold uppercase tracking-wider mb-1"
              >
                Started At
              </Typography>
              <Typography variant="body4" className="font-bold">
                {new Date(data.attempt.started_at).toLocaleString()}
              </Typography>
            </div>
            <div>
              <Typography
                variant="body5"
                className="text-muted-foreground font-bold uppercase tracking-wider mb-1"
              >
                Submitted At
              </Typography>
              <Typography variant="body4" className="font-bold">
                {data.attempt.submitted_at
                  ? new Date(data.attempt.submitted_at).toLocaleString()
                  : "N/A"}
              </Typography>
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <FileCheck2 size={80} />
        </div>
      </div>

      {/* Performance Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {scoreStats.map((stat, idx) => (
          <div
            key={idx}
            className={`group relative overflow-hidden rounded-3xl border ${stat.border} bg-card p-6 shadow-sm transition-all hover:shadow-md`}
          >
            <div className="relative z-10 flex items-center gap-5">
              <div
                className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center transition-transform group-hover:scale-110 border ${stat.border}`}
              >
                {stat.icon}
              </div>
              <div>
                <Typography
                  variant="body5"
                  className="font-bold uppercase tracking-widest text-muted-foreground"
                >
                  {stat.label}
                </Typography>
                <div className="flex items-baseline gap-2">
                  <Typography variant="h1" className="font-black leading-none">
                    {stat.value}
                  </Typography>
                  <Typography
                    variant="body5"
                    className="text-muted-foreground font-bold"
                  >
                    {stat.sub}
                  </Typography>
                </div>
              </div>
            </div>
            <div
              className={`absolute -bottom-8 -right-8 w-28 h-28 rounded-full ${stat.bg} blur-3xl opacity-40`}
            />
          </div>
        ))}
      </div>

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
                      attemptedQuestionItems.map((item) =>
                        renderQuestionCard(item.answer, item.index),
                      )
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
                      unattemptedQuestionItems.map((item) =>
                        renderQuestionCard(item.answer, item.index),
                      )
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
