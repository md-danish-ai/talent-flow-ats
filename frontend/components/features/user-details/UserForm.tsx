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
} from "lucide-react";
import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import {
  personalDetailsSchema,
  type PersonalDetailsFormValues,
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

const sanitizeStr = (val: unknown, fallback = ""): string => {
  if (val === null || val === undefined) return fallback;
  const s = String(val).trim();
  return s || fallback;
};

const sanitizeFamily = (familyArr: unknown[]): FamilyMember[] => {
  const sanitized = (familyArr || []).map((m) => {
    const member = m as Record<string, unknown>;
    return {
      ...member,
      relation: sanitizeStr(member.relation),
      name: sanitizeStr(member.name),
      occupation: sanitizeStr(member.occupation),
      dependent: sanitizeStr(member.dependent),
      contactNo: sanitizeStr(member.contactNo),
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
    let startYear = sanitizeStr(item.startYear);
    let endYear = sanitizeStr(item.endYear);

    // Fallback: parse from 'year' if missing
    const yearStr = sanitizeStr(item.year);
    if (!startYear && !endYear && yearStr && yearStr.includes("-")) {
      const parts = yearStr.split("-");
      startYear = parts[0] || "";
      endYear = parts[1] || "";
    }

    return {
      ...item,
      type: sanitizeStr(item.type),
      school: sanitizeStr(item.school),
      board: sanitizeStr(item.board),
      startYear,
      endYear,
      division: sanitizeStr(item.division),
      percentage: sanitizeStr(item.percentage),
      medium: sanitizeStr(item.medium),
      details: sanitizeStr(item.details),
    };
  }) as Education[];

  // Filter out extra blank rows (beyond the first 2) that were saved previously
  return sanitized.filter((e, index) => {
    if (index < 2) return true;
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
        e.type === "Additional Qualification" ||
        e.type === "Diploma" ||
        e.type === "Graduation");
    return !isBlank;
  });
};

const sanitizeWorkExp = (arr: unknown[]): WorkExperience[] => {
  return (arr || []).map((i) => {
    const item = i as Record<string, unknown>;
    return {
      ...item,
      company: sanitizeStr(item.company),
      employmentType: sanitizeStr(item.employmentType),
      designation: sanitizeStr(item.designation),
      joinDate: sanitizeStr(item.joinDate),
      relieveDate: sanitizeStr(item.relieveDate),
      reason: sanitizeStr(item.reason),
      salary: sanitizeStr(item.salary),
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

  // For User Portal (Self)
  const { data: selfDetails, isLoading: isLoadingSelf } = useUserDetails();

  // Registered mobile and email from session
  const { data: currentUser } = useMe();
  const registeredMobile = currentUser?.mobile ?? "";
  const registeredEmail = currentUser?.email ?? "";

  // Choose data source: Prop initialData -> SSR data -> Client-side fetch "me"
  const existingDetails = initialData || selfDetails;
  const isLoadingDetails = !initialData && !userId && isLoadingSelf;

  const { mutateAsync: saveDetails, isPending: isAdding } =
    useSaveUserDetails();
  const { mutateAsync: updateDetails, isPending: isUpdating } =
    useUpdateUserDetails();

  const isSaving = isAdding || isUpdating;

  const initialValues = React.useMemo(() => {
    if (initialData && initialData.personalDetails) {
      const p = initialData.personalDetails;
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
        bloodGroup: initialData.additionalPersonalDetails?.bloodGroup || "",
        aadhaarNo: initialData.additionalPersonalDetails?.aadhaarNo || "",
        nameAsPerAadhaar:
          initialData.additionalPersonalDetails?.nameAsPerAadhaar || "",
        panNo: initialData.additionalPersonalDetails?.panNo || "",
        nameAsPerPan: initialData.additionalPersonalDetails?.nameAsPerPan || "",
        religion: initialData.additionalPersonalDetails?.religion || "",
        category: initialData.additionalPersonalDetails?.category || "",
        maritalStatus:
          initialData.additionalPersonalDetails?.maritalStatus || "",
        anniversaryDate:
          initialData.additionalPersonalDetails?.anniversaryDate || "",
        emergencyContactRelation: initialData.emergency_contact_relation || "",
        assignedEmergencyRelation:
          initialData.assigned_emergency_relation || "",
        family: (() => {
          const defaultFamily =
            initialData.familyDetails?.length > 0
              ? sanitizeFamily(initialData.familyDetails)
              : [...defaultPersonalDetailsValues.family];
          const assignedCode = initialData.assigned_emergency_relation;
          if (
            assignedCode &&
            !defaultFamily.some((f) => f.relation === assignedCode)
          ) {
            defaultFamily.push({
              id: Date.now(),
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
          return defaultFamily;
        })(),
        interviewedBefore: sanitizeStr(
          initialData.sourceOfInformation?.interviewedBefore,
          "No",
        ),
        workedBefore: sanitizeStr(
          initialData.sourceOfInformation?.workedBefore,
          "No",
        ),
        source: {
          campus: Boolean(initialData.sourceOfInformation?.source?.campus),
          website: Boolean(initialData.sourceOfInformation?.source?.website),
          employee: Boolean(initialData.sourceOfInformation?.source?.employee),
          friends: Boolean(initialData.sourceOfInformation?.source?.friends),
          newspaper: Boolean(
            initialData.sourceOfInformation?.source?.newspaper,
          ),
        },
        education:
          initialData.educationDetails?.length > 0
            ? sanitizeEducation(initialData.educationDetails)
            : defaultPersonalDetailsValues.education,
        workExp:
          initialData.workExperienceDetails?.length > 0
            ? sanitizeWorkExp(initialData.workExperienceDetails)
            : defaultPersonalDetailsValues.workExp,
        ...(initialData.otherDetails || {}),
      };
    }
    return {
      ...defaultPersonalDetailsValues,
      primaryMobile: registeredMobile,
      email: registeredEmail,
    };
  }, [initialData, registeredMobile, registeredEmail]);

  const form = useForm({
    // @ts-expect-error - validatorAdapter exists at runtime but type definition mismatch
    validatorAdapter: zodValidator(),
    defaultValues: initialValues,
    validators: {
      onChange: personalDetailsSchema,
      onBlur: personalDetailsSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const formattedData: UserDetails = {
          is_submitted: true,
          is_interview_submitted:
            existingDetails?.is_interview_submitted ?? false,
          personalDetails: {
            firstName: value.firstName,
            lastName: value.lastName,
            gender: value.gender,
            dob: value.dob,
            primaryMobile: value.primaryMobile,
            alternateMobile: value.alternateMobile,
            email: value.email,
            presentAddressLine1: value.presentAddressLine1,
            presentAddressLine2: value.presentAddressLine2,
            presentState: value.presentState,
            presentDistrict: value.presentDistrict,
            presentCity: value.presentCity,
            presentPincode: value.presentPincode,
            permanentAddressLine1: value.sameAddress
              ? value.presentAddressLine1
              : value.permanentAddressLine1,
            permanentAddressLine2: value.sameAddress
              ? value.presentAddressLine2
              : value.permanentAddressLine2,
            permanentState: value.sameAddress
              ? value.presentState
              : value.permanentState,
            permanentDistrict: value.sameAddress
              ? value.presentDistrict
              : value.permanentDistrict,
            permanentCity: value.sameAddress
              ? value.presentCity
              : value.permanentCity,
            permanentPincode: value.sameAddress
              ? value.presentPincode
              : value.permanentPincode,
            sameAddress: value.sameAddress,
          },
          additionalPersonalDetails: {
            bloodGroup: value.bloodGroup,
            aadhaarNo: value.aadhaarNo,
            nameAsPerAadhaar: value.nameAsPerAadhaar,
            panNo: value.panNo,
            nameAsPerPan: value.nameAsPerPan,
            religion: value.religion,
            category: value.category,
            maritalStatus: value.maritalStatus,
            anniversaryDate: value.anniversaryDate,
          },
          familyDetails: value.family,
          sourceOfInformation: {
            interviewedBefore: value.interviewedBefore,
            workedBefore: value.workedBefore,
            source: value.source,
          },
          educationDetails: value.education.map((edu, index) => ({
            id: edu.id ?? index + 1,
            type: edu.type,
            school: edu.school,
            board: edu.board,
            year: `${edu.startYear}-${edu.endYear}`,
            division: edu.division,
            percentage: edu.percentage,
            medium: edu.medium,
            details: edu.details,
          })),
          workExperienceDetails: value.workExp,
          otherDetails: {
            serviceCommitment: value.serviceCommitment,
            securityDeposit: value.securityDeposit,
            shiftTime: value.shiftTime,
            expectedJoiningDate: value.expectedJoiningDate,
            expectedSalary: value.expectedSalary,
          },
          emergency_contact_relation: value.emergencyContactRelation,
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
        // Define interface for backend validation errors to avoid 'any' lint errors
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
              (meta) => ({
                ...meta,
                errors: [err.msg],
                isTouched: true,
              }),
            );
          });
        }
      }
    },
  });

  // Pre-populate form when existing details are loaded (primarily for self-portal via React Query)
  useEffect(() => {
    if (!initialData && selfDetails && !initializedRef.current) {
      const details = selfDetails as unknown as UserDetails;
      if (!details.personalDetails) return;
      initializedRef.current = true; // Prevent future resets from background fetches
      const p = details.personalDetails;

      const mappedSource = {
        campus: Boolean(details.sourceOfInformation?.source?.campus),
        website: Boolean(details.sourceOfInformation?.source?.website),
        employee: Boolean(details.sourceOfInformation?.source?.employee),
        friends: Boolean(details.sourceOfInformation?.source?.friends),
        newspaper: Boolean(details.sourceOfInformation?.source?.newspaper),
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
        emergencyContactRelation: details.emergency_contact_relation || "",
        assignedEmergencyRelation: details.assigned_emergency_relation || "",
        family: (() => {
          const defaultFamily =
            details.familyDetails?.length > 0
              ? sanitizeFamily(details.familyDetails)
              : [...defaultPersonalDetailsValues.family];
          const assignedCode = details.assigned_emergency_relation;
          if (
            assignedCode &&
            !defaultFamily.some((f) => f.relation === assignedCode)
          ) {
            defaultFamily.push({
              id: Date.now(),
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
          return defaultFamily;
        })(),
        interviewedBefore: sanitizeStr(
          details.sourceOfInformation?.interviewedBefore,
          "No",
        ),
        workedBefore: sanitizeStr(
          details.sourceOfInformation?.workedBefore,
          "No",
        ),
        source: mappedSource,
        education:
          details.educationDetails?.length > 0
            ? sanitizeEducation(details.educationDetails)
            : defaultPersonalDetailsValues.education,
        workExp:
          details.workExperienceDetails?.length > 0
            ? sanitizeWorkExp(details.workExperienceDetails)
            : defaultPersonalDetailsValues.workExp,
        ...(details.otherDetails || {}),
      });
    }
  }, [selfDetails, initialData, form, registeredMobile]);

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
        <div className="hidden md:flex flex-col shrink-0 border-r border-border/40 bg-brand-primary/[0.03] px-5 py-8 sticky top-0 self-start min-h-full">
          <Timeline
            totalSteps={totalSteps}
            currentStep={currentStep}
            touchedSteps={touchedSteps}
            isStepValid={isStepValid}
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
            {/* Header: Title on Left, Buttons on Right */}
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

              {/* Navigation Buttons */}
              <div className="flex items-center gap-3">
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
            </div>

            {/* Step content */}
            <div className="flex-1 w-full relative">
              <AnimatePresence mode="wait">
                {currentStep === 1 && (
                  <PersonalDetailsStep
                    key="step1"
                    form={form}
                    registeredMobile={registeredMobile}
                    registeredEmail={registeredEmail}
                  />
                )}
                {currentStep === 2 && (
                  <PersonalDetailsPart2Step key="step2" form={form} />
                )}
                {currentStep === 3 && (
                  <FamilyDetailsStep key="step3" form={form} />
                )}
                {currentStep === 4 && (
                  <SourceOfInformationStep key="step4" form={form} />
                )}
                {currentStep === 5 && (
                  <EducationDetailsStep key="step5" form={form} />
                )}
                {currentStep === 6 && (
                  <WorkExperienceStep key="step6" form={form} />
                )}
                {currentStep === 7 && (
                  <OtherDetailsStep key="step7" form={form} />
                )}
              </AnimatePresence>
            </div>
          </form>
        </div>
      </div>

      <SubmitModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onSubmit={form.handleSubmit}
        incompleteSteps={incompleteSteps}
      />
    </div>
  );
}
