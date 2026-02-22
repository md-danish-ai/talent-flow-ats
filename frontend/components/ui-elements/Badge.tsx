import React from "react";
import { cn } from "@lib/utils";
import { Typography } from "@components/ui-elements/Typography";

export type BadgeVariant = "fill" | "outline";
export type BadgeShape = "curve" | "square";
export type BadgeColor =
  | "primary"
  | "secondary"
  | "success"
  | "error"
  | "warning"
  | "default";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  shape?: BadgeShape;
  color?: BadgeColor;
  icon?: React.ReactNode;
  className?: string;
}

const colorStyles: Record<BadgeColor, { fill: string; outline: string }> = {
  primary: {
    fill: "bg-brand-primary text-white",
    outline: "border-brand-primary/30 text-brand-primary bg-brand-primary/5",
  },
  secondary: {
    fill: "bg-brand-secondary text-white",
    outline:
      "border-brand-secondary/30 text-brand-secondary bg-brand-secondary/5",
  },
  success: {
    fill: "bg-emerald-500 text-white",
    outline: "border-emerald-500/30 text-emerald-600 bg-emerald-500/5",
  },
  error: {
    fill: "bg-red-500 text-white",
    outline: "border-red-500/30 text-red-600 bg-red-500/5",
  },
  warning: {
    fill: "bg-amber-500 text-black",
    outline: "border-amber-500/30 text-amber-600 bg-amber-500/5",
  },
  default: {
    fill: "bg-muted text-foreground",
    outline: "border-border text-muted-foreground bg-muted/20",
  },
};

export const Badge = ({
  children,
  variant = "fill",
  shape = "curve",
  color = "primary",
  icon,
  className,
}: BadgeProps) => {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 transition-all duration-300",
        shape === "curve" ? "rounded-full" : "rounded-sm",
        variant === "outline" ? "border" : "",
        colorStyles[color][variant],
        className,
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <Typography
        variant="body5"
        weight="medium"
        color="text-inherit"
        className="uppercase tracking-wider"
        as="span"
      >
        {children}
      </Typography>
    </span>
  );
};
