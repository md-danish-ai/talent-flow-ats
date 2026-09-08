import React from "react";
import { cn } from "@lib/utils";
import { STYLE_CONFIG } from "@lib/config/style";
import { motion } from "framer-motion";

interface MainCardProps {
  /** Card heading shown in the header bar */
  title: React.ReactNode;
  /** Optional icon shown on the left of the title (with standard container) */
  icon?: React.ReactNode;
  /** Optional subtitle shown under the heading */
  subtitle?: React.ReactNode;
  /** Optional element rendered on the right side of the header (e.g. a button or link) */
  action?: React.ReactNode;
  /** Main body content of the card (optional if using children) */
  children?: React.ReactNode;
  /** Extra classes on the outer wrapper */
  className?: string;
  /** Extra classes on the content body */
  bodyClassName?: string;
  /** Optional click handler for the entire header bar */
  onHeaderClick?: () => void;
}

export const MainCard: React.FC<MainCardProps> = ({
  title,
  icon,
  subtitle,
  action,
  children,
  className = "",
  bodyClassName = "",
  onHeaderClick,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        type: "spring",
        stiffness: 100,
        damping: 15,
      }}
      className={cn(
        "flex flex-col bg-card border border-border shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_0_rgba(0,0,0,0.02)] transition-colors overflow-hidden",
        STYLE_CONFIG.cardRadius,
        className,
      )}
    >
      <div
        onClick={onHeaderClick}
        className={cn(
          "px-6 py-4.5 border-b border-border flex items-center justify-between gap-3 transition-colors duration-300",
          onHeaderClick &&
            "cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50",
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          {icon && (
            <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0">
              {icon}
            </div>
          )}
          <div className="flex flex-col gap-0.5 min-w-0">
            {typeof title === "string" ? (
              <span className="font-bold text-[17px] sm:text-lg text-slate-900 dark:text-white leading-tight">
                {title}
              </span>
            ) : (
              title
            )}
            {subtitle && (
              <p className="text-[11.5px] sm:text-xs text-muted-foreground font-medium tracking-wide">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {action && (
          <div className="shrink-0 text-sm font-semibold text-brand-primary">
            {action}
          </div>
        )}
      </div>

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
