"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PageContainer } from "@components/ui-layout/PageContainer";
import {
  DUMMY_SECTIONS,
  OVERALL_EXAM_DURATION_MINUTES,
  OVERALL_EXAM_TOTAL_SECONDS,
} from "./data";
import { formatTime } from "./utils";
import { InterviewOverview } from "./components/InterviewOverview";
import { InterviewCompleted } from "./components/InterviewCompleted";
import { QuestionWorkspace } from "./components/QuestionWorkspace";
import { InterviewStatusCard } from "./components/InterviewStatusCard";
import { SectionChangeModal } from "./components/SectionChangeModal";

export function InterviewTestClient() {
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
      DUMMY_SECTIONS.reduce(
        (total, section) => total + section.questions.length,
        0,
      ),
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

  const lockAndMoveToNextSection = useCallback(
    (currentIndex: number, notice?: string) => {
      setLockedSections((prev) => {
        const next = [...prev];
        next[currentIndex] = true;
        return next;
      });

      if (currentIndex === DUMMY_SECTIONS.length - 1) {
        setCompletionReason("manual");
        setIsCompleted(true);
        setMessage("Interview completed successfully.");
        return;
      }

      setSectionIndex(currentIndex + 1);
      setQuestionIndex(0);
      setMessage(notice ?? "Section locked. You cannot return to this section.");
    },
    [],
  );

  useEffect(() => {
    latestAnswersRef.current = answers;
  }, [answers]);

  const handleOverallTimeOver = useCallback(() => {
    if (hasHandledOverallTimeoutRef.current) return;
    hasHandledOverallTimeoutRef.current = true;

    setLockedSections(DUMMY_SECTIONS.map(() => true));
    setIsSectionChangeConfirmOpen(false);
    setCompletionReason("time_over");
    setIsCompleted(true);
    setMessage("Overall interview time is over. Answers were auto-submitted.");
  }, []);

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

    lockAndMoveToNextSection(sectionIndex);
  };

  const handleConfirmSectionChange = () => {
    setIsSectionChangeConfirmOpen(false);
    lockAndMoveToNextSection(
      sectionIndex,
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
    setLockedSections(DUMMY_SECTIONS.map(() => false));
    setExamRemainingSeconds(OVERALL_EXAM_TOTAL_SECONDS);
    hasHandledOverallTimeoutRef.current = false;
    latestAnswersRef.current = {};
  };

  if (isCompleted) {
    return (
      <PageContainer className="py-3 sm:py-4 lg:py-6">
        <InterviewCompleted
          totalSections={DUMMY_SECTIONS.length}
          totalQuestions={totalQuestions}
          answeredCount={answeredCount}
          notAttemptedCount={notAttemptedCount}
          completionReason={completionReason}
          overallExamDurationMinutes={OVERALL_EXAM_DURATION_MINUTES}
          onReset={handleReset}
        />
      </PageContainer>
    );
  }

  if (!hasStarted) {
    return (
      <PageContainer className="py-2 sm:py-3 lg:py-4">
        <InterviewOverview
          sections={DUMMY_SECTIONS}
          overallExamDurationMinutes={OVERALL_EXAM_DURATION_MINUTES}
          onStart={() => setHasStarted(true)}
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="py-2 sm:py-3">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-5 min-w-0">
        <div className="xl:col-span-8 2xl:col-span-9 space-y-4 sm:space-y-5 min-w-0">
          <QuestionWorkspace
            message={message}
            onCloseMessage={() => setMessage(null)}
            sectionIndex={sectionIndex}
            totalSections={DUMMY_SECTIONS.length}
            currentSection={currentSection}
            questionIndex={questionIndex}
            progressPercent={progressPercent}
            timerZone={timerZone}
            remainingTimeText={formatTime(examRemainingSeconds)}
            currentQuestion={currentQuestion}
            currentAnswer={currentAnswer}
            isLastQuestionInSection={isLastQuestionInSection}
            isLastSection={isLastSection}
            onAnswerChange={setCurrentAnswer}
            onPrevious={handlePrevious}
            onSaveAndNext={handleSaveAndNext}
          />
        </div>

        <div className="xl:col-span-4 2xl:col-span-3 min-w-0">
          <div className="xl:sticky xl:top-4 space-y-4">
            <InterviewStatusCard
              sections={DUMMY_SECTIONS}
              sectionIndex={sectionIndex}
              lockedSections={lockedSections}
              timerZone={timerZone}
              remainingTimeText={formatTime(examRemainingSeconds)}
              answeredCount={answeredCount}
              notAttemptedCount={notAttemptedCount}
            />
          </div>
        </div>
      </div>

      <SectionChangeModal
        isOpen={isSectionChangeConfirmOpen}
        onClose={() => setIsSectionChangeConfirmOpen(false)}
        onConfirm={handleConfirmSectionChange}
      />
    </PageContainer>
  );
}
