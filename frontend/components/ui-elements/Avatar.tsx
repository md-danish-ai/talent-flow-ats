"use client";

import React from "react";
import { cn } from "@lib/utils";

interface AvatarProps {
  name?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  variant?: "brand" | "slate" | "blue" | "violet";
  hoverScale?: boolean;
  hoverRing?: boolean;
  hoverEffect?: boolean;
}

export function Avatar({
  name = "User",
  size = "md",
  className,
  variant = "brand",
  hoverScale = true,
  hoverRing = true,
  hoverEffect = true,
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

  const ringClasses = {
    brand:
      "hover:ring-2 hover:ring-brand-primary/40 hover:ring-offset-1 hover:ring-offset-background dark:hover:ring-brand-primary/50",
    slate:
      "hover:ring-2 hover:ring-slate-400/40 hover:ring-offset-1 hover:ring-offset-background dark:hover:ring-slate-500/50",
    blue: "hover:ring-2 hover:ring-blue-500/40 hover:ring-offset-1 hover:ring-offset-background dark:hover:ring-blue-400/50",
    violet:
      "hover:ring-2 hover:ring-violet-500/40 hover:ring-offset-1 hover:ring-offset-background dark:hover:ring-violet-400/50",
  };

  const hoverClasses = {
    brand:
      "hover:bg-orange-100/80 hover:border-orange-300 dark:hover:bg-orange-950/40 dark:hover:border-orange-800/60 hover:shadow-[0_4px_12px_rgba(249,115,22,0.25)] dark:hover:shadow-[0_4px_14px_rgba(249,115,22,0.35)]",
    slate:
      "hover:bg-slate-100 hover:border-slate-300 dark:hover:bg-slate-800/60 dark:hover:border-slate-700 hover:shadow-[0_4px_12px_rgba(100,116,139,0.2)] dark:hover:shadow-[0_4px_14px_rgba(0,0,0,0.4)]",
    blue: "hover:bg-blue-100/80 hover:border-blue-300 dark:hover:bg-blue-950/40 dark:hover:border-blue-800/60 hover:shadow-[0_4px_12px_rgba(59,130,246,0.25)] dark:hover:shadow-[0_4px_14px_rgba(59,130,246,0.35)]",
    violet:
      "hover:bg-violet-100/80 hover:border-violet-300 dark:hover:bg-violet-950/40 dark:hover:border-violet-800/60 hover:shadow-[0_4px_12px_rgba(139,92,246,0.25)] dark:hover:shadow-[0_4px_14px_rgba(139,92,246,0.35)]",
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center font-extrabold border shadow-sm shrink-0 select-none",
        sizeClasses[size],
        variantClasses[variant],
        (hoverScale || hoverRing || hoverEffect) &&
          "transition-all duration-[80ms] ease-out",
        hoverScale && "hover:scale-110 active:scale-95",
        hoverRing && ringClasses[variant],
        hoverEffect && hoverClasses[variant],
        className,
      )}
    >
      {initial}
    </div>
  );
}
