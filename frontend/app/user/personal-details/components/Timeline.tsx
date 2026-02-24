import React from "react";
import { Check, X } from "lucide-react";

export interface TimelineProps {
  totalSteps: number;
  currentStep: number;
  touchedSteps: number[];
  isStepValid: (step: number) => boolean;
}

export function Timeline({
  totalSteps,
  currentStep,
  touchedSteps,
  isStepValid,
}: TimelineProps) {
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
}
