"use client";

import React from "react";
import { cn } from "@lib/utils";
import { STYLE_CONFIG } from "@lib/config/style";
import { motion } from "framer-motion";

interface DashboardMainCardProps {
  /** Card heading shown in the header bar */
  title: React.ReactNode;
  /** Optional Lucide icon shown on the left of the title */
  icon?: React.ReactNode;
  /** Optional element rendered on the right side of the header */
  action?: React.ReactNode;
  /** Main body content of the card */
  children?: React.ReactNode;
  /** Extra classes on the outer wrapper */
  className?: string;
  /** Extra classes on the header */
  headerClassName?: string;
  /** Extra classes on the content body */
  bodyClassName?: string;
}

export const DashboardMainCard: React.FC<DashboardMainCardProps> = ({
  title,
  icon,
  action,
  children,
  className = "",
  headerClassName = "",
  bodyClassName = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
      className={cn(
        "flex flex-col bg-card border border-border/80 shadow-sm transition-all duration-300 overflow-hidden",
        STYLE_CONFIG.cardRadius,
        className,
      )}
    >
      {/* Header */}
      <div
        className={cn(
          "px-6 py-4.5 border-b border-border/60 flex items-center justify-between gap-3",
          headerClassName,
        )}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {icon && (
            <span className="text-[#f96331] shrink-0 flex items-center justify-center">
              {icon}
            </span>
          )}
          <div className="flex items-center gap-2 min-w-0">
            {typeof title === "string" ? (
              <h3 className="font-bold text-base sm:text-lg text-foreground leading-tight tracking-tight">
                {title}
              </h3>
            ) : (
              title
            )}
          </div>
        </div>

        {action && <div className="shrink-0 flex items-center">{action}</div>}
      </div>

      {/* Body */}
      <div
        className={cn(
          "flex-1 flex flex-col overflow-hidden",
          bodyClassName,
          !bodyClassName.includes("p-") && "p-5",
        )}
      >
        {children}
      </div>
    </motion.div>
  );
};
