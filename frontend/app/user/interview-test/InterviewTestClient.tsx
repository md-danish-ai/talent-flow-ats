"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { DUMMY_SECTIONS, OVERALL_EXAM_DURATION_MINUTES } from "./data";
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



const buildSavedAnswersMap = (
  savedResponses: {
    question_id: number;
    answer_text?: string | null;
    is_attempted: boolean;
  }[],
) =>
  savedResponses.reduce<Record<number, string>>((accumulator, response) => {
    if (response.is_attempted && response.answer_text?.trim()) {
      accumulator[response.question_id] = response.answer_text;
    }
    return accumulator;
  }, {});

const getResumePosition = (
  sections: InterviewSection[],
  touchedQuestionIds: Set<number>,
) => {
  for (
    let sectionIndex = 0;
    sectionIndex < sections.length;
    sectionIndex += 1
  ) {
    const questionIndex = sections[sectionIndex]?.questions.findIndex(
      (question) => !touchedQuestionIds.has(question.id),
    );
    if (questionIndex !== undefined && questionIndex >= 0) {
      return { sectionIndex, questionIndex };
    }
  }

  if (sections.length === 0) {
    return { sectionIndex: 0, questionIndex: 0 };
  }

  const lastSectionIndex = sections.length - 1;
  const lastQuestionIndex = Math.max(
    (sections[lastSectionIndex]?.questions.length ?? 1) - 1,
    0,
  );

  return {
    sectionIndex: lastSectionIndex,
    questionIndex: lastQuestionIndex,
  };
};

