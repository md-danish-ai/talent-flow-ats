"use client";

import { useEffect, useCallback } from "react";
import type { CurrentUser } from "@lib/auth/user-utils";
import {
  ONBOARDING_TOUR_STEPS,
  REINTERVIEW_TOUR_STEPS,
  PERSONAL_DETAILS_TOUR_STEPS,
  INTERVIEW_OVERVIEW_TOUR_STEPS,
  ACTIVE_TEST_TOUR_STEPS,
  TOUR_STORAGE_KEYS,
} from "./config";
import { startTourWithSteps } from "./driver";

export interface UseUserTourProps {
  user: CurrentUser | null;
  isDetailsComplete: boolean;
  isInterviewSubmitted: boolean;
  activeInterviewStatus?: {
    has_attempt: boolean;
    status: string | null;
    is_expired: boolean;
    attempt_id?: number | null;
  };
}

/**
 * 1. Hook for User Dashboard Tour
 */
export function useUserTour({
  user,
  isDetailsComplete,
  isInterviewSubmitted,
}: UseUserTourProps) {
  const runTourManually = useCallback(
    (forceType?: "onboarding" | "reinterview") => {
      if (!user?.id) return;

      const type =
        forceType || (!isDetailsComplete ? "onboarding" : "reinterview");
      const steps =
        type === "onboarding" ? ONBOARDING_TOUR_STEPS : REINTERVIEW_TOUR_STEPS;

      startTourWithSteps({ steps });
    },
    [user?.id, isDetailsComplete],
  );

  useEffect(() => {
    if (!user?.id) return;

    if (isInterviewSubmitted) {
      return;
    }

    const timer = setTimeout(() => {
      if (!isDetailsComplete) {
        const onboardingKey = TOUR_STORAGE_KEYS.ONBOARDING(user.id);
        const hasSeenOnboarding = localStorage.getItem(onboardingKey);

        if (!hasSeenOnboarding) {
          startTourWithSteps({
            steps: ONBOARDING_TOUR_STEPS,
            onDestroyed: () => {
              localStorage.setItem(onboardingKey, "true");
            },
          });
        }
        return;
      }

      if (isDetailsComplete && !isInterviewSubmitted) {
        const reinterviewKey = TOUR_STORAGE_KEYS.REINTERVIEW(user.id);
        const hasSeenReinterview = localStorage.getItem(reinterviewKey);

        if (!hasSeenReinterview) {
          startTourWithSteps({
            steps: REINTERVIEW_TOUR_STEPS,
            onDestroyed: () => {
              localStorage.setItem(reinterviewKey, "true");
            },
          });
        }
      }
    }, 700);

    return () => clearTimeout(timer);
  }, [user?.id, isDetailsComplete, isInterviewSubmitted]);

  return {
    runTourManually,
  };
}

/**
 * 2. Hook for Personal Details Form Tour
 */
export function usePersonalDetailsTour(user: CurrentUser | null) {
  const runTourManually = useCallback(() => {
    startTourWithSteps({ steps: PERSONAL_DETAILS_TOUR_STEPS });
  }, []);

  useEffect(() => {
    if (!user?.id || user.role !== "user") return;

    const timer = setTimeout(() => {
      const storageKey = TOUR_STORAGE_KEYS.PERSONAL_DETAILS(user.id);
      const hasSeen = localStorage.getItem(storageKey);

      if (!hasSeen) {
        startTourWithSteps({
          steps: PERSONAL_DETAILS_TOUR_STEPS,
          onDestroyed: () => {
            localStorage.setItem(storageKey, "true");
          },
        });
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [user?.id, user?.role]);

  return {
    runTourManually,
  };
}

/**
 * 3. Hook for Interview Overview / Pre-Test Tour
 */
export function useInterviewOverviewTour(user: CurrentUser | null) {
  const runTourManually = useCallback(() => {
    startTourWithSteps({ steps: INTERVIEW_OVERVIEW_TOUR_STEPS });
  }, []);

  useEffect(() => {
    if (!user?.id || user.role !== "user") return;

    const timer = setTimeout(() => {
      const storageKey = TOUR_STORAGE_KEYS.INTERVIEW_OVERVIEW(user.id);
      const hasSeen = localStorage.getItem(storageKey);

      if (!hasSeen) {
        startTourWithSteps({
          steps: INTERVIEW_OVERVIEW_TOUR_STEPS,
          onDestroyed: () => {
            localStorage.setItem(storageKey, "true");
          },
        });
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [user?.id, user?.role]);

  return {
    runTourManually,
  };
}

/**
 * 4. Hook for Active Test Room Tour
 */
export function useActiveTestTour(user: CurrentUser | null) {
  const runTourManually = useCallback(() => {
    startTourWithSteps({ steps: ACTIVE_TEST_TOUR_STEPS });
  }, []);

  useEffect(() => {
    if (!user?.id || user.role !== "user") return;

    const timer = setTimeout(() => {
      const storageKey = TOUR_STORAGE_KEYS.ACTIVE_TEST(user.id);
      const hasSeen = localStorage.getItem(storageKey);

      if (!hasSeen) {
        startTourWithSteps({
          steps: ACTIVE_TEST_TOUR_STEPS,
          onDestroyed: () => {
            localStorage.setItem(storageKey, "true");
          },
        });
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [user?.id, user?.role]);

  return {
    runTourManually,
  };
}
