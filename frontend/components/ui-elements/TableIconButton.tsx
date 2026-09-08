"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "./Tooltip";
import { cn } from "@lib/utils";
import { Loader2 } from "lucide-react";

/**
 * Resolved animation classes — same CSS-based approach as Button.tsx.
 * Browser handles these natively at 60fps with zero JS overhead.
 */
const getAnimationClass = (
  animate: string,
  disabled: boolean,
  isLoading: boolean,
): string => {
  if (disabled || isLoading || animate === "none") return "";
  switch (animate) {
    case "rotate":
      return "hover:scale-105 hover:-translate-y-0.5 hover:rotate-12 active:scale-95 transition-transform duration-[80ms] ease-out";
    case "slide":
      return "hover:scale-[1.04] hover:translate-x-0.5 active:scale-95 transition-transform duration-[80ms] ease-out";
    case "spin":
      return "animate-spin";
    case "scale":
    default:
      return "hover:scale-105 hover:-translate-y-1 active:scale-95 transition-transform duration-[80ms] ease-out";
  }
};

export type TableIconButtonColor =
  | "slate"
  | "red"
  | "orange"
  | "amber"
  | "green"
  | "blue"
  | "violet"
  | "brand";

export type TableIconButtonShape = "circle" | "rounded" | "square";

export interface TableIconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Semantic color of the icon button */
  iconColor?: TableIconButtonColor;
  /**
   * Button size:
   * - `md` (default) → 36×36px — used in paper/reset tables
   * - `sm` → 32×32px — used in question/management tables
   */
  btnSize?: "sm" | "md";
  /**
   * Border radius shape:
   * - `circle` (default) → rounded-full
   * - `rounded` → rounded-xl
   * - `square` → rounded-lg
   */
  shape?: TableIconButtonShape;
  /** Tooltip position */
  tooltipSide?: "top" | "bottom" | "left" | "right";
  /** Tooltip display delay in seconds (default: 0.1) */
  tooltipDelay?: number;
  /** Animation type when hovering/acting (default: "scale") */
  animate?: "none" | "scale" | "slide" | "rotate" | "spin";
  /** Loading state */
  isLoading?: boolean;
  /** Custom ripple burst color override */
  rippleColor?: string;
  /** Enable / disable ripple wave burst effect (default: true) */
  withRippleBurst?: boolean;
}

interface RippleBurst {
  id: number;
}

const colorConfig: Record<
  TableIconButtonColor,
  {
    button: string;
    ripple: string;
    ring: string;
  }
