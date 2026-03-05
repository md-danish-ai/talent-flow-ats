"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Lock,
  PlayCircle,
  Sparkles,
} from "lucide-react";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { MainCard } from "@components/ui-cards/MainCard";
import { Typography } from "@components/ui-elements/Typography";
import { Button } from "@components/ui-elements/Button";
import { Badge } from "@components/ui-elements/Badge";
import { Alert } from "@components/ui-elements/Alert";
import { Radio } from "@components/ui-elements/Radio";
import { Textarea } from "@components/ui-elements/Textarea";
import { Modal } from "@components/ui-elements/Modal";

type QuestionType = "MCQ" | "IMAGE_MCQ" | "SUBJECTIVE" | "PASSAGE_MCQ";

interface InterviewQuestion {
  id: number;
  type: QuestionType;
  questionText: string;
  description?: string;
  options?: string[];
  passage?: string;
  imageUrl?: string;
}

interface InterviewSection {
  id: string;
  title: string;
  durationMinutes: number;
  questions: InterviewQuestion[];
}

const DEFAULT_OVERALL_EXAM_DURATION_MINUTES = 50;
const OVERALL_EXAM_DURATION_MINUTES = (() => {
  const configured = Number(process.env.NEXT_PUBLIC_INTERVIEW_TOTAL_DURATION_MINUTES);
  if (!Number.isFinite(configured) || configured <= 0) {
    return DEFAULT_OVERALL_EXAM_DURATION_MINUTES;
  }
  return Math.floor(configured);
})();
const OVERALL_EXAM_TOTAL_SECONDS = OVERALL_EXAM_DURATION_MINUTES * 60;

const DUMMY_SECTIONS: InterviewSection[] = [
  {
    id: "grammar",
    title: "Grammar",
    durationMinutes: 8,
    questions: [
      {
        id: 101,
        type: "MCQ",
        description: "Select the suitable answer out of the given options.",
        questionText:
          "She ______ in Switzerland for ten years when she was a child.",
        options: ["lived", "had lived", "has lived", "was living"],
      },
      {
        id: 102,
        type: "SUBJECTIVE",
        description: "Arrange the words in grammatically correct sequence.",
        questionText: "of / are / afraid / what / you",
      },
    ],
  },
  {
    id: "aptitude",
    title: "Aptitude",
    durationMinutes: 10,
    questions: [
      {
        id: 201,
        type: "MCQ",
        description: "Choose the correct option.",
        questionText:
          "If the marked price is reduced by 20% and then by another 10%, the final reduction is:",
        options: ["28%", "30%", "32%", "18%"],
      },
      {
        id: 202,
        type: "MCQ",
        description: "Choose the correct option.",
        questionText:
          "A train crosses a pole in 15 seconds and a 300m platform in 35 seconds. Train length is:",
        options: ["225m", "300m", "450m", "150m"],
      },
    ],
  },
  {
    id: "comprehension",
    title: "Comprehension",
    durationMinutes: 12,
    questions: [
      {
        id: 301,
        type: "PASSAGE_MCQ",
        description: "Read the passage and answer the question.",
        passage:
          "A worker accidentally dropped a heavy sack on a chicken near a butcher shop. The owner demanded a very high compensation. A magistrate intervened and proposed a practical deal: the owner could keep the worker for two years, but only if he also covered the worker's food and shelter costs. Hearing this, the owner withdrew his demand immediately.",
        questionText:
          "Why did the owner finally withdraw the compensation demand?",
        options: [
          "He was convinced by legal pressure.",
          "He realized the long-term cost would be higher.",
          "He felt sorry for the worker.",
          "The worker paid him privately.",
        ],
      },
      {
        id: 302,
        type: "SUBJECTIVE",
        description: "Write in 2-3 lines.",
        questionText:
          "Summarize the key lesson from the passage in your own words.",
      },
    ],
  },
  {
    id: "written",
    title: "Written",
    durationMinutes: 8,
    questions: [
      {
        id: 401,
        type: "SUBJECTIVE",
        description: "Make a sentence using the following word.",
        questionText: "Resolution",
      },
      {
        id: 402,
        type: "SUBJECTIVE",
        description: "Answer briefly.",
        questionText:
          "Describe one challenge you solved in a team and what role you played.",
      },
    ],
  },
  {
    id: "industry-awareness",
    title: "Industry Awareness",
    durationMinutes: 7,
    questions: [
      {
        id: 501,
        type: "IMAGE_MCQ",
        description: "Identify the brand associated with the shown logo.",
        questionText: "Choose the correct brand name from below.",
        imageUrl: "/blue_ag.png",
        options: ["Plum & Grapes", "Procter & Gamble", "Patzo & Game", "None"],
      },
      {
        id: 502,
        type: "MCQ",
        description: "Choose the correct option.",
        questionText: "Which of the following is NOT a shopping website?",
        options: ["Amazon", "eBay", "Macy's", "None of these"],
      },
    ],
  },
];

