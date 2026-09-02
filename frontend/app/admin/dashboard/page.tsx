"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
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
  AlertTriangle,
  FileCheck,
  UserCheck,
  Loader2,
  CheckCheck,
} from "lucide-react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import { cn, parseUTCDate } from "@lib/utils";

import { DashboardMainCard } from "@components/ui-cards/DashboardMainCard";
import { StatCard } from "@components/ui-cards/StatCard";
import { ActivityItem } from "@components/ui-cards/ActivityItem";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { Typography } from "@components/ui-elements/Typography";
import { Badge } from "@components/ui-elements/Badge";
import { useDashboardOverview } from "@hooks/api/dashboard/use-dashboard-stats";
import { getAllNotifications, markNotificationsRead } from "@lib/api";
import { NotificationItem } from "@types";
import { RecentNotificationsListSkeleton } from "@components/ui-skeleton/ProjectLeadDashboardSkeleton";
import { PulseCard } from "@components/ui-cards/PulseCard";
import { InsightCard } from "@components/ui-cards/InsightCard";
import { DateRangePicker } from "@components/ui-elements/DateRangePicker";
import { Button } from "@components/ui-elements/Button";
import { GRADE_OPTIONS } from "@lib/utils/gradeUtils";
import { NotificationFormatter } from "@components/ui-elements/NotificationFormatter";

