"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Button } from "@components/ui-elements/Button";
import { Typography } from "@components/ui-elements/Typography";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  User,
  Fingerprint,
  Users,
  Info,
  GraduationCap,
  Briefcase,
  FileText,
  HelpCircle,
} from "lucide-react";
import { usePersonalDetailsTour } from "@lib/tour";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import {
  personalDetailsSchema,
  type PersonalDetailsFormValues,
  type PersonalDetailsForm,
  type FamilyMember,
  type Education,
  type WorkExperience,
} from "@lib/validations/personal-details";

import { stepFields, defaultPersonalDetailsValues } from "./constants";

import { PersonalDetailsStep } from "./timeline/PersonalDetailsStep";
import { PersonalDetailsPart2Step } from "./timeline/PersonalDetailsPart2Step";
import { FamilyDetailsStep } from "./timeline/FamilyDetailsStep";
import { SourceOfInformationStep } from "./timeline/SourceOfInformationStep";
import { EducationDetailsStep } from "./timeline/EducationDetailsStep";
import { WorkExperienceStep } from "./timeline/WorkExperienceStep";
import { OtherDetailsStep } from "./timeline/OtherDetailsStep";
import { Timeline } from "./components/Timeline";
import { SubmitModal } from "./components/SubmitModal";
import {
  useUserDetails,
  useSaveUserDetails,
  useUpdateUserDetails,
} from "@hooks/api/user-details/use-user-details";
import { useMe } from "@hooks/api/user/use-me";
import type { UserDetails } from "@types";

const STEP_CONTENT = [
  {
    icon: User,
    title: "Personal Details",
    subtitle: "Provide your basic contact and demographic information.",
  },
  {
    icon: Fingerprint,
    title: "Additional Personal Details",
    subtitle: "Provide your demographic and identity information.",
  },
  {
    icon: Users,
    title: "Family Details",
    subtitle: "Provide details about your family members.",
  },
  {
    icon: Info,
    title: "Source of Information",
    subtitle: "Let us know how you heard about this opportunity.",
  },
  {
    icon: GraduationCap,
    title: "Education Details",
    subtitle: "Provide details about your academic qualifications.",
  },
  {
    icon: Briefcase,
    title: "Work Experience",
    subtitle: "Provide details of your employment history.",
  },
  {
    icon: FileText,
    title: "Other Details",
    subtitle: "Provide additional employment details.",
  },
];

import {
  normalizeWhitespace,
  normalizeProperCase,
  parseBoolean,
  normalizeMobile,
  normalizeEmail,
  normalizePan,
  normalizeAadhaar,
} from "@lib/utils";

const sanitizeFamily = (familyArr: unknown[]): FamilyMember[] => {
  const sanitized = (familyArr || []).map((m) => {
    const member = m as Record<string, unknown>;
    const depStr = normalizeWhitespace(member.dependent);
    return {
      ...member,
      relation: normalizeWhitespace(member.relation),
      name: normalizeProperCase(member.name),
      occupation: normalizeProperCase(member.occupation),
      dependent: depStr || "No",
      contactNo: normalizeWhitespace(member.contactNo),
    };
  }) as FamilyMember[];

  // Filter out completely blank rows that are beyond the first 2 rows
  return sanitized.filter((m, index) => {
    if (index < 2) return true;
    const isBlank =
      !m.relation &&
      !m.name &&
      !m.occupation &&
      !m.dependent &&
      (!m.relationLabel ||
        m.relationLabel === "Spouse" ||
        m.relationLabel === "Brother/Sister");
    return !isBlank;
  });
};

