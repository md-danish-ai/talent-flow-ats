"use client";

import React, { InputHTMLAttributes } from "react";
import { cn } from "@lib/utils";
import { CheckCircle2, Trash2 } from "lucide-react";
import { Button } from "./Button";

export interface OptionInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "prefix"
> {
  prefixLabel: React.ReactNode;
  isCorrect?: boolean;
  onMarkCorrect?: () => void;
  onRemove?: () => void;
  showRemove?: boolean;
  error?: boolean;
}

export const OptionInput = React.forwardRef<HTMLInputElement, OptionInputProps>(
  (
    {
      className,
      prefixLabel,
      isCorrect = false,
      onMarkCorrect,
      onRemove,
      showRemove = false,
      error = false,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        className={cn(
          "flex items-center gap-3 p-1 rounded-md border transition-all duration-200",
          isCorrect
            ? "border-green-500/50 bg-green-500/5 shadow-sm shadow-green-500/10"
            : error
              ? "border-red-500 ring-1 ring-red-500/20 bg-red-500/5"
              : "border-border/60 bg-muted/10 hover:border-border hover:bg-muted/20 focus-within:border-brand-primary focus-within:ring-1 focus-within:ring-brand-primary",
          className,
        )}
      >
        <div
          className={cn(
            "w-10 h-10 shrink-0 flex items-center justify-center rounded-lg font-bold transition-colors",
            isCorrect
              ? "bg-green-500 text-white"
              : "bg-muted-foreground/10 text-muted-foreground",
          )}
        >
          {prefixLabel}
        </div>

        <input
          ref={ref}
          type="text"
          className="flex-1 bg-transparent border-none focus:border-transparent focus:outline-none focus:ring-0 text-foreground placeholder:text-muted-foreground/50 h-10 py-1"
          {...props}
        />

        <div className="flex items-center gap-1 pr-2">
          {onMarkCorrect && (
            <Button
              type="button"
              variant="action"
              size="auto"
              onClick={onMarkCorrect}
              className={cn(
                "p-2 rounded-lg transition-all focus:outline-none",
                isCorrect
                  ? "text-green-500 bg-green-500/20 hover:bg-green-500/30"
                  : "text-muted-foreground/40 hover:text-green-500 hover:bg-green-500/10",
              )}
              title="Mark as correct"
            >
              <CheckCircle2 size={18} />
            </Button>
          )}

          {showRemove && onRemove && (
            <Button
              type="button"
              variant="action"
              size="auto"
              onClick={onRemove}
              className="p-2 rounded-lg text-muted-foreground/40 hover:text-red-500 hover:bg-red-500/10 transition-all focus:outline-none"
              title="Remove option"
            >
              <Trash2 size={18} />
            </Button>
          )}
        </div>
      </div>
    );
  },
);

OptionInput.displayName = "OptionInput";
