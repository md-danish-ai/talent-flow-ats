"use client";

import React from "react";
import { Check, X } from "lucide-react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { cn } from "@lib/utils";

export interface TimelineProps {
  totalSteps: number;
  currentStep: number;
  touchedSteps: number[];
  isStepValid: (step: number) => boolean;
}

const STEP_META = [
  { label: "Personal" },
  { label: "Identity" },
  { label: "Family" },
  { label: "Source" },
  { label: "Education" },
  { label: "Experience" },
  { label: "Others" },
];

const CARD = 36; // px — the card's rendered width & height

function StepNode({
  step,
  isActive,
  isCompleted,
  hasError,
  isFuture,
  label,
  isLast,
}: {
  step: number;
  isActive: boolean;
  isCompleted: boolean;
  hasError: boolean;
  isFuture: boolean;
  label: string;
  isLast: boolean;
}) {
  const rotateY = useMotionValue(0);

  React.useEffect(() => {
    animate(rotateY, isCompleted && !hasError ? 180 : 0, {
      type: "spring",
      stiffness: 90,
      damping: 20,
    });
  }, [isCompleted, hasError, rotateY]);

  const frontRotate = useTransform(rotateY, [0, 180], [0, 180]);
  const backRotate = useTransform(rotateY, [0, 180], [180, 360]);
  const frontOpacity = useTransform(rotateY, [75, 105], [1, 0]);
  const backOpacity = useTransform(rotateY, [75, 105], [0, 1]);

  return (
    <div className="flex flex-col">
      {/* ── Step row: icon + label ── */}
      <div className="flex items-center gap-3">
        {/*
          Outer wrapper: perspective + fixed size so the 3-D transform works.
          Both faces are absolute-inset-0 — no more double-height problem.
          We add p-2 only as an invisible click target / glow overflow area.
        */}
        <div
          className="relative shrink-0"
          style={{ width: CARD + 12, height: CARD + 12, perspective: 900 }}
        >
          {/* Scale + lift container — centred inside the perspective wrapper */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            animate={{ scale: isActive ? 1.12 : 1, y: isActive ? -2 : 0 }}
            transition={{ type: "spring", stiffness: 220, damping: 26 }}
          >
            {/* Breathing glow */}
            {isActive && (
              <motion.div
                className="absolute inset-0 rounded-xl bg-brand-primary/25 blur-md"
                animate={{ opacity: [0.5, 0.9, 0.5] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}

            {/* Inner flip wrapper — CARD × CARD, both faces absolute */}
            <div className="relative" style={{ width: CARD, height: CARD }}>
              {/* FRONT */}
              <motion.div
                style={{
                  rotateY: frontRotate,
                  opacity: frontOpacity,
                  backfaceVisibility: "hidden",
                }}
                className={cn(
                  "absolute inset-0 flex items-center justify-center rounded-xl border-2 text-sm font-bold",
                  isActive
                    ? "bg-gradient-to-br from-brand-primary to-brand-accent border-brand-primary/50 text-white"
                    : hasError
                      ? "bg-destructive/10 border-destructive/50 text-destructive"
                      : isFuture
                        ? "bg-card border-border/60 text-muted-foreground"
                        : "bg-card border-brand-success/40 text-muted-foreground",
                )}
              >
                {hasError ? (
                  <X size={13} strokeWidth={3} />
                ) : (
                  <span className="leading-none">{step}</span>
                )}
              </motion.div>

              {/* BACK — checkmark */}
              <motion.div
                style={{
                  rotateY: backRotate,
                  opacity: backOpacity,
                  backfaceVisibility: "hidden",
                }}
                className="absolute inset-0 flex items-center justify-center rounded-xl border-2 bg-brand-success border-brand-success/70 text-brand-success-foreground"
              >
                <Check size={14} strokeWidth={3} />
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Label — flex-centred with the card row */}
        <motion.span
          animate={{ opacity: isFuture ? 0.4 : 1 }}
          transition={{ duration: 0.35 }}
          className={cn(
            "text-[13px] font-medium leading-none",
            isActive
              ? "text-brand-primary font-bold"
              : hasError
                ? "text-destructive"
                : isCompleted
                  ? "text-brand-success"
                  : "text-muted-foreground",
          )}
        >
          {label}
        </motion.span>
      </div>

      {/* ── Connector — centred under the card column ── */}
      {!isLast && (
        <div className="flex justify-center" style={{ width: CARD + 12 }}>
          <div className="relative w-[2px] h-5 rounded-full bg-brand-primary/15 overflow-hidden">
            <motion.div
              className="absolute top-0 left-0 right-0 rounded-full bg-gradient-to-b from-brand-primary to-brand-accent"
              animate={{ height: isCompleted ? "100%" : "0%" }}
              transition={{ type: "spring", stiffness: 60, damping: 18 }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export function Timeline({
  totalSteps,
  currentStep,
  touchedSteps,
  isStepValid,
}: TimelineProps) {
  return (
    <div className="w-full">
      <div className="flex flex-col">
        {Array.from({ length: totalSteps }).map((_, index) => {
          const step = index + 1;
          const isActive = step === currentStep;
          const isAttempted = touchedSteps.includes(step) || step < currentStep;
          const isCompleted = isAttempted && !isActive;
          const isValid = isStepValid(step);
          const hasError = !isValid && isAttempted && !isActive;
          const isFuture = !isAttempted && !isActive;
          const isDone = isCompleted && isValid;
          const meta = STEP_META[index] ?? { label: `Step ${step}` };

          return (
            <StepNode
              key={step}
              step={step}
              isActive={isActive}
              isCompleted={isDone}
              hasError={hasError}
              isFuture={isFuture}
              label={meta.label}
              isLast={index === totalSteps - 1}
            />
          );
        })}
      </div>
    </div>
  );
}
