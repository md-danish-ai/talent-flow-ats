"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@lib/utils";

export interface SwitchProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeConfig = {
  sm: {
    container: "w-8 h-4",
    knob: "w-3 h-3",
    offset: 16,
  },
  md: {
    container: "w-11 h-6",
    knob: "w-4 h-4",
    offset: 20,
  },
  lg: {
    container: "w-14 h-8",
    knob: "w-6 h-6",
    offset: 24,
  },
};

export const Switch: React.FC<SwitchProps> = ({
  checked = false,
  onChange,
  disabled = false,
  className,
  size = "md",
}) => {
  const config = sizeConfig[size];

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  return (
    <div
      onClick={handleToggle}
      className={cn(
        "relative flex items-center rounded-full cursor-pointer transition-colors duration-300",
        config.container,
        checked ? "bg-brand-primary" : "bg-slate-200 dark:bg-slate-700",
        disabled && "opacity-50 cursor-not-allowed grayscale",
        className,
      )}
    >
      <motion.div
        animate={{
          x: checked ? config.offset : 4,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
        className={cn("bg-white rounded-full shadow-sm", config.knob)}
      />
    </div>
  );
};

Switch.displayName = "Switch";
