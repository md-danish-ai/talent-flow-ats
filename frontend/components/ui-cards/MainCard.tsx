import React from "react";
import { cn } from "@lib/utils";
import { Typography } from "@components/ui-elements/Typography";

interface MainCardProps {
  /** Card heading shown in the header bar */
  title: React.ReactNode;
  /** Optional element rendered on the right side of the header (e.g. a button or link) */
  action?: React.ReactNode;
  /** Main body content of the card (optional if using children) */
  children?: React.ReactNode;
  /** Extra classes on the outer wrapper */
  className?: string;
  /** Extra classes on the content body */
  bodyClassName?: string;
}

export const MainCard: React.FC<MainCardProps> = ({
  title,
  action,
  children,
  className = "",
  bodyClassName = "",
}) => {
  return (
    <div
      className={cn(
        "flex flex-col bg-card rounded-xl border border-border shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_0_rgba(0,0,0,0.02)] transition-colors overflow-hidden",
        className,
      )}
    >
      <div className="px-6 py-5 border-b border-border flex items-center justify-between gap-3">
        <Typography
          variant="h4"
          as="h3"
          weight="extrabold"
          className="flex items-center gap-2.5 text-foreground tracking-tight"
        >
          {title}
        </Typography>

        {action && (
          <div className="shrink-0 text-sm font-semibold text-brand-primary">
            {action}
          </div>
        )}
      </div>

      <div className={cn("p-5 flex-1 flex flex-col", bodyClassName)}>
        {children}
      </div>
    </div>
  );
};
