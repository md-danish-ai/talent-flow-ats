import React from "react";
import { cn } from "@lib/utils";
import { Typography } from "./Typography";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  action,
  className,
}) => {
  return (
    <header
      className={cn(
        "mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4",
        className,
      )}
    >
      <div className="flex-1">
        <Typography variant="h1" weight="extrabold">
          {title}
        </Typography>
        {description && (
          <Typography variant="body2" className="mt-1">
            {description}
          </Typography>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </header>
  );
};
