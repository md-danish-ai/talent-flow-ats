"use client";

import React from "react";
import { Button } from "@components/ui-elements/Button";
import { Typography } from "@components/ui-elements/Typography";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: string | number;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

interface NotificationDropdownProps {
  isOpen: boolean;
  onToggle: () => void;
  notifications: Notification[];
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({
  isOpen,
  onToggle,
  notifications,
}) => {
  return (
    <div className="relative">
      <Button
        variant="action"
        size="rounded-icon"
        isActive={isOpen}
        onClick={onToggle}
        className="hidden sm:inline-flex"
      >
        <div className="relative flex items-center justify-center">
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
          {notifications.length > 0 && (
            <span className="absolute -top-1 -right-1 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white" />
          )}
        </div>
      </Button>

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
                <div className="divide-y divide-border"></div>
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
                <Button
                  variant="ghost"
                  color="primary"
                  className="w-full text-xs font-bold"
                  onClick={() => {}}
                >
                  View all notifications
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
