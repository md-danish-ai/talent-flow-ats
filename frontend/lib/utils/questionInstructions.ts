/**
 * Maps Question Subject Name and Question Type to exact Candidate Test Instructions.
 */
export function getQuestionInstruction(
  subjectName?: string,
  type?: string,
): string | null {
  if (!type) return null;

  const s = (subjectName || "").trim().toLowerCase();
  const t = type.trim().toUpperCase();

  // 1. Comprehension + MCQ (or PASSAGE_CONTENT)
  if (
    s.includes("comprehension") &&
    (t === "MULTIPLE_CHOICE" || t === "PASSAGE_CONTENT")
  ) {
    return "Please select the most appropriate answer from the options provided.";
  }

  // 2. Grammar + MCQ
  if (
    (s.includes("grammar") || s.includes("english grammar")) &&
    t === "MULTIPLE_CHOICE"
  ) {
    return "Please select the most appropriate answer from the options provided.";
  }

  // 3. Grammar + Subjective
  if (
    (s.includes("grammar") || s.includes("english grammar")) &&
    t === "SUBJECTIVE"
  ) {
    return "Please arrange the following words to form a grammatically correct sentence.";
  }

  // 4. Written + Subjective
  if (s.includes("written") && t === "SUBJECTIVE") {
    return "Please construct a sentence using the word provided below.";
  }

  // 5. Aptitude + MCQ
  if (s.includes("aptitude") && t === "MULTIPLE_CHOICE") {
    return "Please select the most appropriate answer from the options provided.";
  }

  // 6. Industry Awareness + MCQ
  if (
    (s.includes("industry") || s.includes("awareness")) &&
    t === "MULTIPLE_CHOICE"
  ) {
    return "Please select the most appropriate answer from the options provided.";
  }

  // 7. Company Contact Details Test + Contact Details
  if (
    (s.includes("contact") || t === "CONTACT_DETAILS") &&
    t === "CONTACT_DETAILS"
  ) {
    return "Using the website URL provided, research the required information online and fill in the corresponding fields below.";
  }

  // 8. Lead Generation Test + Lead Generation
  if (
    (s.includes("lead") || t === "LEAD_GENERATION") &&
    t === "LEAD_GENERATION"
  ) {
    return "Use the provided company name to search for the required information online and complete the corresponding fields. Ensure that the contact person identified is either the Founder, Co-Founder, CEO, or President of the company.";
  }

  // 9. Typing Test + Typing
  if ((s.includes("typing") || t === "TYPING_TEST") && t === "TYPING_TEST") {
    return "Please type the text provided below into the editor.";
  }

  // Fallback for standard types
  if (
    t === "MULTIPLE_CHOICE" ||
    t === "PASSAGE_CONTENT" ||
    t === "IMAGE_MULTIPLE_CHOICE"
  ) {
    return "Please select the most appropriate answer from the options provided.";
  }

  return null;
}
