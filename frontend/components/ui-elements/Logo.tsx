"use client";

import React from "react";
import { cn } from "@lib/utils";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: "sm" | "md" | "lg";
}

export const Logo: React.FC<LogoProps> = ({
  className,
  iconOnly = false,
  size = "md",
}) => {
  const iconSizes = {
    sm: "w-7 h-7",
    md: "w-9 h-9",
    lg: "w-11 h-11",
  };

  const containerSizes = {
    sm: "gap-2",
    md: "gap-2.5",
    lg: "gap-3.5",
  };

  const textSizes = {
    sm: "text-[13px]",
    md: "text-[16px]",
    lg: "text-xl",
  };

  return (
    <div className={cn("flex items-center select-none group", containerSizes[size], className)}>
      {/* Solid Icon Container */}
      <div 
        className={cn(
          "relative flex items-center justify-center shrink-0 rounded-[1.2rem] bg-brand-primary/10 shadow-[0_0_20px_rgba(var(--color-brand-primary-rgb),0.1)] transition-all duration-300 group-hover:bg-brand-primary/15 group-hover:shadow-[0_0_25px_rgba(var(--color-brand-primary-rgb),0.2)]",
          iconSizes[size]
        )}
      >
        {/* The Solid Caret "A" SVG */}
        <svg 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-[55%] h-[55%] text-brand-primary drop-shadow-[0_0_10px_rgba(var(--color-brand-primary-rgb),0.4)] transition-transform duration-500 group-hover:scale-110"
        >
          <path 
            d="M3 19L12 5L21 19" 
            stroke="currentColor" 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
        </svg>
      </div>

      {!iconOnly && (
        <span className={cn(
          "font-extrabold tracking-tighter text-slate-900 dark:text-white uppercase transition-all duration-300 group-hover:text-brand-primary",
          textSizes[size]
        )}>
          ArcInterview
        </span>
      )}
    </div>
  );
};
