import { type Classification } from "@types";

const normalize = (s: string) =>
  (s || "")
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/'/g, "")
    .replace(/\s+/g, " ")
    .trim();

const SPECIAL_CATEGORIES = [
  "company contact detail",
  "company contact details",
  "lead generation",
  "typing test",
];

const SPECIAL_QUESTION_TYPE_CODES = [
  "contact details", // normalized (no underscore)
  "lead generation",
  "typing test",
];

/**
 * Checks whether a given classification object or exact code/name is considered "exclusive".
 */
export const isExclusiveClassification = (
  classificationOrName: Classification | string,
): boolean => {
  if (!classificationOrName) return false;

  if (typeof classificationOrName === "string") {
    const n = normalize(classificationOrName);
    return (
      SPECIAL_CATEGORIES.some((c) => n.includes(c)) ||
      SPECIAL_QUESTION_TYPE_CODES.some((c) => n.includes(c))
    );
  }

  if (classificationOrName.metadata?.is_exclusive === true) {
    return true;
  }

  const nName = normalize(classificationOrName.name);
  const nCode = normalize(classificationOrName.code);
  return (
    SPECIAL_CATEGORIES.some((c) => nName.includes(c)) ||
    SPECIAL_QUESTION_TYPE_CODES.some((c) => nCode.includes(c)) ||
    SPECIAL_CATEGORIES.some((c) => nCode.includes(c))
  );
};

/**
 * Filters subjects based on the Question Type context.
 */
export const filterSubjectsForQuestionType = (
  subjects: Classification[],
  currentQuestionType?: Classification | string,
  questionTypesPool?: Classification[],
): Classification[] => {
  if (!currentQuestionType) return subjects;

  const activeQT =
    typeof currentQuestionType === "string"
      ? questionTypesPool?.find((t) => t.code === currentQuestionType) ||
        currentQuestionType
      : currentQuestionType;

  if (isExclusiveClassification(activeQT)) {
    const qtName =
      typeof activeQT === "string" ? activeQT : activeQT.name || activeQT.code;
    const nQT = normalize(qtName);

    return subjects.filter((subject) => {
      const nS = normalize(subject.name || subject.code);
      return (
        isExclusiveClassification(subject) &&
        (nS === nQT ||
          (nS.includes("company contact") && nQT.includes("contact")) ||
          (nS.includes("typing") && nQT.includes("typing")) ||
          (nS.includes("lead") && nQT.includes("lead")))
      );
    });
  }

  return subjects.filter((subject) => !isExclusiveClassification(subject));
};

/**
 * Filters Question Types based on the Subject context (Paper setup etc)
 */
export const filterQuestionTypesForSubject = (
  types: Classification[],
  currentSubject?: Classification | string,
  subjectsPool?: Classification[],
): Classification[] => {
  if (!currentSubject) return types;

  const activeS =
    typeof currentSubject === "string"
      ? subjectsPool?.find((s) => s.code === currentSubject) || currentSubject
      : currentSubject;

  if (isExclusiveClassification(activeS)) {
    const sName =
      typeof activeS === "string" ? activeS : activeS.name || activeS.code;
    const nS = normalize(sName);

    return types.filter((type) => {
      const nT = normalize(type.name || type.code);
      return (
        isExclusiveClassification(type) &&
        (nT === nS ||
          (nT.includes("contact") && nS.includes("company contact")) ||
          (nT.includes("typing") && nS.includes("typing")) ||
          (nT.includes("lead") && nS.includes("lead")))
      );
    });
  }

  return types.filter((type) => !isExclusiveClassification(type));
};
