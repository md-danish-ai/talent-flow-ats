"use client";

import React from "react";
import { cn } from "@lib/utils";

interface AvatarProps {
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  variant?: "brand" | "slate" | "blue" | "violet";
}

export function Avatar({
  name = "User",
  size = "md",
  className,
  variant = "brand",
}: AvatarProps) {
  const getInitials = (nameStr: string) => {
    const parts = nameStr.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    }
    return parts[0].charAt(0).toUpperCase();
  };

  const initial = getInitials(name);

  const sizeClasses = {
    sm: "w-8 h-8 text-[11px] rounded-lg",
    md: "w-9 h-9 text-[13px] rounded-xl",
    lg: "w-11 h-11 text-[16px] rounded-2xl",
  };

  const variantClasses = {
    brand:
      "bg-orange-50 border-orange-200 text-orange-600 dark:bg-orange-950/20 dark:border-orange-900/40 dark:text-orange-400",
    slate:
      "bg-slate-50 border-slate-200 text-slate-600 dark:bg-slate-900/40 dark:border-slate-800 dark:text-slate-400",
    blue: "bg-blue-50 border-blue-200 text-blue-600 dark:bg-blue-950/20 dark:border-blue-900/40 dark:text-blue-400",
    violet:
      "bg-violet-50 border-violet-200 text-violet-600 dark:bg-violet-950/20 dark:border-violet-900/40 dark:text-violet-400",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center font-extrabold border shadow-sm shrink-0",
        sizeClasses[size],
        variantClasses[variant],
        className,
      )}
    >
      {initial}
    </div>
  );
}
