"use client";

import { useState, useEffect } from "react";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { Typography } from "@components/ui-elements/Typography";
import { MainCard } from "@components/ui-cards/MainCard";
import {
  Users,
  Clock,
  CheckCircle,
  Bell,
  Phone,
  X,
  AlertTriangle,
  UserX,
  FileCheck,
  UserCheck,
} from "lucide-react";
import { StatCard } from "@components/ui-cards/StatCard";
import { evaluationsApi, getAllNotifications } from "@lib/api";
import { EvaluationTask, NotificationItem } from "@types";
import Link from "next/link";
import { Button } from "@components/ui-elements/Button";
import { cn } from "@lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ActivityItem } from "@components/ui-cards/ActivityItem";
import { NotificationFormatter } from "@components/ui-elements/NotificationFormatter";
import { formatDistanceToNow } from "date-fns";

interface ProjectLeadDashboardClientProps {
  leadId: number;
}

export default function ProjectLeadDashboardClient({
  leadId,
}: ProjectLeadDashboardClientProps) {
  const [tasks, setTasks] = useState<EvaluationTask[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  const [selectedTask, setSelectedTask] = useState<EvaluationTask | null>(null);
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationItem | null>(null);

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

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoadingNotifications(true);
        const res = await getAllNotifications({ limit: 10 });
        setNotifications(res.data || []);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      } finally {
        setLoadingNotifications(false);
      }
    };
    fetchNotifications();
  }, []);

  const pendingCount = tasks.filter((t) => t.status === "pending").length;
  const completedCount = tasks.filter((t) => t.status === "completed").length;

  return (
    <PageContainer className="space-y-6 flex flex-col lg:h-[calc(100vh-100px)] pb-4 overflow-hidden">
      <div className="flex flex-col gap-1 shrink-0">
        <Typography variant="h2" className="font-black tracking-tight">
          Project Lead Dashboard
        </Typography>
        <Typography variant="body4" className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your assigned interview
          tasks.
        </Typography>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0 overflow-hidden">
        {/* Card 1: Assigned Candidates */}
        <MainCard
          title={`Assigned Candidates (${tasks.length})`}
          className="overflow-hidden flex flex-col h-full min-h-[350px]"
          bodyClassName="p-0 flex-1 overflow-hidden flex flex-col"
        >
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                Loading candidates...
              </div>
            ) : tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-2">
                <Users size={36} className="text-muted-foreground opacity-50" />
                <Typography variant="body4" className="text-muted-foreground">
                  No candidates assigned to you yet.
                </Typography>
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-3.5 bg-muted/10 dark:bg-slate-900/40 border border-border/30 rounded-xl hover:bg-muted/20 dark:hover:bg-slate-900/60 transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary font-black text-sm border border-brand-primary/20">
                      {task.candidate_name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .slice(0, 2)
                        .toUpperCase()}
                    </div>
                    <div>
                      <Typography
                        variant="body3"
                        className="font-extrabold text-foreground"
                      >
                        {task.candidate_name}
                      </Typography>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-black uppercase tracking-wider text-brand-primary px-1.5 py-0.5 bg-brand-primary/5 rounded border border-brand-primary/20">
                          {task.round_type}
                        </span>
                        <span
                          className={cn(
                            "text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border",
                            task.status === "pending"
                              ? "bg-amber-500/5 border-amber-500/20 text-amber-500"
                              : "bg-emerald-500/5 border-emerald-500/20 text-emerald-500",
                          )}
                        >
                          {task.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-lg h-8 text-[11px] font-extrabold"
                    onClick={() => setSelectedTask(task)}
                  >
                    View Details
                  </Button>
                </div>
              ))
            )}
          </div>
        </MainCard>

        {/* Card 2: Recent Notifications */}
        <MainCard
          title="Recent Notifications"
          className="overflow-hidden flex flex-col h-full min-h-[350px]"
          bodyClassName="p-0 flex-1 overflow-hidden flex flex-col"
        >
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loadingNotifications ? (
              <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-2">
                <Bell size={36} className="text-muted-foreground opacity-50" />
                <Typography variant="body4" className="text-muted-foreground">
                  No recent notifications found.
                </Typography>
              </div>
            ) : (
              notifications.map((notif) => {
                const t = notif.title?.toLowerCase() || "";
                const tp = notif.type?.toLowerCase() || "";

                let icon = <Bell size={18} />;
                let colorClass = "text-slate-500";
                let bgClass = "bg-slate-500/10 dark:bg-slate-500/20";

                if (t.includes("duplicate") || tp.includes("duplicate")) {
                  icon = <AlertTriangle size={18} />;
                  colorClass = "text-amber-500";
                  bgClass = "bg-amber-500/10 dark:bg-amber-500/20";
                } else if (
                  t.includes("unassigned") ||
                  tp.includes("unassigned")
                ) {
                  icon = <UserX size={18} />;
                  colorClass = "text-red-500";
                  bgClass = "bg-red-500/10 dark:bg-red-500/20";
                } else if (
                  t.includes("submitted") ||
                  tp.includes("submitted")
                ) {
                  icon = <FileCheck size={18} />;
                  colorClass = "text-emerald-500";
                  bgClass = "bg-emerald-500/10 dark:bg-emerald-500/20";
                } else if (
                  t.includes("interview") ||
                  t.includes("assigned") ||
                  tp.includes("assigned")
                ) {
                  icon = <UserCheck size={18} />;
                  colorClass = "text-brand-primary";
                  bgClass = "bg-brand-primary/10 dark:bg-brand-primary/20";
                }

                return (
                  <div
                    key={notif.id}
                    onClick={() => setSelectedNotification(notif)}
                    className="cursor-pointer hover:scale-[1.005] transition-all"
                  >
                    <ActivityItem
                      icon={icon}
                      title={notif.title}
                      description={
                        <NotificationFormatter message={notif.message} />
                      }
                      time={formatDistanceToNow(new Date(notif.created_at), {
                        addSuffix: true,
                      })}
                      color={colorClass}
                      bgClassName={bgClass}
                      className="p-3.5 border border-border/30 rounded-xl bg-muted/10 dark:bg-slate-900/40 hover:bg-muted/20 dark:hover:bg-slate-900/60"
                    />
                  </div>
                );
              })
            )}
          </div>
        </MainCard>
      </div>

      {/* Candidate Details Modal */}
      <AnimatePresence>
        {selectedTask && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-card border-2 border-brand-primary/30 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-border flex items-center justify-between bg-muted/20">
                <div>
                  <Typography
                    variant="h4"
                    className="font-extrabold text-foreground"
                  >
                    {selectedTask.candidate_name}
                  </Typography>
                  <Typography
                    variant="body5"
                    className="text-brand-primary font-bold uppercase tracking-wider mt-0.5"
                  >
                    {selectedTask.round_type} Round
                  </Typography>
                </div>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-muted/10 p-3 rounded-xl border border-border/30">
                    <Typography
                      variant="body5"
                      className="text-muted-foreground mb-1"
                    >
                      Mobile Number
                    </Typography>
                    <Typography
                      variant="body4"
                      className="font-semibold text-foreground flex items-center gap-1.5"
                    >
                      <Phone size={14} className="text-brand-primary" />
                      {selectedTask.candidate_mobile}
                    </Typography>
                  </div>
                  <div className="bg-muted/10 p-3 rounded-xl border border-border/30">
                    <Typography
                      variant="body5"
                      className="text-muted-foreground mb-1"
                    >
                      Status
                    </Typography>
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold",
                        selectedTask.status === "pending"
                          ? "bg-amber-500/15 text-amber-500"
                          : "bg-emerald-500/15 text-emerald-500",
                      )}
                    >
                      <Clock size={12} />
                      {selectedTask.status}
                    </span>
                  </div>
                </div>

                <div className="bg-muted/10 p-4 rounded-xl border border-border/30">
                  <Typography
                    variant="body5"
                    className="text-muted-foreground mb-1"
                  >
                    Overall Grade
                  </Typography>
                  <Typography
                    variant="body4"
                    className="font-semibold text-foreground"
                  >
                    {selectedTask.overall_grade || "Not evaluated yet"}
                  </Typography>
                </div>

                <div className="bg-muted/10 p-4 rounded-xl border border-border/30">
                  <Typography
                    variant="body5"
                    className="text-muted-foreground mb-1"
                  >
                    Lead Comments
                  </Typography>
                  <Typography
                    variant="body4"
                    className="text-foreground italic"
                  >
                    &ldquo;{selectedTask.comments || "No comments added yet."}
                    &rdquo;
                  </Typography>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                  <span>
                    Assigned on{" "}
                    {new Date(selectedTask.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-muted/20 border-t border-border flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setSelectedTask(null)}>
                  Close
                </Button>
                {selectedTask.status === "pending" && (
                  <Link href="/project-lead/users">
                    <Button color="primary">Start Evaluation</Button>
                  </Link>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Notification Details Modal */}
      <AnimatePresence>
        {selectedNotification && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-card border-2 border-brand-primary/30 dark:border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-border flex items-center justify-between bg-muted/20">
                <div>
                  <Typography
                    variant="h4"
                    className="font-extrabold text-foreground"
                  >
                    {selectedNotification.title}
                  </Typography>
                  <Typography
                    variant="body5"
                    className="text-brand-primary font-bold uppercase tracking-wider mt-0.5"
                  >
                    {selectedNotification.type} Notification
                  </Typography>
                </div>
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="text-muted-foreground hover:text-foreground p-1.5 rounded-lg hover:bg-muted transition-all"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="bg-muted/10 p-4 rounded-xl border border-border/30">
                  <Typography
                    variant="body5"
                    className="text-muted-foreground mb-1"
                  >
                    Notification Message
                  </Typography>
                  <Typography
                    variant="body4"
                    className="text-foreground leading-relaxed"
                  >
                    {selectedNotification.message}
                  </Typography>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                  <span>
                    Received on{" "}
                    {new Date(selectedNotification.created_at).toLocaleString()}
                  </span>
                  <span
                    className={cn(
                      "px-2 py-0.5 rounded-full font-bold uppercase tracking-wider text-[9px]",
                      selectedNotification.is_read
                        ? "bg-slate-200 dark:bg-slate-800 text-muted-foreground"
                        : "bg-brand-primary/10 text-brand-primary",
                    )}
                  >
                    {selectedNotification.is_read ? "Read" : "Unread"}
                  </span>
                </div>
              </div>

              <div className="p-4 bg-muted/20 border-t border-border flex justify-end">
                <Button
                  variant="ghost"
                  onClick={() => setSelectedNotification(null)}
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageContainer>
  );
}
