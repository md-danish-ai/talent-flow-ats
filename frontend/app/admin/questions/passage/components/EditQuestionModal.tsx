"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@components/ui-elements/Modal";
import { AddPassageQuestionForm } from "@/components/features/questions/AddPassageQuestionForm";
import { questionsApi } from "@lib/api/questions";
import { type PassageFormValues } from "@lib/validations/question";
import { Typography } from "@components/ui-elements/Typography";
import { Loader2 } from "lucide-react";

interface EditQuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  questionId: number;
  onSuccess: () => void;
}

export const EditQuestionModal = ({
  isOpen,
  onClose,
  questionId,
  onSuccess,
}: EditQuestionModalProps) => {
  const [loading, setLoading] = useState(true);
  const [initialData, setInitialData] = useState<PassageFormValues | null>(null);

  useEffect(() => {
    if (isOpen && questionId) {
      const fetchQuestion = async () => {
        setLoading(true);
        try {
          const q = await questionsApi.getQuestion(questionId);
          setInitialData({
            subject: q.subject?.code || "",
            examLevel: q.exam_level?.code || "",
            marks: q.marks,
            passage: q.passage || "",
            questionText: q.question_text,
            answerText: q.answer?.answer_text || "",
            explanation: q.answer?.explanation || "",
          });
        } catch (error) {
          console.error("Failed to fetch question for edit:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchQuestion();
    }
  }, [isOpen, questionId]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Passage Question"
    >
      <div className="py-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
            <Typography variant="body4" className="text-muted-foreground animate-pulse">
              Loading question data...
            </Typography>
          </div>
        ) : initialData ? (
          <AddPassageQuestionForm
            questionId={questionId}
            initialData={initialData}
            onSuccess={() => {
              onSuccess();
              onClose();
            }}
          />
        ) : (
          <div className="py-10 text-center">
             <Typography variant="body4" className="text-red-500">
               Failed to load question data. Please try again.
             </Typography>
          </div>
        )}
      </div>
    </Modal>
  );
};
