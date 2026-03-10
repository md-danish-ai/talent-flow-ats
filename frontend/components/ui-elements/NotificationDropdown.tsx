"use client";

import React from "react";
import { Button } from "@components/ui-elements/Button";
import { Typography } from "@components/ui-elements/Typography";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

import { type NotificationItem } from "@lib/api";

interface NotificationDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  notifications: NotificationItem[];
  unreadCount: number;
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onToggle,
  notifications,
  unreadCount,
}) => {
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
            className="absolute right-0 mt-3 w-80 bg-card border border-border rounded-2xl shadow-xl z-50 overflow-hidden origin-top-right transition-colors"
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
                      onClick={() => onToggle()} // We'll handle read later or just dismiss
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-1">
                          <span
                            className={`block w-2.5 h-2.5 rounded-full ${!notif.is_read ? "bg-brand-primary" : "bg-muted"}`}
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <Typography variant="body4" weight="bold">
                            {notif.title}
                          </Typography>
                          <Typography
                            variant="body5"
                            className="text-muted-foreground line-clamp-2"
                          >
                            {notif.message}
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
                <Link href="/admin/notifications" passHref>
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
