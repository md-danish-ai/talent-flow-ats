"use client";

import React from "react";
import { Input, InputProps } from "./Input";
import { cn } from "@lib/utils";

export interface DatePickerProps extends Omit<InputProps, "type"> {
  label?: string;
}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, label, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="text-sm font-semibold text-muted-foreground mb-1 block">
            {label}
          </label>
        )}
        <Input
          type="date"
          ref={ref}
          className={cn(
            "[&::-webkit-calendar-picker-indicator]:cursor-pointer",
            className,
          )}
          {...props}
        />
      </div>
    );
  },
);

DatePicker.displayName = "DatePicker";