const sanitizeEducation = (arr: unknown[]): Education[] => {
  const sanitized = (arr || []).map((e) => {
    const item = e as Record<string, unknown>;
    let startYear = normalizeWhitespace(item.startYear);
    let endYear = normalizeWhitespace(item.endYear);
    let isPursuing = Boolean(item.isPursuing);

    // Fallback: parse from 'year' if missing or contains Pursuing
    const yearStr = normalizeWhitespace(item.year);
    if (yearStr) {
      if (yearStr.toLowerCase().includes("pursuing")) {
        isPursuing = true;
        const parts = yearStr.split("-");
        startYear =
          startYear ||
          (parts[0] && parts[0].toLowerCase() !== "pursuing" ? parts[0] : "");
        endYear = "";
      } else if (!startYear && !endYear && yearStr.includes("-")) {
        const parts = yearStr.split("-");
        startYear = parts[0] || "";
        endYear = parts[1] || "";
      }
    }

    if (endYear.toLowerCase() === "pursuing") {
      isPursuing = true;
      endYear = "";
    }

    return {
      ...item,
      type: normalizeWhitespace(item.type),
      school: normalizeProperCase(item.school),
      board: normalizeProperCase(item.board),
      startYear,
      endYear: isPursuing ? "" : endYear,
      division: normalizeWhitespace(item.division),
      percentage: normalizeWhitespace(item.percentage),
      medium: normalizeWhitespace(item.medium),
      details: normalizeProperCase(item.details),
      isPursuing,
    };
  }) as Education[];

  // Filter out extra blank rows (beyond the first 3) that were saved previously
  const filtered = sanitized.filter((e, index) => {
    if (index < 3) return true;
    const isBlank =
      !e.school &&
      !e.board &&
      !e.startYear &&
      !e.endYear &&
      !e.division &&
      !e.percentage &&
      !e.medium &&
      !e.details &&
      (!e.type ||
        e.type === "Post Graduation" ||
        e.type === "Additional Qualification");
    return !isBlank;
  });

  // Ensure mandatory default rows (10th / High School, 12th / Intermediate, Graduation) exist
  const defaultTypes = [
    {
      type: "10th / High School",
      legacyType: "10th Std",
      defaultDetails: "All Subjects",
    },
    { type: "12th / Intermediate", legacyType: "12th Std", defaultDetails: "" },
    { type: "Graduation", legacyType: "Graduation", defaultDetails: "" },
  ];
  defaultTypes.forEach((def, index) => {
    if (!filtered[index]) {
      filtered[index] = {
        id: index + 1,
        type: def.type,
        school: "",
        board: "",
        startYear: "",
        endYear: "",
        division: "",
        percentage: "",
        medium: "",
        details: def.defaultDetails,
      };
    } else {
      if (!filtered[index].type || filtered[index].type === def.legacyType) {
        filtered[index].type = def.type;
      }
      if (index === 0 && !filtered[index].details) {
        filtered[index].details = "All Subjects";
      }
    }
  });

  return filtered;
};

const sanitizeWorkExp = (arr: unknown[]): WorkExperience[] => {
  if (!arr || arr.length === 0) {
    return [
      {
        id: 1,
        company: "Fresher",
        employmentType: "",
        designation: "",
        joinDate: "",
        relieveDate: "",
        reason: "",
        salary: "",
        isPresent: false,
      },
    ];
  }
  const isFresherRecord =
    arr.length === 1 &&
    normalizeWhitespace(
      (arr[0] as Record<string, unknown>).company,
    ).toLowerCase() === "fresher";

  return arr.map((i, index) => {
    const item = i as Record<string, unknown>;
    const companyStr = normalizeWhitespace(item.company);
    const relieveDateStr = normalizeWhitespace(item.relieveDate);
    const isLastCompany = index === arr.length - 1;
    const isPresent =
      Boolean(item.isPresent) ||
      (!isFresherRecord &&
        isLastCompany &&
        Boolean(companyStr) &&
        (relieveDateStr.toLowerCase() === "present" || !relieveDateStr));

    return {
      ...item,
      id: Number(item.id) || index + 1,
      company: companyStr
        ? normalizeProperCase(companyStr)
        : index === 0
          ? "Fresher"
          : "",
      employmentType: normalizeWhitespace(item.employmentType),
      designation: normalizeProperCase(item.designation),
      joinDate: normalizeWhitespace(item.joinDate),
      relieveDate:
        relieveDateStr.toLowerCase() === "present" ? "" : relieveDateStr,
      reason: normalizeProperCase(item.reason),
      salary: normalizeWhitespace(item.salary),
      isPresent,
    };
  }) as WorkExperience[];
};

interface UserFormProps {
  initialData?: UserDetails;
  userId?: string | number;
  onSuccess?: () => void;
  isAdmin?: boolean;
}