> = {
  slate: {
    button: cn(
      "text-slate-600 dark:text-slate-200 bg-slate-100/90 dark:bg-slate-800/80",
      "border-[1.5px] border-slate-300 dark:border-slate-500/60",
      "shadow-[0_2px_4px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.15)]",
      "hover:bg-slate-200/90 dark:hover:bg-slate-700/90 hover:border-slate-400 dark:hover:border-slate-300",
      "hover:shadow-[0_6px_16px_rgba(15,23,42,0.16),0_2px_6px_rgba(15,23,42,0.08),inset_0_1px_0_rgba(255,255,255,0.95)] dark:hover:shadow-[0_6px_18px_rgba(0,0,0,0.6),0_0_12px_rgba(148,163,184,0.3)] hover:text-slate-900 dark:hover:text-white",
    ),
    ripple: "bg-slate-400/35 dark:bg-slate-300/30",
    ring: "focus-visible:ring-slate-400",
  },
  red: {
    button: cn(
      "text-rose-500 dark:text-rose-400 bg-rose-500/15 dark:bg-rose-500/20",
      "border-[1.5px] border-rose-500/50 dark:border-rose-500/60",
      "shadow-[0_2px_4px_rgba(244,67,54,0.12),0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.15)]",
      "hover:bg-rose-500/25 dark:hover:bg-rose-500/30 hover:border-rose-500/80",
      "hover:shadow-[0_6px_18px_rgba(244,67,54,0.35),0_2px_6px_rgba(244,67,54,0.15),inset_0_1px_0_rgba(255,255,255,0.95)] dark:hover:shadow-[0_6px_18px_rgba(0,0,0,0.6),0_0_16px_rgba(244,67,54,0.4)] hover:text-rose-600 dark:hover:text-rose-300",
    ),
    ripple: "bg-rose-500/40",
    ring: "focus-visible:ring-rose-500",
  },
  orange: {
    button: cn(
      "text-orange-500 dark:text-orange-400 bg-orange-500/15 dark:bg-orange-500/20",
      "border-[1.5px] border-orange-500/50 dark:border-orange-500/60",
      "shadow-[0_2px_4px_rgba(249,115,22,0.12),0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.15)]",
      "hover:bg-orange-500/25 dark:hover:bg-orange-500/30 hover:border-orange-500/80",
      "hover:shadow-[0_6px_18px_rgba(249,115,22,0.35),0_2px_6px_rgba(249,115,22,0.15),inset_0_1px_0_rgba(255,255,255,0.95)] dark:hover:shadow-[0_6px_18px_rgba(0,0,0,0.6),0_0_16px_rgba(249,115,22,0.4)] hover:text-orange-600 dark:hover:text-orange-300",
    ),
    ripple: "bg-orange-500/40",
    ring: "focus-visible:ring-orange-500",
  },
  amber: {
    button: cn(
      "text-amber-500 dark:text-amber-400 bg-amber-500/15 dark:bg-amber-500/20",
      "border-[1.5px] border-amber-500/50 dark:border-amber-500/60",
      "shadow-[0_2px_4px_rgba(245,158,11,0.12),0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.15)]",
      "hover:bg-amber-500/25 dark:hover:bg-amber-500/30 hover:border-amber-500/80",
      "hover:shadow-[0_6px_18px_rgba(245,158,11,0.35),0_2px_6px_rgba(245,158,11,0.15),inset_0_1px_0_rgba(255,255,255,0.95)] dark:hover:shadow-[0_6px_18px_rgba(0,0,0,0.6),0_0_16px_rgba(245,158,11,0.4)] hover:text-amber-600 dark:hover:text-amber-300",
    ),
    ripple: "bg-amber-500/40",
    ring: "focus-visible:ring-amber-500",
  },
  green: {
    button: cn(
      "text-emerald-500 dark:text-emerald-400 bg-emerald-500/15 dark:bg-emerald-500/20",
      "border-[1.5px] border-emerald-500/50 dark:border-emerald-500/60",
      "shadow-[0_2px_4px_rgba(16,185,129,0.12),0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.15)]",
      "hover:bg-emerald-500/25 dark:hover:bg-emerald-500/30 hover:border-emerald-500/80",
      "hover:shadow-[0_6px_18px_rgba(16,185,129,0.35),0_2px_6px_rgba(16,185,129,0.15),inset_0_1px_0_rgba(255,255,255,0.95)] dark:hover:shadow-[0_6px_18px_rgba(0,0,0,0.6),0_0_16px_rgba(16,185,129,0.4)] hover:text-emerald-700 dark:hover:text-emerald-300",
    ),
    ripple: "bg-emerald-500/40",
    ring: "focus-visible:ring-emerald-500",
  },
  blue: {
    button: cn(
      "text-blue-500 dark:text-blue-400 bg-blue-500/15 dark:bg-blue-500/20",
      "border-[1.5px] border-blue-500/50 dark:border-blue-500/60",
      "shadow-[0_2px_4px_rgba(59,130,246,0.12),0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.15)]",
      "hover:bg-blue-500/25 dark:hover:bg-blue-500/30 hover:border-blue-500/80",
      "hover:shadow-[0_6px_18px_rgba(59,130,246,0.35),0_2px_6px_rgba(59,130,246,0.15),inset_0_1px_0_rgba(255,255,255,0.95)] dark:hover:shadow-[0_6px_18px_rgba(0,0,0,0.6),0_0_16px_rgba(59,130,246,0.4)] hover:text-blue-700 dark:hover:text-blue-300",
    ),
    ripple: "bg-blue-500/40",
    ring: "focus-visible:ring-blue-500",
  },
  violet: {
    button: cn(
      "text-violet-500 dark:text-violet-400 bg-violet-500/15 dark:bg-violet-500/20",
      "border-[1.5px] border-violet-500/50 dark:border-violet-500/60",
      "shadow-[0_2px_4px_rgba(139,92,246,0.12),0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.15)]",
      "hover:bg-violet-500/25 dark:hover:bg-violet-500/30 hover:border-violet-500/80",
      "hover:shadow-[0_6px_18px_rgba(139,92,246,0.35),0_2px_6px_rgba(139,92,246,0.15),inset_0_1px_0_rgba(255,255,255,0.95)] dark:hover:shadow-[0_6px_18px_rgba(0,0,0,0.6),0_0_16px_rgba(139,92,246,0.4)] hover:text-violet-700 dark:hover:text-violet-300",
    ),
    ripple: "bg-violet-500/40",
    ring: "focus-visible:ring-violet-500",
  },
  brand: {
    button: cn(
      "text-brand-primary bg-brand-primary/15 dark:bg-brand-primary/20",
      "border-[1.5px] border-brand-primary/50 dark:border-brand-primary/60",
      "shadow-[0_2px_4px_rgba(249,99,49,0.12),0_1px_2px_rgba(0,0,0,0.04),inset_0_1px_0_rgba(255,255,255,0.8)] dark:shadow-[0_2px_6px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.15)]",
      "hover:bg-brand-primary/25 dark:hover:bg-brand-primary/30 hover:border-brand-primary/80",
      "hover:shadow-[0_6px_18px_rgba(249,99,49,0.35),0_2px_6px_rgba(249,99,49,0.15),inset_0_1px_0_rgba(255,255,255,0.95)] dark:hover:shadow-[0_6px_18px_rgba(0,0,0,0.6),0_0_16px_rgba(249,99,49,0.4)] hover:text-brand-hover",
    ),
    ripple: "bg-[#f96331]/40",
    ring: "focus-visible:ring-brand-primary",
  },
};

