import { driver, DriveStep, Config } from "driver.js";
import "./tour.css";

export interface CreateTourOptions {
  steps: DriveStep[];
  onDestroyed?: () => void;
  onHighlightStarted?: (element?: Element) => void;
}

/**
 * Creates and starts a Driver.js tour with TalentFlow ATS branding
 * Automatically scrolls elements into center view smoothly so they are never clipped.
 */
export function startTourWithSteps({
  steps,
  onDestroyed,
  onHighlightStarted,
}: CreateTourOptions) {
  if (typeof window === "undefined") return null;

  // Filter steps to only include elements that exist in the DOM
  const validSteps = steps.filter((step) => {
    if (typeof step.element === "string") {
      const el = document.querySelector(step.element);
      return !!el;
    }
    return true;
  });

  if (validSteps.length === 0) {
    console.warn("No valid tour steps found in DOM.");
    return null;
  }

  const driverConfig: Config = {
    showProgress: true,
    animate: true,
    allowClose: true,
    smoothScroll: true,
    stagePadding: 6,
    stageRadius: 10,
    popoverOffset: 14,
    overlayColor: "#030712",
    overlayOpacity: 0.85,
    popoverClass: "talentflow-tour-popover",
    nextBtnText: "Next →",
    prevBtnText: "← Back",
    doneBtnText: "Got It! ✓",
    steps: validSteps,
    onDestroyed: () => {
      onDestroyed?.();
    },
    onHighlightStarted: (element) => {
      if (
        element &&
        typeof (element as HTMLElement).scrollIntoView === "function"
      ) {
        (element as HTMLElement).scrollIntoView({
          behavior: "smooth",
          block: "center",
          inline: "nearest",
        });
      }
      onHighlightStarted?.(element);
    },
  };

  const driverObj = driver(driverConfig);
  driverObj.drive();

  return driverObj;
}
