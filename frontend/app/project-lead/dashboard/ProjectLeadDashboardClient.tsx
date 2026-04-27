"use client";

import { useState, useEffect } from "react";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { Typography } from "@components/ui-elements/Typography";
import { MainCard } from "@components/ui-cards/MainCard";
import { Users, Clock, CheckCircle, ArrowRight } from "lucide-react";
import { StatCard } from "@components/ui-cards/StatCard";
import { evaluationsApi } from "@lib/api";
import { EvaluationTask } from "@types";
import Link from "next/link";
import { Button } from "@components/ui-elements/Button";

interface ProjectLeadDashboardClientProps {
  leadId: number;
}

export default function ProjectLeadDashboardClient({
  leadId,
}: ProjectLeadDashboardClientProps) {
  const [tasks, setTasks] = useState<EvaluationTask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const res = await evaluationsApi.getLeadTasks(leadId);
        setTasks(res.data || []);
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setLoading(false);
      }
    };
    if (leadId) fetchTasks();
  }, [leadId]);

  const pendingCount = tasks.filter((t) => t.status === "pending").length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;

  return (
    <PageContainer className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <Typography variant="h2" className="font-black tracking-tight">
          Project Lead Dashboard
        </Typography>
        <Typography variant="body4" className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your assigned interview
          tasks.
        </Typography>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Total Assigned"
          value={tasks.length.toString()}
          icon={<Users />}
          color="text-brand-primary"
          bgColor="bg-brand-primary/10"
          isLoading={loading}
        />
        <StatCard
          label="Pending Interviews"
          value={pendingCount.toString()}
          icon={<Clock />}
          color="text-amber-500"
          bgColor="bg-amber-500/10"
          isLoading={loading}
        />
        <StatCard
          label="Completed"
          value={completedCount.toString()}
          icon={<CheckCircle />}
          color="text-emerald-500"
          bgColor="bg-emerald-500/10"
          isLoading={loading}
        />
      </div>

      <MainCard
        title="Active Overview"
        className="overflow-hidden"
        bodyClassName="p-0"
      >
        <div className="p-8 flex flex-col items-center justify-center min-h-[240px] text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
            <Users size={32} />
          </div>
          <div className="max-w-md">
            <Typography variant="h4" className="font-bold mb-2">
              {pendingCount > 0
                ? `You have ${pendingCount} pending interviews`
                : "All caught up!"}
            </Typography>
            <Typography variant="body4" className="text-muted-foreground mb-6">
              {pendingCount > 0
                ? "Start evaluating your assigned candidates to finalize their recruitment process."
                : "You have completed all your currently assigned interview evaluations."}
            </Typography>
            <Link href="/project-lead/users">
              <Button color="primary" endIcon={<ArrowRight size={18} />}>
                View Candidates
              </Button>
            </Link>
          </div>
        </div>
      </MainCard>
    </PageContainer>
  );
}
