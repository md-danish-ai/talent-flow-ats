/* eslint-disable */
import { z } from "zod";
import { type ReactFormExtendedApi } from "@tanstack/react-form";

/**
 * Interface definitions based on the provided form data structure.
 * These are used across the application to ensure consistent typing.
 */

export interface FamilyMember {
  id: number;
  relationLabel: string;
  relation: string;
  name: string;
  occupation: string;
  dependent: string;
}

export interface Education {
  id: number;
  type: string;
  school: string;
  board: string;
  startYear: string;
  endYear: string;
  division: string;
  percentage: string;
  medium: string;
  details: string;
}

export interface WorkExperience {
  id: number;
  company: string;
  employmentType: string;
  designation: string;
  joinDate: string;
  relieveDate: string;
  reason: string;
  salary: string;
}

export interface PersonalDetailsFormValues {
  firstName: string;
  lastName: string;
  gender: string;
  dob: string;
  primaryMobile: string;
  alternateMobile: string;
  email: string;
  presentAddressLine1: string;
  presentAddressLine2: string;
  presentState: string;
  presentDistrict: string;
  presentCity: string;
  presentPincode: string;
  permanentAddressLine1: string;
  permanentAddressLine2: string;
  permanentState: string;
  permanentDistrict: string;
  permanentCity: string;
  permanentPincode: string;
  sameAddress: boolean;
  family: FamilyMember[];
  interviewedBefore: string;
  workedBefore: string;
  source: {
    campus: boolean;
    website: boolean;
    employee: boolean;
    friends: boolean;
    newspaper: boolean;
  };
  education: Education[];
  workExp: WorkExperience[];
  serviceCommitment: string;
  securityDeposit: string;
  shiftTime: string;
  expectedJoiningDate: string;
  expectedSalary: string;
}

/**
 * Zod schemas for validation, ensuring they match the interfaces.
 */

export const familyMemberSchema = z
  .object({
    id: z.number(),
    relationLabel: z.string(),
    relation: z.string().default(""),
    name: z.string().default(""),
    occupation: z.string().default(""),
    dependent: z.string().default(""),
  })
  .superRefine((data, ctx) => {
    const isMandatory =
      data.relationLabel === "Father" || data.relationLabel === "Mother";
    const hasDetails =
      data.name.trim() !== "" ||
      data.occupation.trim() !== "" ||
      data.dependent === "Yes" ||
      data.dependent === "No" ||
      (!isMandatory && data.relation.trim() !== "");

    if (isMandatory || hasDetails) {
      if (!isMandatory && data.relation.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Relation required",
          path: ["relation"],
        });
      }
      if (data.name.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Name required",
          path: ["name"],
        });
      }
      if (data.occupation.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Occupation required",
          path: ["occupation"],
        });
      }
      if (data.dependent.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Dependency required",
          path: ["dependent"],
        });
      }
    }
  });

export const educationSchema = z
  .object({
    id: z.number(),
    type: z.string(),
    school: z.string().default(""),
    board: z.string().default(""),
    startYear: z.string().default(""),
    endYear: z.string().default(""),
    division: z.string().default(""),
    percentage: z.string().default(""),
    medium: z.string().default(""),
    details: z.string().default(""),
  })
  .superRefine((data, ctx) => {
    const isMandatory = data.type === "10th Std" || data.type === "12th Std";
    const hasDetails =
      data.type.trim() !== "" ||
      data.school.trim() !== "" ||
      data.board.trim() !== "" ||
      data.startYear.trim() !== "" ||
      data.endYear.trim() !== "" ||
      data.division.trim() !== "" ||
      data.percentage.trim() !== "" ||
      data.medium.trim() !== "" ||
      data.details.trim() !== "";

    if (isMandatory || hasDetails) {
      if (data.type.trim() === "")
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Education required",
          path: ["type"],
        });
      if (data.details.trim() === "")
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Details required",
          path: ["details"],
        });
      if (data.school.trim() === "")
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "School required",
          path: ["school"],
        });
      if (data.board.trim() === "")
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Board required",
          path: ["board"],
        });
      if (data.startYear.trim() === "")
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Start Year required",
          path: ["startYear"],
        });
      if (data.endYear.trim() === "")
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "End Year required",
          path: ["endYear"],
        });
      if (data.division.trim() === "")
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Division required",
          path: ["division"],
        });
      if (data.percentage.trim() === "")
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Percentage required",
          path: ["percentage"],
        });
      if (data.medium.trim() === "")
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Medium required",
          path: ["medium"],
        });
    }

    if (data.startYear.trim() !== "" && data.endYear.trim() !== "") {
      if (parseInt(data.endYear, 10) <= parseInt(data.startYear, 10)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Must be > Start Year",
          path: ["endYear"],
        });
      }
    }
  });

