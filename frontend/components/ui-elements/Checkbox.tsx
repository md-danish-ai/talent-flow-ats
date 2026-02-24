"use client";

import React from "react";
import { cn } from "@lib/utils";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-foreground">
        <input
          type="checkbox"
          ref={ref}
          className={cn(
            "accent-brand-primary w-5 h-5 rounded cursor-pointer",
            className,
          )}
          {...props}
        />
        {label && <span>{label}</span>}
      </label>
    );
  },
);

Checkbox.displayName = "Checkbox";
