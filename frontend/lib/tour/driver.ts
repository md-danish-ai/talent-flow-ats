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
    allowKeyboardControl: true,
    overlayClickBehavior: "close",
    smoothScroll: true,
    stagePadding: 6,
    stageRadius: 10,
    popoverOffset: 14,
    overlayColor: "#030712",
    overlayOpacity: 0.85,
    popoverClass: "talentflow-tour-popover",
    showButtons: ["close", "previous", "next"],
    nextBtnText: "Next →",
    prevBtnText: "← Prev",
    doneBtnText: "Got It! ✓",
    steps: validSteps,
    onPopoverRender: (popover) => {
      // High-visibility Skip Tour button content
      if (popover.closeButton) {
        popover.closeButton.innerHTML =
          "<span>Skip Tour</span> <svg width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'><line x1='18' y1='6' x2='6' y2='18'></line><line x1='6' y1='6' x2='18' y2='18'></line></svg>";
        popover.closeButton.title = "Skip / Close Tour";
        popover.closeButton.setAttribute("aria-label", "Skip Tour");
      }

      // Structure top-bar container to hold Left-aligned Skip Tour button
      if (popover.wrapper) {
        let topBar = popover.wrapper.querySelector<HTMLDivElement>(
          ".talentflow-tour-top-bar",
        );
        if (!topBar) {
          topBar = document.createElement("div");
          topBar.className = "talentflow-tour-top-bar";
          popover.wrapper.insertBefore(topBar, popover.title);
        }

        if (
          popover.closeButton &&
          popover.closeButton.parentElement !== topBar
        ) {
          topBar.appendChild(popover.closeButton);
        }
      }

      // High-visibility footer close/skip button
      const footerCloseBtn = popover.footerButtons?.querySelector(
        ".driver-popover-close-btn",
      );
      if (footerCloseBtn) {
        footerCloseBtn.textContent = "Skip Tour ✕";
        footerCloseBtn.setAttribute("title", "Skip Tour");
      }
    },
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
