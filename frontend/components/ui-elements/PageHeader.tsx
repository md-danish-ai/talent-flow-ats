import React from "react";
import { cn } from "@/lib/utils";

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
      <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
        {title}
      </h1>
      {description && <p className="text-slate-500 mt-1">{description}</p>}
    </header>
  );
};
