import React from "react";
import { cn } from "@lib/utils";

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-7xl bg-white h-full min-h-[calc(100vh-8rem)] rounded-xl shadow-sm border border-gray-100 p-6 sm:p-8",
        className,
      )}
    >
      {children}
    </div>
  );
};
