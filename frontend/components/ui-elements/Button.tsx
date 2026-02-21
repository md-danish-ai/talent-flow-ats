import React from "react";
import { cn } from "@lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "text"
    | "ghost"
    | "link"
    | "action";
  color?: "primary" | "secondary" | "success" | "error" | "warning" | "default";
  size?:
    | "default"
    | "sm"
    | "lg"
    | "icon"
    | "icon-sm"
    | "rounded-icon"
    | "small"
    | "medium"
    | "large"
    | "auto";
  shadow?: boolean;
  animate?: "none" | "scale" | "slide" | "rotate" | "spin";
  isActive?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      color = "default",
      size = "default",
      isActive = false,
      shadow = false,
      animate = "none",
      startIcon,
      endIcon,
      children,
      ...props
    },
    ref,
  ) => {
    const colorStyles = {
      primary: "bg-brand-primary text-white hover:bg-brand-hover",
      secondary: "bg-brand-secondary text-white hover:opacity-90",
      success: "bg-brand-success text-white hover:opacity-90",
      error: "bg-brand-error text-white hover:opacity-90",
      warning:
        "bg-brand-warning text-slate-900 hover:opacity-90 transition-colors",
      default: "bg-muted text-foreground hover:bg-muted/80 transition-colors",
    };

    const outlineStyles = {
      primary:
        "border border-brand-primary text-brand-primary hover:bg-brand-primary/5 dark:hover:bg-brand-primary/10",
      secondary:
        "border border-brand-secondary text-brand-secondary hover:bg-brand-secondary/5",
      success:
        "border border-brand-success text-brand-success hover:bg-brand-success/5",
      error:
        "border border-brand-error text-brand-error hover:bg-brand-error/5",
      warning:
        "border border-brand-warning text-brand-warning hover:bg-brand-warning/5",
      default:
        "border border-border text-foreground hover:bg-brand-primary/5 hover:border-brand-primary/20 transition-colors",
    };

    const textStyles = {
      primary: "text-brand-primary hover:bg-brand-primary/10",
      secondary: "text-brand-secondary hover:bg-brand-secondary/10",
      success: "text-brand-success hover:bg-brand-success/10",
      error: "text-brand-error hover:bg-brand-error/10",
      warning: "text-brand-warning hover:bg-brand-warning/10",
      default:
        "text-muted-foreground hover:bg-brand-primary/10 hover:text-brand-primary transition-colors",
    };

    let variantStyles = "";
    if (variant === "primary") variantStyles = colorStyles[color];
    else if (variant === "secondary")
      variantStyles = colorStyles.secondary; // Fallback
    else if (variant === "outline") variantStyles = outlineStyles[color];
    else if (variant === "text" || variant === "ghost")
      variantStyles = textStyles[color];
    else if (variant === "link")
      variantStyles = "text-brand-primary underline-offset-4 hover:underline";
    else if (variant === "action") {
      variantStyles = isActive
        ? "bg-brand-primary/20 dark:bg-brand-primary/30 text-brand-primary font-bold shadow-sm"
        : "text-muted-foreground hover:text-brand-primary hover:bg-brand-primary/10 transition-colors";
    }

    const sizes = {
      default: "h-10 px-4 py-2",
      sm: "h-8 rounded-lg px-3 text-xs leading-none",
      small: "h-8 rounded-lg px-3 text-xs leading-none",
      medium: "h-10 px-4 py-2",
      lg: "h-12 rounded-lg px-6 text-base",
      large: "h-12 rounded-lg px-6 text-base",
      icon: "h-10 w-10 rounded-full justify-center p-0",
      "icon-sm": "h-8 w-8 rounded-full justify-center p-0",
      "rounded-icon": "w-10 h-10 rounded-xl justify-center",
      auto: "h-auto",
    };

    const shadowClass = shadow
      ? "shadow-[0_8px_16px_theme(colors.brand-primary/24%)]"
      : "";
    const animationClass =
      animate === "scale"
        ? "hover:-translate-y-1 hover:scale-105 active:scale-95"
        : animate === "slide"
          ? "hover:translate-x-1"
          : animate === "rotate"
            ? "hover:rotate-[360deg] duration-500 transition-transform"
            : animate === "spin"
              ? "animate-spin"
              : "";

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-brand-primary disabled:pointer-events-none disabled:opacity-50",
          variantStyles,
          sizes[size],
          shadowClass,
          animationClass,
          className,
        )}
        {...props}
      >
        {startIcon && (
          <span className="mr-2 inline-flex self-center">{startIcon}</span>
        )}
        {children}
        {endIcon && (
          <span className="ml-2 inline-flex self-center">{endIcon}</span>
        )}
      </button>
    );
  },
);
Button.displayName = "Button";
