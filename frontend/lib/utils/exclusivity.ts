import { type Classification } from "@types";

export const normalize = (s: string) =>
  (s || "")
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/'/g, "")
    .replace(/\s+/g, " ")
    .trim();

/**
 * Mapping between Question Type codes and their corresponding Exclusive Subject codes.
 */
const EXCLUSIVE_MAPPING: Record<string, string> = {
  CONTACT_DETAILS: "COMPANY_CONTACT_DETAILS",
  LEAD_GENERATION: "LEAD_GENERATION",
  TYPING_TEST: "TYPING_TEST",
};

/**
 * Reverse mapping to find Question Type for a given Subject.
 */
const REVERSE_EXCLUSIVE_MAPPING: Record<string, string> = Object.entries(
  EXCLUSIVE_MAPPING,
).reduce((acc, [qt, s]) => ({ ...acc, [s]: qt }), {});

/**
 * Checks whether a given classification object or exact code/name is considered "exclusive".
 */
export const isExclusiveClassification = (
  classificationOrName: Classification | string,
): boolean => {
  if (!classificationOrName) return false;

  // Handle Object (Best way: check metadata from DB)
  if (typeof classificationOrName === "object") {
    if (classificationOrName.metadata?.is_exclusive === true) return true;

    // Check if it's one of the exclusive Question Types
    const code = (classificationOrName.code || "").toUpperCase();
    return !!EXCLUSIVE_MAPPING[code] || !!REVERSE_EXCLUSIVE_MAPPING[code];
  }

  // Handle String (Code check)
  const code = classificationOrName.toUpperCase().replace(/\s+/g, "_");
  return !!EXCLUSIVE_MAPPING[code] || !!REVERSE_EXCLUSIVE_MAPPING[code];
};

/**
 * Filters subjects based on the Question Type context.
 */
export const filterSubjectsForQuestionType = (
  subjects: Classification[],
  currentQuestionType?: Classification | string,
): Classification[] => {
  if (!currentQuestionType) return subjects;

  const activeQTCode = (
    typeof currentQuestionType === "string"
      ? currentQuestionType
      : currentQuestionType.code || ""
  ).toUpperCase();

  const targetSubjectCode = EXCLUSIVE_MAPPING[activeQTCode];

  // If the Question Type is exclusive, only show its mapped Subject
  if (targetSubjectCode) {
    return subjects.filter((s) => s.code === targetSubjectCode);
  }

  // Otherwise, hide all exclusive subjects
  const exclusiveSubjectCodes = Object.values(EXCLUSIVE_MAPPING);
  return subjects.filter((s) => !exclusiveSubjectCodes.includes(s.code));
};

/**
 * Filters Question Types based on the Subject context (Paper setup etc)
 */
export const filterQuestionTypesForSubject = (
  types: Classification[],
  currentSubject?: Classification | string,
): Classification[] => {
  if (!currentSubject) return types;

  const activeSCode = (
    typeof currentSubject === "string"
      ? currentSubject
      : currentSubject.code || ""
  ).toUpperCase();

  const targetQTCode = REVERSE_EXCLUSIVE_MAPPING[activeSCode];

  // If the Subject is exclusive, only show its mapped Question Type
  if (targetQTCode) {
    return types.filter((t) => t.code === targetQTCode);
  }

  // Otherwise, hide all exclusive question types
  const exclusiveQTCodes = Object.keys(EXCLUSIVE_MAPPING);
  return types.filter((t) => !exclusiveQTCodes.includes(t.code));
};