export const workExperienceSchema = z
  .object({
    id: z.number(),
    company: z.string().default(""),
    employmentType: z.string().default(""),
    designation: z.string().default(""),
    joinDate: z.string().default(""),
    relieveDate: z.string().default(""),
    reason: z.string().default(""),
    salary: z.string().default(""),
  })
  .superRefine((data, ctx) => {
    // We only force validation if a company name is entered.
    const hasCompany = data.company.trim() !== "";

    if (hasCompany) {
      if (data.employmentType.trim() === "")
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Employment type required",
          path: ["employmentType"],
        });
      if (data.designation.trim() === "")
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Designation required",
          path: ["designation"],
        });
      if (data.joinDate.trim() === "")
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Join date required",
          path: ["joinDate"],
        });
      if (data.relieveDate.trim() === "")
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Relieve date required",
          path: ["relieveDate"],
        });
      if (data.reason.trim() === "")
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Reason required",
          path: ["reason"],
        });
      if (data.salary.trim() === "")
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Salary required",
          path: ["salary"],
        });

      if (data.joinDate.trim() !== "" && data.relieveDate.trim() !== "") {
        const join = new Date(data.joinDate);
        const relieve = new Date(data.relieveDate);
        if (relieve < join) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Must be >= Join Date",
            path: ["relieveDate"],
          });
        }
      }
    }
  });

const baseSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  gender: z.string().min(1, "Gender is required"),
  dob: z.string().min(1, "Date of birth is required"),
  primaryMobile: z
    .string()
    .length(10, "Mobile number must be exactly 10 digits.")
    .regex(/^\d+$/, "Mobile number must contain only digits."),
  alternateMobile: z
    .string()
    .length(10, "Alternate mobile must be exactly 10 digits.")
    .regex(/^\d+$/, "Alternate mobile must contain only digits.")
    .optional()
    .or(z.literal("")),
  email: z.string().email("Valid email address is required"),
  presentAddressLine1: z.string().min(1, "Address Line 1 is required"),
  presentAddressLine2: z.string().default(""),
  presentState: z.string().min(1, "State is required"),
  presentDistrict: z.string().min(1, "District is required"),
  presentCity: z.string().min(1, "City is required"),
  presentPincode: z.string().min(6, "Pincode must be 6 digits"),
  permanentAddressLine1: z.string().default(""),
  permanentAddressLine2: z.string().default(""),
  permanentState: z.string().default(""),
  permanentDistrict: z.string().default(""),
  permanentCity: z.string().default(""),
  permanentPincode: z.string().default(""),
  sameAddress: z.boolean(),
  family: z.array(familyMemberSchema),
  interviewedBefore: z.string().min(1, "Please select an option"),
  workedBefore: z.string().min(1, "Please select an option"),
  source: z.object({
    campus: z.boolean(),
    website: z.boolean(),
    employee: z.boolean(),
    friends: z.boolean(),
    newspaper: z.boolean(),
  }),
  education: z.array(educationSchema),
  workExp: z.array(workExperienceSchema),
  serviceCommitment: z.string().min(1, "Please select an option"),
  securityDeposit: z.string().min(1, "Please select an option"),
  shiftTime: z.string().min(1, "Please select an option"),
  expectedJoiningDate: z.string().min(1, "Expected joining date is required"),
  expectedSalary: z.string().min(1, "Expected salary is required"),
});

export const personalDetailsSchema: z.ZodType<PersonalDetailsFormValues> =
  baseSchema.superRefine((data, ctx) => {
    // Logic for Permanent Address Validation
    if (!data.sameAddress) {
      const hasAnyPermanentDetail =
        data.permanentAddressLine1.trim() !== "" ||
        data.permanentAddressLine2.trim() !== "" ||
        data.permanentState.trim() !== "" ||
        data.permanentDistrict.trim() !== "" ||
        data.permanentCity.trim() !== "" ||
        data.permanentPincode.trim() !== "";

      if (hasAnyPermanentDetail) {
        if (data.permanentAddressLine1.trim() === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Address Line 1 is required",
            path: ["permanentAddressLine1"],
          });
        }
        if (data.permanentState.trim() === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "State is required",
            path: ["permanentState"],
          });
        }
        if (data.permanentDistrict.trim() === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "District is required",
            path: ["permanentDistrict"],
          });
        }
        if (data.permanentCity.trim() === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "City is required",
            path: ["permanentCity"],
          });
        }
        if (data.permanentPincode.trim() === "") {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Pincode is required",
            path: ["permanentPincode"],
          });
        } else if (data.permanentPincode.trim().length !== 6) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Pincode must be 6 digits",
            path: ["permanentPincode"],
          });
        }
      }
    }
  }) as any;

/**
 * Helper type for the TanStack Form instance across components.
 * Using 'any' for the internal generics is standard for TanStack Form type helpers
 */

export type PersonalDetailsForm = ReactFormExtendedApi<
  PersonalDetailsFormValues,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any,
  any
>;
