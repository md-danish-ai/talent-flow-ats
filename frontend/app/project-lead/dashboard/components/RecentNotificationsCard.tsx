"use client";

import React, { memo, RefObject } from "react";
import { Bell, Loader2, CheckCheck } from "lucide-react";
import { MainCard } from "@components/ui-cards/MainCard";
import { Badge } from "@components/ui-elements/Badge";
import { Button } from "@components/ui-elements/Button";
import { Typography } from "@components/ui-elements/Typography";
import { NotificationItem } from "@types";
import { RecentNotificationsListSkeleton } from "@components/ui-skeleton/ProjectLeadDashboardSkeleton";
import { NotificationItemRow } from "./NotificationItemRow";

interface RecentNotificationsCardProps {
  notifications: NotificationItem[];
  unreadNotifCount: number;
  loading: boolean;
  hasMore: boolean;
  loadingMore: boolean;
  markingAllRead: boolean;
  observerTarget: RefObject<HTMLDivElement | null>;
  onMarkAllRead: () => void;
  onNotificationClick: (notif: NotificationItem) => void;
}

export const RecentNotificationsCard = memo(function RecentNotificationsCard({
  notifications,
  unreadNotifCount,
  loading,
  hasMore,
  loadingMore,
  markingAllRead,
  observerTarget,
  onMarkAllRead,
  onNotificationClick,
}: RecentNotificationsCardProps) {
  const hasUnread =
    unreadNotifCount > 0 || notifications.some((n) => !n.is_read);

  return (
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
        hasUnread ? (
          <Button
            variant="outline"
            color="primary"
            size="sm"
            disabled={markingAllRead}
            onClick={onMarkAllRead}
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
        {loading ? (
          <RecentNotificationsListSkeleton count={4} />
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-2">
            <Bell size={36} className="text-muted-foreground opacity-50" />
            <Typography variant="body4" className="text-muted-foreground">
              No recent notifications found.
            </Typography>
          </div>
        ) : (
          notifications.map((notif) => (
            <NotificationItemRow
              key={notif.id}
              notification={notif}
              onClick={onNotificationClick}
            />
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
                <span>Loading more notifications...</span>
              </div>
            )}
          </div>
        )}
      </div>
    </MainCard>
  );
});
