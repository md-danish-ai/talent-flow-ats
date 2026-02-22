"use client";

import React, { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@lib/utils";
import { Button } from "@components/ui-elements/Button";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, startIcon, endIcon, type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    return (
      <div className="relative w-full group">
        {startIcon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors group-focus-within:text-brand-primary flex items-center justify-center">
            {startIcon}
          </div>
        )}
        <input
          ref={ref}
          type={inputType}
          className={cn(
            "w-full rounded-xl border bg-input py-3.5 px-4 text-medium text-foreground outline-none transition-all placeholder:text-muted-foreground/50 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary",
            startIcon && "pl-[42px]",
            (endIcon || isPassword) && "pr-[42px]",
            error
              ? "border-brand-error ring-1 ring-brand-error/20"
              : "border-border",
            className,
          )}
          {...props}
        />
        {isPassword ? (
          <Button
            type="button"
            variant="ghost"
            color="default"
            size="icon-sm"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground/60 hover:text-brand-primary"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </Button>
        ) : endIcon ? (
          <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground/60 transition-colors group-focus-within:text-brand-primary flex items-center justify-center">
            {endIcon}
          </div>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