// Types for better safety
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
    refetch: refetchOverview,
  } = useDashboardOverview({
    start_date: startDate,
    end_date: endDate,
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loadingNotifications, setLoadingNotifications] = useState(true);
  const [unreadNotifCount, setUnreadNotifCount] = useState<number>(0);
  const [hasMoreNotifs, setHasMoreNotifs] = useState(false);
  const [loadingMoreNotifs, setLoadingMoreNotifs] = useState(false);
  const [markingAllRead, setMarkingAllRead] = useState(false);

  const notifPageRef = useRef(1);
  const notifHasMoreRef = useRef(false);
  const notifLoadingMoreRef = useRef(false);
  const notifObserverTarget = useRef<HTMLDivElement | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoadingNotifications(true);
      notifPageRef.current = 1;
      const res = await getAllNotifications({ page: 1, limit: 10 });
      if (res && res.data) {
        setNotifications(res.data);
        const totalPages = res.pagination?.total_pages || 1;
        const canLoadMore = 1 < totalPages;
        notifHasMoreRef.current = canLoadMore;
        setHasMoreNotifs(canLoadMore);
        setUnreadNotifCount(res.unread_count ?? 0);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoadingNotifications(false);
    }
  }, []);

  const loadMoreNotifications = useCallback(async () => {
    if (
      loadingNotifications ||
      notifLoadingMoreRef.current ||
      !notifHasMoreRef.current
    )
      return;

    try {
      notifLoadingMoreRef.current = true;
      setLoadingMoreNotifs(true);
      const nextPage = notifPageRef.current + 1;
      const res = await getAllNotifications({ page: nextPage, limit: 10 });

      if (res && res.data) {
        setNotifications((prev) => [...prev, ...res.data]);
        notifPageRef.current = nextPage;
        const totalPages = res.pagination?.total_pages || 1;
        const canLoadMore = nextPage < totalPages;
        notifHasMoreRef.current = canLoadMore;
        setHasMoreNotifs(canLoadMore);
        if (res.unread_count !== undefined) {
          setUnreadNotifCount(res.unread_count);
        }
      }
    } catch (err) {
      console.error("Failed to load more notifications", err);
    } finally {
      notifLoadingMoreRef.current = false;
      setLoadingMoreNotifs(false);
    }
  }, [loadingNotifications]);

  useEffect(() => {
    void fetchNotifications();
  }, [fetchNotifications]);

  useEffect(() => {
    const target = notifObserverTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          notifHasMoreRef.current &&
          !notifLoadingMoreRef.current &&
          !loadingNotifications
        ) {
          void loadMoreNotifications();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [loadMoreNotifications, loadingNotifications]);

  // Listen for global notification update events
  useEffect(() => {
    const handleUpdate = () => {
      void fetchNotifications();
      void refetchOverview();
    };
    window.addEventListener("notificationsUpdated", handleUpdate);
    return () =>
      window.removeEventListener("notificationsUpdated", handleUpdate);
  }, [fetchNotifications, refetchOverview]);

  const handleMarkAllRead = async () => {
    try {
      setMarkingAllRead(true);
      await markNotificationsRead([]);
      await fetchNotifications();
      window.dispatchEvent(new CustomEvent("notificationsUpdated"));
    } catch (err) {
      console.error("Failed to mark all notifications as read", err);
    } finally {
      setMarkingAllRead(false);
    }
  };

  const handleNotificationClick = async (notif: NotificationItem) => {
    if (!notif.is_read) {
      try {
        await markNotificationsRead([notif.id]);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n)),
        );
        setUnreadNotifCount((prev) => Math.max(0, prev - 1));
        window.dispatchEvent(new CustomEvent("notificationsUpdated"));
      } catch (err) {
        console.error("Failed to mark notification as read", err);
      }
    }
  };

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
    : GRADE_OPTIONS.map((r) => ({ label: r.label, count: 0 }));

  const statCards = [
    {
      label: "TOTAL USERS",
      value: stats?.total_candidates ?? 0,
      icon: <Users />,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-l-blue-500",
    },
    {
      label: "ACTIVE PAPERS",
      value: stats?.active_papers ?? 0,
      icon: <FileText />,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-l-emerald-500",
    },
    {
      label: "QUESTION POOL",
      value: stats?.total_questions ?? 0,
      icon: <HelpCircle />,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-l-purple-500",
    },
    {
      label: "TODAY'S EFFORTS",
      value: stats?.today_attempts ?? 0,
      icon: <Zap />,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-l-amber-500",
    },
  ];

  const pulseMetrics = [
    {
      label: "NEW REGISTRATIONS",
      value: today_pulse?.registrations ?? 0,
      icon: <UserPlus />,
      sub: "Fresh applicants",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "RE-INTERVIEWS",
      value: today_pulse?.reinterviews ?? 0,
      icon: <RefreshCcw />,
      sub: "Candidates returning",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      label: "PAPER ASSIGNMENTS",
      value: today_pulse?.assignments ?? 0,
      icon: <ClipboardCheck />,
      sub: "Auto & Manual allot",
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "COMPLETED TESTS",
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
    "Above Average": {
      icon: <BadgeCheck />,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
    Average: {
      icon: <Target />,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
    "Below Average": {
      icon: <Target />,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
    },
    Poor: {
      icon: <UserX />,
      color: "text-rose-500",
      bgColor: "bg-rose-500/10",
      borderColor: "border-rose-500/20",
    },
  };

  return (
    <PageContainer animate className="space-y-8">
      {/* Top Header: Title + Date Filter */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Typography
            variant="h2"
            weight="bold"
            className="text-foreground tracking-tight"
          >
            Talent Dashboard
          </Typography>
          <Typography variant="body4" className="text-muted-foreground mt-0.5">
            Overview of recruitment activities and candidate pipeline
          </Typography>
        </div>
        <div className="w-full md:w-auto">
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
        </div>
      </div>

      <div className="space-y-8">
        {/* Top: 4 Stat Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-1"
        >
          {statCards.map((card) => (
            <motion.div key={card.label} variants={itemVariants}>
              <StatCard
                label={card.label}
                value={card.value.toString()}
                icon={card.icon}
                color={card.color}
                bgColor={card.bgColor}
                borderColor={card.borderColor}
                isLoading={overviewLoading}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Middle: Dashboard Pulse & Recent Notifications */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Top-Left: Dashboard Pulse */}
          <div className="lg:col-span-2 flex flex-col">
            <DashboardMainCard
              icon={<Zap size={18} />}
              title="Dashboard Pulse"
              className="h-full flex flex-col"
              bodyClassName="p-4 sm:p-5 flex-1 flex flex-col justify-between"
            >
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 p-1 flex-1 items-stretch"
              >
                {pulseMetrics.map((metric) => (
                  <motion.div
                    key={metric.label}
                    variants={itemVariants}
                    className="h-full"
                  >
                    <PulseCard
                      {...metric}
                      isLoading={overviewLoading}
                      className="h-full"
                    />
                  </motion.div>
                ))}
              </motion.div>
            </DashboardMainCard>
          </div>

          {/* Top-Right: Recent Notifications */}
          <div className="lg:col-span-1 flex flex-col">
            <DashboardMainCard
              icon={<Bell size={18} />}
              title={
                <div className="flex items-center gap-2.5">
                  <span>Recent Notifications</span>
                  {unreadNotifCount > 0 && (
                    <Badge
                      variant="outline"
                      color="primary"
                      shape="square"
                      className="rounded-md"
                    >
                      {unreadNotifCount} new
                    </Badge>
                  )}
                </div>
              }
              action={
                unreadNotifCount > 0 ||
                notifications.some((n) => !n.is_read) ? (
                  <Button
                    variant="outline"
                    color="primary"
                    size="sm"
                    disabled={markingAllRead}
                    onClick={handleMarkAllRead}
                    className="h-8 rounded-lg text-xs font-bold px-3 flex items-center gap-1.5"
                    startIcon={
                      markingAllRead ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <CheckCheck size={13} />
                      )
                    }
                  >
                    Mark All Read
                  </Button>
                ) : null
              }
              className="h-full flex flex-col"
              bodyClassName="p-0 flex-1 flex flex-col min-h-0 overflow-hidden"
            >
              <div className="flex flex-col flex-1 min-h-0 overflow-hidden">
                <div className="flex-1 min-h-0 space-y-3 overflow-y-auto max-h-[290px] p-4 custom-scrollbar">

                  {loadingNotifications ? (
                    <RecentNotificationsListSkeleton count={3} />
                  ) : notifications.length === 0 ? (
                    <div className="py-20 flex flex-col items-center justify-center text-center p-6 space-y-2">
                      <Bell
                        size={36}
                        className="text-muted-foreground opacity-50"
                      />
                      <Typography
                        variant="body4"
                        className="text-muted-foreground"
                      >
                        No recent notifications found.
                      </Typography>
                    </div>
                  ) : (
                    notifications.map((notif) => {
                      const isRead = notif.is_read;
                      const t = notif.title?.toLowerCase() || "";
                      const tp = notif.type?.toLowerCase() || "";

                      let icon = <Bell size={18} />;
                      if (t.includes("duplicate") || tp.includes("duplicate")) {
                        icon = <AlertTriangle size={18} />;
                      } else if (
                        t.includes("unassigned") ||
                        tp.includes("unassigned")
                      ) {
                        icon = <UserX size={18} />;
                      } else if (
                        t.includes("submitted") ||
                        tp.includes("submitted")
                      ) {
                        icon = <FileCheck size={18} />;
                      } else if (
                        t.includes("interview") ||
                        t.includes("assigned") ||
                        tp.includes("assigned")
                      ) {
                        icon = <UserCheck size={18} />;
                      }

                      // Read: success color (emerald), Unread: primary color (brand-primary)
                      const colorClass = isRead
                        ? "text-emerald-500"
                        : "text-brand-primary";
                      const bgClass = isRead
                        ? "bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/30"
                        : "bg-brand-primary/10 dark:bg-brand-primary/20 border-brand-primary/30";

                      return (
                        <div
                          key={notif.id}
                          onClick={() => void handleNotificationClick(notif)}
                          className="cursor-pointer"
                        >
                          <ActivityItem
                            icon={icon}
                            title={notif.title}
                            description={
                              <NotificationFormatter message={notif.message} />
                            }
                            time={
                              <div className="flex items-center gap-2">
                                <span
                                  className={cn(
                                    "text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded border leading-none",
                                    isRead
                                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                                      : "bg-brand-primary/10 text-brand-primary border-brand-primary/20",
                                  )}
                                >
                                  {isRead ? "Read" : "Unread"}
                                </span>
                                <span className="text-muted-foreground/60 text-xs">
                                  {formatDistanceToNow(
                                    parseUTCDate(notif.created_at) ||
                                      new Date(),
                                    { addSuffix: true },
                                  )}
                                </span>
                              </div>
                            }
                            color={colorClass}
                            bgClassName={bgClass}
                            className={cn(
                              "p-3.5 border rounded-xl transition-all",
                              isRead
                                ? "border-emerald-500/20 dark:border-emerald-500/30 bg-emerald-500/[0.02] dark:bg-emerald-500/[0.04] hover:bg-emerald-500/[0.07]"
                                : "border-brand-primary/35 dark:border-brand-primary/35 bg-brand-primary/[0.04] dark:bg-brand-primary/[0.08] hover:bg-brand-primary/[0.12] shadow-xs",
                            )}
                          />
                        </div>
                      );
                    })
                  )}

                  {/* Infinite Scroll Trigger & Bottom Loader */}
                  {hasMoreNotifs && !loadingNotifications && (
                    <div
                      ref={notifObserverTarget}
                      className="py-2.5 flex justify-center items-center"
                    >
                      {loadingMoreNotifs && (
                        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full border border-border/30">
                          <Loader2
                            size={13}
                            className="animate-spin text-brand-primary"
                          />
                          <span>Loading more notifications...</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <Button
                  variant="ghost"
                  color="primary"
                  fullWidth
                  animate="scale"
                  onClick={() => router.push("/admin/notifications")}
                  className="py-3.5 mt-auto text-xs font-black uppercase tracking-widest border-t border-border/60 rounded-t-none rounded-b-2xl h-auto flex items-center justify-center gap-2 text-[#f96331] hover:text-[#f96331] shadow-none hover:bg-muted/30"
                  endIcon={<ArrowRight size={14} className="text-[#f96331]" />}
                >
                  VIEW ALL
                </Button>
              </div>
            </DashboardMainCard>
          </div>
        </div>

        {/* Bottom: Performance Insights */}
        <DashboardMainCard
          icon={<Trophy size={18} />}
          title="Performance Insights"
          className="h-full"
          bodyClassName="p-4 sm:p-5"
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 p-1"
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
        </DashboardMainCard>
      </div>
    </PageContainer>
  );
}
