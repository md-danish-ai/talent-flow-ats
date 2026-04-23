"use client";

import React, { forwardRef } from "react";
import { cn } from "@lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, startIcon, endIcon, rows = 4, ...props }, ref) => {
    return (
      <div className="relative w-full group">
        {startIcon && (
          <div className="absolute left-3.5 top-4 text-muted-foreground/60 transition-colors group-focus-within:text-brand-primary">
            {startIcon}
          </div>
        )}

        <textarea
          ref={ref}
          rows={rows}
          className={cn(
            "w-full rounded-md border bg-input py-3 px-4 text-medium text-foreground outline-none transition-all resize-none",
            "placeholder:text-muted-foreground/50 dark:placeholder:text-white/40",
            "focus:border-brand-primary focus:ring-1 focus:ring-brand-primary",
            "border-border dark:border-white/20",
            startIcon && "pl-[42px]",
            endIcon && "pr-[42px]",
            error &&
              "!border-red-500 ring-1 !ring-red-500/20 focus:!border-red-500 focus:!ring-red-500/20 hover:!border-red-500",
            className,
          )}
          {...props}
        />

        {endIcon && (
          <div className="absolute right-3.5 top-4 text-muted-foreground/60 transition-colors group-focus-within:text-brand-primary">
            {endIcon}
          </div>
        )}
      </div>
    );
  },
);

Textarea.displayName = "Textarea";
