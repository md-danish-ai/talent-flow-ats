"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { Button } from "@components/ui-elements/Button";
import { Modal } from "@components/ui-elements/Modal";
import { Typography } from "@components/ui-elements/Typography";
import { Check, CheckCircle2, X } from "lucide-react";
import { useRouter } from "next/navigation";

import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import {
  personalDetailsSchema,
  type PersonalDetailsFormValues,
} from "@lib/validations/personal-details";

import { PersonalDetailsStep } from "./components/PersonalDetailsStep";
import { FamilyDetailsStep } from "./components/FamilyDetailsStep";
import { SourceOfInformationStep } from "./components/SourceOfInformationStep";
import { EducationDetailsStep } from "./components/EducationDetailsStep";
import { WorkExperienceStep } from "./components/WorkExperienceStep";
import { OtherDetailsStep } from "./components/OtherDetailsStep";

const stepFields: Record<number, (keyof PersonalDetailsFormValues)[]> = {
  1: [
    "firstName",
    "lastName",
    "gender",
    "dob",
    "mobile1",
    "email",
    "presentAddressLine1",
    "presentState",
    "presentDistrict",
    "presentCity",
    "presentPincode",
    "permanentAddressLine1",
    "permanentState",
    "permanentDistrict",
    "permanentCity",
    "permanentPincode",
  ],
  2: ["family"],
  3: ["interviewedBefore", "workedBefore", "source"],
  4: ["education"],
  5: ["workExp"],
  6: [
    "serviceCommitment",
    "securityDeposit",
    "shiftTime",
    "expectedJoiningDate",
    "expectedSalary",
  ],
};

