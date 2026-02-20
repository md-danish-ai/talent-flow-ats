import React from "react";
import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  animate?: boolean;
}

export const PageContainer: React.FC<PageContainerProps> = ({
  children,
  className,
  animate = false, // Default to false to match old behavior
}) => {
  return (
    <div
      className={cn(
        "w-full",
        animate && "animate-in fade-in slide-in-from-bottom-2 duration-500",
        className,
      )}
    >
      {children}
    </div>
  );
};
