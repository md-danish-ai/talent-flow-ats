"use client";

import { useState, useEffect } from "react";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { Typography } from "@components/ui-elements/Typography";
import { Tabs } from "@components/ui-elements/Tabs";
import { evaluationsApi } from "@lib/api";
import { CandidateList } from "./CandidateList";
import { Clock, CheckCircle } from "lucide-react";

import { EvaluationTask } from "@types";

interface ProjectLeadUsersClientProps {
  leadId: number;
}

export default function ProjectLeadUsersClient({
  leadId,
}: ProjectLeadUsersClientProps) {
  const [tasks, setTasks] = useState<EvaluationTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const res = await evaluationsApi.getLeadTasks(leadId);
        setTasks(res || []);
      } catch (err) {
        console.error("Failed to fetch lead tasks", err);
      } finally {
        setLoading(false);
      }
    };
    if (leadId) fetchTasks();
  }, [leadId]);

  const pendingTasks = tasks.filter((t) => t.status === "pending");
  const completedTasks = tasks.filter((t) => t.status === "completed");

  const TABS = [
    {
      value: "pending",
      label: `Pending (${pendingTasks.length})`,
      icon: <Clock size={16} />,
    },
    {
      value: "completed",
      label: `Completed (${completedTasks.length})`,
      icon: <CheckCircle size={16} />,
    },
  ];

  return (
    <PageContainer className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-2">
        <Typography variant="h2" className="font-black tracking-tight">
          Assigned Candidates
        </Typography>
        <Typography variant="body4" className="text-muted-foreground">
          Manage and evaluate candidates assigned to you for Round 2.
        </Typography>
      </div>

      <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} variant="pills" />

      <div className="mt-2">
        {activeTab === "pending" && (
          <CandidateList tasks={pendingTasks} loading={loading} />
        )}
        {activeTab === "completed" && (
          <CandidateList tasks={completedTasks} loading={loading} />
        )}
      </div>
    </PageContainer>
  );
}