export default function PersonalDetailsPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [touchedSteps, setTouchedSteps] = useState<number[]>([]);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [incompleteSteps, setIncompleteSteps] = useState<number[]>([]);
  const totalSteps = 6;

  const form = useForm({
    // @ts-expect-error - validatorAdapter exists at runtime but type definition mismatch
    validatorAdapter: zodValidator(),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "Male",
      dob: "",
      mobile1: "",
      mobile2: "",
      email: "",
      presentAddressLine1: "",
      presentAddressLine2: "",
      presentState: "",
      presentDistrict: "",
      presentCity: "",
      presentPincode: "",
      permanentAddressLine1: "",
      permanentAddressLine2: "",
      permanentState: "",
      permanentDistrict: "",
      permanentCity: "",
      permanentPincode: "",
      sameAddress: false,
      family: [
        {
          id: 1,
          relationLabel: "Father",
          relation: "Father",
          name: "",
          occupation: "",
          dependent: "",
        },
        {
          id: 2,
          relationLabel: "Mother",
          relation: "Mother",
          name: "",
          occupation: "",
          dependent: "",
        },
        {
          id: 3,
          relationLabel: "Spouse",
          relation: "Spouse",
          name: "",
          occupation: "",
          dependent: "",
        },
        {
          id: 4,
          relationLabel: "Brother/Sister",
          relation: "",
          name: "",
          occupation: "",
          dependent: "",
        },
        {
          id: 5,
          relationLabel: "Brother/Sister",
          relation: "",
          name: "",
          occupation: "",
          dependent: "",
        },
        {
          id: 6,
          relationLabel: "Brother/Sister",
          relation: "",
          name: "",
          occupation: "",
          dependent: "",
        },
      ],
      interviewedBefore: "",
      workedBefore: "",
      source: {
        campus: false,
        website: false,
        employee: false,
        friends: false,
        newspaper: false,
      },
      education: [
        {
          id: 1,
          type: "10th Std",
          school: "",
          board: "",
          year: "",
          division: "",
          percentage: "",
          medium: "",
        },
        {
          id: 2,
          type: "12th Std",
          school: "",
          board: "",
          year: "",
          division: "",
          percentage: "",
          medium: "",
        },
        {
          id: 3,
          type: "Diploma",
          school: "",
          board: "",
          year: "",
          division: "",
          percentage: "",
          medium: "",
        },
        {
          id: 4,
          type: "Graduation",
          school: "",
          board: "",
          year: "",
          division: "",
          percentage: "",
          medium: "",
        },
        {
          id: 5,
          type: "Post Graduation",
          school: "",
          board: "",
          year: "",
          division: "",
          percentage: "",
          medium: "",
        },
        {
          id: 6,
          type: "Additional Qualification",
          school: "",
          board: "",
          year: "",
          division: "",
          percentage: "",
          medium: "",
        },
      ],
      workExp: [
        {
          id: 1,
          company: "",
          designation: "",
          joinDate: "",
          relieveDate: "",
          reason: "",
          salary: "",
        },
        {
          id: 2,
          company: "",
          designation: "",
          joinDate: "",
          relieveDate: "",
          reason: "",
          salary: "",
        },
        {
          id: 3,
          company: "",
          designation: "",
          joinDate: "",
          relieveDate: "",
          reason: "",
          salary: "",
        },
        {
          id: 4,
          company: "",
          designation: "",
          joinDate: "",
          relieveDate: "",
          reason: "",
          salary: "",
        },
      ],
      serviceCommitment: "",
      securityDeposit: "",
      shiftTime: "",
      expectedJoiningDate: "",
      expectedSalary: "",
    } as PersonalDetailsFormValues,
    validators: {
      onChange: personalDetailsSchema,
      onBlur: personalDetailsSchema,
    },
    onSubmit: async ({ value }) => {
      console.log("Submitting form data", value);
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

  const renderTimeline = () => {
    return (
      <div className="flex items-center justify-center mb-6 w-full max-w-3xl mx-auto">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const step = index + 1;
          const isActive = step === currentStep;
          const isAttempted = touchedSteps.includes(step) || step < currentStep;
          const isCompleted = isAttempted && !isActive;
          const isValid = isStepValid(step);
          const hasError = !isValid;

          // Decide what to show in the circle
          let icon = <span>{step}</span>;
          let bgColor = "border-border bg-card text-muted-foreground shadow-sm";

          if (isActive) {
            bgColor =
              "border-brand-primary bg-brand-primary text-white shadow-md ring-4 ring-brand-primary/10";
          } else if (hasError && isAttempted) {
            icon = <X size={16} />;
            bgColor =
              "border-red-500 bg-red-500 text-white ring-2 ring-red-500/20 shadow-lg shadow-red-500/20";
          } else if (isValid && isCompleted) {
            icon = <Check size={16} />;
            bgColor =
              "border-brand-success bg-brand-success text-white ring-2 ring-brand-success/20";
          }

          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center relative">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 z-10 ${bgColor}`}
                >
                  {icon}
                </div>
              </div>
              {step < totalSteps && (
                <div
                  className={`flex-1 h-1 transition-colors duration-300 mx-1 ${
                    isCompleted && isValid ? "bg-brand-success" : "bg-border"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  // Removed updateField as we now use TanStack Form
  // const updateField = (field: string, value: unknown) => {
  //   setFormData((prev) => ({ ...prev, [field]: value as never }));
  // };

  return (
    <div className="min-h-screen bg-layout-bg flex items-start justify-center py-10 px-4 md:px-12 transition-colors">
      <div className="w-full mx-auto max-w-[1400px]">
        {renderTimeline()}
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
                  className="px-10 text-sm font-semibold"
                >
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
                className="px-10 text-sm font-semibold"
              >
                {currentStep === totalSteps ? "SUBMIT DETAILS" : "NEXT"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        className="max-w-xl"
      >
        <div className="flex flex-col items-center py-6 w-full">
          {incompleteSteps.length > 0 ? (
            <div className="flex flex-col items-center w-full">
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 ring-8 ring-red-500/5">
                <X size={48} className="text-red-500" />
              </div>

              <div className="text-center space-y-3 mb-8">
                <Typography
                  variant="h2"
                  weight="bold"
                  className="text-gray-900"
                >
                  Incomplete Details
                </Typography>
                <Typography
                  variant="body1"
                  className="text-muted-foreground px-4"
                >
                  Please complete the following timelines before submitting:
                  <br />
                  <span className="font-semibold text-red-600">
                    {incompleteSteps
                      .map((step) => {
                        const stepNames: Record<number, string> = {
                          1: "Personal Details",
                          2: "Family Details",
                          3: "Source of Information",
                          4: "Education Details",
                          5: "Work Experience",
                          6: "Other Details",
                        };
                        return stepNames[step] || `Timeline ${step}`;
                      })
                      .join(", ")}
                  </span>
                </Typography>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  color="primary"
                  size="md"
                  animate="scale"
                  shadow
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="px-10 text-sm font-semibold"
                >
                  Go Back & Complete
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full">
              <div className="w-20 h-20 bg-brand-success/10 rounded-full flex items-center justify-center mb-6 ring-8 ring-brand-success/5">
                <CheckCircle2 size={48} className="text-brand-success" />
              </div>

              <div className="text-center space-y-3 mb-8">
                <Typography
                  variant="h2"
                  weight="bold"
                  className="text-gray-900"
                >
                  Confirm Submission
                </Typography>
                <Typography
                  variant="body1"
                  className="text-muted-foreground px-4"
                >
                  Are you sure you want to submit your details?
                  <br />
                  Please verify all information before proceeding.
                </Typography>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  color="primary"
                  size="md"
                  animate="scale"
                  shadow
                  onClick={() => setIsConfirmModalOpen(false)}
                  className="px-10 text-sm font-semibold"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  color="primary"
                  size="md"
                  animate="scale"
                  shadow
                  onClick={() => {
                    setIsConfirmModalOpen(false);
                    form.handleSubmit();
                  }}
                  className="px-10 text-sm font-semibold"
                >
                  Yes, Submit
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
