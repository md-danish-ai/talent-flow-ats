"use client";

import React, { forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@lib/utils";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, error, startIcon, endIcon, children, ...props }, ref) => {
    return (
      <div className="relative w-full group">
        {/* Start Icon */}
        {startIcon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors group-focus-within:text-brand-primary flex items-center justify-center">
            {startIcon}
          </div>
        )}

        <select
          ref={ref}
          className={cn(
            // SAME as Input.tsx
            "w-full rounded-md border bg-input py-3.5 px-4 text-medium text-foreground outline-none transition-all appearance-none",
            "placeholder:text-muted-foreground/50",
            "focus:border-brand-primary focus:ring-1 focus:ring-brand-primary",
            "border-border",
            startIcon && "pl-[42px]",
            (endIcon || true) && "pr-[42px]",
            error &&
              "!border-red-500 ring-1 !ring-red-500/20 focus:!border-red-500 focus:!ring-red-500/20 hover:!border-red-500",
            className,
          )}
          {...props}
        >
          {children}
        </select>

        {/* Default Dropdown Arrow */}
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground/60 transition-colors group-focus-within:text-brand-primary flex items-center justify-center">
          {endIcon ? endIcon : <ChevronDown size={18} />}
        </div>
      </div>
    );
  },
);

Select.displayName = "Select";
