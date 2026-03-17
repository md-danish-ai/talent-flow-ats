import type { InterviewSection } from "./types";

const DEFAULT_OVERALL_EXAM_DURATION_MINUTES = 5;
const DEFAULT_INTERVIEW_PAPER_ID = 1;

const resolveOverallExamDurationMinutes = () => {
  const configured = Number(
    process.env.NEXT_PUBLIC_INTERVIEW_TOTAL_DURATION_MINUTES,
  );

  if (!Number.isFinite(configured) || configured <= 0) {
    return DEFAULT_OVERALL_EXAM_DURATION_MINUTES;
  }

  return Math.floor(configured);
};

export const OVERALL_EXAM_DURATION_MINUTES =
  resolveOverallExamDurationMinutes();
export const OVERALL_EXAM_TOTAL_SECONDS = OVERALL_EXAM_DURATION_MINUTES * 60;

const resolveInterviewPaperId = () => {
  const configured = Number(process.env.NEXT_PUBLIC_INTERVIEW_PAPER_ID);
  if (!Number.isFinite(configured) || configured <= 0) {
    return DEFAULT_INTERVIEW_PAPER_ID;
  }
  return Math.floor(configured);
};

export const INTERVIEW_PAPER_ID = resolveInterviewPaperId();

export const DUMMY_SECTIONS: InterviewSection[] = [
  {
    id: "grammar",
    title: "Grammar",
    durationMinutes: 8,
    questions: [
      {
        id: 101,
        type: "MCQ",
        description: "Select the suitable answer out of the given options.",
        questionText:
          "She ______ in Switzerland for ten years when she was a child.",
        options: ["lived", "had lived", "has lived", "was living"],
      },
      {
        id: 102,
        type: "SUBJECTIVE",
        description: "Arrange the words in grammatically correct sequence.",
        questionText: "of / are / afraid / what / you",
      },
    ],
  },
  {
    id: "aptitude",
    title: "Aptitude",
    durationMinutes: 10,
    questions: [
      {
        id: 201,
        type: "MCQ",
        description: "Choose the correct option.",
        questionText:
          "If the marked price is reduced by 20% and then by another 10%, the final reduction is:",
        options: ["28%", "30%", "32%", "18%"],
      },
      {
        id: 202,
        type: "MCQ",
        description: "Choose the correct option.",
        questionText:
          "A train crosses a pole in 15 seconds and a 300m platform in 35 seconds. Train length is:",
        options: ["225m", "300m", "450m", "150m"],
      },
    ],
  },
  {
    id: "comprehension",
    title: "Comprehension",
    durationMinutes: 12,
    questions: [
      {
        id: 301,
        type: "PASSAGE_MCQ",
        description: "Read the passage and answer the question.",
        passage:
          "A worker accidentally dropped a heavy sack on a chicken near a butcher shop. The owner demanded a very high compensation. A magistrate intervened and proposed a practical deal: the owner could keep the worker for two years, but only if he also covered the worker's food and shelter costs. Hearing this, the owner withdrew his demand immediately.",
        questionText:
          "Why did the owner finally withdraw the compensation demand?",
        options: [
          "He was convinced by legal pressure.",
          "He realized the long-term cost would be higher.",
          "He felt sorry for the worker.",
          "The worker paid him privately.",
        ],
      },
      {
        id: 302,
        type: "SUBJECTIVE",
        description: "Write in 2-3 lines.",
        questionText:
          "Summarize the key lesson from the passage in your own words.",
      },
    ],
  },
  {
    id: "written",
    title: "Written",
    durationMinutes: 8,
    questions: [
      {
        id: 401,
        type: "SUBJECTIVE",
        description: "Make a sentence using the following word.",
        questionText: "Resolution",
      },
      {
        id: 402,
        type: "SUBJECTIVE",
        description: "Answer briefly.",
        questionText:
          "Describe one challenge you solved in a team and what role you played.",
      },
    ],
  },
  {
    id: "industry-awareness",
    title: "Industry Awareness",
    durationMinutes: 7,
    questions: [
      {
        id: 501,
        type: "IMAGE_MCQ",
        description: "Identify the brand associated with the shown logo.",
        questionText: "Choose the correct brand name from below.",
        imageUrl: "/blue_ag.png",
        options: ["Plum & Grapes", "Procter & Gamble", "Patzo & Game", "None"],
      },
      {
        id: 502,
        type: "MCQ",
        description: "Choose the correct option.",
        questionText: "Which of the following is NOT a shopping website?",
        options: ["Amazon", "eBay", "Macy's", "None of these"],
      },
    ],
  },
];
