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
  contactNo?: string;
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
  gradingType?: string;
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
  bloodGroup: string;
  aadhaarNo: string;
  nameAsPerAadhaar: string;
  panNo: string;
  nameAsPerPan: string;
  religion: string;
  category: string;
  maritalStatus: string;
  anniversaryDate: string;
  family: FamilyMember[];
  interviewedBefore: boolean;
  workedBefore: boolean;
  source: {
    campus: boolean;
    website: boolean;
    employee: boolean;
    friends: boolean;
    newspaper: boolean;
    others: boolean;
    otherDetails: string;
  };
  education: Education[];
  workExp: WorkExperience[];
  serviceCommitment: string;
  securityDeposit: string;
  shiftTime: string;
  expectedJoiningDate: string;
  expectedSalary: string;
  emergencyContactRelation: string;
  assignedEmergencyRelation: string;
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
    contactNo: z.string().default(""),
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
      } else if (/\d/.test(data.name)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Numbers are not allowed",
          path: ["name"],
        });
      }

      if (data.occupation.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Occupation required",
          path: ["occupation"],
        });
      } else if (/\d/.test(data.occupation)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Numbers are not allowed",
          path: ["occupation"],
        });
      }
      // Note: Dependent is non-mandatory per feedback point 18
    } else {
      if (/\d/.test(data.name)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Numbers are not allowed",
          path: ["name"],
        });
      }
      if (/\d/.test(data.occupation)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Numbers are not allowed",
          path: ["occupation"],
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
    gradingType: z.string().default("Percentage"),
  })
  .superRefine((data, ctx) => {
    const isMandatory =
      data.type === "10th / High School" ||
      data.type === "12th / Intermediate" ||
      data.type === "10th Std" ||
      data.type === "12th Std" ||
      data.type === "Graduation";
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
      // Division field is optional (Point 13)
      if (data.percentage.trim() === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `${data.gradingType || "Percentage"} required`,
          path: ["percentage"],
        });
      } else {
        const num = parseFloat(data.percentage.replace("%", "").trim());
        if (isNaN(num)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Must be a valid number",
            path: ["percentage"],
          });
        } else if (data.gradingType === "CGPA" && num > 10) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "CGPA cannot exceed 10",
            path: ["percentage"],
          });
        } else if (data.gradingType !== "CGPA" && num > 100) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Percentage cannot exceed 100%",
            path: ["percentage"],
          });
        }
      }
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
    const isFresher = data.company.trim().toLowerCase() === "fresher";

    if (!isFresher) {
      if (data.company.trim() === "")
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Company name required",
          path: ["company"],
        });
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

export const bloodGroupSchema = z.string();
export const aadhaarNoSchema = z
  .string()
  .refine(
    (val) => !val || (val.length === 12 && /^\d{12}$/.test(val)),
    "Aadhaar number must be exactly 12 digits",
  );
export const nameAsPerAadhaarSchema = z.string();
export const panNoSchema = z
  .string()
  .refine(
    (val) => !val || /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(val),
    "Invalid PAN format (e.g., ABCDE1234F)",
  );
export const nameAsPerPanSchema = z.string();
export const religionSchema = z.string();
export const categorySchema = z.string();
export const maritalStatusSchema = z.string();
export const emergencyContactRelationSchema = z
  .string()
  .min(1, "Emergency contact relation is required");

const baseSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .refine((val) => !/\d/.test(val), "Numbers are not allowed"),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .refine((val) => !/\d/.test(val), "Numbers are not allowed"),
  gender: z.string().min(1, "Gender is required"),
  dob: z.string().min(1, "Date of Birth is required"),
  primaryMobile: z
    .string()
    .transform((val) => (val || "").replace(/\D/g, "").slice(-10))
    .refine((val) => /^\d{10}$/.test(val), "Invalid mobile number"),
  alternateMobile: z
    .string()
    .transform((val) => (val || "").replace(/\D/g, "").slice(-10))
    .refine(
      (val) => !val || /^\d{10}$/.test(val),
      "Invalid alternate mobile number",
    ),
  email: z.union([z.string().email("Invalid email address"), z.literal("")]),
  presentAddressLine1: z.string().min(1, "Address Line 1 is required"),
  presentAddressLine2: z.string().default(""),
  presentState: z.string().min(1, "State is required"),
  presentDistrict: z.string().min(1, "District is required"),
  presentCity: z.string().min(1, "City is required"),
  presentPincode: z.string().min(1, "Pincode is required"),
  permanentAddressLine1: z.string().default(""),
  permanentAddressLine2: z.string().default(""),
  permanentState: z.string().default(""),
  permanentDistrict: z.string().default(""),
  permanentCity: z.string().default(""),
  permanentPincode: z.string().default(""),
  sameAddress: z.boolean(),
  bloodGroup: bloodGroupSchema,
  aadhaarNo: aadhaarNoSchema,
  nameAsPerAadhaar: nameAsPerAadhaarSchema,
  panNo: panNoSchema,
  nameAsPerPan: nameAsPerPanSchema,
  religion: religionSchema,
  category: categorySchema,
  maritalStatus: maritalStatusSchema,
  anniversaryDate: z.string().default(""),
  family: z.array(familyMemberSchema),
  interviewedBefore: z.boolean().default(false),
  workedBefore: z.boolean().default(false),
  source: z.object({
    campus: z.boolean().default(false),
    website: z.boolean().default(false),
    employee: z.boolean().default(false),
    friends: z.boolean().default(false),
    newspaper: z.boolean().default(false),
    others: z.boolean().default(false),
    otherDetails: z.string().default(""),
  }),
  education: z.array(educationSchema),
  workExp: z.array(workExperienceSchema),
  serviceCommitment: z.string().min(1, "Please select an option"),
  securityDeposit: z.string().min(1, "Please select an option"),
  shiftTime: z.string().min(1, "Please select an option"),
  expectedJoiningDate: z.string().min(1, "Expected joining date is required"),
  expectedSalary: z.string().min(1, "Expected salary is required"),
  emergencyContactRelation: emergencyContactRelationSchema,
  assignedEmergencyRelation: z.string().default(""),
});

export const personalDetailsSchema: z.ZodType<PersonalDetailsFormValues> =
  baseSchema.superRefine((data, ctx) => {
    // Source of Information Validation
    const hasAnySource =
      data.source.campus ||
      data.source.website ||
      data.source.employee ||
      data.source.friends ||
      data.source.newspaper ||
      data.source.others;

    if (!hasAnySource) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please select at least one source of information",
        path: ["source"],
      });
    }

    if (data.source.others && data.source.otherDetails.trim() === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please specify details for Others",
        path: ["source", "otherDetails"],
      });
    }

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

    // Logic for Anniversary Date
    if (
      data.maritalStatus === "Married" &&
      data.anniversaryDate.trim() === ""
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Anniversary Date is required when Married",
        path: ["anniversaryDate"],
      });
    }

    // Contact Number Uniqueness Validation across Primary, Alternate & Family Contact Numbers
    const primary = data.primaryMobile?.trim() || "";
    const alternate = data.alternateMobile?.trim() || "";

    if (alternate && primary && alternate === primary) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Alternate mobile number should be unique (cannot be same as primary contact)",
        path: ["alternateMobile"],
      });
    }

    // Logic for Emergency Contact Number Validation
    if (data.emergencyContactRelation) {
      const emergencyMemberIndex = data.family.findIndex(
        (m) => m.relation === data.emergencyContactRelation,
      );
      if (emergencyMemberIndex === -1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Please add details for your emergency contact relation`,
          path: ["family"],
        });
      } else {
        const member = data.family[emergencyMemberIndex];
        const contactNo = member.contactNo ? member.contactNo.trim() : "";

        if (!contactNo) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Emergency contact number is required",
            path: ["family", emergencyMemberIndex, "contactNo"],
          });
        } else if (!/^\d{10}$/.test(contactNo)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Must be a 10-digit number",
            path: ["family", emergencyMemberIndex, "contactNo"],
          });
        } else {
          // Uniqueness check for emergency contact number
          if (primary && contactNo === primary) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message:
                "Emergency contact number should be unique (cannot be same as primary contact)",
              path: ["family", emergencyMemberIndex, "contactNo"],
            });
          } else if (alternate && contactNo === alternate) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message:
                "Emergency contact number should be unique (cannot be same as alternate contact)",
              path: ["family", emergencyMemberIndex, "contactNo"],
            });
          }
        }
      }
    }

    // Check all other family member contact numbers if present for uniqueness
    data.family.forEach((m, idx) => {
      const no = m.contactNo ? m.contactNo.trim() : "";
      if (
        no &&
        no.length === 10 &&
        m.relation !== data.emergencyContactRelation
      ) {
        if (primary && no === primary) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Contact number should be unique (cannot be same as primary contact)",
            path: ["family", idx, "contactNo"],
          });
        } else if (alternate && no === alternate) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message:
              "Contact number should be unique (cannot be same as alternate contact)",
            path: ["family", idx, "contactNo"],
          });
        }
      }
    });
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
