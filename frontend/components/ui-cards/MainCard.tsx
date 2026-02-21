import React from "react";
import { cn } from "@lib/utils";
import { Typography } from "@components/ui-elements/Typography";

interface MainCardProps {
  /** Card heading shown in the header bar */
  title: string;
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
        "flex flex-col bg-white rounded-xl border border-slate-200/60 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_0_rgba(0,0,0,0.02)]",
        className,
      )}
    >
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
        <Typography variant="h4" as="h3">
          {title}
        </Typography>

        {action && (
          <div className="shrink-0 text-sm font-semibold text-[#F96331]">
            {action}
          </div>
        )}
      </div>

      {/* Body */}
      <div className={cn("p-5 flex-1 flex flex-col", bodyClassName)}>
        {children}
      </div>
    </div>
  );
};
