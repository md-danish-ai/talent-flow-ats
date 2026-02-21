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
    | "large";
  shadow?: boolean;
  animate?: "none" | "scale" | "slide";
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
      primary: "bg-[#F96331] text-white hover:bg-[#E05225]", // theme orange
      secondary: "bg-[#673ab7] text-white hover:bg-[#5e35b1]",
      success: "bg-[#00e676] text-white hover:bg-[#00c853]",
      error: "bg-[#f44336] text-white hover:bg-[#e53935]",
      warning:
        "bg-[#ff9800] text-slate-800 hover:bg-[#f57c00] hover:text-white",
      default: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    };

    const outlineStyles = {
      primary: "border border-[#F96331] text-[#F96331] hover:bg-orange-50",
      secondary: "border border-[#673ab7] text-[#673ab7] hover:bg-[#ede7f6]",
      success: "border border-[#00e676] text-[#00e676] hover:bg-[#e8f5e9]",
      error: "border border-[#f44336] text-[#f44336] hover:bg-[#ffebee]",
      warning: "border border-[#ff9800] text-[#ff9800] hover:bg-[#fff3e0]",
      default: "border border-gray-200 text-gray-700 hover:bg-gray-50",
    };

    const textStyles = {
      primary: "text-[#F96331] hover:bg-orange-50",
      secondary: "text-[#673ab7] hover:bg-[#ede7f6]",
      success: "text-[#00e676] hover:bg-[#e8f5e9]",
      error: "text-[#f44336] hover:bg-[#ffebee]",
      warning: "text-[#ff9800] hover:bg-[#fff3e0]",
      default: "text-gray-500 hover:bg-gray-100",
    };

    let variantStyles = "";
    if (variant === "primary") variantStyles = colorStyles[color];
    else if (variant === "secondary")
      variantStyles = colorStyles.secondary; // Fallback
    else if (variant === "outline") variantStyles = outlineStyles[color];
    else if (variant === "text" || variant === "ghost")
      variantStyles = textStyles[color];
    else if (variant === "link")
      variantStyles = "text-[#F96331] underline-offset-4 hover:underline";
    else if (variant === "action") {
      variantStyles = isActive
        ? "bg-orange-50 text-[#F96331]"
        : "text-slate-400 hover:text-[#F96331] hover:bg-orange-50";
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
    };

    const shadowClass = shadow
      ? "shadow-[0_8px_16px_rgba(249,99,49,0.24)]"
      : "";
    const animationClass =
      animate === "scale"
        ? "hover:-translate-y-1 hover:scale-105 active:scale-95"
        : animate === "slide"
          ? "hover:translate-x-1"
          : "";

    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[#F96331] disabled:pointer-events-none disabled:opacity-50",
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
