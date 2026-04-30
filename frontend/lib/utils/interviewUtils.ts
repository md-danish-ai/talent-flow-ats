import { InterviewSection } from "app/user/interview-test/types";

/**
 * Builds a mapping of question IDs to their saved answer text.
 */
export const buildSavedAnswersMap = (
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

/**
 * Determines the next available question position when resuming an interview.
 */
export const getResumePosition = (
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

/**
 * Identifies which sections need to be unlocked/reset based on touched questions.
 */
export const getResetSectionIndexes = (
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