const getResetSectionIndexes = (
  sections: InterviewSection[],
  touchedQuestionIds: Set<number>,
) =>
  new Set(
    sections.reduce<number[]>((indexes, section, sectionIdx) => {
      const hasResetQuestion = section.questions.some(
        (question) => !touchedQuestionIds.has(question.id),
      );
      if (hasResetQuestion) indexes.push(sectionIdx);
      return indexes;
    }, []),
  );

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
  const [, setExamRemainingSeconds] = useState(
    OVERALL_EXAM_DURATION_MINUTES * 60,
  );
  const [sectionRemainingSeconds, setSectionRemainingSeconds] = useState(0);
  const [currentSectionTotalSeconds, setCurrentSectionTotalSeconds] =
    useState(0);

  const hasHandledOverallTimeoutRef = useRef(false);
  const hasHandledSectionTimeoutRef = useRef(false);
  const latestAnswersRef = useRef<Record<number, string>>({});
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [finalSummary, setFinalSummary] =
    useState<AttemptSummaryResponse | null>(null);

  const currentSection = sections[sectionIndex] ?? sections[0];
  const currentQuestion =
    currentSection?.questions[questionIndex] ?? currentSection?.questions[0];
  const currentAnswer = currentQuestion
    ? answers[currentQuestion.id] || ""
    : "";

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
    totalQuestions > 0
      ? Math.round((completedSteps / totalQuestions) * 100)
      : 0,
  );

  const sectionSpentRatio =
    currentSectionTotalSeconds > 0
      ? (currentSectionTotalSeconds - sectionRemainingSeconds) /
        currentSectionTotalSeconds
      : 0;

  const timerZone: "safe" | "warn" | "danger" =
    sectionSpentRatio >= 0.75
      ? "danger"
      : sectionSpentRatio >= 0.5
        ? "warn"
        : "safe";

  const isLastQuestionInSection =
    questionIndex === currentSection.questions.length - 1;
  const isLastSection = useMemo(() => {
    // A section is effectively the last one if no future sections are available (unlocked)
    for (let i = sectionIndex + 1; i < sections.length; i++) {
      if (!lockedSections[i]) return false;
    }
    return true;
  }, [sectionIndex, sections, lockedSections]);

  const persistSubjectAnswers = useCallback(
    async (sectionToSave: InterviewSection, isAutoSaved: boolean = false) => {
      if (!attemptId) return;

      const answersToBatch = sectionToSave.questions.map((q) => ({
        question_id: q.id,
        answer_text: latestAnswersRef.current[q.id] || "",
        is_auto_saved: isAutoSaved,
      }));

      if (answersToBatch.length === 0) return;

      try {
        await interviewAttemptsApi.saveAnswersBatch(attemptId, {
          answers: answersToBatch,
        });
      } catch (error) {
        console.error("Failed to batch save answers:", error);
        throw error;
      }
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

  const finalizeInterview = useCallback(async () => {
    if (!attemptId) return;
    try {
      const summary = await interviewAttemptsApi.submitAttempt(attemptId);
      setFinalSummary(summary);
    } catch {
      setMessage(
        "Interview finished locally, but final server submission failed.",
      );
    }
  }, [attemptId]);

  const lockAndMoveToNextSection = useCallback(
    async (currentIndex: number, notice?: string) => {
      setLockedSections((prev) => {
        const next = [...prev];
        next[currentIndex] = true;
        return next;
      });

      // Find the next section that is NOT locked
      let nextUnlockedIndex = -1;
      for (let i = currentIndex + 1; i < totalSections; i++) {
        if (!lockedSections[i]) {
          nextUnlockedIndex = i;
          break;
        }
      }

      // Send batch answers for this subject before locking/submitting
      if (attemptId && currentSection) {
        try {
          await persistSubjectAnswers(
            currentSection,
            notice?.includes("time") ?? false,
          );

          // Only skip if there's actually a next move (not finishing)
          if (nextUnlockedIndex !== -1) {
            await interviewAttemptsApi.skipSection(
              attemptId,
              currentSection.title,
            );
          }
        } catch {
          console.error("Failed to sync subject answers or skip section");
        }
      }

      if (nextUnlockedIndex === -1) {
        setCompletionReason("manual");
        setIsCompleted(true);
        setMessage(
          notice ??
            "Interview completed. All remaining sections were already finished.",
        );
        await finalizeInterview();
        return;
      }

      setSectionIndex(nextUnlockedIndex);
      setQuestionIndex(0);
      setMessage(
        notice ?? "Section locked. Moving to the next available section.",
      );
    },
    [
      attemptId,
      currentSection,
      lockedSections,
      totalSections,
      finalizeInterview,
      persistSubjectAnswers,
    ],
  );

  useEffect(() => {
    if (currentSection) {
      const seconds = currentSection.durationMinutes * 60;
      setSectionRemainingSeconds(seconds);
      setCurrentSectionTotalSeconds(seconds);
      hasHandledSectionTimeoutRef.current = false;
    }
  }, [sectionIndex, currentSection]);

  useEffect(() => {
    latestAnswersRef.current = answers;
  }, [answers]);

  const handleOverallTimeOver = useCallback(() => {
    if (hasHandledOverallTimeoutRef.current) return;
    hasHandledOverallTimeoutRef.current = true;

    const submitOnTimeout = async () => {
      try {
        if (attemptId) {
          // Batch save everything
          const allBatchRequests = sections.map((sec) =>
            persistSubjectAnswers(sec, true),
          );
          await Promise.allSettled(allBatchRequests);

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
  }, [allLockedSections, sections, attemptId, persistSubjectAnswers]);

  const handleSectionTimeOver = useCallback(() => {
    if (hasHandledSectionTimeoutRef.current) return;
    hasHandledSectionTimeoutRef.current = true;

    const advanceSection = async () => {
      lockAndMoveToNextSection(
        sectionIndex,
        `Time is up for ${currentSection.title}. Section auto-locked.`,
      );
    };

    void advanceSection();
  }, [
    lockAndMoveToNextSection,
    sectionIndex,
    currentSection,
  ]);

  useEffect(() => {
    if (!hasStarted || isCompleted) return;

    // 1. Prevent refresh/close
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue =
        "Are you sure you want to leave? Your interview progress may be lost.";
      return e.returnValue;
    };

    // 2. Prevent back button
    window.history.pushState(null, "", window.location.href);
    const handlePopState = () => {
      window.history.pushState(null, "", window.location.href);
      setMessage(
        "Navigation is disabled during the assessment. Please stay on this page to complete your mission.",
      );
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handlePopState);

    const timer = setInterval(() => {
      // 1. Overall Exam Timer
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

      // 2. Section Timer
      setSectionRemainingSeconds((prev) => {
        if (prev <= 1) {
          setTimeout(() => {
            handleSectionTimeOver();
          }, 0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [handleOverallTimeOver, handleSectionTimeOver, hasStarted, isCompleted]);

  const setCurrentAnswer = useCallback(
    (value: string) => {
      if (!currentQuestion) return;
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
      // Individual auto-save removed for subject-wise optimization
    },
    [currentQuestion],
  );

  const handlePrevious = useCallback(() => {
    if (questionIndex === 0) return;
    setQuestionIndex((prev) => prev - 1);
    setMessage(null);
  }, [questionIndex]);

  const handleSaveAndNext = useCallback(async () => {
    if (!currentQuestion) return;
    setMessage(null);

    // Question-level remote persist removed for subject-wise optimization
    // Answers are kept in local state until subject completion

    if (!isLastQuestionInSection) {
      setQuestionIndex((prev) => prev + 1);
      return;
    }

    // Check if there are any MORE unlocked sections ahead
    let hasNextUnlocked = false;
    for (let i = sectionIndex + 1; i < sections.length; i++) {
      if (!lockedSections[i]) {
        hasNextUnlocked = true;
        break;
      }
    }

    if (hasNextUnlocked) {
      setIsSectionChangeConfirmOpen(true);
      return;
    }

    // No unlocked sections left, perform final submission via locking mechanism
    lockAndMoveToNextSection(sectionIndex);
  }, [
    currentQuestion,
    isLastQuestionInSection,
    sections,
    lockedSections,
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
      const restoredAnswers = buildSavedAnswersMap(
        startResponse.saved_responses,
      );
      // touchedQuestionIds: ALL questions with any saved record (drives resume position)
      const touchedQuestionIds = new Set(
        startResponse.saved_responses.map((r) => r.question_id),
      );
      const resetSectionIndexes = startResponse.is_resumed
        ? getResetSectionIndexes(loadedSections, touchedQuestionIds)
        : new Set<number>();

      if (startResponse.is_resumed && resetSectionIndexes.size === 0) {
        setStartError(
          "No unlocked questions were found for this resume session. Please ask admin to reset the subject again.",
        );
        return;
      }

      const resumePosition = getResumePosition(
        loadedSections,
        touchedQuestionIds,
      );
      const initialLockedSections = loadedSections.map((_, sectionIdx) =>
        startResponse.is_resumed ? !resetSectionIndexes.has(sectionIdx) : false,
      );

      setAttemptId(startResponse.attempt_id);
      setSections(loadedSections);
      setLockedSections(initialLockedSections);
      setSectionIndex(
        startResponse.is_resumed ? resumePosition.sectionIndex : 0,
      );
      setQuestionIndex(
        startResponse.is_resumed ? resumePosition.questionIndex : 0,
      );
      setAnswers(restoredAnswers);
      setMessage(
        startResponse.is_resumed
          ? "Resumed your in-progress interview with saved responses."
          : null,
      );

      // Handle server-synced timer resumption
      if (startResponse.is_resumed && startResponse.started_at) {
        const startedAt = new Date(startResponse.started_at);
        const now = new Date();
        const secondsElapsed = Math.floor(
          (now.getTime() - startedAt.getTime()) / 1000,
        );
        const totalDurationSeconds =
          (startResponse.total_duration_minutes ?? overallExamDurationMinutes) *
          60;
        const remainingSeconds = Math.max(
          0,
          totalDurationSeconds - secondsElapsed,
        );

        setExamRemainingSeconds(remainingSeconds);

        if (remainingSeconds <= 0) {
          void handleOverallTimeOver();
        }
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
            remainingTimeText={formatTime(sectionRemainingSeconds)}
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
              remainingTimeText={formatTime(sectionRemainingSeconds)}
            />
            <InterviewStatusCard
              sections={sections}
              sectionIndex={sectionIndex}
              lockedSections={lockedSections}
              timerZone={timerZone}
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
