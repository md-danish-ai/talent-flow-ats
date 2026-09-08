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
    sm: "w-8 h-8 rounded-[9px]",
    md: "w-10 h-10 rounded-[12px]",
    lg: "w-12 h-12 rounded-[14px]",
  };

  const containerSizes = {
    sm: "gap-2.5",
    md: "gap-3",
    lg: "gap-3.5",
  };

  const textSizes = {
    sm: "text-[17px]",
    md: "text-[21px]",
    lg: "text-[26px]",
  };

  return (
    <div
      className={cn(
        "flex items-center select-none group cursor-pointer py-1",
        containerSizes[size],
        className,
      )}
    >
      {/* Gradient Icon Container */}
      <div
        className={cn(
          "relative flex items-center justify-center shrink-0 overflow-hidden",
          "bg-gradient-to-br from-[#ff7d4d] via-brand-primary to-[#e24c1e]",
          "shadow-[0_2px_10px_rgba(249,99,49,0.32)] transition-all duration-300",
          "group-hover:scale-105 group-hover:shadow-[0_4px_14px_rgba(249,99,49,0.45)] group-hover:brightness-105",
          iconSizes[size],
        )}
      >
        {/* Subtle Glassmorphic Highlight */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/25 via-transparent to-black/10 pointer-events-none" />

        {/* Creative Stylized Interview Icon */}
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative z-10 w-[58%] h-[58%] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.2)] transition-transform duration-300 group-hover:scale-110"
        >
          {/* Main Chat Bubble Frame */}
          <path
            d="M7 17.5L3.5 20.5V6C3.5 4.61929 4.61929 3.5 6 3.5H18C19.3807 3.5 20.5 4.61929 20.5 6V15C20.5 16.3807 19.3807 17.5 18 17.5H7Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="currentColor"
            fillOpacity="0.15"
          />
          {/* Sound / Voice Interview Waves */}
          <path
            d="M8.5 10.5V10.51M12 9V12M15.5 10V11"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {!iconOnly && (
        <span
          className={cn(
            "font-bold tracking-tight bg-clip-text text-transparent leading-none",
            "bg-gradient-to-r from-brand-primary via-[#ff6f3d] to-[#ff945e]",
            "transition-all duration-300 group-hover:brightness-110",
            textSizes[size],
          )}
        >
          Arc Interview <span className="font-extrabold">App</span>
        </span>
      )}
    </div>
  );
};
