"use client";

import React, { memo } from "react";
import { NotificationItem } from "@types";
import { ActivityItem } from "@components/ui-cards/ActivityItem";
import { NotificationFormatter } from "@components/ui-elements/NotificationFormatter";
import { formatDistanceToNow } from "date-fns";
import { cn, parseUTCDate } from "@lib/utils";
import { Bell, AlertTriangle, UserX, FileCheck, UserCheck } from "lucide-react";

interface NotificationItemRowProps {
  notification: NotificationItem;
  onClick: (notification: NotificationItem) => void;
}

export const NotificationItemRow = memo(function NotificationItemRow({
  notification,
  onClick,
}: NotificationItemRowProps) {
  const isRead = notification.is_read;
  const t = notification.title?.toLowerCase() || "";
  const tp = notification.type?.toLowerCase() || "";

  let icon = <Bell size={18} />;
  if (t.includes("duplicate") || tp.includes("duplicate")) {
    icon = <AlertTriangle size={18} />;
  } else if (t.includes("unassigned") || tp.includes("unassigned")) {
    icon = <UserX size={18} />;
  } else if (t.includes("submitted") || tp.includes("submitted")) {
    icon = <FileCheck size={18} />;
  } else if (
    t.includes("interview") ||
    t.includes("assigned") ||
    tp.includes("assigned")
  ) {
    icon = <UserCheck size={18} />;
  }

  // Read: success color (emerald), Unread: primary color (brand-primary)
  const colorClass = isRead ? "text-emerald-500" : "text-brand-primary";
  const bgClass = isRead
    ? "bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/30"
    : "bg-brand-primary/10 dark:bg-brand-primary/20 border-brand-primary/30";

  return (
    <div onClick={() => onClick(notification)} className="cursor-pointer">
      <ActivityItem
        icon={icon}
        title={notification.title}
        description={<NotificationFormatter message={notification.message} />}
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
                parseUTCDate(notification.created_at) || new Date(),
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
});
