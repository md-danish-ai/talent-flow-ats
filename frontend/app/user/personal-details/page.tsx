"use client";

import React, { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Button } from "@components/ui-elements/Button";
import { Modal } from "@components/ui-elements/Modal";
import { Typography } from "@components/ui-elements/Typography";
import { Check, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

import { PersonalDetailsStep } from "./components/PersonalDetailsStep";
import { FamilyDetailsStep } from "./components/FamilyDetailsStep";
import { SourceOfInformationStep } from "./components/SourceOfInformationStep";
import { EducationDetailsStep } from "./components/EducationDetailsStep";
import { WorkExperienceStep } from "./components/WorkExperienceStep";
import { OtherDetailsStep } from "./components/OtherDetailsStep";

export default function PersonalDetailsPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const totalSteps = 6;

  const [formData, setFormData] = useState({
    // Step 1: Personal Details
    firstName: "",
    lastName: "",
    gender: "",
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

    // Step 2: Family Details
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

    // Step 3: Source of Information
    interviewedBefore: "",
    workedBefore: "",
    source: {
      campus: false,
      website: false,
      employee: false,
      friends: false,
      newspaper: false,
    },

    // Step 4: Education Details
    education: [
      {
        id: 1,
        type: "Additional Qualification",
        school: "",
        board: "",
        year: "",
        division: "",
        percentage: "",
        medium: "",
      },
      {
        id: 2,
        type: "Post Graduation",
        school: "",
        board: "",
        year: "",
        division: "",
        percentage: "",
        medium: "",
      },
      {
        id: 3,
        type: "Graduation",
        school: "",
        board: "",
        year: "",
        division: "",
        percentage: "",
        medium: "",
      },
      {
        id: 4,
        type: "Diploma",
        school: "",
        board: "",
        year: "",
        division: "",
        percentage: "",
        medium: "",
      },
      {
        id: 5,
        type: "12th Std",
        school: "",
        board: "",
        year: "",
        division: "",
        percentage: "",
        medium: "",
      },
      {
        id: 6,
        type: "10th Std",
        school: "",
        board: "",
        year: "",
        division: "",
        percentage: "",
        medium: "",
      },
    ],

    // Step 5: Work Experience Details
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

    // Step 6: Other Details
    serviceCommitment: "",
    securityDeposit: "",
    shiftTime: "",
    expectedJoiningDate: "",
    expectedSalary: "",
  });

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsConfirmModalOpen(true);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = () => {
    console.log("Submitting form data", formData);
    // Submit to API
    router.push("/user/dashboard");
  };

  const renderTimeline = () => {
    return (
      <div className="flex items-center justify-center mb-6 w-full max-w-3xl mx-auto">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const step = index + 1;
          const isActive = step === currentStep;
          const isCompleted = step < currentStep;

          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center relative">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors duration-300 z-10 ${
                    isActive
                      ? "border-brand-primary bg-brand-primary text-white"
                      : isCompleted
                        ? "border-brand-success bg-brand-success text-white"
                        : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  {isCompleted ? <Check size={16} /> : step}
                </div>
              </div>
              {step < totalSteps && (
                <div
                  className={`flex-1 h-1 transition-colors duration-300 ${
                    isCompleted ? "bg-brand-success" : "bg-border"
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  };

  const updateField = (field: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value as never }));
  };

  return (
    <div className="min-h-screen bg-layout-bg flex items-start justify-center py-10 px-4 md:px-12 transition-colors">
      <div className="w-full mx-auto max-w-[1400px]">
        {renderTimeline()}
        <div className="bg-card rounded-[2rem] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] ring-1 ring-border border-t-[6px] border-t-brand-primary flex flex-col relative overflow-hidden">
          <div className="flex-1 w-full relative">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <PersonalDetailsStep
                  key="step1"
                  formData={formData}
                  updateField={updateField}
                />
              )}
              {currentStep === 2 && (
                <FamilyDetailsStep
                  key="step2"
                  formData={formData}
                  updateField={updateField}
                />
              )}
              {currentStep === 3 && (
                <SourceOfInformationStep
                  key="step3"
                  formData={formData}
                  updateField={updateField}
                />
              )}
              {currentStep === 4 && (
                <EducationDetailsStep
                  key="step4"
                  formData={formData}
                  updateField={updateField}
                />
              )}
              {currentStep === 5 && (
                <WorkExperienceStep
                  key="step5"
                  formData={formData}
                  updateField={updateField}
                />
              )}
              {currentStep === 6 && (
                <OtherDetailsStep
                  key="step6"
                  formData={formData}
                  updateField={updateField}
                />
              )}
            </AnimatePresence>
          </div>

          <div className="mt-8 flex justify-end items-center gap-3">
            {currentStep > 1 && (
              <Button
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
        </div>
      </div>

      <Modal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        className="max-w-xl"
      >
        <div className="flex flex-col items-center py-6">
          <div className="w-20 h-20 bg-brand-success/10 rounded-full flex items-center justify-center mb-6 ring-8 ring-brand-success/5">
            <CheckCircle2 size={48} className="text-brand-success" />
          </div>

          <div className="text-center space-y-3 mb-8">
            <Typography variant="h2" weight="bold" className="text-gray-900">
              Confirm Submission
            </Typography>
            <Typography variant="body1" className="text-muted-foreground px-4">
              Are you sure you want to submit your details?
              <br />
              Please verify all information before proceeding.
            </Typography>
          </div>

          <div className="flex gap-4">
            <Button
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
              color="primary"
              size="md"
              animate="scale"
              shadow
              onClick={handleSubmit}
              className="px-10 text-sm font-semibold"
            >
              Yes, Submit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
