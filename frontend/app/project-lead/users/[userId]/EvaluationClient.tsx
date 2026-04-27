"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  User,
  FileText,
  ClipboardCheck,
  ShieldCheck,
  MessageSquare,
  ChevronRight,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { Typography } from "@components/ui-elements/Typography";
import { MainCard } from "@components/ui-cards/MainCard";
import { Button } from "@components/ui-elements/Button";
import { Badge } from "@components/ui-elements/Badge";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { Textarea } from "@components/ui-elements/Textarea";
import { resultsApi, evaluationsApi, classificationsApi } from "@lib/api";
import { toast } from "@lib/toast";

import {
  AdminUserResultDetail,
  Classification,
  SubmitEvaluationPayload,
  SubjectResult,
  InterviewEvaluation,
} from "@types";

interface EvaluationClientProps {
  userId: number;
}

const METRICS = [
  "Communication",
  "Domain Knowledge",
  "Critical Thinking",
  "Professionalism",
  "Cultural Fit",
  "Learning Ability",
];

const RATINGS = [
  { id: "Excellent", label: "Excellent" },
  { id: "Good", label: "Good" },
  { id: "Average", label: "Average" },
  { id: "Poor", label: "Poor" },
];

export default function EvaluationClient({ userId }: EvaluationClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const evaluationId = Number(searchParams.get("evaluation_id"));

  const [r1Data, setR1Data] = useState<AdminUserResultDetail | null>(null);
  const [verdicts, setVerdicts] = useState<Classification[]>([]);
  const [evaluation, setEvaluation] = useState<InterviewEvaluation | null>(
    null,
  );
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<SubmitEvaluationPayload>({
    evaluation_data: {},
    overall_grade: "",
    final_verdict_id: 0,
    comments: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId || !evaluationId) return;

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

        // Pre-fill form if data exists (whether pending or completed)
        if (evalData) {
          setFormData({
            evaluation_data: evalData.evaluation_data || {},
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
  }, [userId, evaluationId]);

  const isCompleted = evaluation?.status === "completed";

  const handleMetricChange = (metric: string, rating: string) => {
    if (isCompleted) return;
    setFormData((prev) => ({
      ...prev,
      evaluation_data: { ...prev.evaluation_data, [metric]: rating },
    }));
  };

  const handleSubmit = async () => {
    if (isCompleted) return;
    if (!formData.overall_grade || !formData.final_verdict_id) {
      toast.error("Please fill overall grade and final verdict.");
      return;
    }

    try {
      setSubmitting(true);
      await evaluationsApi.submitEvaluation(evaluationId, formData);
      toast.success("Evaluation submitted successfully!");
      router.push("/project-lead/users");
    } catch (err) {
      console.error("Submission failed", err);
      toast.error("Failed to submit evaluation.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageContainer>Loading...</PageContainer>;

  return (
    <PageContainer className="py-6 space-y-8 max-w-7xl mx-auto pb-40">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/project-lead/users">
            <Button variant="ghost" size="icon-sm" className="rounded-full">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <Typography variant="h3" className="font-black tracking-tight">
                Evaluation: {r1Data?.user?.username}
              </Typography>
              {isCompleted && (
                <Badge
                  color="success"
                  icon={<CheckCircle size={12} />}
                  variant="fill"
                  className="rounded-full px-3 py-1 font-black text-[14px] uppercase flex items-center gap-1"
                >
                  Submitted
                </Badge>
              )}
            </div>
            <Typography variant="body5" className="text-muted-foreground">
              Candidate ID: #{userId} • Interview Round 2
            </Typography>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: R1 Data */}
        <div className="lg:col-span-5 space-y-6">
          <MainCard
            title={
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-brand-primary" />
                <span>Round 1 Results (Technical)</span>
              </div>
            }
            className="border-brand-primary/20"
          >
            <div className="space-y-6">
              {/* Score Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-brand-primary/5 border border-brand-primary/10">
                  <Typography
                    variant="body5"
                    className="text-brand-primary font-bold uppercase tracking-wider mb-1"
                  >
                    Marks Obtained
                  </Typography>
                  <div className="flex items-baseline gap-1">
                    <Typography variant="h3" className="font-black">
                      {r1Data?.attempt?.obtained_marks}
                    </Typography>
                    <Typography
                      variant="body5"
                      className="text-muted-foreground"
                    >
                      / {r1Data?.attempt?.total_marks}
                    </Typography>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/10">
                  <Typography
                    variant="body5"
                    className="text-amber-600 font-bold uppercase tracking-wider mb-1"
                  >
                    Overall Grade
                  </Typography>
                  <Typography
                    variant="h3"
                    className="font-black text-amber-600"
                  >
                    {r1Data?.attempt?.overall_grade}
                  </Typography>
                </div>
              </div>

              {/* Subject Breakdown */}
              <div className="space-y-3">
                <Typography variant="body4" className="font-bold">
                  Subject Breakdown
                </Typography>
                {r1Data?.subject_results?.map((s: SubjectResult) => (
                  <div
                    key={s.section_code}
                    className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50"
                  >
                    <Typography variant="body5" className="font-medium">
                      {s.section_name}
                    </Typography>
                    <Badge
                      variant="outline"
                      color="default"
                      className="font-bold"
                    >
                      {s.obtained_marks}/{s.total_marks}
                    </Badge>
                  </div>
                ))}
              </div>

              <Link href={`/admin/results/${userId}`} target="_blank">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full text-brand-primary font-bold"
                  endIcon={<ChevronRight size={16} />}
                >
                  View Detailed Responses
                </Button>
              </Link>
            </div>
          </MainCard>
        </div>

        {/* Right Side: Evaluation Form */}
        <div className="lg:col-span-7 space-y-6">
          <MainCard
            title={
              <div className="flex items-center gap-2">
                <ClipboardCheck size={18} className="text-emerald-500" />
                <span>Face-to-Face Evaluation Form</span>
              </div>
            }
          >
            <div className="space-y-8">
              {/* Metrics Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {METRICS.map((metric) => (
                  <div key={metric} className="space-y-2">
                    <Typography
                      variant="body5"
                      className="font-bold uppercase tracking-wider text-muted-foreground"
                    >
                      {metric}
                    </Typography>
                    <SelectDropdown
                      options={RATINGS}
                      placeholder={`Rate ${metric}`}
                      value={formData.evaluation_data[metric]}
                      onChange={(val) =>
                        handleMetricChange(metric, val as string)
                      }
                      className="rounded-2xl"
                      disabled={isCompleted}
                    />
                  </div>
                ))}
              </div>

              <div className="h-px bg-border/50 w-full" />

              {/* Final Verdict Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Typography
                    variant="body5"
                    className="font-bold uppercase tracking-wider text-brand-primary"
                  >
                    Overall Grade
                  </Typography>
                  <SelectDropdown
                    options={RATINGS}
                    placeholder="Select Overall Grade"
                    value={formData.overall_grade}
                    onChange={(val) =>
                      setFormData((prev) => ({
                        ...prev,
                        overall_grade: val as string,
                      }))
                    }
                    className="rounded-2xl border-brand-primary/30"
                    disabled={isCompleted}
                  />
                </div>
                <div className="space-y-2">
                  <Typography
                    variant="body5"
                    className="font-bold uppercase tracking-wider text-emerald-600"
                  >
                    Final Verdict
                  </Typography>
                  <SelectDropdown
                    options={verdicts.map((v) => ({ id: v.id, label: v.name }))}
                    placeholder="Select Verdict"
                    value={formData.final_verdict_id}
                    onChange={(val) =>
                      setFormData((prev) => ({
                        ...prev,
                        final_verdict_id: Number(val),
                      }))
                    }
                    className="rounded-2xl border-emerald-500/30"
                    disabled={isCompleted}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Typography
                  variant="body5"
                  className="font-bold uppercase tracking-wider text-muted-foreground"
                >
                  Interviewer Comments & Feedback
                </Typography>
                <Textarea
                  placeholder="Write your detailed feedback here..."
                  value={formData.comments}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      comments: e.target.value,
                    }))
                  }
                  className="min-h-[120px] rounded-2xl resize-none"
                  disabled={isCompleted}
                />
              </div>

              {/* Submit Button - Moved to bottom */}
              {!isCompleted && (
                <div className="pt-4 border-t border-border/50">
                  <Button
                    color="primary"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="w-full shadow-xl shadow-brand-primary/20 h-14 rounded-2xl font-black uppercase tracking-widest text-sm"
                    startIcon={<ShieldCheck size={20} />}
                  >
                    {submitting ? "Submitting..." : "Submit Evaluation"}
                  </Button>
                </div>
              )}

              {isCompleted && (
                <div className="p-6 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex flex-col items-center text-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                    <CheckCircle size={24} />
                  </div>
                  <div>
                    <Typography
                      variant="body3"
                      className="font-black text-emerald-500 uppercase"
                    >
                      Evaluation Completed
                    </Typography>
                    <Typography
                      variant="body5"
                      className="text-muted-foreground mt-1"
                    >
                      This candidate has been successfully evaluated. The
                      results are now locked.
                    </Typography>
                  </div>
                </div>
              )}
            </div>
          </MainCard>
        </div>
      </div>
    </PageContainer>
  );
}
