import React from "react";
import { motion } from "framer-motion";
import { Bell, Mail, MailOpen } from "lucide-react";
import { cn } from "@lib/utils";
import { Typography } from "@components/ui-elements/Typography";

interface NotificationSummaryProps {
  counts: {
    read: number;
    unread: number;
    total: number;
  };
  statusFilter: "all" | "unread" | "read";
  onFilterChange: (filter: "all" | "unread" | "read") => void;
}

export const NotificationSummary = React.memo<NotificationSummaryProps>(
  ({ counts, statusFilter, onFilterChange }) => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 border-b border-border bg-muted/5">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => onFilterChange("all")}
          className={cn(
            "bg-background border-2 rounded-2xl p-4 flex items-center gap-4 transition-all hover:shadow-lg cursor-pointer",
            statusFilter === "all"
              ? "border-brand-primary shadow-md shadow-brand-primary/10"
              : "border-border/60 hover:border-brand-primary/50",
          )}
        >
          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
            <Bell size={20} />
          </div>
          <div>
            <Typography
              variant="body5"
              className="text-muted-foreground font-medium uppercase tracking-wider text-[10px]"
            >
              Total Received
            </Typography>
            <Typography variant="h4" weight="bold" className="tabular-nums">
              {counts.read + counts.unread}
            </Typography>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={() => onFilterChange("unread")}
          className={cn(
            "bg-background border-2 rounded-2xl p-4 flex items-center gap-4 transition-all hover:shadow-lg cursor-pointer",
            statusFilter === "unread"
              ? "border-brand-primary shadow-md shadow-brand-primary/10"
              : "border-border/60 hover:border-brand-primary/50",
          )}
        >
          <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
            <Mail size={20} />
          </div>
          <div>
            <Typography
              variant="body5"
              className="text-brand-primary/70 font-medium uppercase tracking-wider text-[10px]"
            >
              Unread Alerts
            </Typography>
            <Typography
              variant="h4"
              weight="bold"
              className="text-brand-primary tabular-nums"
            >
              {counts.unread}
            </Typography>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onClick={() => onFilterChange("read")}
          className={cn(
            "bg-background border-2 rounded-2xl p-4 flex items-center gap-4 transition-all hover:shadow-lg cursor-pointer",
            statusFilter === "read"
              ? "border-slate-500 shadow-md shadow-slate-500/10"
              : "border-border/60 hover:border-slate-500/50",
          )}
        >
          <div className="w-10 h-10 rounded-xl bg-slate-500/10 flex items-center justify-center text-slate-500">
            <MailOpen size={20} />
          </div>
          <div>
            <Typography
              variant="body5"
              className="text-slate-500/70 font-medium uppercase tracking-wider text-[10px]"
            >
              Processed (Read)
            </Typography>
            <Typography
              variant="h4"
              weight="bold"
              className="text-slate-500 tabular-nums"
            >
              {counts.read}
            </Typography>
          </div>
        </motion.div>
      </div>
    );
  },
);

NotificationSummary.displayName = "NotificationSummary";
