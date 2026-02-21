"use client";

import React from "react";
import { cn } from "@lib/utils";
import {
  AlertCircle,
  CheckCircle2,
  Info,
  AlertTriangle,
  X,
} from "lucide-react";
import { Typography } from "@components/ui-elements/Typography";

export type AlertVariant = "info" | "success" | "warning" | "error" | "default";

interface AlertProps {
  variant?: AlertVariant;
  title?: string;
  description: string | React.ReactNode;
  icon?: React.ReactNode;
  onClose?: () => void;
  className?: string;
  showIcon?: boolean;
}

const variantStyles: Record<AlertVariant, string> = {
  info: "bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400",
  success:
    "bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
  warning:
    "bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400",
  error: "bg-red-500/10 border-red-500/20 text-red-600 dark:text-red-400",
  default: "bg-muted/50 border-border text-foreground",
};

const defaultIcons: Record<AlertVariant, React.ReactNode> = {
  info: <Info size={18} />,
  success: <CheckCircle2 size={18} />,
  warning: <AlertTriangle size={18} />,
  error: <AlertCircle size={18} />,
  default: <Info size={18} />,
};

export const Alert = ({
  variant = "info",
  title,
  description,
  icon,
  onClose,
  className,
  showIcon = true,
}: AlertProps) => {
  const activeIcon = icon || defaultIcons[variant];

  return (
    <div
      role="alert"
      className={cn(
        "relative w-full border rounded-lg px-4 py-3 flex gap-3 transition-all duration-300 animate-in fade-in slide-in-from-top-2",
        variantStyles[variant],
        className,
      )}
    >
      {showIcon && (
        <div className="shrink-0 mt-0.5 opacity-90">{activeIcon}</div>
      )}
      <div className="flex-1 flex flex-col gap-1">
        {title && (
          <Typography
            variant="body4"
            weight="bold"
            color="text-inherit"
            className="leading-none tracking-tight"
          >
            {title}
          </Typography>
        )}
        <Typography
          variant="body5"
          weight="medium"
          color="text-inherit"
          className="opacity-90 leading-relaxed"
        >
          {description}
        </Typography>
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="shrink-0 h-fit p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition-colors -mr-1"
        >
          <X size={16} className="opacity-60" />
        </button>
      )}
    </div>
  );
};
