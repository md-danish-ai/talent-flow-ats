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

export function PersonalDetailsClient() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [touchedSteps, setTouchedSteps] = useState<number[]>([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [incompleteSteps, setIncompleteSteps] = useState<number[]>([]);
  const totalSteps = 6;

  const form = useForm({
    // @ts-expect-error - validatorAdapter exists at runtime but type definition mismatch
    validatorAdapter: zodValidator(),
    defaultValues: defaultPersonalDetailsValues,
    validators: {
      onChange: personalDetailsSchema,
      onBlur: personalDetailsSchema,
    },
    onSubmit: async ({ value }) => {
      const formattedData = {
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

      console.log("Submitting formatted form data:");
      console.log(JSON.stringify(formattedData, null, 2));

      // Submit to API
      router.push("/user/dashboard");
    },
  });

  const touchStepFields = (step: number) => {
    const fields = stepFields[step];
    if (fields) {
      fields.forEach((field) => {
        form.setFieldMeta(field, (meta) => ({ ...meta, isTouched: true }));
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const val: any = form.getFieldValue(field as any);
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
  };

  useEffect(() => {
    if (touchedSteps.includes(currentStep)) {
      const timer = setTimeout(() => {
        touchStepFields(currentStep);
        form.validateAllFields("change");
      }, 50);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentStep, touchedSteps]);

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
    // Mark current step as attempted
    setTouchedSteps((prev) => [...new Set([...prev, currentStep])]);

    // Touch all fields in the current step to trigger the UI validation (red border/msg)
    touchStepFields(currentStep);

    // Trigger validation logic
    await form.validateAllFields("change");

    // Move to next step (non-blocking) or open confirm modal
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
            // Mark invalid step as touched so if they go back they see errors
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

      // Mark prev step and the step we are leaving as attempted
      setTouchedSteps((prev) => [...new Set([...prev, prevStep, currentStep])]);

      setCurrentStep(prevStep);
    }
  };

  return (
    <div className="min-h-screen bg-layout-bg flex items-start justify-center py-10 px-4 md:px-12 transition-colors">
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
                onClick={handleNext}
                className="px-8 text-sm font-semibold group flex items-center gap-2"
              >
                {currentStep === totalSteps ? (
                  "SUBMIT DETAILS"
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
        onSubmit={form.handleSubmit}
        incompleteSteps={incompleteSteps}
      />
    </div>
  );
}
