import type { DriveStep } from "driver.js";

export const TOUR_STORAGE_KEYS = {
  ONBOARDING: (userId: string | number) => `tour_onboarding_${userId}`,
  REINTERVIEW: (userId: string | number) => `tour_reinterview_${userId}`,
  PERSONAL_DETAILS: (userId: string | number) =>
    `tour_personal_details_${userId}`,
  INTERVIEW_OVERVIEW: (userId: string | number) =>
    `tour_interview_overview_${userId}`,
  ACTIVE_TEST: (userId: string | number) => `tour_active_test_${userId}`,
};

/**
 * 1. Newly Registered User Tour Steps (Dashboard)
 * 1. Welcome
 * 2. Light / Dark Mode
 * 3. User Profile
 * 4. Step 1: Personal Details
 * 5. Step 2: Cross-check Submission Details
 * 6. Step 3: Online Assessment
 * 7. Quick Tour
 */
export const ONBOARDING_TOUR_STEPS: DriveStep[] = [
  {
    element: "#user-dashboard-header",
    popover: {
      title: "👋 Welcome to TalentFlow",
      description:
        "This is your candidate dashboard. Here you can track and complete each phase of your application lifecycle.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#theme-toggle",
    popover: {
      title: "☀️ Light & Dark Mode",
      description:
        "Switch between light and dark themes anytime for a comfortable visual experience.",
      side: "bottom",
      align: "end",
    },
  },
  {
    element: "#user-profile-menu",
    popover: {
      title: "👤 Candidate Profile",
      description:
        "Access your account details, manage your profile, and sign out securely from here.",
      side: "bottom",
      align: "end",
    },
  },
  {
    element: "#step-card-personal-details",
    popover: {
      title: "📝 Step 1: Personal Details",
      description:
        "Start by filling in your contact details, education, and work experience. This step is mandatory before taking the test.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#step-submission-button",
    popover: {
      title: "🔍 Step 2: Review Submission Details",
      description:
        "Once Step 1 is completed, this button activates. You can cross-check and review all your submitted information here.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#step-card-interview-test",
    popover: {
      title: "🎯 Step 3: Online Assessment",
      description:
        "Your Round-1 technical test unlocks after profile submission. Click here to enter the test room and start your assessment.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#tour-help-trigger",
    popover: {
      title: "💡 Quick Tour & Help",
      description:
        "Need a quick reminder? Click this button anytime to replay the guide and review the steps.",
      side: "bottom",
      align: "end",
    },
  },
];

/**
 * 2. Re-Interview / Completed Details Candidate Tour Steps (Dashboard)
 * 1. Dashboard Overview
 * 2. Light / Dark Mode
 * 3. Candidate Profile
 * 4. Step 1: Submission Details (Review)
 * 5. Step 2: Personal Details (Locked)
 * 6. Step 3: Online Assessment (Unlocked & Ready)
 * 7. Quick Tour & Help
 */
export const REINTERVIEW_TOUR_STEPS: DriveStep[] = [
  {
    element: "#user-dashboard-header",
    popover: {
      title: "👋 Application Dashboard",
      description:
        "Your profile is submitted. Here is the updated status of your application lifecycle.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#theme-toggle",
    popover: {
      title: "☀️ Light & Dark Mode",
      description:
        "Switch between light and dark themes anytime for a comfortable visual experience.",
      side: "bottom",
      align: "end",
    },
  },
  {
    element: "#user-profile-menu",
    popover: {
      title: "👤 Candidate Profile",
      description:
        "Access your account details, manage your profile, and sign out securely from here.",
      side: "bottom",
      align: "end",
    },
  },
  {
    element: "#step-submission-button",
    popover: {
      title: "🔍 Review Submission Details",
      description:
        "Your personal details are submitted. Click here anytime to cross-check and review all your submitted information.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#step-card-personal-details",
    popover: {
      title: "🔒 Personal Details Cleared",
      description:
        "Your operational data is now locked and verified. No further modifications are required.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#step-card-interview-test",
    popover: {
      title: "🚀 Assessment Ready!",
      description:
        "Your Round-1 Assessment is unlocked! Click here to enter the test room and complete your evaluation.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#tour-help-trigger",
    popover: {
      title: "💡 Quick Tour & Help",
      description:
        "Need a reminder? You can replay the guide and review your next steps anytime by clicking Quick Tour.",
      side: "bottom",
      align: "end",
    },
  },
];

/**
 * 3. Personal Details Multi-Step Form Tour Steps
 */
export const PERSONAL_DETAILS_TOUR_STEPS: DriveStep[] = [
  {
    element: "#personal-details-timeline",
    popover: {
      title: "📌 Application Timeline",
      description:
        "Complete all 7 sections to finalize your candidate profile. Your progress is tracked in real-time.",
      side: "right",
      align: "start",
    },
  },
  {
    element: "#timeline-step-2",
    popover: {
      title: "👆 Direct Step Navigation",
      description:
        "You can directly jump to any section on the timeline just by clicking on it to quickly edit or review your details.",
      side: "right",
      align: "center",
    },
  },
  {
    element: "#personal-details-form-content",
    popover: {
      title: "✍️ Required Information",
      description:
        "Please ensure all mandatory fields marked with an asterisk (*) like contact info, education, and documents are filled accurately.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#personal-details-nav-actions",
    popover: {
      title: "💾 Auto-Save & Next",
      description:
        "Click 'NEXT' to automatically save your current section and move to the next step without losing data.",
      side: "top",
      align: "end",
    },
  },
  {
    element: "#personal-details-help-trigger",
    popover: {
      title: "💡 Form Guide",
      description:
        "Need tips on filling this form? Click here anytime for a quick walkthrough.",
      side: "bottom",
      align: "end",
    },
  },
];

/**
 * 4. Interview Overview / Pre-Test Tour Steps
 */
export const INTERVIEW_OVERVIEW_TOUR_STEPS: DriveStep[] = [
  {
    element: "#interview-overview-title",
    popover: {
      title: "📝 Assessment Paper",
      description:
        "This is your assigned evaluation paper containing questions tailored to your candidate application.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#interview-overview-department",
    popover: {
      title: "🏢 Target Department",
      description:
        "The specific department or business vertical for which this assessment is being conducted.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#interview-overview-level",
    popover: {
      title: "📊 Difficulty Level",
      description:
        "The candidate experience tier (e.g. Fresher / Experienced) targeted by this paper.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#interview-overview-marks",
    popover: {
      title: "🏆 Total Marks",
      description:
        "The maximum aggregate score achievable across all assessment sections combined.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#interview-overview-duration",
    popover: {
      title: "⏳ Overall Duration",
      description:
        "Total time allotted for this test. Your session will automatically submit when this countdown expires.",
      side: "bottom",
      align: "center",
    },
  },
  {
    element: "#interview-overview-sections",
    popover: {
      title: "📑 Section Breakdown",
      description:
        "Review all assigned sections, individual question counts, and section-specific time limits.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#interview-overview-rules",
    popover: {
      title: "📋 Assessment Guidelines",
      description:
        "Read all exam rules carefully. Each section is time-bound and permanently locks once submitted.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#interview-start-btn",
    popover: {
      title: "🚀 Launch Assessment",
      description:
        "When you are in a quiet, stable environment, click 'Start Interview' to enter the test room and begin.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#interview-help-trigger",
    popover: {
      title: "💡 Exam Tips & Guide",
      description:
        "Need a quick reminder on rules or exam protocols? Click this button anytime before starting.",
      side: "bottom",
      align: "end",
    },
  },
];

/**
 * 5. Active Test Screen Tour Steps
 */
export const ACTIVE_TEST_TOUR_STEPS: DriveStep[] = [
  {
    element: "#interview-active-timer",
    popover: {
      title: "⏳ Section Countdown Timer",
      description:
        "Shows the remaining time for your active section. Responses will automatically submit when this timer expires.",
      side: "left",
      align: "center",
    },
  },
  {
    element: "#interview-active-progress",
    popover: {
      title: "📊 Section Progress",
      description:
        "Track which section you are currently completing and your overall exam completion progress.",
      side: "left",
      align: "center",
    },
  },
  {
    element: "#interview-active-status",
    popover: {
      title: "🔒 Section Locking Status",
      description:
        "Shows active, completed, and pending sections. Submitted sections are permanently locked.",
      side: "left",
      align: "start",
    },
  },
  {
    element: "#interview-active-question-badge",
    popover: {
      title: "🔢 Current Question",
      description:
        "Displays your active question number out of the total questions in this section.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#interview-active-question-type",
    popover: {
      title: "🏷️ Question Mode & Subject",
      description:
        "Indicates the question category (e.g. Passage Content, MCQ, Typing) and corresponding subject area.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#interview-active-instruction",
    popover: {
      title: "📋 Question Instructions",
      description:
        "Review any section-specific instructions or criteria before submitting your answer.",
      side: "bottom",
      align: "start",
    },
  },
  {
    element: "#interview-active-workspace-content",
    popover: {
      title: "✍️ Answering Workspace",
      description:
        "Select choices, type text, or complete tasks in this dedicated workspace.",
      side: "top",
      align: "center",
    },
  },
  {
    element: "#interview-active-nav-actions",
    popover: {
      title: "💾 Save & Next Navigation",
      description:
        "Use 'Previous' to revisit earlier questions within this section, or 'Save & Next' to record your response and proceed.",
      side: "top",
      align: "end",
    },
  },
  {
    element: "#interview-active-help-trigger",
    popover: {
      title: "💡 Test Guide",
      description:
        "Need a quick reminder on how the test workspace works? Click this guide button anytime during the exam.",
      side: "bottom",
      align: "end",
    },
  },
];
