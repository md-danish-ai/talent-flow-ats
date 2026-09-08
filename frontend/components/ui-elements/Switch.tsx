"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@lib/utils";

export interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "success" | "error";
  withIcon?: boolean;
  iconOn?: React.ReactNode;
  iconOff?: React.ReactNode;
  id?: string;
  name?: string;
  "aria-label"?: string;
}

const sizeConfig = {
  sm: {
    container: "w-8 h-[18px]",
    knob: "w-3.5 h-3.5",
    offset: 14,
    padX: 2,
    iconSize: "w-2 h-2",
  },
  md: {
    container: "w-11 h-6",
    knob: "w-4.5 h-4.5",
    offset: 20,
    padX: 2,
    iconSize: "w-2.5 h-2.5",
  },
  lg: {
    container: "w-14 h-8",
    knob: "w-6 h-6",
    offset: 24,
    padX: 3,
    iconSize: "w-3.5 h-3.5",
  },
};

export const Switch: React.FC<SwitchProps> = ({
  checked = false,
  onChange,
  disabled = false,
  className,
  size = "md",
  color = "primary",
  withIcon = true,
  iconOn,
  iconOff,
  id,
  name,
  "aria-label": ariaLabel,
}) => {
  const config = sizeConfig[size];
  const [isPressed, setIsPressed] = useState(false);
  const [rippleKey, setRippleKey] = useState(0);

  const handleToggle = (e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) {
      e.stopPropagation();
    }
    if (!disabled && onChange) {
      setRippleKey((prev) => prev + 1);
      onChange(!checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      handleToggle(e);
    }
  };

  const getColorClasses = () => {
    switch (color) {
      case "success":
        return {
          activeBg: "bg-gradient-to-r from-emerald-500 to-teal-500",
          glow: "shadow-[0_0_12px_rgba(16,185,129,0.4)]",
          iconText: "text-emerald-600 dark:text-emerald-500",
          ringColor: "focus-visible:ring-emerald-500",
          rippleColor: "bg-emerald-400/40",
        };
      case "error":
        return {
          activeBg: "bg-gradient-to-r from-rose-500 to-red-600",
          glow: "shadow-[0_0_12px_rgba(244,67,54,0.4)]",
          iconText: "text-rose-600 dark:text-rose-500",
          ringColor: "focus-visible:ring-rose-500",
          rippleColor: "bg-rose-400/40",
        };
      default:
        return {
          activeBg: "bg-gradient-to-r from-[#f96331] to-orange-400",
          glow: "shadow-[0_0_12px_rgba(249,99,49,0.4)]",
          iconText: "text-[#f96331]",
          ringColor: "focus-visible:ring-brand-primary",
          rippleColor: "bg-[#f96331]/40",
        };
    }
  };

  const themeColors = getColorClasses();

  return (
    <motion.button
      type="button"
      id={id}
      name={name}
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      disabled={disabled}
      tabIndex={disabled ? -1 : 0}
      onClick={handleToggle}
      onKeyDown={handleKeyDown}
      onMouseDown={() => !disabled && setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      whileHover={disabled ? undefined : { scale: 1.04 }}
      whileTap={disabled ? undefined : { scale: 0.96 }}
      className={cn(
        "relative flex items-center select-none rounded-full cursor-pointer outline-none",
        "border border-black/[0.06] dark:border-white/[0.08]",
        "transition-shadow duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        themeColors.ringColor,
        config.container,
        disabled && "opacity-50 cursor-not-allowed grayscale",
        className,
      )}
      style={{ padding: `0 ${config.padX}px` }}
    >
      {/* Background Track (Inactive: Soft muted / Dark Slate) */}
      <motion.div
        className="absolute inset-0 rounded-full bg-slate-200/90 dark:bg-slate-700/80 shadow-[inset_0_1px_2px_rgba(0,0,0,0.12)] transition-opacity duration-300"
        animate={{ opacity: checked ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      />

      {/* Background Track (Active: Modern Gradient + Soft Glow) */}
      <motion.div
        className={cn(
          "absolute inset-0 rounded-full transition-opacity duration-300",
          themeColors.activeBg,
          themeColors.glow,
        )}
        animate={{ opacity: checked ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />

      {/* Ripple Wave Burst Animation */}
      <AnimatePresence>
        {checked && rippleKey > 0 && (
          <motion.span
            key={rippleKey}
            initial={{ scale: 0.4, opacity: 0.8 }}
            animate={{ scale: 1.9, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className={cn(
              "absolute inset-0 rounded-full pointer-events-none",
              themeColors.rippleColor,
            )}
          />
        )}
      </AnimatePresence>

      {/* Moving Thumb / Knob */}
      <motion.div
        animate={{
          x: checked ? config.offset : 0,
          scaleX: isPressed ? 1.18 : 1,
          scaleY: isPressed ? 0.92 : 1,
        }}
        transition={{
          type: "spring",
          stiffness: 520,
          damping: 28,
          mass: 0.65,
        }}
        className={cn(
          "relative z-10 flex items-center justify-center rounded-full bg-white dark:bg-slate-100",
          "shadow-[0_2px_4px_rgba(0,0,0,0.16),0_1px_2px_rgba(0,0,0,0.08),inset_0_1px_1px_rgba(255,255,255,0.9)]",
          config.knob,
        )}
      >
        {/* Subtle glass reflection highlight */}
        <div className="absolute top-0.5 inset-x-1 h-[30%] bg-gradient-to-b from-white/80 to-transparent rounded-full pointer-events-none" />

        {/* Micro-Icon Morphing Animation */}
        {withIcon && (
          <div className="relative flex items-center justify-center pointer-events-none">
            {iconOn || iconOff ? (
              <AnimatePresence mode="wait" initial={false}>
                {checked ? (
                  <motion.span
                    key="custom-on"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className={themeColors.iconText}
                  >
                    {iconOn}
                  </motion.span>
                ) : (
                  <motion.span
                    key="custom-off"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="text-slate-400 dark:text-slate-500"
                  >
                    {iconOff}
                  </motion.span>
                )}
              </AnimatePresence>
            ) : (
              <AnimatePresence mode="wait" initial={false}>
                {checked ? (
                  <motion.svg
                    key="check-icon"
                    viewBox="0 0 12 12"
                    fill="none"
                    className={cn(config.iconSize, themeColors.iconText)}
                    initial={{ scale: 0, rotate: -45, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    exit={{ scale: 0, rotate: 45, opacity: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 600,
                      damping: 25,
                    }}
                  >
                    <motion.path
                      d="M2.5 6.2L4.8 8.5L9.5 3.5"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </motion.svg>
                ) : (
                  <motion.div
                    key="uncheck-dot"
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-400"
                  />
                )}
              </AnimatePresence>
            )}
          </div>
        )}
      </motion.div>
    </motion.button>
  );
};

Switch.displayName = "Switch";
