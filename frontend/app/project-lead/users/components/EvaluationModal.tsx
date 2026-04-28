"use client";

import React, { useEffect, useState, useCallback } from "react";
import { ClipboardCheck } from "lucide-react";
import { Modal } from "@components/ui-elements/Modal";
import { Typography } from "@components/ui-elements/Typography";
import { resultsApi, evaluationsApi, classificationsApi } from "@lib/api";
import { toast } from "@lib/toast";
import { EvaluationForm } from "@components/features/EvaluationForm";
import { EvaluationFormValues } from "@lib/validations/evaluation";

import {
  AdminUserResultDetail,
  Classification,
  InterviewEvaluation,
} from "@types";

interface EvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: number;
  evaluationId: number;
  onSuccess?: () => void;
}

export const EvaluationModal = React.memo(({
  isOpen,
  onClose,
  userId,
  evaluationId,
  onSuccess,
}: EvaluationModalProps) => {
  const [r1Data, setR1Data] = useState<AdminUserResultDetail | null>(null);
  const [verdicts, setVerdicts] = useState<Classification[]>([]);
  const [evaluation, setEvaluation] = useState<InterviewEvaluation | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Default values for the form
  const [initialValues, setInitialValues] = useState<EvaluationFormValues>({
    evaluation_data: {
      Communication: "",
      "Domain Knowledge": "",
      "Critical Thinking": "",
      Professionalism: "",
      "Cultural Fit": "",
      "Learning Ability": "",
    },
    overall_grade: "",
    final_verdict_id: 0,
    comments: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      if (!isOpen || !userId || !evaluationId) return;

      try {
        setLoading(true);
        const [resR1, resVerdicts, resEval] = await Promise.all([
          resultsApi.getUserResultDetail(userId),
          classificationsApi.getClassifications({
            type: "interview_verdict",
            is_active: true,
          }),
          evaluationsApi.getEvaluationDetail(evaluationId),
        ]);

        const evalData = resEval as InterviewEvaluation;
        const rawVerdicts = resVerdicts?.data ?? resVerdicts ?? [];
        const verdictOptions = Array.isArray(rawVerdicts) ? rawVerdicts : [];

        setR1Data(resR1 as AdminUserResultDetail);
        setVerdicts(verdictOptions);
        setEvaluation(evalData);

        if (evalData) {
          setInitialValues({
            evaluation_data: {
              Communication: evalData.evaluation_data?.Communication || "",
              "Domain Knowledge": evalData.evaluation_data?.["Domain Knowledge"] || "",
              "Critical Thinking": evalData.evaluation_data?.["Critical Thinking"] || "",
              Professionalism: evalData.evaluation_data?.Professionalism || "",
              "Cultural Fit": evalData.evaluation_data?.["Cultural Fit"] || "",
              "Learning Ability": evalData.evaluation_data?.["Learning Ability"] || "",
            },
            overall_grade: evalData.overall_grade || "",
            final_verdict_id: evalData.final_verdict_id
              ? Number(evalData.final_verdict_id)
              : 0,
            comments: evalData.comments || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch evaluation data", err);
        toast.error("Failed to load candidate data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen, userId, evaluationId]);

  const isCompleted = evaluation?.status === "completed";

  const handleSubmit = useCallback(async (values: EvaluationFormValues) => {
    if (isCompleted) return;

    try {
      setSubmitting(true);
      await evaluationsApi.submitEvaluation(evaluationId, values);
      toast.success("Evaluation submitted successfully!");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error("Submission failed", err);
      toast.error("Failed to submit evaluation.");
    } finally {
      setSubmitting(false);
    }
  }, [isCompleted, evaluationId, onSuccess, onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
            <ClipboardCheck size={20} />
          </div>
          <div>
            <Typography
              variant="body1"
              className="font-black uppercase tracking-tight"
            >
              Face-to-Face Evaluation
            </Typography>
            <Typography variant="body5" className="text-muted-foreground">
              Candidate: {r1Data?.user?.username || "Loading..."}
            </Typography>
          </div>
        </div>
      }
      className="max-w-3xl"
    >
      {loading ? (
        <div className="p-20 flex flex-col items-center justify-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-primary border-t-transparent rounded-full animate-spin" />
          <Typography
            variant="body4"
            className="text-muted-foreground font-bold uppercase tracking-widest"
          >
            Fetching Candidate Data...
          </Typography>
        </div>
      ) : (
        <EvaluationForm
          key={JSON.stringify(initialValues)} // Reset form when initialValues change
          initialValues={initialValues}
          verdicts={verdicts}
          isCompleted={isCompleted}
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={onClose}
        />
      )}
    </Modal>
  );
});

EvaluationModal.displayName = "EvaluationModal";
