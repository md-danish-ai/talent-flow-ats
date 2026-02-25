"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Button } from "@components/ui-elements/Button";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";

import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import {
  personalDetailsSchema,
  type PersonalDetailsFormValues,
} from "@lib/validations/personal-details";

import { stepFields, defaultPersonalDetailsValues } from "./constants";

import { PersonalDetailsStep } from "./timeline/PersonalDetailsStep";
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
} from "@lib/react-query/user-details/use-user-details";
import type { UserDetails } from "@lib/api/user-details";

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
  const [currentStep, setCurrentStep] = useState(1);
  const [touchedSteps, setTouchedSteps] = useState<number[]>([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [incompleteSteps, setIncompleteSteps] = useState<number[]>([]);
  const totalSteps = 6;

  // For User Portal (Self)
  const { data: selfDetails, isLoading: isLoadingSelf } = useUserDetails();

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
        primaryMobile: p.primaryMobile || "",
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
        family:
          initialData.familyDetails?.length > 0
            ? initialData.familyDetails
            : defaultPersonalDetailsValues.family,
        interviewedBefore:
          initialData.sourceOfInformation?.interviewedBefore || "No",
        workedBefore: initialData.sourceOfInformation?.workedBefore || "No",
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
            ? initialData.educationDetails
            : defaultPersonalDetailsValues.education,
        workExp:
          initialData.workExperienceDetails?.length > 0
            ? initialData.workExperienceDetails
            : defaultPersonalDetailsValues.workExp,
        ...(initialData.otherDetails || {}),
      };
    }
    return defaultPersonalDetailsValues;
  }, [initialData]);

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
          familyDetails: value.family,
          sourceOfInformation: {
            interviewedBefore: value.interviewedBefore,
            workedBefore: value.workedBefore,
            source: value.source,
          },
          educationDetails: value.education,
          workExperienceDetails: value.workExp,
          otherDetails: {
            serviceCommitment: value.serviceCommitment,
            securityDeposit: value.securityDeposit,
            shiftTime: value.shiftTime,
            expectedJoiningDate: value.expectedJoiningDate,
            expectedSalary: value.expectedSalary,
          },
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
          router.push(isAdmin ? "/admin/user-management" : "/user/dashboard");
        }
      } catch (error) {
        console.error("Submission error:", error);
      }
    },
  });

  // Pre-populate form when existing details are loaded (primarily for self-portal via React Query)
  useEffect(() => {
    if (!initialData && selfDetails) {
      const details = selfDetails as unknown as UserDetails;
      if (!details.personalDetails) return;
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
        primaryMobile: p.primaryMobile || "",
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
        family:
          details.familyDetails?.length > 0
            ? details.familyDetails
            : defaultPersonalDetailsValues.family,
        interviewedBefore:
          details.sourceOfInformation?.interviewedBefore || "No",
        workedBefore: details.sourceOfInformation?.workedBefore || "No",
        source: mappedSource,
        education:
          details.educationDetails?.length > 0
            ? details.educationDetails
            : defaultPersonalDetailsValues.education,
        workExp:
          details.workExperienceDetails?.length > 0
            ? details.workExperienceDetails
            : defaultPersonalDetailsValues.workExp,
        ...(details.otherDetails || {}),
      });
    }
  }, [selfDetails, initialData, form]);

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
      <Timeline
        totalSteps={totalSteps}
        currentStep={currentStep}
        touchedSteps={touchedSteps}
        isStepValid={isStepValid}
      />
      <div className="bg-card rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-border border-t-[6px] border-t-brand-primary flex flex-col relative overflow-hidden">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="flex-1 w-full flex flex-col"
        >
          <div className="flex-1 w-full relative">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <PersonalDetailsStep key="step1" form={form} />
              )}
              {currentStep === 2 && (
                <FamilyDetailsStep key="step2" form={form} />
              )}
              {currentStep === 3 && (
                <SourceOfInformationStep key="step3" form={form} />
              )}
              {currentStep === 4 && (
                <EducationDetailsStep key="step4" form={form} />
              )}
              {currentStep === 5 && (
                <WorkExperienceStep key="step5" form={form} />
              )}
              {currentStep === 6 && (
                <OtherDetailsStep key="step6" form={form} />
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 flex justify-end items-center gap-3">
            {currentStep > 1 && (
              <Button
                type="button"
                color="primary"
                size="md"
                animate="scale"
                shadow
                disabled={isSaving}
                onClick={handlePrev}
                className="px-8 text-sm font-semibold group flex items-center gap-2"
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
              className="px-8 text-sm font-semibold group flex items-center gap-2"
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

      <SubmitModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onSubmit={form.handleSubmit}
        incompleteSteps={incompleteSteps}
      />
    </div>
  );
}
