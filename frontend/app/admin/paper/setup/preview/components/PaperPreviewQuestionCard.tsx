"use client";

import React from "react";
import { QuestionView } from "@components/features/questions/views";
import { Question } from "@types";

interface PaperPreviewQuestionCardProps {
  question: Question;
  index: number;
  showAnswers?: boolean;
}

export const PaperPreviewQuestionCard: React.FC<
  PaperPreviewQuestionCardProps
> = ({ question, index, showAnswers = true }) => {
  return (
    <QuestionView
      question={question}
      index={index}
      showAnswers={showAnswers}
      showHeader={true}
    />
  );
};
