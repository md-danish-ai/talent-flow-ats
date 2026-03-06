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
import { questionsApi, type Question } from "@lib/api/questions";
import {
  interviewAttemptsApi,
  type AttemptSummaryResponse,
} from "@lib/api/interview-attempts";
import type { InterviewQuestion, InterviewSection } from "./types";

export function InterviewTestClient() {
  const [sections, setSections] = useState<InterviewSection[]>(DUMMY_SECTIONS);
  const totalSections = sections.length;
  const emptyLockedSections = useMemo(() => sections.map(() => false), [sections]);
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
  const [lockedSections, setLockedSections] = useState<boolean[]>(emptyLockedSections);
  const [examRemainingSeconds, setExamRemainingSeconds] = useState(
    OVERALL_EXAM_TOTAL_SECONDS,
  );

  const hasHandledOverallTimeoutRef = useRef(false);
  const latestAnswersRef = useRef<Record<number, string>>({});
  const [attemptId, setAttemptId] = useState<number | null>(null);
  const [finalSummary, setFinalSummary] = useState<AttemptSummaryResponse | null>(
    null,
  );

  const currentSection = sections[sectionIndex];
  const currentQuestion = currentSection.questions[questionIndex];
  const currentAnswer = answers[currentQuestion.id] || "";

  const totalQuestions = useMemo(
    () => sections.reduce((total, section) => total + section.questions.length, 0),
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

  const completedBeforeCurrentSection = sections.slice(0, sectionIndex)
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

      await interviewAttemptsApi.saveAnswer(attemptId, questionId, {
        answer_text: answerText,
        is_auto_saved: isAutoSaved,
      });
    },
    [attemptId],
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
    setSections(DUMMY_SECTIONS);
    setHasStarted(false);
    setIsCompleted(false);
    setCompletionReason(null);
    setAttemptId(null);
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

  const resolveQuestionType = (question: Question): InterviewQuestion["type"] => {
    const typeCode = question.question_type?.code || "";
    if (typeCode === "IMAGE_MULTIPLE_CHOICE") return "IMAGE_MCQ";
    if (typeCode === "SUBJECTIVE") return "SUBJECTIVE";
    if (typeCode === "PASSAGE_MULTIPLE_CHOICE" || typeCode === "PASSAGE_MCQ") {
      return "PASSAGE_MCQ";
    }
    if (typeCode === "MULTIPLE_CHOICE") return "MCQ";

    if (question.passage) return "PASSAGE_MCQ";
    if (question.image_url) return "IMAGE_MCQ";
    if (question.options?.length) return "MCQ";
    return "SUBJECTIVE";
  };

  const resolveQuestionOptions = (question: Question): string[] => {
    if (!Array.isArray(question.options)) return [];
    return question.options
      .map((option) => {
        const optionText = option.option_text;
        if (typeof optionText === "string" && optionText.trim()) return optionText;
        const optionLabel = option.option_label;
        if (typeof optionLabel === "string" && optionLabel.trim()) return optionLabel;
        return null;
      })
      .filter((value): value is string => Boolean(value));
  };

  const buildSectionsFromBackend = (
    orderedQuestions: Question[],
  ): InterviewSection[] => {
    const sectionMap = new Map<string, InterviewSection>();

    orderedQuestions.forEach((question) => {
      const subjectCode = question.subject?.code || "GENERAL";
      const sectionTitle = question.subject?.name || "General";

      if (!sectionMap.has(subjectCode)) {
        sectionMap.set(subjectCode, {
          id: subjectCode.toLowerCase(),
          title: sectionTitle,
          durationMinutes: 0,
          questions: [],
        });
      }

      const mappedQuestion: InterviewQuestion = {
        id: question.id,
        type: resolveQuestionType(question),
        questionText: question.question_text,
        description: undefined,
        passage: question.passage || undefined,
        imageUrl: question.image_url || undefined,
        options: resolveQuestionOptions(question),
      };

      sectionMap.get(subjectCode)!.questions.push(mappedQuestion);
    });

    return Array.from(sectionMap.values()).filter(
      (section) => section.questions.length > 0,
    );
  };

  const handleStartInterview = async () => {
    try {
      setStartError(null);
      const startResponse = await interviewAttemptsApi.startAttempt(
        INTERVIEW_PAPER_ID,
      );
      const paperQuestionIds = startResponse.paper_question_ids || [];
      const fetchedQuestions = await Promise.all(
        paperQuestionIds.map((questionId) =>
          questionsApi.getQuestion(questionId).catch(() => null),
        ),
      );
      const orderedQuestions = fetchedQuestions.filter(
        (question): question is Question => question !== null,
      );

      if (orderedQuestions.length === 0) {
        setStartError(
          "No questions available for this paper. Please contact admin.",
        );
        return;
      }

      const backendSections = buildSectionsFromBackend(orderedQuestions);

      setAttemptId(startResponse.attempt_id);
      setSections(backendSections);
      setLockedSections(backendSections.map(() => false));
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
