import { describe, it, expect } from "vitest";
import { 
  isExclusiveClassification, 
  filterSubjectsForQuestionType,
  filterQuestionTypesForSubject 
} from "./exclusivity";
import { Classification } from "@types";

describe("exclusivity utils", () => {
  const mockExclusiveSubject: Classification = {
    id: 101,
    code: "COMPANY_CONTACT_DETAILS",
    name: "Company Contact Details",
    type: "subject",
    is_active: true,
    metadata: { is_exclusive: true }
  };

  const mockNormalSubject: Classification = {
    id: 102,
    code: "APTITUDE",
    name: "Aptitude",
    type: "subject",
    is_active: true
  };

  const mockExclusiveQT: Classification = {
    id: 201,
    code: "CONTACT_DETAILS",
    name: "Contact Details",
    type: "question_type",
    is_active: true
  };

  const mockNormalQT: Classification = {
    id: 202,
    code: "MULTIPLE_CHOICE",
    name: "Multiple Choice",
    type: "question_type",
    is_active: true
  };

  describe("isExclusiveClassification", () => {
    it("should return true for special categories by code", () => {
      expect(isExclusiveClassification("LEAD_GENERATION")).toBe(true);
      expect(isExclusiveClassification("TYPING_TEST")).toBe(true);
      expect(isExclusiveClassification("CONTACT_DETAILS")).toBe(true);
      expect(isExclusiveClassification("COMPANY_CONTACT_DETAILS")).toBe(true);
    });

    it("should return true if metadata.is_exclusive is true", () => {
      expect(isExclusiveClassification(mockExclusiveSubject)).toBe(true);
    });

    it("should return false for normal category codes", () => {
      expect(isExclusiveClassification("APTITUDE")).toBe(false);
      expect(isExclusiveClassification("MULTIPLE_CHOICE")).toBe(false);
    });
  });

  describe("filterSubjectsForQuestionType", () => {
    const subjects = [mockExclusiveSubject, mockNormalSubject];

    it("should return only mapped exclusive subject for exclusive question type", () => {
      const filtered = filterSubjectsForQuestionType(subjects, "CONTACT_DETAILS");
      expect(filtered).toHaveLength(1);
      expect(filtered[0].code).toBe("COMPANY_CONTACT_DETAILS");
    });

    it("should show only non-exclusive subjects for normal question type", () => {
      const filtered = filterSubjectsForQuestionType(subjects, "MULTIPLE_CHOICE");
      expect(filtered).toHaveLength(1);
      expect(filtered[0].code).toBe("APTITUDE");
    });
  });

  describe("filterQuestionTypesForSubject", () => {
    const types = [mockExclusiveQT, mockNormalQT];

    it("should return only mapped exclusive question type for exclusive subject", () => {
      const filtered = filterQuestionTypesForSubject(types, "COMPANY_CONTACT_DETAILS");
      expect(filtered).toHaveLength(1);
      expect(filtered[0].code).toBe("CONTACT_DETAILS");
    });

    it("should show only non-exclusive question types for normal subject", () => {
      const filtered = filterQuestionTypesForSubject(types, "APTITUDE");
      expect(filtered).toHaveLength(1);
      expect(filtered[0].code).toBe("MULTIPLE_CHOICE");
    });
  });
});
