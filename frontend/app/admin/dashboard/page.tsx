"use client";

import React, { useState } from "react";
import {
  Users,
  FileText,
  HelpCircle,
  Zap,
  UserPlus,
  RefreshCcw,
  ClipboardCheck,
  CheckCircle2,
  Bell,
  Trophy,
  BadgeCheck,
  Target,
  UserX,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

import { MainCard } from "@components/ui-cards/MainCard";
import { StatCard } from "@components/ui-cards/StatCard";
import { ActivityItem } from "@components/ui-cards/ActivityItem";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { Typography } from "@components/ui-elements/Typography";
import { useDashboardOverview } from "@lib/react-query/dashboard/use-dashboard-stats";
import { useNotifications } from "@lib/react-query/notifications/use-notifications";
import { PulseCard } from "@components/ui-cards/PulseCard";
import { InsightCard } from "@components/ui-cards/InsightCard";
import { DateRangePicker } from "@components/ui-elements/DateRangePicker";
import { Button } from "@components/ui-elements/Button";

// Types for better safety
interface DashboardNotification {
  id: string | number;
  type: string;
  title: string;
  message: string;
  created_at: string;
}

interface GradeConfig {
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  borderColor: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
} as const;

const itemVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
} as const;

export default function DashboardPage() {
  const router = useRouter();
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");

  const {
    data: overview,
    isLoading: overviewLoading,
    isFetching: isRefetching,
  } = useDashboardOverview({
    start_date: startDate,
    end_date: endDate,
  });
  const { data: notificationsData, isLoading: notificationsLoading } =
    useNotifications({ limit: 5 });

  const notifications = (notificationsData?.data ||
    []) as DashboardNotification[];

  const { stats, today_pulse } = overview ?? {
    stats: {
      total_candidates: 0,
      active_papers: 0,
      total_questions: 0,
      today_attempts: 0,
    },
    today_pulse: {
      registrations: 0,
      reinterviews: 0,
      assignments: 0,
      attempts: 0,
      grades: [],
    },
  };

  const displayGrades = today_pulse?.grades?.length
    ? today_pulse.grades
    : [
        { label: "Excellent", count: 0 },
        { label: "Good", count: 0 },
        { label: "Average", count: 0 },
        { label: "Poor", count: 0 },
      ];

  const statCards = [
    {
      label: "Total Users",
      value: stats?.total_candidates ?? 0,
      icon: <Users />,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Active Papers",
      value: stats?.active_papers ?? 0,
      icon: <FileText />,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Question Pool",
      value: stats?.total_questions ?? 0,
      icon: <HelpCircle />,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Today's Efforts",
      value: stats?.today_attempts ?? 0,
      icon: <Zap />,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
  ];

  const pulseMetrics = [
    {
      label: "New Registrations",
      value: today_pulse?.registrations ?? 0,
      icon: <UserPlus />,
      sub: "Fresh applicants",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Re-interviews",
      value: today_pulse?.reinterviews ?? 0,
      icon: <RefreshCcw />,
      sub: "Candidates returning",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "Paper Assignments",
      value: today_pulse?.assignments ?? 0,
      icon: <ClipboardCheck />,
      sub: "Auto & Manual allot",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Completed Tests",
      value: today_pulse?.attempts ?? 0,
      icon: <CheckCircle2 />,
      sub: "Finalized submissions",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
  ];

  const gradeConfigs: Record<string, GradeConfig> = {
    Excellent: {
      icon: <Trophy />,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    Good: {
      icon: <BadgeCheck />,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    Average: {
      icon: <Target />,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
    Poor: {
      icon: <UserX />,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20",
    },
  };

  return (
    <PageContainer className="space-y-8 py-8">
      {/* PERSISTENT HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Typography
            variant="body1"
            className="text-muted-foreground font-medium"
          >
            Monitor system health, candidate flow and performance insights.
          </Typography>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-shrink-0"
        >
          <DateRangePicker
            onRangeChange={(range) => {
              if (range) {
                setStartDate(range.from);
                setEndDate(range.to);
              } else {
                setStartDate("");
                setEndDate("");
              }
            }}
            initialLabel="Today"
            className="w-[280px]"
          />
        </motion.div>
      </div>

      <div className="space-y-8">
        {/* Top Stat Cards Section with internal skeletons */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {statCards.map((stat) => (
            <motion.div key={stat.label} variants={itemVariants}>
              <StatCard
                label={stat.label}
                value={stat.value.toLocaleString()}
                icon={stat.icon}
                color={stat.color}
                bgColor={stat.bgColor}
                isLoading={overviewLoading}
              />
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Pulse Section with internal skeletons */}
          <div className="lg:col-span-2">
            <MainCard
              title={
                <div className="flex items-center gap-3">
                  <Zap size={22} className="text-brand-primary" />
                  <Typography
                    variant="h4"
                    weight="black"
                    className="uppercase tracking-widest pt-0.5 text-foreground"
                  >
                    Dashboard Pulse
                  </Typography>
                </div>
              }
              className="h-full"
            >
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-1"
              >
                {pulseMetrics.map((metric) => (
                  <motion.div key={metric.label} variants={itemVariants}>
                    <PulseCard {...metric} isLoading={overviewLoading} />
                  </motion.div>
                ))}
              </motion.div>
            </MainCard>
          </div>

          {/* Activity Section */}
          <div className="lg:col-span-1">
            <MainCard
              title={
                <div className="flex items-center gap-3">
                  <Bell size={22} className="text-rose-500" />
                  <Typography
                    variant="h4"
                    weight="black"
                    className="uppercase tracking-widest pt-0.5 text-foreground"
                  >
                    Activity & Focus
                  </Typography>
                </div>
              }
              className="h-full"
              bodyClassName="p-1"
            >
              <div className="flex flex-col flex-1 h-full">
                <div className="flex-1 space-y-1">
                  {notificationsLoading ? (
                    <div className="p-4 space-y-4">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="h-20 bg-muted/20 animate-pulse rounded-2xl"
                        />
                      ))}
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="py-20 text-center text-muted-foreground/40 font-bold text-xs uppercase tracking-widest">
                      No recent activity
                    </div>
                  ) : (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="space-y-1"
                    >
                      {notifications.map((notif) => (
                        <motion.div key={notif.id} variants={itemVariants}>
                          <ActivityItem
                            icon={
                              notif.type === "duplicate_user" ? (
                                <UserPlus size={18} />
                              ) : (
                                <FileText size={18} />
                              )
                            }
                            title={notif.title}
                            description={notif.message}
                            time={formatDistanceToNow(
                              new Date(notif.created_at),
                              { addSuffix: true },
                            )}
                            color={
                              notif.type === "duplicate_user"
                                ? "text-rose-500"
                                : "text-blue-500"
                            }
                            className="p-3"
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </div>

                {notifications.length > 0 && (
                  <Button
                    variant="ghost"
                    color="primary"
                    fullWidth
                    animate="scale"
                    onClick={() => router.push("/admin/notifications")}
                    className="py-5 mt-auto text-xs font-black uppercase tracking-widest border-t border-border rounded-t-none rounded-b-3xl h-auto flex items-center justify-center gap-2 shadow-none hover:bg-muted/30"
                    endIcon={<ArrowRight size={14} />}
                  >
                    View all
                  </Button>
                )}
              </div>
            </MainCard>
          </div>
        </div>

        {/* Performance Insights with internal skeletons */}
        <MainCard
          title={
            <div className="flex items-center gap-3">
              <Trophy size={22} className="text-emerald-500" />
              <Typography
                variant="h4"
                weight="black"
                className="uppercase tracking-widest pt-0.5 text-foreground"
              >
                Performance Insights
              </Typography>
            </div>
          }
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-1"
          >
            {displayGrades.map((grade) => {
              const config = gradeConfigs[grade.label] || gradeConfigs.Average;
              return (
                <motion.div key={grade.label} variants={itemVariants}>
                  <InsightCard
                    label={grade.label}
                    value={grade.count}
                    icon={config.icon}
                    color={config.color}
                    bgColor={config.bgColor}
                    borderColor={config.borderColor}
                    isLoading={overviewLoading}
                    onClick={() =>
                      router.push(`/admin/results?grade=${grade.label}`)
                    }
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </MainCard>
      </div>
    </PageContainer>
  );
}
