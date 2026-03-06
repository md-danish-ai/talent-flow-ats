"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PageContainer } from "@components/ui-layout/PageContainer";
import {
  DUMMY_SECTIONS,
  INTERVIEW_PAPER_ID,
  OVERALL_EXAM_DURATION_MINUTES,
  OVERALL_EXAM_TOTAL_SECONDS,
} from "./data";
import { formatTime } from "./utils";
import { InterviewOverview } from "./components/InterviewOverview";
import { InterviewCompleted } from "./components/InterviewCompleted";
import { QuestionWorkspace } from "./components/QuestionWorkspace";
import { InterviewStatusCard } from "./components/InterviewStatusCard";
import { SectionChangeModal } from "./components/SectionChangeModal";
import {
  interviewAttemptsApi,
  type AttemptSummaryResponse,
} from "@lib/api/interview-attempts";

export function InterviewTestClient() {
  const totalSections = DUMMY_SECTIONS.length;
  const emptyLockedSections = useMemo(
    () => DUMMY_SECTIONS.map(() => false),
    [],
  );
  const allLockedSections = useMemo(
    () => DUMMY_SECTIONS.map(() => true),
    [],
  );

  const [hasStarted, setHasStarted] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionReason, setCompletionReason] = useState<
    "manual" | "time_over" | null
  >(null);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [startError, setStartError] = useState<string | null>(null);
  const [isSectionChangeConfirmOpen, setIsSectionChangeConfirmOpen] =
    useState(false);
  const [lockedSections, setLockedSections] = useState<boolean[]>(emptyLockedSections);
  const [examRemainingSeconds, setExamRemainingSeconds] = useState(
    OVERALL_EXAM_TOTAL_SECONDS,
  );

  const hasHandledOverallTimeoutRef = useRef(false);
  const latestAnswersRef = useRef<Record<number, string>>({});
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [paperQuestionIds, setPaperQuestionIds] = useState<number[]>([]);
  const [finalSummary, setFinalSummary] = useState<AttemptSummaryResponse | null>(
    null,
  );

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
  const localQuestionIds = useMemo(
    () => allQuestions.map((question) => question.id),
    [allQuestions],
  );
  const questionIdMap = useMemo(() => {
    return localQuestionIds.reduce<Record<number, number>>((acc, localId, index) => {
      const backendQuestionId = paperQuestionIds[index];
      if (backendQuestionId) {
        acc[localId] = backendQuestionId;
      }
      return acc;
    }, {});
  }, [localQuestionIds, paperQuestionIds]);

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
    .reduce((sum, section) => sum + section.questions.length, 0);

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

  const persistAnswerToBackend = useCallback(
    async (
      questionId: number,
      answerText: string,
      isAutoSaved: boolean = false,
    ) => {
      if (!attemptId) return;
      const backendQuestionId = questionIdMap[questionId];
      if (!backendQuestionId) return;

      await interviewAttemptsApi.saveAnswer(attemptId, backendQuestionId, {
        answer_text: answerText,
        is_auto_saved: isAutoSaved,
      });
    },
    [attemptId, questionIdMap],
  );

  const lockAndMoveToNextSection = useCallback(
    (currentIndex: number, notice?: string) => {
      setLockedSections((prev) => {
        const next = [...prev];
        next[currentIndex] = true;
        return next;
      });

      if (currentIndex === totalSections - 1) {
        setCompletionReason("manual");
        setIsCompleted(true);
        setMessage("Interview completed successfully.");
        return;
      }

      setSectionIndex(currentIndex + 1);
      setQuestionIndex(0);
      setMessage(notice ?? "Section locked. You cannot return to this section.");
    },
    [totalSections],
  );

  useEffect(() => {
    latestAnswersRef.current = answers;
  }, [answers]);

  const handleOverallTimeOver = useCallback(() => {
    if (hasHandledOverallTimeoutRef.current) return;
    hasHandledOverallTimeoutRef.current = true;

    const submitOnTimeout = async () => {
      try {
        if (attemptId) {
          const snapshot = latestAnswersRef.current;
          const saveRequests = allQuestions.map((question) =>
            persistAnswerToBackend(
              question.id,
              snapshot[question.id] ?? "",
              true,
            ),
          );
          await Promise.all(saveRequests);

          const summary = await interviewAttemptsApi.autoSubmitAttempt(attemptId);
          setFinalSummary(summary);
        }
      } catch {
        setMessage("Time is over. Local submission completed, but server sync failed.");
      } finally {
        setLockedSections(allLockedSections);
        setIsSectionChangeConfirmOpen(false);
        setCompletionReason("time_over");
        setIsCompleted(true);
        setMessage((prev) => prev ?? "Overall interview time is over. Answers were auto-submitted.");
      }
    };

    void submitOnTimeout();
  }, [allLockedSections, allQuestions, attemptId, persistAnswerToBackend]);

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

    const isChoiceQuestion =
      currentQuestion.type === "MCQ" ||
      currentQuestion.type === "IMAGE_MCQ" ||
      currentQuestion.type === "PASSAGE_MCQ";

    if (isChoiceQuestion) {
      void persistAnswerToBackend(currentQuestion.id, value).catch(() => {
        setMessage("Answer selected locally, but failed to sync with server.");
      });
    }
  };

  const handlePrevious = () => {
    if (questionIndex === 0) return;
    setQuestionIndex((prev) => prev - 1);
    setMessage(null);
  };

  const handleSaveAndNext = async () => {
    setMessage(null);

    try {
      await persistAnswerToBackend(currentQuestion.id, currentAnswer);
    } catch {
      setMessage("Answer saved locally, but failed to sync with server.");
    }

    if (!isLastQuestionInSection) {
      setQuestionIndex((prev) => prev + 1);
      return;
    }

    if (!isLastSection) {
      setIsSectionChangeConfirmOpen(true);
      return;
    }

    try {
      if (attemptId) {
        const summary = await interviewAttemptsApi.submitAttempt(attemptId);
        setFinalSummary(summary);
      }
    } catch {
      setMessage("Interview finished locally, but final server submission failed.");
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
    setAttemptId(null);
    setPaperQuestionIds([]);
    setFinalSummary(null);
    setSectionIndex(0);
    setQuestionIndex(0);
    setAnswers({});
    setMessage(null);
    setStartError(null);
    setIsSectionChangeConfirmOpen(false);
    setLockedSections(emptyLockedSections);
    setExamRemainingSeconds(OVERALL_EXAM_TOTAL_SECONDS);
    hasHandledOverallTimeoutRef.current = false;
    latestAnswersRef.current = {};
  };

  const handleStartInterview = async () => {
    try {
      setStartError(null);
      const startResponse = await interviewAttemptsApi.startAttempt(
        INTERVIEW_PAPER_ID,
      );
      setAttemptId(startResponse.attempt_id);
      const incomingPaperQuestionIds = startResponse.paper_question_ids || [];
      setPaperQuestionIds(incomingPaperQuestionIds);
      if (incomingPaperQuestionIds.length !== allQuestions.length) {
        setMessage(
          "Paper question mapping differs from UI question count. Some answers may stay local only.",
        );
      }
      setHasStarted(true);
    } catch {
      setStartError(
        "Could not start interview on server. Please check paper setup and try again.",
      );
    }
  };

  if (isCompleted) {
    return (
      <PageContainer className="py-3 sm:py-4 lg:py-6">
        <InterviewCompleted
          totalSections={totalSections}
          totalQuestions={finalSummary?.total_questions ?? totalQuestions}
          answeredCount={finalSummary?.attempted_count ?? answeredCount}
          notAttemptedCount={
            finalSummary?.unattempted_count ?? notAttemptedCount
          }
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
          startError={startError}
          onStart={() => {
            void handleStartInterview();
          }}
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
            totalSections={totalSections}
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
