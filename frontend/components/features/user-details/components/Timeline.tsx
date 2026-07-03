import React from "react";
import { Check, X } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@lib/utils";

export interface TimelineProps {
  totalSteps: number;
  currentStep: number;
  touchedSteps: number[];
  isStepValid: (step: number) => boolean;
}

const STEP_LABELS = [
  "Personal",
  "Identity",
  "Family",
  "Source",
  "Education",
  "Experience",
  "Others",
];

export function Timeline({
  totalSteps,
  currentStep,
  touchedSteps,
  isStepValid,
}: TimelineProps) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-10 mt-4 px-4 sm:px-8">
      {/* Glassmorphic Container for the timeline */}
      <div className="relative px-6 rounded-[2rem] bg-card/60 backdrop-blur-xl border border-border/50 shadow-sm flex items-center justify-between">
        {/* Progress Background Line */}
        <div className="absolute left-[3rem] right-[3rem] top-1/2 -translate-y-1/2 h-[3px] bg-secondary/50 rounded-full z-0" />

        {/* Dynamic Progress Filled Line */}
        <motion.div
          className="absolute left-[3rem] top-1/2 -translate-y-1/2 h-[3px] bg-gradient-to-r from-brand-primary to-brand-accent rounded-full z-0"
          initial={{ width: "0%" }}
          animate={{
            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

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
          let labelColor = "text-muted-foreground";

          if (isActive) {
            bgColor =
              "border-brand-primary bg-brand-primary text-white shadow-[0_0_15px_rgba(var(--brand-primary),0.5)] ring-4 ring-brand-primary/20";
            labelColor = "text-foreground font-semibold";
          } else if (hasError && isAttempted) {
            icon = <X size={16} strokeWidth={3} />;
            bgColor =
              "border-destructive bg-destructive text-destructive-foreground shadow-[0_0_15px_rgba(var(--destructive),0.5)] ring-4 ring-destructive/20";
            labelColor = "text-destructive font-semibold";
          } else if (isValid && isCompleted) {
            icon = <Check size={16} strokeWidth={3} />;
            bgColor =
              "border-brand-success bg-brand-success text-brand-success-foreground shadow-[0_0_10px_rgba(var(--brand-success),0.3)] ring-2 ring-brand-success/20";
            labelColor = "text-foreground font-medium";
          }

          return (
            <div
              key={step}
              className="flex flex-col items-center relative z-10 gap-3 group"
            >
              <motion.div
                initial={false}
                animate={{
                  scale: isActive ? 1.15 : 1,
                  y: isActive ? -2 : 0,
                }}
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300",
                  bgColor,
                )}
              >
                {icon}
              </motion.div>

              <motion.span
                animate={{
                  y: isActive ? 2 : 0,
                  opacity: isActive || isCompleted ? 1 : 0.6,
                }}
                className={cn(
                  "absolute -bottom-8 text-[11px] sm:text-xs whitespace-nowrap transition-colors duration-300",
                  labelColor,
                )}
              >
                {STEP_LABELS[index] || `Step ${step}`}
              </motion.span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
