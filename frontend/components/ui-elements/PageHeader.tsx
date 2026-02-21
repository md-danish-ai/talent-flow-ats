import React from "react";
import { cn } from "@lib/utils";
import { Typography } from "./Typography";

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  className,
}) => {
  return (
    <header className={cn("mb-8", className)}>
      <Typography variant="h1" weight="extrabold">
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" className="mt-1">
          {description}
        </Typography>
      )}
    </header>
  );
};
