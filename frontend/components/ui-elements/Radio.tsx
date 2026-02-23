"use client";

import React from "react";
import { cn } from "@lib/utils";

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
}

export const Radio = React.forwardRef<HTMLInputElement, RadioProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <label className="flex items-center gap-2 cursor-pointer text-sm font-medium text-foreground">
        <input
          type="radio"
          ref={ref}
          className={cn(
            "accent-brand-primary w-5 h-5 cursor-pointer",
            className,
          )}
          {...props}
        />
        {label && <span>{label}</span>}
      </label>
    );
  },
);

Radio.displayName = "Radio";
