"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PageContainer } from "@components/ui-layout/PageContainer";
import {
  DUMMY_SECTIONS,
  OVERALL_EXAM_DURATION_MINUTES,
} from "./data";
import { formatTime } from "./utils";
import { InterviewOverview } from "./components/InterviewOverview";
import { InterviewCompleted } from "./components/InterviewCompleted";
import { InterviewProgressCard } from "./components/InterviewProgressCard";
import { QuestionWorkspace } from "./components/QuestionWorkspace";
import { InterviewStatusCard } from "./components/InterviewStatusCard";
import { SectionChangeModal } from "./components/SectionChangeModal";
import {
  interviewAttemptsApi,
  type AttemptSummaryResponse,
} from "@lib/api/interview-attempts";
import {
  paperAssignmentsApi,
  type AssignedInterviewPaperResponse,
} from "@lib/api/paper-assignments";
import type { InterviewQuestion, InterviewSection } from "./types";

export function InterviewTestClient() {
  const [sections, setSections] = useState<InterviewSection[]>(DUMMY_SECTIONS);
  const [loadedSections, setLoadedSections] =
    useState<InterviewSection[]>(DUMMY_SECTIONS);
  const [assignedPaper, setAssignedPaper] =
    useState<AssignedInterviewPaperResponse | null>(null);
  const [isLoadingPaper, setIsLoadingPaper] = useState(true);
  const [overallExamDurationMinutes, setOverallExamDurationMinutes] = useState(
    OVERALL_EXAM_DURATION_MINUTES,
  );
  const totalSections = sections.length;
  const emptyLockedSections = useMemo(
    () => sections.map(() => false),
    [sections],
  );
  const allLockedSections = useMemo(() => sections.map(() => true), [sections]);
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
  const [lockedSections, setLockedSections] =
    useState<boolean[]>(emptyLockedSections);
  const [examRemainingSeconds, setExamRemainingSeconds] = useState(
    OVERALL_EXAM_DURATION_MINUTES * 60,
  );

  const hasHandledOverallTimeoutRef = useRef(false);
  const latestAnswersRef = useRef<Record<number, string>>({});
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [finalSummary, setFinalSummary] =
    useState<AttemptSummaryResponse | null>(null);

  const overallExamTotalSeconds = overallExamDurationMinutes * 60;

  const currentSection = sections[sectionIndex] ?? sections[0];
  const currentQuestion =
    currentSection?.questions[questionIndex] ?? currentSection?.questions[0];
  const currentAnswer = currentQuestion ? answers[currentQuestion.id] || "" : "";

  const totalQuestions = useMemo(
    () =>
      sections.reduce((total, section) => total + section.questions.length, 0),
    [sections],
  );

  const allQuestions = useMemo(
    () => sections.flatMap((section) => section.questions),
    [sections],
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

  const completedBeforeCurrentSection = sections
    .slice(0, sectionIndex)
    .reduce((sum, section) => sum + section.questions.length, 0);

  const completedSteps = completedBeforeCurrentSection + questionIndex + 1;
  const progressPercent = Math.min(
    100,
    totalQuestions > 0 ? Math.round((completedSteps / totalQuestions) * 100) : 0,
  );

  const overallExamSpentRatio =
    overallExamTotalSeconds > 0
      ? (overallExamTotalSeconds - examRemainingSeconds) /
        overallExamTotalSeconds
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

      await interviewAttemptsApi.saveAnswer(attemptId, questionId, {
        answer_text: answerText,
        is_auto_saved: isAutoSaved,
      });
    },
    [attemptId],
  );

  useEffect(() => {
    const loadAssignedPaper = async () => {
      try {
        setIsLoadingPaper(true);
        const response = await paperAssignmentsApi.getMyInterviewPaper();
        const mappedSections: InterviewSection[] = response.sections.map(
          (section) => ({
            id: section.id,
            title: section.title,
            durationMinutes: section.duration_minutes,
            questions: section.questions.map((question) => ({
              id: question.id,
              type: question.type as InterviewQuestion["type"],
              questionText: question.question_text,
              subjectName: question.subject_name ?? undefined,
              typeName: question.type_name ?? undefined,
              description: undefined,
              passage: question.passage || undefined,
              imageUrl: question.image_url || undefined,
              options: question.options,
            })),
          }),
        );
        const resolvedDuration =
          response.overall_duration_minutes > 0
            ? response.overall_duration_minutes
            : OVERALL_EXAM_DURATION_MINUTES;

        setAssignedPaper(response);
        setLoadedSections(mappedSections);
        setSections(mappedSections);
        setLockedSections(mappedSections.map(() => false));
        setOverallExamDurationMinutes(resolvedDuration);
        setExamRemainingSeconds(resolvedDuration * 60);
        setStartError(null);
      } catch {
        setAssignedPaper(null);
        setLoadedSections(DUMMY_SECTIONS);
        setSections(DUMMY_SECTIONS);
        setLockedSections(DUMMY_SECTIONS.map(() => false));
        setOverallExamDurationMinutes(OVERALL_EXAM_DURATION_MINUTES);
        setExamRemainingSeconds(OVERALL_EXAM_DURATION_MINUTES * 60);
        setStartError("No paper is assigned for today. Please contact admin.");
      } finally {
        setIsLoadingPaper(false);
      }
    };

    void loadAssignedPaper();
  }, []);

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
      setMessage(
        notice ?? "Section locked. You cannot return to this section.",
      );
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

          const summary =
            await interviewAttemptsApi.autoSubmitAttempt(attemptId);
          setFinalSummary(summary);
        }
      } catch {
        setMessage(
          "Time is over. Local submission completed, but server sync failed.",
        );
      } finally {
        setLockedSections(allLockedSections);
        setIsSectionChangeConfirmOpen(false);
        setCompletionReason("time_over");
        setIsCompleted(true);
        setMessage(
          (prev) =>
            prev ??
            "Overall interview time is over. Answers were auto-submitted.",
        );
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

  const setCurrentAnswer = useCallback(
    (value: string) => {
      if (!currentQuestion) return;
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));

      const isAutoSaveType =
        currentQuestion.type === "MULTIPLE_CHOICE" ||
        currentQuestion.type === "IMAGE_MULTIPLE_CHOICE" ||
        currentQuestion.type === "CONTACT_DETAILS" ||
        currentQuestion.type === "LEAD_GENERATION" ||
        currentQuestion.type === "TYPING_TEST";

      if (isAutoSaveType) {
        void persistAnswerToBackend(currentQuestion.id, value).catch(() => {
          setMessage("Answer selected locally, but failed to sync with server.");
        });
      }
    },
    [currentQuestion, persistAnswerToBackend],
  );

  const handlePrevious = useCallback(() => {
    if (questionIndex === 0) return;
    setQuestionIndex((prev) => prev - 1);
    setMessage(null);
  }, [questionIndex]);

  const handleSaveAndNext = useCallback(async () => {
    if (!currentQuestion) return;
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
      setMessage(
        "Interview finished locally, but final server submission failed.",
      );
    }

    lockAndMoveToNextSection(sectionIndex);
  }, [
    currentAnswer,
    currentQuestion,
    persistAnswerToBackend,
    isLastQuestionInSection,
    isLastSection,
    attemptId,
    lockAndMoveToNextSection,
    sectionIndex,
  ]);

  const handleConfirmSectionChange = () => {
    setIsSectionChangeConfirmOpen(false);
    lockAndMoveToNextSection(
      sectionIndex,
      "Section changed successfully. You cannot return to previous section.",
    );
  };

  const handleStartInterview = async () => {
    try {
      if (!assignedPaper?.paper?.id) {
        setStartError("No paper is assigned for today. Please contact admin.");
        return;
      }

      setStartError(null);
      const startResponse = await interviewAttemptsApi.startAttempt(
        assignedPaper.paper.id,
      );

      setAttemptId(startResponse.attempt_id);
      setSections(loadedSections);
      setLockedSections(loadedSections.map(() => false));
      setSectionIndex(0);
      setQuestionIndex(0);
      setAnswers({});
      setMessage(null);
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
          overallExamDurationMinutes={overallExamDurationMinutes}
        />
      </PageContainer>
    );
  }

  if (isLoadingPaper && !hasStarted) {
    return (
      <PageContainer className="py-2 sm:py-3 lg:py-4">
        Loading assigned paper...
      </PageContainer>
    );
  }

  if (!hasStarted) {
    return (
      <PageContainer className="py-2 sm:py-3 lg:py-4">
        <InterviewOverview
          sections={sections}
          overallExamDurationMinutes={overallExamDurationMinutes}
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
            currentSection={currentSection}
            questionIndex={questionIndex}
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
            <InterviewProgressCard
              sectionIndex={sectionIndex}
              totalSections={totalSections}
              currentSection={currentSection}
              progressPercent={progressPercent}
              timerZone={timerZone}
              remainingTimeText={formatTime(examRemainingSeconds)}
            />
            <InterviewStatusCard
              sections={sections}
              sectionIndex={sectionIndex}
              lockedSections={lockedSections}
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
