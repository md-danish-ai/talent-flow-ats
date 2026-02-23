import React from "react";
import { cn } from "@lib/utils";
import { Typography } from "@components/ui-elements/Typography";

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
  bodyClassName?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  children,
  className = "",
  icon,
  bodyClassName = "",
}) => {
  return (
    <div
      className={cn(
        "flex flex-col bg-white rounded-xl border border-slate-200/60 shadow-[0_2px_4px_rgba(0,0,0,0.02),0_1px_0_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_20px_25px_-5px_theme(colors.brand-primary/10%),0_8px_10px_-6px_theme(colors.brand-primary/10%)] hover:border-brand-primary/30",
        className,
      )}
    >
      {(title || icon) && (
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
          {icon && (
            <div className="text-[var(--color-brand-primary)]">{icon}</div>
          )}
          {title && (
            <Typography variant="h4" as="h3">
              {title}
            </Typography>
          )}
        </div>
      )}
      <div className={cn("p-5 flex-1 flex flex-col", bodyClassName)}>
        {children}
      </div>
    </div>
  );
};