const shapeClasses: Record<TableIconButtonShape, string> = {
  circle: "rounded-full",
  rounded: "rounded-xl",
  square: "rounded-lg",
};

/**
 * A small, 3D elevated/tactile icon button designed for table action cells.
 * Features ultra-smooth hardware-accelerated spring animations, elevated 3D depth,
 * 1.5px defined borders, translucent colored body tint, and outward ripple wave burst effect.
 * Supports two sizes: `md` (36×36px, default) and `sm` (32×32px).
 * Automatically wraps in a Tooltip if a `title` prop is provided.
 */
export const TableIconButton = React.forwardRef<
  HTMLButtonElement,
  TableIconButtonProps
>(
  (
    {
      iconColor = "slate",
      btnSize = "md",
      shape = "circle",
      animate = "scale",
      tooltipSide = "top",
      tooltipDelay = 0.1,
      isLoading = false,
      withRippleBurst = true,
      rippleColor,
      className,
      children,
      title,
      onClick,
      disabled,
      type = "button",
      ...props
    },
    ref,
  ) => {
    const [bursts, setBursts] = useState<RippleBurst[]>([]);
    const colors = colorConfig[iconColor] || colorConfig.slate;
    const radiusClass = shapeClasses[shape];

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (disabled || isLoading) return;

      if (withRippleBurst) {
        const id = Date.now() + Math.random();
        setBursts((prev) => [...prev.slice(-2), { id }]);
      }

      if (onClick) {
        onClick(e);
      }
    };

    const removeBurst = (id: number) => {
      setBursts((prev) => prev.filter((b) => b.id !== id));
    };

    const sizeClasses =
      btnSize === "sm"
        ? "h-8 w-8 min-w-[32px] min-h-[32px] text-sm"
        : "h-9 w-9 min-w-[36px] min-h-[36px] text-base";

    const animationClass = getAnimationClass(animate, !!disabled, !!isLoading);

    const button = (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        onClick={handleClick}
        className={cn(
          "relative inline-flex items-center justify-center select-none cursor-pointer outline-none",
          "transition-[background-color,border-color,box-shadow,color] duration-[80ms] ease-out",
          "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          colors.ring,
          radiusClass,
          sizeClasses,
          colors.button,
          animationClass,
          (disabled || isLoading) &&
            "opacity-50 cursor-not-allowed grayscale pointer-events-none shadow-none",
          className,
        )}
        {...props}
      >
        {/* Ripple Wave Burst Effects */}
        <AnimatePresence>
          {withRippleBurst &&
            bursts.map((burst) => (
              <React.Fragment key={burst.id}>
                {/* Outward Shockwave Burst */}
                <motion.span
                  initial={{ scale: 0.7, opacity: 0.85 }}
                  animate={{ scale: 2.1, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  onAnimationComplete={() => removeBurst(burst.id)}
                  className={cn(
                    "absolute inset-0 pointer-events-none -z-10",
                    radiusClass,
                    rippleColor || colors.ripple,
                  )}
                />
                {/* Inner Flash Pulse */}
                <motion.span
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className={cn(
                    "absolute inset-0 pointer-events-none",
                    radiusClass,
                    rippleColor || colors.ripple,
                  )}
                />
              </React.Fragment>
            ))}
        </AnimatePresence>

        {/* Loading Spinner or Child Icon */}
        <span className="relative z-10 flex items-center justify-center pointer-events-none">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-current" />
          ) : (
            children
          )}
        </span>
      </button>
    );

    if (title) {
      return (
        <Tooltip content={title} side={tooltipSide} delay={tooltipDelay}>
          {button}
        </Tooltip>
      );
    }

    return button;
  },
);

TableIconButton.displayName = "TableIconButton";