const formatTime = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

export default function InterviewTestPage() {
  const [hasStarted, setHasStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionReason, setCompletionReason] = useState<
    "manual" | "time_over" | null
  >(null);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [isSectionChangeConfirmOpen, setIsSectionChangeConfirmOpen] =
    useState(false);
  const [timerModalState, setTimerModalState] = useState<{
    isOpen: boolean;
    title: string;
    attemptedCount: number;
    unattemptedCount: number;
    totalCount: number;
  }>({
    isOpen: false,
    title: "",
    attemptedCount: 0,
    unattemptedCount: 0,
    totalCount: 0,
  });
  const [lockedSections, setLockedSections] = useState<boolean[]>(
    DUMMY_SECTIONS.map(() => false),
  );
  const [examRemainingSeconds, setExamRemainingSeconds] = useState(
    OVERALL_EXAM_TOTAL_SECONDS,
  );
  const hasHandledOverallTimeoutRef = useRef(false);
  const latestAnswersRef = useRef<Record<number, string>>({});

  const currentSection = DUMMY_SECTIONS[sectionIndex];
  const currentQuestion = currentSection.questions[questionIndex];
  const currentAnswer = answers[currentQuestion.id] || "";

  const totalQuestions = useMemo(
    () =>
      DUMMY_SECTIONS.reduce((total, section) => total + section.questions.length, 0),
    [],
  );

  const allQuestions = useMemo(
    () => DUMMY_SECTIONS.flatMap((section) => section.questions),
    [],
  );

  const answeredCount = useMemo(
    () =>
      allQuestions.reduce((count, question) => {
        const value = answers[question.id]?.trim();
        return value ? count + 1 : count;
      }, 0),
    [allQuestions, answers],
  );
  const notAttemptedCount = totalQuestions - answeredCount;

  const completedBeforeCurrentSection = DUMMY_SECTIONS.slice(0, sectionIndex)
    .map((section) => section.questions.length)
    .reduce((sum, count) => sum + count, 0);

  const completedSteps = completedBeforeCurrentSection + questionIndex + 1;
  const progressPercent = Math.min(
    100,
    Math.round((completedSteps / totalQuestions) * 100),
  );
  const overallExamSpentRatio =
    OVERALL_EXAM_TOTAL_SECONDS > 0
      ? (OVERALL_EXAM_TOTAL_SECONDS - examRemainingSeconds) /
        OVERALL_EXAM_TOTAL_SECONDS
      : 0;
  const timerZone: "safe" | "warn" | "danger" =
    overallExamSpentRatio >= 0.8
      ? "danger"
      : overallExamSpentRatio >= 0.6
        ? "warn"
        : "safe";
  const isLastQuestionInSection =
    questionIndex === currentSection.questions.length - 1;
  const isLastSection = sectionIndex === DUMMY_SECTIONS.length - 1;

  const finalizeSectionAttemptStatus = useCallback(
    (sectionIdx: number, answerSnapshot: Record<number, string>) => {
      const section = DUMMY_SECTIONS[sectionIdx];
      let attempted = 0;
      let unattempted = 0;

      section.questions.forEach((question) => {
        const value = answerSnapshot[question.id]?.trim();
        if (value) {
          attempted += 1;
        } else {
          unattempted += 1;
        }
      });

      return {
        sectionTitle: section.title,
        total: section.questions.length,
        attempted,
        unattempted,
      };
    },
    [],
  );

  const finalizeOverallAttemptStatus = useCallback(
    (answerSnapshot: Record<number, string>) => {
      let attempted = 0;
      let unattempted = 0;

      allQuestions.forEach((question) => {
        const value = answerSnapshot[question.id]?.trim();
        if (value) {
          attempted += 1;
        } else {
          unattempted += 1;
        }
      });

      return {
        attempted,
        unattempted,
        total: allQuestions.length,
      };
    },
    [allQuestions],
  );

  const lockAndMoveToNextSection = useCallback(
    (
      currentIndex: number,
      answerSnapshot: Record<number, string>,
      notice?: string,
    ) => {
      finalizeSectionAttemptStatus(currentIndex, answerSnapshot);

      setLockedSections((prev) => {
        const next = [...prev];
        next[currentIndex] = true;
        return next;
      });

      if (currentIndex === DUMMY_SECTIONS.length - 1) {
        finalizeOverallAttemptStatus(answerSnapshot);
        setCompletionReason("manual");
        setIsCompleted(true);
        setMessage("Interview completed successfully.");
        return;
      }

      setSectionIndex(currentIndex + 1);
      setQuestionIndex(0);
      setMessage(notice ?? "Section locked. You cannot return to this section.");
    },
    [finalizeOverallAttemptStatus, finalizeSectionAttemptStatus],
  );

  useEffect(() => {
    latestAnswersRef.current = answers;
  }, [answers]);

  const handleOverallTimeOver = useCallback(() => {
    if (hasHandledOverallTimeoutRef.current) return;
    hasHandledOverallTimeoutRef.current = true;

    const summary = finalizeOverallAttemptStatus(latestAnswersRef.current);
    setLockedSections(DUMMY_SECTIONS.map(() => true));
    setIsSectionChangeConfirmOpen(false);
    setCompletionReason("time_over");
    setIsCompleted(true);
    setMessage("Overall interview time is over. Answers were auto-submitted.");
    setTimerModalState({
      isOpen: true,
      title: "Interview Time Over",
      attemptedCount: summary.attempted,
      unattemptedCount: summary.unattempted,
      totalCount: summary.total,
    });
  }, [finalizeOverallAttemptStatus]);

  useEffect(() => {
    if (!hasStarted || isCompleted) return;

    const timer = setInterval(() => {
      setExamRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimeout(() => {
            handleOverallTimeOver();
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [handleOverallTimeOver, hasStarted, isCompleted]);

  const setCurrentAnswer = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
  };

  const handlePrevious = () => {
    if (questionIndex === 0) return;
    setQuestionIndex((prev) => prev - 1);
    setMessage(null);
  };

  const handleSaveAndNext = () => {
    setMessage(null);

    if (!isLastQuestionInSection) {
      setQuestionIndex((prev) => prev + 1);
      return;
    }

    if (!isLastSection) {
      setIsSectionChangeConfirmOpen(true);
      return;
    }

    lockAndMoveToNextSection(sectionIndex, answers);
  };

  const handleConfirmSectionChange = () => {
    setIsSectionChangeConfirmOpen(false);
    lockAndMoveToNextSection(
      sectionIndex,
      answers,
      "Section changed successfully. You cannot return to previous section.",
    );
  };

  const handleReset = () => {
    setHasStarted(false);
    setIsCompleted(false);
    setCompletionReason(null);
    setSectionIndex(0);
    setQuestionIndex(0);
    setAnswers({});
    setMessage(null);
    setIsSectionChangeConfirmOpen(false);
    setTimerModalState({
      isOpen: false,
      title: "",
      attemptedCount: 0,
      unattemptedCount: 0,
      totalCount: 0,
    });
    setLockedSections(DUMMY_SECTIONS.map(() => false));
    setExamRemainingSeconds(OVERALL_EXAM_TOTAL_SECONDS);
    hasHandledOverallTimeoutRef.current = false;
    latestAnswersRef.current = {};
  };

  const renderQuestionInput = () => {
    if (
      currentQuestion.type === "MCQ" ||
      currentQuestion.type === "IMAGE_MCQ" ||
      currentQuestion.type === "PASSAGE_MCQ"
    ) {
      return (
        <div className="space-y-3">
          {(currentQuestion.options || []).map((option, index) => {
            const optionKey = String.fromCharCode(65 + index);
            const value = `${optionKey}. ${option}`;
            const isChecked = currentAnswer === value;

            return (
              <label
                key={`${currentQuestion.id}-${optionKey}`}
                className={`group flex items-center gap-3 rounded-xl border px-4 py-3 transition-all ${
                  isChecked
                    ? "border-brand-primary bg-brand-primary/10 shadow-[0_6px_20px_rgba(249,99,49,0.14)]"
                    : "border-border bg-card hover:border-brand-primary/40 hover:bg-brand-primary/5"
                }`}
              >
                <Radio
                  checked={isChecked}
                  onChange={() => setCurrentAnswer(value)}
                  name={`question-${currentQuestion.id}`}
                />
                <Typography
                  variant="body3"
                  className={`transition-colors break-words ${
                    isChecked
                      ? "text-brand-primary font-semibold"
                      : "text-foreground group-hover:text-brand-primary"
                  }`}
                >
                  {value}
                </Typography>
              </label>
            );
          })}
        </div>
      );
    }

    return (
      <Textarea
        rows={8}
        placeholder="Write your answer here..."
        value={currentAnswer}
        onChange={(event) => setCurrentAnswer(event.target.value)}
        className="rounded-xl"
      />
    );
  };

  if (isCompleted) {
    return (
      <PageContainer className="py-3 sm:py-4 lg:py-6">
        <MainCard
          title="Interview Completed"
          className="max-w-4xl mx-auto"
          bodyClassName="gap-6"
        >
          <Alert
            variant="success"
            title="Submission Complete"
            description={
              completionReason === "time_over"
                ? `Your paper was auto-submitted because the overall interview time of ${OVERALL_EXAM_DURATION_MINUTES} minutes ended. Selected answers were saved as attempted, and unanswered questions were submitted as not attempted.`
                : "All sections are completed. This screen is running with dummy data and UI-only workflow."
            }
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <div className="rounded-xl border border-border bg-muted/20 px-4 py-4">
              <Typography variant="body5">Total Sections</Typography>
              <Typography variant="h3" className="text-foreground mt-1">
                {DUMMY_SECTIONS.length}
              </Typography>
            </div>
            <div className="rounded-xl border border-border bg-muted/20 px-4 py-4">
              <Typography variant="body5">Total Questions</Typography>
              <Typography variant="h3" className="text-foreground mt-1">
                {totalQuestions}
              </Typography>
            </div>
            <div className="rounded-xl border border-border bg-muted/20 px-4 py-4">
              <Typography variant="body5">Answered</Typography>
              <Typography variant="h3" className="text-foreground mt-1">
                {answeredCount}
              </Typography>
            </div>
            <div className="rounded-xl border border-border bg-muted/20 px-4 py-4">
              <Typography variant="body5">Not Attempted</Typography>
              <Typography variant="h3" className="text-foreground mt-1">
                {notAttemptedCount}
              </Typography>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/user/dashboard">
              <Button
                variant="outline"
                color="default"
                startIcon={<ArrowLeft size={16} />}
                className="w-full sm:w-auto"
              >
                Back to Dashboard
              </Button>
            </Link>
            <Button color="primary" onClick={handleReset} className="w-full sm:w-auto">
              Restart Demo
            </Button>
          </div>
        </MainCard>
      </PageContainer>
    );
  }

  if (!hasStarted) {
    return (
      <PageContainer className="py-2 sm:py-3 lg:py-4">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 md:p-8"
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(249,99,49,0.12),transparent_45%)]" />

          <div className="relative z-10 space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Badge color="primary" icon={<Sparkles size={14} />}>
                Interview Module
              </Badge>
              <Badge variant="outline" color="secondary">
                UI Demo Mode
              </Badge>
            </div>

            <div className="space-y-2">
              <Typography variant="h1" className="max-w-3xl">
                Start Your Interview Assessment
              </Typography>
              <Typography variant="body2" className="max-w-3xl">
                This flow follows your approved rules: overall paper timer, no direct
                jump, previous/next navigation, and mandatory section lock after
                section completion.
              </Typography>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {DUMMY_SECTIONS.map((section, index) => (
                <div
                  key={section.id}
                  className="rounded-xl border border-border bg-background/70 px-4 py-4"
                >
                  <Typography variant="body4" className="text-foreground">
                    Section {index + 1}
                  </Typography>
                  <Typography variant="h4" className="mt-1">
                    {section.title}
                  </Typography>
                  <Typography variant="body5" className="mt-1">
                    {section.questions.length} questions
                  </Typography>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-brand-primary/20 bg-gradient-to-br from-brand-primary/10 via-background to-brand-secondary/10 p-5 md:p-6">
              <div className="mb-4 flex items-center gap-2">
                <div className="rounded-lg bg-brand-primary/15 p-2 text-brand-primary">
                  <Sparkles size={16} />
                </div>
                <Typography variant="h4" className="text-foreground">
                  Interview Instructions
                </Typography>
              </div>

              <ul className="space-y-3">
                <li className="flex items-start gap-3 rounded-xl border border-border/70 bg-card/80 px-3 py-3">
                  <CheckCircle2
                    size={16}
                    className="mt-0.5 shrink-0 text-brand-primary"
                  />
                  <Typography variant="body3" className="text-foreground">
                    Use only <span className="font-semibold">Previous</span> and{" "}
                    <span className="font-semibold">Save & Next</span> for navigation.
                  </Typography>
                </li>
                <li className="flex items-start gap-3 rounded-xl border border-border/70 bg-card/80 px-3 py-3">
                  <CheckCircle2
                    size={16}
                    className="mt-0.5 shrink-0 text-brand-primary"
                  />
                  <Typography variant="body3" className="text-foreground">
                    Once a section is completed, it gets locked and cannot be reopened.
                  </Typography>
                </li>
                <li className="flex items-start gap-3 rounded-xl border border-border/70 bg-card/80 px-3 py-3">
                  <CheckCircle2
                    size={16}
                    className="mt-0.5 shrink-0 text-brand-primary"
                  />
                  <Typography variant="body3" className="text-foreground">
                    The complete paper has one overall timer of{" "}
                    <span className="font-semibold">
                      {OVERALL_EXAM_DURATION_MINUTES} minutes
                    </span>
                    .
                  </Typography>
                </li>
                <li className="flex items-start gap-3 rounded-xl border border-border/70 bg-card/80 px-3 py-3">
                  <CheckCircle2
                    size={16}
                    className="mt-0.5 shrink-0 text-brand-primary"
                  />
                  <Typography variant="body3" className="text-foreground">
                    When time ends, the paper is auto-submitted with selected answers
                    as attempted and empty answers as not attempted.
                  </Typography>
                </li>
              </ul>
            </div>

            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                color="primary"
                startIcon={<PlayCircle size={18} />}
                onClick={() => setHasStarted(true)}
                className="w-full sm:w-auto"
              >
                Start Interview
              </Button>
              <Link href="/user/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  color="default"
                  startIcon={<ArrowLeft size={16} />}
                  className="w-full sm:w-auto"
                >
                  Back
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-2 sm:py-3">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-5 min-w-0">
        <div className="xl:col-span-8 2xl:col-span-9 space-y-4 sm:space-y-5 min-w-0">
          <MainCard
            title={
              <div className="flex items-center gap-2">
                <span>Question Workspace</span>
              </div>
            }
            action={
              <Badge variant="outline" color="primary" className="whitespace-nowrap">
                <span className="sm:hidden">
                  Q {questionIndex + 1}/{currentSection.questions.length}
                </span>
                <span className="hidden sm:inline">
                  Question {questionIndex + 1}/{currentSection.questions.length}
                </span>
              </Badge>
            }
            bodyClassName="space-y-4"
          >
            {message && (
              <Alert
                variant="info"
                description={message}
                onClose={() => setMessage(null)}
              />
            )}

            <div className="space-y-3 rounded-xl border border-border bg-muted/20 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" color="secondary">
                  Section {sectionIndex + 1}/{DUMMY_SECTIONS.length}
                </Badge>
                <Badge variant="outline" color="primary">
                  {currentSection.title}
                </Badge>
                <Badge variant="outline" color="default">
                  Progress {progressPercent}%
                </Badge>
                <Badge
                  variant="outline"
                  color={
                    timerZone === "danger"
                      ? "error"
                      : timerZone === "warn"
                        ? "warning"
                        : "success"
                  }
                  icon={<Clock3 size={12} />}
                  className="font-mono"
                >
                  {formatTime(examRemainingSeconds)}
                </Badge>
              </div>

              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-brand-primary transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {timerZone === "danger" && (
              <Alert
                variant="error"
                title="Time Warning"
                description={`You have ${formatTime(
                  examRemainingSeconds,
                )} left in the interview. Please answer quickly, otherwise remaining unanswered questions will be auto-submitted as not attempted.`}
              />
            )}

            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
              <Typography variant="h3" className="text-foreground">
                {currentQuestion.type === "SUBJECTIVE"
                  ? "Subjective Question"
                  : "Multiple Choice Question"}
              </Typography>

              {currentQuestion.description && (
                <Typography variant="body3">{currentQuestion.description}</Typography>
              )}

              {currentQuestion.passage && (
                <div className="rounded-lg border border-border bg-muted/20 p-3 sm:p-4 max-h-56 sm:max-h-60 overflow-y-auto">
                  <Typography variant="body4" className="text-foreground">
                    Passage
                  </Typography>
                  <Typography variant="body3" className="mt-2 leading-relaxed">
                    {currentQuestion.passage}
                  </Typography>
                </div>
              )}

              {currentQuestion.imageUrl && (
                <div className="rounded-lg border border-border bg-muted/20 p-4">
                  <Typography variant="body5" className="mb-2">
                    Reference Image
                  </Typography>
                  <Image
                    src={currentQuestion.imageUrl}
                    alt="Question reference"
                    width={320}
                    height={180}
                    className="w-full max-w-[320px] h-auto rounded-lg border border-border object-contain bg-white"
                  />
                </div>
              )}

              <Typography variant="body2" className="text-foreground font-semibold">
                {currentQuestion.questionText}
              </Typography>

              {renderQuestionInput()}
            </div>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 pt-1">
              <Button
                variant="outline"
                color="default"
                onClick={handlePrevious}
                disabled={questionIndex === 0}
                startIcon={<ArrowLeft size={16} />}
                className="w-full sm:w-auto"
              >
                Previous
              </Button>

              <Button
                onClick={handleSaveAndNext}
                color="primary"
                endIcon={<ArrowRight size={16} />}
                className="w-full sm:w-auto"
              >
                {isLastQuestionInSection
                  ? isLastSection
                    ? "Finish Interview"
                    : "Save & Next Section"
                  : "Save & Next"}
              </Button>
            </div>
          </MainCard>
        </div>

        <div className="xl:col-span-4 2xl:col-span-3 min-w-0">
          <div className="xl:sticky xl:top-4 space-y-4">
            <MainCard
              title="Interview Status"
              bodyClassName="space-y-4"
              action={
                <Badge
                  variant="outline"
                  color={
                    timerZone === "danger"
                      ? "error"
                      : timerZone === "warn"
                        ? "warning"
                        : "success"
                  }
                  icon={<Clock3 size={14} />}
                  className="font-mono"
                >
                  {formatTime(examRemainingSeconds)}
                </Badge>
              }
            >
              <Alert
                variant="warning"
                description="Section lock is mandatory. Once section is completed, you cannot go back."
                showIcon={false}
              />

              <div className="space-y-2">
                {DUMMY_SECTIONS.map((section, index) => {
                  const isCurrent = index === sectionIndex;
                  const isLocked = lockedSections[index];
                  return (
                    <div
                      key={section.id}
                      className={`rounded-lg border px-3 py-3 ${
                        isCurrent
                          ? "border-brand-primary bg-brand-primary/10"
                          : isLocked
                            ? "border-emerald-500/40 bg-emerald-500/10"
                            : "border-border bg-muted/10"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <Typography
                          variant="body4"
                          className={`break-words ${
                            isCurrent ? "text-brand-primary" : "text-foreground"
                          }`}
                        >
                          {section.title}
                        </Typography>
                        {isCurrent && <Badge color="primary">Active</Badge>}
                        {isLocked && (
                          <Badge
                            variant="outline"
                            color="success"
                            icon={<CheckCircle2 size={12} />}
                          >
                            Locked
                          </Badge>
                        )}
                        {!isCurrent && !isLocked && (
                          <Badge
                            variant="outline"
                            color="default"
                            icon={<Lock size={12} />}
                          >
                            Pending
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="rounded-lg border border-border bg-muted/20 px-3 py-3">
                  <Typography variant="body5">Answered</Typography>
                  <Typography variant="h4" className="text-foreground mt-1">
                    {answeredCount}
                  </Typography>
                </div>
                <div className="rounded-lg border border-border bg-muted/20 px-3 py-3">
                  <Typography variant="body5">Not Attempted</Typography>
                  <Typography variant="h4" className="text-foreground mt-1">
                    {notAttemptedCount}
                  </Typography>
                </div>
              </div>
            </MainCard>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isSectionChangeConfirmOpen}
        onClose={() => setIsSectionChangeConfirmOpen(false)}
        title="Confirm Section Change"
        className="max-w-2xl"
      >
        <div className="space-y-4">
          <Alert
            variant="warning"
            description="You can't jump back to this section again."
          />
          <Typography variant="body2" className="text-foreground">
            Please review all questions and answers of this section before moving
            to the next section. If you are sure, click on{" "}
            <span className="font-semibold text-brand-primary">Change Section</span>.
          </Typography>
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 pt-1">
            <Button
              variant="outline"
              color="default"
              onClick={() => setIsSectionChangeConfirmOpen(false)}
              className="w-full sm:w-auto"
            >
              Review Section
            </Button>
            <Button
              color="warning"
              onClick={handleConfirmSectionChange}
              className="w-full sm:w-auto"
            >
              Change Section
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={timerModalState.isOpen}
        onClose={() =>
          setTimerModalState({
            isOpen: false,
            title: "",
            attemptedCount: 0,
            unattemptedCount: 0,
            totalCount: 0,
          })
        }
        className="max-w-xl"
      >
        <div className="space-y-4">
          <Alert
            variant={timerModalState.unattemptedCount > 0 ? "warning" : "info"}
            title={timerModalState.title}
            description="Overall interview duration ended and all responses were auto-submitted."
          />
          {timerModalState.unattemptedCount > 0 ? (
            <Typography variant="body3" className="text-foreground">
              Unattempted questions were submitted as{" "}
              <span className="font-semibold">not attempted</span>.
            </Typography>
          ) : (
            <Typography variant="body3" className="text-foreground">
              All questions were already answered and submitted as attempted.
            </Typography>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="rounded-lg border border-border bg-muted/20 px-3 py-3">
              <Typography variant="body5">Total</Typography>
              <Typography variant="h4" className="text-foreground mt-1">
                {timerModalState.totalCount}
              </Typography>
            </div>
            <div className="rounded-lg border border-border bg-muted/20 px-3 py-3">
              <Typography variant="body5">Attempted</Typography>
              <Typography variant="h4" className="text-foreground mt-1">
                {timerModalState.attemptedCount}
              </Typography>
            </div>
            <div className="rounded-lg border border-border bg-muted/20 px-3 py-3">
              <Typography variant="body5">Not Attempted</Typography>
              <Typography variant="h4" className="text-foreground mt-1">
                {timerModalState.unattemptedCount}
              </Typography>
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              color="primary"
              onClick={() =>
                setTimerModalState({
                  isOpen: false,
                  title: "",
                  attemptedCount: 0,
                  unattemptedCount: 0,
                  totalCount: 0,
                })
              }
            >
              OK
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
}
