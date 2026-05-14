"use client";

import React from "react";
import { Button } from "@components/ui-elements/Button";
import { Typography } from "@components/ui-elements/Typography";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Bell, UserCheck, UserX, FileCheck, AlertTriangle } from "lucide-react";
import { NotificationFormatter } from "./NotificationFormatter";

import { markNotificationsRead } from "@lib/api";
import { type NotificationItem } from "@types";

interface NotificationDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  notifications: NotificationItem[];
  unreadCount: number;
  role?: string;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onToggle,
  notifications,
  unreadCount,
  role,
}) => {
  React.useEffect(() => {
    (
      window as Window & { isNotificationDropdownOpen?: boolean }
    ).isNotificationDropdownOpen = isOpen;
    return () => {
      (
        window as Window & { isNotificationDropdownOpen?: boolean }
      ).isNotificationDropdownOpen = false;
    };
  }, [isOpen]);

  return (
    <div className="relative">
      <div className="relative inline-flex">
        <Button
          variant="action"
          size="rounded-icon"
          isActive={isOpen}
          onClick={onToggle}
          className="hidden sm:inline-flex"
        >
          <motion.div
            whileHover={{ rotate: [0, -20, 20, -20, 20, 0] }}
            transition={{ duration: 0.4 }}
            className="flex items-center justify-center"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.8}
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>
          </motion.div>
        </Button>

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center px-1 rounded-full bg-red-500 text-[9px] font-black text-white ring-2 ring-background min-w-[18px] h-[18px] shadow-sm animate-in zoom-in duration-300 pointer-events-none z-20">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{
              duration: 0.3,
              ease: [0.23, 1, 0.32, 1],
            }}
            className="absolute right-0 mt-3 w-[450px] bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden origin-top-right transition-colors"
          >
            <div className="px-5 py-4 border-b border-border bg-muted/20 flex items-center justify-between">
              <Typography variant="body3" weight="bold" color="text-foreground">
                Notifications
              </Typography>
              <Typography
                as="span"
                variant="body5"
                weight="bold"
                className="bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-full uppercase"
              >
                New
              </Typography>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {notifications.length > 0 ? (
                <div className="divide-y divide-border">
                  {notifications.map((notif: NotificationItem) => (
                    <div
                      key={notif.id}
                      className={`p-4 transition-colors hover:bg-muted/50 w-full text-left cursor-pointer ${
                        !notif.is_read ? "bg-brand-primary/5" : ""
                      }`}
                      onClick={async () => {
                        if (!notif.is_read) {
                          try {
                            await markNotificationsRead([notif.id]);
                            window.dispatchEvent(
                              new CustomEvent("notificationsUpdated"),
                            );
                          } catch (error) {
                            console.error(
                              "Failed to mark notification as read:",
                              error,
                            );
                          }
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {(() => {
                            const t = notif.title?.toLowerCase() || "";
                            const tp = notif.type?.toLowerCase() || "";
                            const isRead = notif.is_read;

                            let icon = (
                              <Bell size={14} className="text-slate-500" />
                            );
                            let bgClass =
                              "bg-slate-100 dark:bg-slate-800 text-slate-500";
                            let dotBgClass = "bg-slate-500";

                            if (
                              t.includes("duplicate") ||
                              tp.includes("duplicate")
                            ) {
                              icon = (
                                <AlertTriangle
                                  size={14}
                                  className="text-amber-500"
                                />
                              );
                              bgClass = isRead
                                ? "bg-amber-500/5 text-amber-500/60"
                                : "bg-amber-500/10 dark:bg-amber-500/20";
                              dotBgClass = "bg-amber-500";
                            } else if (
                              t.includes("unassigned") ||
                              tp.includes("unassigned")
                            ) {
                              icon = (
                                <UserX size={14} className="text-red-500" />
                              );
                              bgClass = isRead
                                ? "bg-red-500/5 text-red-500/60"
                                : "bg-red-500/10 dark:bg-red-500/20";
                              dotBgClass = "bg-red-500";
                            } else if (
                              t.includes("submitted") ||
                              tp.includes("submitted")
                            ) {
                              icon = (
                                <FileCheck
                                  size={14}
                                  className="text-emerald-500"
                                />
                              );
                              bgClass = isRead
                                ? "bg-emerald-500/5 text-emerald-500/60"
                                : "bg-emerald-500/10 dark:bg-emerald-500/20";
                              dotBgClass = "bg-emerald-500";
                            } else if (
                              t.includes("interview") ||
                              t.includes("assigned") ||
                              tp.includes("assigned")
                            ) {
                              icon = (
                                <UserCheck
                                  size={14}
                                  className="text-brand-primary"
                                />
                              );
                              bgClass = isRead
                                ? "bg-brand-primary/5 text-brand-primary/60"
                                : "bg-brand-primary/10 dark:bg-brand-primary/20";
                              dotBgClass = "bg-brand-primary";
                            }

                            return (
                              <div
                                className={`relative flex items-center justify-center w-8 h-8 rounded-full ${bgClass}`}
                              >
                                {icon}
                                {!isRead && (
                                  <span
                                    className={`absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ${dotBgClass}`}
                                  />
                                )}
                              </div>
                            );
                          })()}
                        </div>
                        <div className="flex-1 space-y-1">
                          <Typography
                            variant="body4"
                            weight="bold"
                            className={
                              notif.title?.toLowerCase().includes("duplicate")
                                ? "text-amber-500 dark:text-amber-400"
                                : notif.title
                                      ?.toLowerCase()
                                      .includes("evaluation")
                                  ? "text-emerald-500 dark:text-emerald-400"
                                  : notif.title
                                        ?.toLowerCase()
                                        .includes("unassigned")
                                    ? "text-red-500 dark:text-red-400"
                                    : ""
                            }
                          >
                            {notif.title}
                          </Typography>
                          <Typography
                            variant="body5"
                            className="text-muted-foreground line-clamp-2"
                          >
                            <NotificationFormatter message={notif.message} />
                          </Typography>
                          <Typography
                            variant="body5"
                            className="text-muted-foreground/60"
                          >
                            {new Date(notif.created_at).toLocaleDateString()}{" "}
                            {new Date(notif.created_at).toLocaleTimeString()}
                          </Typography>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 px-5 text-center">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-muted-foreground/30"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                      />
                    </svg>
                  </div>
                  <Typography
                    variant="body3"
                    weight="bold"
                    color="text-foreground"
                    className="mb-1"
                  >
                    No new notifications
                  </Typography>
                  <Typography variant="body5" className="text-muted-foreground">
                    We&apos;ll let you know when something important happens.
                  </Typography>
                </div>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="p-3 border-t border-border bg-muted/30">
                <Link
                  href={
                    role === "project_lead"
                      ? "/project-lead/notifications"
                      : "/admin/notifications"
                  }
                  passHref
                >
                  <Button
                    variant="ghost"
                    color="primary"
                    className="w-full text-xs font-bold"
                    onClick={() => onToggle()}
                  >
                    View all notifications
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