export function UserForm({
  initialData,
  userId,
  onSuccess,
  isAdmin = false,
}: UserFormProps) {
  const router = useRouter();
  const initializedRef = React.useRef(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [touchedSteps, setTouchedSteps] = useState<number[]>([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [incompleteSteps, setIncompleteSteps] = useState<number[]>([]);
  const totalSteps = 7;

  // For User Portal (Self) — disabled when admin is editing a specific user
  // Admin always provides initialData via SSR, so no need to call /me
  const { data: selfDetails, isLoading: isLoadingSelf } = useUserDetails({
    enabled: !isAdmin,
  });

  // Registered mobile and email from session — only used for the user portal (not admin)
  const { data: currentUser } = useMe();
  // When admin edits another user's form, do NOT pull admin's own mobile/email
  const registeredMobile = isAdmin ? "" : (currentUser?.mobile ?? "");
  const registeredEmail = isAdmin ? "" : (currentUser?.email ?? "");

  const { runTourManually } = usePersonalDetailsTour(
    !isAdmin && currentUser ? currentUser : null,
  );

  // Choose data source: Prop initialData -> SSR data -> Client-side fetch "me"
  const existingDetails = initialData || selfDetails;
  const isLoadingDetails = !initialData && !userId && isLoadingSelf;

  const { mutateAsync: saveDetails, isPending: isAdding } =
    useSaveUserDetails();
  const { mutateAsync: updateDetails, isPending: isUpdating } =
    useUpdateUserDetails();

  const isSaving = isAdding || isUpdating;

  const initialValues = React.useMemo(() => {
    const details = initialData || (selfDetails as unknown as UserDetails);
    if (details && details.personalDetails) {
      const p = details.personalDetails;
      return {
        ...defaultPersonalDetailsValues,
        firstName: p.firstName || "",
        lastName: p.lastName || "",
        gender: p.gender || "Male",
        dob: p.dob || "",
        primaryMobile: p.primaryMobile || registeredMobile,
        alternateMobile: p.alternateMobile || "",
        email: p.email || registeredEmail,
        presentAddressLine1: p.presentAddressLine1 || "",
        presentAddressLine2: p.presentAddressLine2 || "",
        presentState: p.presentState || "",
        presentDistrict: p.presentDistrict || "",
        presentCity: p.presentCity || "",
        presentPincode: p.presentPincode || "",
        permanentAddressLine1: p.permanentAddressLine1 || "",
        permanentAddressLine2: p.permanentAddressLine2 || "",
        permanentState: p.permanentState || "",
        permanentDistrict: p.permanentDistrict || "",
        permanentCity: p.permanentCity || "",
        permanentPincode: p.permanentPincode || "",
        sameAddress: Boolean(p.sameAddress),
        bloodGroup: details.additionalPersonalDetails?.bloodGroup || "",
        aadhaarNo: details.additionalPersonalDetails?.aadhaarNo || "",
        nameAsPerAadhaar:
          details.additionalPersonalDetails?.nameAsPerAadhaar || "",
        panNo: details.additionalPersonalDetails?.panNo || "",
        nameAsPerPan: details.additionalPersonalDetails?.nameAsPerPan || "",
        religion: details.additionalPersonalDetails?.religion || "",
        category: details.additionalPersonalDetails?.category || "",
        maritalStatus: details.additionalPersonalDetails?.maritalStatus || "",
        anniversaryDate:
          details.additionalPersonalDetails?.anniversaryDate || "",
        emergencyContactRelation:
          details.assigned_emergency_relation ||
          details.emergency_contact_relation ||
          "",
        assignedEmergencyRelation: details.assigned_emergency_relation || "",
        family: (() => {
          const defaultFamily =
            details.familyDetails?.length > 0
              ? sanitizeFamily(details.familyDetails)
              : [...defaultPersonalDetailsValues.family];
          const emergencyCode =
            details.assigned_emergency_relation ||
            details.emergency_contact_relation;
          if (
            emergencyCode &&
            !defaultFamily.some(
              (f) => f.relation?.toUpperCase() === emergencyCode.toUpperCase(),
            )
          ) {
            defaultFamily.push({
              id: defaultFamily.length + 1,
              relationLabel:
                emergencyCode.charAt(0).toUpperCase() +
                emergencyCode.slice(1).toLowerCase(),
              relation: emergencyCode,
              name: "",
              occupation: "",
              dependent: "",
              contactNo: "",
            });
          }
          return defaultFamily;
        })(),
        interviewedBefore: parseBoolean(
          details.sourceOfInformation?.interviewedBefore,
        ),
        workedBefore: parseBoolean(details.sourceOfInformation?.workedBefore),
        source: {
          campus: Boolean(details.sourceOfInformation?.source?.campus),
          website: Boolean(details.sourceOfInformation?.source?.website),
          employee: Boolean(details.sourceOfInformation?.source?.employee),
          friends: Boolean(details.sourceOfInformation?.source?.friends),
          newspaper: Boolean(details.sourceOfInformation?.source?.newspaper),
          others: Boolean(details.sourceOfInformation?.source?.others),
          otherDetails:
            typeof details.sourceOfInformation?.source?.otherDetails ===
            "string"
              ? details.sourceOfInformation.source.otherDetails
              : "",
        },
        education:
          details.educationDetails?.length > 0
            ? sanitizeEducation(details.educationDetails)
            : defaultPersonalDetailsValues.education,
        workExp:
          details.workExperienceDetails?.length > 0
            ? sanitizeWorkExp(details.workExperienceDetails)
            : defaultPersonalDetailsValues.workExp,
        serviceCommitment: details.otherDetails?.serviceCommitment || "",
        securityDeposit: details.otherDetails?.securityDeposit || "",
        shiftTime: details.otherDetails?.shiftTime || "",
        expectedJoiningDate: details.otherDetails?.expectedJoiningDate || "",
        expectedSalary: details.otherDetails?.expectedSalary || "",
      };
    }
    return {
      ...defaultPersonalDetailsValues,
      primaryMobile: registeredMobile,
      email: registeredEmail,
    };
  }, [initialData, selfDetails, registeredMobile, registeredEmail]);

  const handleFinalSubmit = React.useCallback(async () => {
    const value = form.state.values;
    try {
      const formattedData: UserDetails = {
        user_id: userId ? Number(userId) : undefined,
        is_submitted: true,
        is_interview_submitted:
          existingDetails?.is_interview_submitted ?? false,
        personalDetails: {
          firstName: normalizeProperCase(value.firstName),
          lastName: normalizeProperCase(value.lastName),
          gender: normalizeWhitespace(value.gender),
          dob: normalizeWhitespace(value.dob),
          primaryMobile: normalizeMobile(value.primaryMobile),
          alternateMobile: normalizeMobile(value.alternateMobile),
          email: normalizeEmail(value.email) || null,
          presentAddressLine1: normalizeProperCase(value.presentAddressLine1),
          presentAddressLine2: normalizeProperCase(value.presentAddressLine2),
          presentState: normalizeWhitespace(value.presentState),
          presentDistrict: normalizeWhitespace(value.presentDistrict),
          presentCity: normalizeProperCase(value.presentCity),
          presentPincode: normalizeWhitespace(value.presentPincode),
          permanentAddressLine1: value.sameAddress
            ? normalizeProperCase(value.presentAddressLine1)
            : normalizeProperCase(value.permanentAddressLine1),
          permanentAddressLine2: value.sameAddress
            ? normalizeProperCase(value.presentAddressLine2)
            : normalizeProperCase(value.permanentAddressLine2),
          permanentState: value.sameAddress
            ? normalizeWhitespace(value.presentState)
            : normalizeWhitespace(value.permanentState),
          permanentDistrict: value.sameAddress
            ? normalizeWhitespace(value.presentDistrict)
            : normalizeWhitespace(value.permanentDistrict),
          permanentCity: value.sameAddress
            ? normalizeProperCase(value.presentCity)
            : normalizeProperCase(value.permanentCity),
          permanentPincode: value.sameAddress
            ? normalizeWhitespace(value.presentPincode)
            : normalizeWhitespace(value.permanentPincode),
          sameAddress: Boolean(value.sameAddress),
        },
        additionalPersonalDetails: {
          bloodGroup: normalizeWhitespace(value.bloodGroup),
          aadhaarNo: normalizeAadhaar(value.aadhaarNo),
          nameAsPerAadhaar: normalizeProperCase(value.nameAsPerAadhaar),
          panNo: normalizePan(value.panNo),
          nameAsPerPan: normalizeProperCase(value.nameAsPerPan),
          religion: normalizeWhitespace(value.religion),
          category: normalizeWhitespace(value.category),
          maritalStatus: normalizeWhitespace(value.maritalStatus),
          anniversaryDate: normalizeWhitespace(value.anniversaryDate),
        },
        familyDetails: value.family.map((fam) => ({
          ...fam,
          relation: normalizeWhitespace(fam.relation),
          relationLabel: normalizeWhitespace(fam.relationLabel),
          name: normalizeProperCase(fam.name),
          occupation: normalizeProperCase(fam.occupation),
          dependent: normalizeWhitespace(fam.dependent) || "No",
          contactNo: normalizeWhitespace(fam.contactNo),
        })),
        sourceOfInformation: {
          interviewedBefore: parseBoolean(value.interviewedBefore),
          workedBefore: parseBoolean(value.workedBefore),
          source: {
            ...value.source,
            otherDetails: normalizeProperCase(value.source?.otherDetails),
          },
        },
        educationDetails: value.education.map((edu, index) => {
          const startYear = normalizeWhitespace(edu.startYear);
          const endYear = normalizeWhitespace(edu.endYear);
          const isPursuing = Boolean(edu.isPursuing);
          return {
            id: edu.id ?? index + 1,
            type: normalizeWhitespace(edu.type),
            school: normalizeProperCase(edu.school),
            board: normalizeProperCase(edu.board),
            year: isPursuing
              ? startYear
                ? `${startYear}-Pursuing`
                : "Pursuing"
              : `${startYear}-${endYear}`,
            division: normalizeWhitespace(edu.division),
            percentage: normalizeWhitespace(edu.percentage),
            medium: normalizeWhitespace(edu.medium),
            details: normalizeProperCase(edu.details),
            isPursuing,
          };
        }),
        workExperienceDetails: value.workExp.map((exp, index) => ({
          ...exp,
          id: exp.id ?? index + 1,
          company: normalizeProperCase(exp.company),
          employmentType: normalizeWhitespace(exp.employmentType),
          designation: normalizeProperCase(exp.designation),
          joinDate: normalizeWhitespace(exp.joinDate),
          relieveDate: normalizeWhitespace(exp.relieveDate),
          reason: normalizeProperCase(exp.reason),
          salary: normalizeWhitespace(exp.salary),
          isPresent: Boolean(exp.isPresent),
        })),
        otherDetails: {
          serviceCommitment: normalizeWhitespace(value.serviceCommitment),
          securityDeposit: normalizeWhitespace(value.securityDeposit),
          shiftTime: normalizeWhitespace(value.shiftTime),
          expectedJoiningDate: normalizeProperCase(value.expectedJoiningDate),
          expectedSalary: normalizeWhitespace(value.expectedSalary),
        },
        emergency_contact_relation: normalizeWhitespace(
          value.emergencyContactRelation,
        ),
      };

      if (existingDetails) {
        await updateDetails(formattedData);
      } else {
        await saveDetails(formattedData);
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.refresh();
        router.push(isAdmin ? "/admin/management/users" : "/user/dashboard");
      }
    } catch (error: unknown) {
      console.error("Submission error:", error);
      interface BackendValidationError {
        loc: (string | number)[];
        msg: string;
        type: string;
      }

      const axiosError = error as {
        response?: {
          status: number;
          data?: {
            errors?: BackendValidationError[];
          };
        };
      };

      if (
        axiosError?.response?.status === 422 &&
        axiosError?.response?.data?.errors
      ) {
        axiosError.response.data.errors.forEach((err) => {
          const path = err.loc[err.loc.length - 1] as string;
          form.setFieldMeta(
            path as keyof PersonalDetailsFormValues,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (meta: any) => ({
              ...meta,
              errors: [err.msg],
              isTouched: true,
            }),
          );
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [existingDetails, updateDetails, saveDetails, onSuccess, router, isAdmin]);

  const form = useForm({
    // @ts-expect-error - validatorAdapter exists at runtime but type definition mismatch
    validatorAdapter: zodValidator(),
    defaultValues: initialValues,
    validators: {
      onChange: personalDetailsSchema,
      onBlur: personalDetailsSchema,
    },
    onSubmit: handleFinalSubmit,
  });

  // Pre-populate form when existing details are loaded (primarily for self-portal via React Query)
  useEffect(() => {
    if (!initialData && selfDetails && !initializedRef.current) {
      const details = selfDetails as unknown as UserDetails;
      if (!details.personalDetails) {
        // User hasn't submitted form yet, but admin may have assigned emergency relation
        if (details.assigned_emergency_relation) {
          const assignedCode = details.assigned_emergency_relation;
          form.setFieldValue("assignedEmergencyRelation", assignedCode);
          form.setFieldValue("emergencyContactRelation", assignedCode);

          // Dynamically add the assigned relation to family array so it shows up in Step 3
          const currentFamily = form.getFieldValue("family") || [];
          if (
            !currentFamily.some(
              (f: FamilyMember) =>
                f.relation?.toUpperCase() === assignedCode.toUpperCase(),
            )
          ) {
            form.pushFieldValue("family", {
              id: currentFamily.length + 1,
              relationLabel:
                assignedCode.charAt(0).toUpperCase() +
                assignedCode.slice(1).toLowerCase(),
              relation: assignedCode,
              name: "",
              occupation: "",
              dependent: "",
              contactNo: "",
            });
          }
        }
        return;
      }
      initializedRef.current = true; // Prevent future resets from background fetches
      const p = details.personalDetails;

      const mappedSource = {
        campus: Boolean(details.sourceOfInformation?.source?.campus),
        website: Boolean(details.sourceOfInformation?.source?.website),
        employee: Boolean(details.sourceOfInformation?.source?.employee),
        friends: Boolean(details.sourceOfInformation?.source?.friends),
        newspaper: Boolean(details.sourceOfInformation?.source?.newspaper),
        others: Boolean(details.sourceOfInformation?.source?.others),
        otherDetails:
          typeof details.sourceOfInformation?.source?.otherDetails === "string"
            ? details.sourceOfInformation.source.otherDetails
            : "",
      };

      form.reset({
        ...defaultPersonalDetailsValues,
        firstName: p.firstName || "",
        lastName: p.lastName || "",
        gender: p.gender || "Male",
        dob: p.dob || "",
        primaryMobile: p.primaryMobile || registeredMobile,
        alternateMobile: p.alternateMobile || "",
        email: p.email || "",
        presentAddressLine1: p.presentAddressLine1 || "",
        presentAddressLine2: p.presentAddressLine2 || "",
        presentState: p.presentState || "",
        presentDistrict: p.presentDistrict || "",
        presentCity: p.presentCity || "",
        presentPincode: p.presentPincode || "",
        permanentAddressLine1: p.permanentAddressLine1 || "",
        permanentAddressLine2: p.permanentAddressLine2 || "",
        permanentState: p.permanentState || "",
        permanentDistrict: p.permanentDistrict || "",
        permanentCity: p.permanentCity || "",
        permanentPincode: p.permanentPincode || "",
        sameAddress: Boolean(p.sameAddress),
        bloodGroup: details.additionalPersonalDetails?.bloodGroup || "",
        aadhaarNo: details.additionalPersonalDetails?.aadhaarNo || "",
        nameAsPerAadhaar:
          details.additionalPersonalDetails?.nameAsPerAadhaar || "",
        panNo: details.additionalPersonalDetails?.panNo || "",
        nameAsPerPan: details.additionalPersonalDetails?.nameAsPerPan || "",
        religion: details.additionalPersonalDetails?.religion || "",
        category: details.additionalPersonalDetails?.category || "",
        maritalStatus: details.additionalPersonalDetails?.maritalStatus || "",
        anniversaryDate:
          details.additionalPersonalDetails?.anniversaryDate || "",
        emergencyContactRelation:
          details.assigned_emergency_relation ||
          details.emergency_contact_relation ||
          "",
        assignedEmergencyRelation: details.assigned_emergency_relation || "",
        family: (() => {
          const defaultFamily =
            details.familyDetails?.length > 0
              ? sanitizeFamily(details.familyDetails)
              : [...defaultPersonalDetailsValues.family];
          const emergencyCode =
            details.assigned_emergency_relation ||
            details.emergency_contact_relation;
          if (
            emergencyCode &&
            !defaultFamily.some(
              (f: FamilyMember) =>
                f.relation?.toUpperCase() === emergencyCode.toUpperCase(),
            )
          ) {
            defaultFamily.push({
              id: defaultFamily.length + 1,
              relationLabel:
                emergencyCode.charAt(0).toUpperCase() +
                emergencyCode.slice(1).toLowerCase(),
              relation: emergencyCode,
              name: "",
              occupation: "",
              dependent: "",
              contactNo: "",
            });
          }
          return defaultFamily;
        })(),
        interviewedBefore: parseBoolean(
          details.sourceOfInformation?.interviewedBefore,
        ),
        workedBefore: parseBoolean(details.sourceOfInformation?.workedBefore),
        source: mappedSource,
        education:
          details.educationDetails?.length > 0
            ? sanitizeEducation(details.educationDetails)
            : defaultPersonalDetailsValues.education,
        workExp:
          details.workExperienceDetails?.length > 0
            ? sanitizeWorkExp(details.workExperienceDetails)
            : defaultPersonalDetailsValues.workExp,
        serviceCommitment: details.otherDetails?.serviceCommitment || "",
        securityDeposit: details.otherDetails?.securityDeposit || "",
        shiftTime: details.otherDetails?.shiftTime || "",
        expectedJoiningDate: details.otherDetails?.expectedJoiningDate || "",
        expectedSalary: details.otherDetails?.expectedSalary || "",
      });
    }
  }, [selfDetails, initialData, form, registeredMobile]);

  // Sync registered mobile & email from currentUser into form state if empty
  // Only applies to user portal — admin should never overwrite candidate's fields
  useEffect(() => {
    if (!isAdmin && registeredMobile) {
      const cleanMobile = registeredMobile.replace(/\D/g, "").slice(-10);
      const currentPrimary = form.getFieldValue("primaryMobile");
      if (!currentPrimary || currentPrimary !== cleanMobile) {
        form.setFieldValue("primaryMobile", cleanMobile);
      }
    }
  }, [isAdmin, registeredMobile, form]);

  useEffect(() => {
    if (!isAdmin && registeredEmail) {
      const currentEmail = form.getFieldValue("email");
      if (!currentEmail) {
        form.setFieldValue("email", registeredEmail);
      }
    }
  }, [isAdmin, registeredEmail, form]);

  const touchStepFields = React.useCallback(
    (step: number) => {
      const fields = stepFields[step];
      if (fields) {
        fields.forEach((field) => {
          form.setFieldMeta(field, (meta) => ({ ...meta, isTouched: true }));
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const val = form.getFieldValue(field as any);
          if (Array.isArray(val)) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (val as any[]).forEach((item: any, index: number) => {
              if (item && typeof item === "object") {
                Object.keys(item).forEach((key) => {
                  form.setFieldMeta(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    `${field as string}[${index}].${key}` as any,
                    (meta) => ({
                      ...meta,
                      isTouched: true,
                    }),
                  );
                });
              }
            });
          }
        });
      }
    },
    [form],
  );

  useEffect(() => {
    if (touchedSteps.includes(currentStep)) {
      const timer = setTimeout(() => {
        touchStepFields(currentStep);
        form.validateAllFields("change");
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [currentStep, touchedSteps, form, touchStepFields]);

  const isStepValid = (step: number) => {
    const fields = stepFields[step];
    if (!fields) return true;

    const result = personalDetailsSchema.safeParse(form.state.values);
    if (result.success) return true;

    // Check if any error path starts with one of the fields in this step
    return !result.error.issues.some((issue) => {
      const topLevelPath = issue.path[0] as string;
      return fields.includes(topLevelPath as keyof PersonalDetailsFormValues);
    });
  };

  const handleNext = async () => {
    setTouchedSteps((prev) => [...new Set([...prev, currentStep])]);
    touchStepFields(currentStep);
    await form.validateAllFields("change");

    if (!isStepValid(currentStep)) {
      // toast.error("Please fill all required fields correctly.");

      // Map Zod errors manually to TanStack form fields so that nested errors display correctly
      const result = personalDetailsSchema.safeParse(form.state.values);
      if (!result.success) {
        result.error.issues.forEach((issue) => {
          let fieldPath = "";
          issue.path.forEach((p, idx) => {
            if (typeof p === "number") {
              fieldPath += `[${p}]`;
            } else {
              fieldPath += idx === 0 ? p : `.${p}`;
            }
          });
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          form.setFieldMeta(fieldPath as any, (meta) => ({
            ...meta,
            errors: [issue.message],
            isTouched: true,
          }));
        });
      }
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      const validationResult = personalDetailsSchema.safeParse(
        form.state.values,
      );
      const invalidSteps: number[] = [];
      if (!validationResult.success) {
        const errorPaths = validationResult.error.issues.map(
          (issue) => issue.path[0] as string,
        );
        for (let i = 1; i <= totalSteps; i++) {
          const fields = stepFields[i];
          if (
            fields &&
            errorPaths.some((ep) =>
              fields.includes(ep as keyof PersonalDetailsFormValues),
            )
          ) {
            invalidSteps.push(i);
            setTouchedSteps((prev) => [...new Set([...prev, i])]);
          }
        }
      }
      setIncompleteSteps(invalidSteps);
      setIsConfirmModalOpen(true);
    }
  };

  const handlePrev = async () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setTouchedSteps((prev) => [...new Set([...prev, prevStep, currentStep])]);
      setCurrentStep(prevStep);
    }
  };

  if (isLoadingDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-muted-foreground font-medium">
            Loading details...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto max-w-[1400px]">
      {/* Single card containing Timeline (left) + Form (right) */}
      <div className="bg-card/90 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] ring-1 ring-border/50 border-t-[6px] border-t-brand-primary flex relative overflow-hidden">
        {/* ── Left: Timeline sidebar inside the card ── */}
        <div
          id="personal-details-timeline"
          className="hidden md:flex flex-col shrink-0 border-r border-border/40 bg-brand-primary/[0.03] px-5 py-8 sticky top-0 self-start min-h-full"
        >
          <Timeline
            totalSteps={totalSteps}
            currentStep={currentStep}
            touchedSteps={touchedSteps}
            isStepValid={isStepValid}
            onStepClick={(targetStep) => {
              setTouchedSteps((prev) => [
                ...new Set([...prev, currentStep, targetStep]),
              ]);
              setCurrentStep(targetStep);
            }}
          />
        </div>

        {/* ── Right: Form content ── */}
        <div className="flex-1 min-w-0 p-8 md:p-10 flex flex-col">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="flex-1 w-full flex flex-col"
          >
            <form.Subscribe selector={(state) => [state.values]}>
              {([values]) => (
                <RealtimeFormValidator form={form} values={values} />
              )}
            </form.Subscribe>
            {/* Header: Title */}
            <div className="flex items-center justify-between border-b border-border/50 pb-5 mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-brand-primary/20 to-brand-primary/5 flex items-center justify-center text-brand-primary shadow-inner">
                  {(() => {
                    const CurrentIcon =
                      STEP_CONTENT[currentStep - 1]?.icon || User;
                    return <CurrentIcon size={24} strokeWidth={2.5} />;
                  })()}
                </div>
                <div>
                  <Typography
                    variant="h3"
                    className="mb-1 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent font-bold"
                  >
                    {STEP_CONTENT[currentStep - 1]?.title}
                  </Typography>
                  <Typography variant="body2" color="muted">
                    {STEP_CONTENT[currentStep - 1]?.subtitle}
                  </Typography>
                </div>
              </div>

              {!isAdmin && (
                <button
                  id="personal-details-help-trigger"
                  type="button"
                  onClick={() => runTourManually()}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-2xl border border-brand-primary/30 bg-brand-primary/5 hover:bg-brand-primary/10 text-brand-primary font-bold text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer active:scale-95 hover:border-brand-primary/50 shrink-0"
                  title="Quick Guide"
                >
                  <HelpCircle className="h-4 w-4 text-brand-primary" />
                  <span className="hidden sm:inline">Quick Guide</span>
                </button>
              )}
            </div>

            {/* Step content */}
            <div
              id="personal-details-form-content"
              className="flex-1 w-full relative"
            >
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <PersonalDetailsStep
                    key="step1"
                    form={form as unknown as PersonalDetailsForm}
                    registeredMobile={registeredMobile}
                    registeredEmail={registeredEmail}
                  />
                )}
                {currentStep === 2 && (
                  <PersonalDetailsPart2Step
                    key="step2"
                    form={form as unknown as PersonalDetailsForm}
                  />
                )}
                {currentStep === 3 && (
                  <FamilyDetailsStep
                    key="step3"
                    form={form as unknown as PersonalDetailsForm}
                  />
                )}
                {currentStep === 4 && (
                  <SourceOfInformationStep
                    key="step4"
                    form={form as unknown as PersonalDetailsForm}
                  />
                )}
                {currentStep === 5 && (
                  <EducationDetailsStep
                    key="step5"
                    form={form as unknown as PersonalDetailsForm}
                  />
                )}
                {currentStep === 6 && (
                  <WorkExperienceStep
                    key="step6"
                    form={form as unknown as PersonalDetailsForm}
                  />
                )}
                {currentStep === 7 && (
                  <OtherDetailsStep
                    key="step7"
                    form={form as unknown as PersonalDetailsForm}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Navigation Buttons (Bottom Right) */}
            <div
              id="personal-details-nav-actions"
              className="flex items-center justify-end gap-3 mt-8 pt-5 border-t border-border/50"
            >
              {currentStep > 1 && (
                <Button
                  type="button"
                  color="primary"
                  size="md"
                  animate="scale"
                  shadow
                  disabled={isSaving}
                  onClick={handlePrev}
                  className="px-6 text-sm font-semibold group flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                  PREVIOUS
                </Button>
              )}

              <Button
                type="button"
                color="primary"
                size="md"
                animate="scale"
                shadow
                disabled={isSaving}
                onClick={handleNext}
                className="px-6 text-sm font-semibold group flex items-center gap-2"
              >
                {isSaving ? (
                  "SAVING..."
                ) : currentStep === totalSteps ? (
                  isAdmin ? (
                    "UPDATE USER DETAILS"
                  ) : (
                    "SUBMIT DETAILS"
                  )
                ) : (
                  <>
                    NEXT
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <SubmitModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onSubmit={handleFinalSubmit}
        isSubmitting={isSaving}
        incompleteSteps={incompleteSteps}
      />
    </div>
  );
}

// Helper component to run real-time Zod validation on value changes cleanly without violating Rules of Hooks
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function RealtimeFormValidator({ form, values }: { form: any; values: any }) {
  React.useEffect(() => {
    const result = personalDetailsSchema.safeParse(values);
    const issueMap = new Map<string, string>();

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        let fieldPath = "";
        issue.path.forEach((p, idx) => {
          if (typeof p === "number") {
            fieldPath += `[${p}]`;
          } else {
            fieldPath += idx === 0 ? p : `.${p}`;
          }
        });
        if (!issueMap.has(fieldPath)) {
          issueMap.set(fieldPath, issue.message);
        }
      });
    }

    const fieldMeta = form.state.fieldMeta || {};

    // 1. Clear or update errors for all existing registered fields
    Object.keys(fieldMeta).forEach((fieldPath) => {
      const currentMeta = fieldMeta[fieldPath];
      const newError = issueMap.get(fieldPath);

      if (newError) {
        if (currentMeta?.errors?.[0] !== newError) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          form.setFieldMeta(fieldPath as any, (meta: any) => ({
            ...meta,
            errorMap: { ...meta?.errorMap, realtime: newError },
            errors: [newError],
          }));
        }
      } else {
        if (
          (currentMeta?.errors && currentMeta.errors.length > 0) ||
          (currentMeta?.errorMap &&
            Object.keys(currentMeta.errorMap).length > 0)
        ) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          form.setFieldMeta(fieldPath as any, (meta: any) => ({
            ...meta,
            errorMap: {},
            errors: [],
          }));
        }
      }
    });
  }, [form, values]);

  return null;
}
