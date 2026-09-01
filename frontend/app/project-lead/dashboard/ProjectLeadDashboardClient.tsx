"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { Typography } from "@components/ui-elements/Typography";
import { Badge } from "@components/ui-elements/Badge";
import { MainCard } from "@components/ui-cards/MainCard";
import {
  Users,
  Clock,
  CheckCircle,
  Bell,
  X,
  AlertTriangle,
  UserX,
  FileCheck,
  UserCheck,
  ClipboardEdit,
  Eye,
  ArrowRight,
  Loader2,
  CheckCheck,
} from "lucide-react";
import { StatCard } from "@components/ui-cards/StatCard";
import {
  evaluationsApi,
  getAllNotifications,
  markNotificationsRead,
} from "@lib/api";
import { EvaluationTask, NotificationItem, LeadDashboardStats } from "@types";
import Link from "next/link";
import { Button } from "@components/ui-elements/Button";
import { cn, formatDateTime, parseUTCDate } from "@lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ActivityItem } from "@components/ui-cards/ActivityItem";
import { NotificationFormatter } from "@components/ui-elements/NotificationFormatter";
import { formatDistanceToNow } from "date-fns";
import { EvaluationModal } from "../users/components/EvaluationModal";
import {
  PendingCandidatesListSkeleton,
  RecentNotificationsListSkeleton,
} from "@components/ui-skeleton/ProjectLeadDashboardSkeleton";

interface ProjectLeadDashboardClientProps {
  leadId: number;
}

