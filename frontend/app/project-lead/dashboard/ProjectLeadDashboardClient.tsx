"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { PageContainer } from "@components/ui-layout/PageContainer";
import { Users, Clock, CheckCircle } from "lucide-react";
import { StatCard } from "@components/ui-cards/StatCard";
import {
  evaluationsApi,
  getAllNotifications,
  markNotificationsRead,
} from "@lib/api";
import { EvaluationTask, NotificationItem, LeadDashboardStats } from "@types";
import { EvaluationModal } from "../users/components/EvaluationModal";
import { PendingCandidatesCard } from "./components/PendingCandidatesCard";
import { RecentNotificationsCard } from "./components/RecentNotificationsCard";

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
    void fetchDashboardData();
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
    void fetchNotifications();
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

  const handleMarkAllRead = useCallback(async () => {
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
  }, [fetchNotifications]);

  const handleNotificationClick = useCallback(
    async (notif: NotificationItem) => {
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
    },
    [],
  );

  const handleOpenEvaluation = useCallback((task: EvaluationTask) => {
    setEvaluatingTask(task);
    setIsEvalModalOpen(true);
  }, []);

  const handleEvaluationClose = useCallback(() => {
    setIsEvalModalOpen(false);
    setEvaluatingTask(null);
  }, []);

  const handleEvaluationSuccess = useCallback(() => {
    handleEvaluationClose();
    void fetchDashboardData();
  }, [handleEvaluationClose, fetchDashboardData]);

  return (
    <PageContainer className="space-y-6 flex flex-col lg:h-[calc(100vh-100px)] pb-4 pt-1.5 overflow-hidden">
      {/* Top 3 Stat Cards */}
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

      {/* Main Split Cards: Pending Candidates & Recent Notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0 overflow-hidden">
        {/* Card 1: Pending Candidates */}
        <PendingCandidatesCard
          tasks={tasks}
          pendingCount={stats.pending ?? tasks.length}
          loading={loading}
          hasMore={hasMore}
          loadingMore={loadingMore}
          observerTarget={observerTarget}
          onOpenEvaluation={handleOpenEvaluation}
        />

        {/* Card 2: Recent Notifications */}
        <RecentNotificationsCard
          notifications={notifications}
          unreadNotifCount={unreadNotifCount}
          loading={loadingNotifications}
          hasMore={hasMoreNotifs}
          loadingMore={loadingMoreNotifs}
          markingAllRead={markingAllRead}
          observerTarget={notifObserverTarget}
          onMarkAllRead={handleMarkAllRead}
          onNotificationClick={handleNotificationClick}
        />
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
    </PageContainer>
  );
}