export default function ProjectLeadDashboardClient({
  leadId,
}: ProjectLeadDashboardClientProps) {
  const [stats, setStats] = useState<LeadDashboardStats>({
    total_assigned: 0,
    pending: 0,
    completed: 0,
  });
  const [tasks, setTasks] = useState<EvaluationTask[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingNotifications, setLoadingNotifications] = useState(true);

  // Infinite Scroll Pagination State (Candidates)
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const loadingMoreRef = useRef(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  // Infinite Scroll Pagination State (Notifications)
  const [hasMoreNotifs, setHasMoreNotifs] = useState(true);
  const [loadingMoreNotifs, setLoadingMoreNotifs] = useState(false);
  const notifPageRef = useRef(1);
  const hasMoreNotifsRef = useRef(true);
  const loadingMoreNotifsRef = useRef(false);
  const notifObserverTarget = useRef<HTMLDivElement>(null);
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [markingAllRead, setMarkingAllRead] = useState(false);

  // Selected task for Evaluation Modal
  const [evaluatingTask, setEvaluatingTask] = useState<EvaluationTask | null>(
    null,
  );
  const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);

  const [selectedNotification, setSelectedNotification] =
    useState<NotificationItem | null>(null);

  const fetchDashboardData = useCallback(
    async (silent = false) => {
      if (!leadId) return;
      try {
        if (!silent) setLoading(true);
        pageRef.current = 1;
        const [statsRes, tasksRes] = await Promise.all([
          evaluationsApi.getLeadDashboardStats(leadId),
          evaluationsApi.getLeadTasks(leadId, {
            status: "pending",
            page: 1,
            limit: 10,
          }),
        ]);

        if (statsRes) {
          const statsData =
            (statsRes as unknown as { data?: LeadDashboardStats })?.data ??
            (statsRes as LeadDashboardStats);
          setStats(statsData);
        }

        const initialTasks = tasksRes?.data || [];
        setTasks(initialTasks);

        const totalPages = tasksRes?.pagination?.total_pages || 1;
        const canLoadMore = 1 < totalPages;
        hasMoreRef.current = canLoadMore;
        setHasMore(canLoadMore);
      } catch (err) {
        console.error("Failed to fetch dashboard stats/tasks", err);
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [leadId],
  );

  const loadMoreTasks = useCallback(async () => {
    if (!leadId || loading || loadingMoreRef.current || !hasMoreRef.current)
      return;
    try {
      loadingMoreRef.current = true;
      setLoadingMore(true);
      const nextPage = pageRef.current + 1;
      const res = await evaluationsApi.getLeadTasks(leadId, {
        status: "pending",
        page: nextPage,
        limit: 10,
      });

      const newTasks = res?.data || [];
      if (newTasks.length > 0) {
        setTasks((prev) => {
          const existingIds = new Set(prev.map((t) => t.id));
          const uniqueNew = newTasks.filter((t) => !existingIds.has(t.id));
          return [...prev, ...uniqueNew];
        });
        pageRef.current = nextPage;
      }

      const totalPages = res?.pagination?.total_pages || 1;
      const canLoadMore = nextPage < totalPages;
      hasMoreRef.current = canLoadMore;
      setHasMore(canLoadMore);
    } catch (err) {
      console.error("Failed to load more tasks", err);
    } finally {
      loadingMoreRef.current = false;
      setLoadingMore(false);
    }
  }, [leadId, loading]);

  const fetchNotifications = useCallback(async () => {
    try {
      setLoadingNotifications(true);
      notifPageRef.current = 1;
      const res = await getAllNotifications({ page: 1, limit: 10 });
      const notifsData = res?.data || [];
      setNotifications(notifsData);
      setUnreadNotifCount(
        res?.unread_count ?? notifsData.filter((n) => !n.is_read).length,
      );

      const totalPages = res?.pagination?.total_pages || 1;
      const canLoadMore = 1 < totalPages;
      hasMoreNotifsRef.current = canLoadMore;
      setHasMoreNotifs(canLoadMore);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    } finally {
      setLoadingNotifications(false);
    }
  }, []);

  const loadMoreNotifications = useCallback(async () => {
    if (
      loadingNotifications ||
      loadingMoreNotifsRef.current ||
      !hasMoreNotifsRef.current
    )
      return;
    try {
      loadingMoreNotifsRef.current = true;
      setLoadingMoreNotifs(true);
      const nextPage = notifPageRef.current + 1;
      const res = await getAllNotifications({ page: nextPage, limit: 10 });

      const newNotifs = res?.data || [];
      if (newNotifs.length > 0) {
        setNotifications((prev) => {
          const existingIds = new Set(prev.map((n) => n.id));
          const uniqueNew = newNotifs.filter((n) => !existingIds.has(n.id));
          return [...prev, ...uniqueNew];
        });
        notifPageRef.current = nextPage;
      }

      if (res?.unread_count !== undefined) {
        setUnreadNotifCount(res.unread_count);
      }

      const totalPages = res?.pagination?.total_pages || 1;
      const canLoadMore = nextPage < totalPages;
      hasMoreNotifsRef.current = canLoadMore;
      setHasMoreNotifs(canLoadMore);
    } catch (err) {
      console.error("Failed to load more notifications", err);
    } finally {
      loadingMoreNotifsRef.current = false;
      setLoadingMoreNotifs(false);
    }
  }, [loadingNotifications]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Observer for triggering next page load on scroll (Candidates)
  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMoreRef.current &&
          !loading &&
          !loadingMoreRef.current
        ) {
          void loadMoreTasks();
        }
      },
      { threshold: 0.1 },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [loadMoreTasks, loading]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Observer for triggering next page load on scroll (Notifications)
  useEffect(() => {
    const target = notifObserverTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMoreNotifsRef.current &&
          !loadingNotifications &&
          !loadingMoreNotifsRef.current
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
      void fetchDashboardData(true);
    };
    window.addEventListener("notificationsUpdated", handleUpdate);
    return () =>
      window.removeEventListener("notificationsUpdated", handleUpdate);
  }, [fetchNotifications, fetchDashboardData]);

  const handleMarkAllRead = async () => {
    try {
      setMarkingAllRead(true);
      // Passing empty list [] marks ALL unread notifications in the DB as read
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
    setSelectedNotification(notif);
    if (!notif.is_read) {
      try {
        await markNotificationsRead([notif.id]);
        setNotifications((prev) =>
          prev.map((n) => (n.id === notif.id ? { ...n, is_read: true } : n)),
        );
        setSelectedNotification((prev) =>
          prev ? { ...prev, is_read: true } : null,
        );
        setUnreadNotifCount((prev) => Math.max(0, prev - 1));
        window.dispatchEvent(new CustomEvent("notificationsUpdated"));
      } catch (err) {
        console.error("Failed to mark notification as read", err);
      }
    }
  };

  const handleOpenEvaluation = (task: EvaluationTask) => {
    setEvaluatingTask(task);
    setIsEvalModalOpen(true);
  };

  const handleEvaluationClose = () => {
    setIsEvalModalOpen(false);
    setEvaluatingTask(null);
  };

  const handleEvaluationSuccess = () => {
    handleEvaluationClose();
    void fetchDashboardData();
  };

  return (
    <PageContainer className="space-y-6 flex flex-col lg:h-[calc(100vh-100px)] pb-4 pt-1.5 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 shrink-0 p-1">
        <StatCard
          label="Total Assigned"
          value={(stats.total_assigned ?? 0).toString()}
          icon={<Users />}
          color="text-brand-primary"
          bgColor="bg-brand-primary/10"
          isLoading={loading}
        />
        <StatCard
          label="Pending Interviews"
          value={(stats.pending ?? 0).toString()}
          icon={<Clock />}
          color="text-amber-500"
          bgColor="bg-amber-500/10"
          isLoading={loading}
        />
        <StatCard
          label="Completed"
          value={(stats.completed ?? 0).toString()}
          icon={<CheckCircle />}
          color="text-emerald-500"
          bgColor="bg-emerald-500/10"
          isLoading={loading}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0 overflow-hidden">
        {/* Card 1: Pending Candidates */}
        <MainCard
          icon={<Users size={18} />}
          title={
            <div className="flex items-center gap-2.5">
              <span>Pending Candidates</span>
              <Badge
                variant="outline"
                color="primary"
                shape="square"
                className="rounded-md"
              >
                {stats.pending ?? tasks.length} new
              </Badge>
            </div>
          }
          action={
            <Link href="/project-lead/users">
              <Button
                variant="outline"
                color="primary"
                size="sm"
                className="h-8 rounded-lg text-xs font-bold px-3 flex items-center gap-1.5"
                endIcon={<ArrowRight size={13} />}
              >
                View All
              </Button>
            </Link>
          }
          className="overflow-hidden flex flex-col h-full min-h-[350px]"
          bodyClassName="p-0 flex-1 overflow-hidden flex flex-col"
        >
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              <PendingCandidatesListSkeleton count={4} />
            ) : tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-2">
                <Users size={36} className="text-muted-foreground opacity-50" />
                <Typography variant="body4" className="text-muted-foreground">
                  No pending candidates assigned to you.
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
                        {task.round_type && (
                          <span className="text-[10px] font-black uppercase tracking-wider text-brand-primary px-1.5 py-0.5 bg-brand-primary/5 rounded border border-brand-primary/20">
                            {task.round_type}
                          </span>
                        )}
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
                    variant={task.status === "pending" ? "primary" : "outline"}
                    color={task.status === "pending" ? "primary" : "success"}
                    size="sm"
                    className="rounded-lg h-8 text-[11px] font-extrabold flex items-center gap-1.5"
                    startIcon={
                      task.status === "pending" ? (
                        <ClipboardEdit size={13} />
                      ) : (
                        <Eye size={13} />
                      )
                    }
                    onClick={() => handleOpenEvaluation(task)}
                  >
                    {task.status === "pending"
                      ? "Start Evaluation"
                      : "View Evaluation"}
                  </Button>
                </div>
              ))
            )}

            {/* Infinite Scroll Trigger & Bottom Loader */}
            {hasMore && !loading && (
              <div
                ref={observerTarget}
                className="py-2.5 flex justify-center items-center"
              >
                {loadingMore && (
                  <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-full border border-border/30">
                    <Loader2
                      size={13}
                      className="animate-spin text-brand-primary"
                    />
                    <span>Loading more candidates...</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </MainCard>

        {/* Card 2: Recent Notifications */}
        <MainCard
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
            unreadNotifCount > 0 || notifications.some((n) => !n.is_read) ? (
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
          className="overflow-hidden flex flex-col h-full min-h-[350px]"
          bodyClassName="p-0 flex-1 overflow-hidden flex flex-col"
        >
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loadingNotifications ? (
              <RecentNotificationsListSkeleton count={4} />
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-2">
                <Bell size={36} className="text-muted-foreground opacity-50" />
                <Typography variant="body4" className="text-muted-foreground">
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
                              parseUTCDate(notif.created_at) || new Date(),
                              {
                                addSuffix: true,
                              },
                            )}
                          </span>
                        </div>
                      }
                      color={colorClass}
                      bgClassName={bgClass}
                      className={cn(
                        "p-3.5 border rounded-xl transition-all",
                        isRead
                          ? "border-emerald-500/20 dark:border-emerald-500/20 bg-emerald-500/[0.02] dark:bg-emerald-500/[0.04] hover:bg-emerald-500/[0.07]"
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
        </MainCard>
      </div>

      {/* Full Evaluation Modal */}
      {evaluatingTask && (
        <EvaluationModal
          isOpen={isEvalModalOpen}
          onClose={handleEvaluationClose}
          userId={evaluatingTask.user_id}
          evaluationId={evaluatingTask.id}
          candidateName={evaluatingTask.candidate_name}
          roundType={evaluatingTask.round_type}
          onSuccess={handleEvaluationSuccess}
        />
      )}

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
                  <div className="text-foreground leading-relaxed text-sm">
                    <NotificationFormatter
                      message={selectedNotification.message}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-2">
                  <span>
                    Received on{" "}
                    {formatDateTime(selectedNotification.created_at)}
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
                  variant="outline"
                  color="primary"
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
