"use client";

import React from "react";
import { Tooltip } from "./Tooltip";
import { Button, ButtonProps } from "./Button";
import { cn } from "@lib/utils";

export type TableIconButtonColor =
  | "slate"
  | "red"
  | "orange"
  | "amber"
  | "green"
  | "blue"
  | "violet"
  | "brand";

interface TableIconButtonProps extends Omit<
  ButtonProps,
  "variant" | "size" | "color"
> {
  /** Semantic color of the icon button */
  iconColor?: TableIconButtonColor;
  /**
   * Button size:
   * - `md` (default) → 36×36px — used in paper/reset tables
   * - `sm` → 32×32px — used in question/management tables
   */
  btnSize?: "sm" | "md";
  /** Tooltip position */
  tooltipSide?: "top" | "bottom" | "left" | "right";
}

const colorMap: Record<TableIconButtonColor, string> = {
  slate:
    "text-slate-500 hover:text-slate-700 bg-slate-50 dark:bg-slate-400/10 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-400/20 border border-transparent hover:border-slate-200 dark:hover:border-slate-400/30",
  red: "text-red-500 hover:text-red-600 bg-red-50 dark:bg-red-500/10 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 border border-transparent hover:border-red-200 dark:hover:border-red-500/30",
  orange:
    "text-orange-500 hover:text-orange-600 bg-orange-50 dark:bg-orange-500/10 dark:text-orange-400 hover:bg-orange-100 dark:hover:bg-orange-500/20 border border-transparent hover:border-orange-200 dark:hover:border-orange-500/30",
  amber:
    "text-amber-500 hover:text-amber-600 bg-amber-50 dark:bg-amber-500/10 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-500/20 border border-transparent hover:border-amber-200 dark:hover:border-amber-500/30",
  green:
    "text-green-500 hover:text-green-600 bg-green-50 dark:bg-green-500/10 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-500/20 border border-transparent hover:border-green-200 dark:hover:border-green-500/30",
  blue: "text-blue-500 hover:text-blue-600 bg-blue-50 dark:bg-blue-500/10 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-500/20 border border-transparent hover:border-blue-200 dark:hover:border-blue-500/30",
  violet:
    "text-violet-500 hover:text-violet-600 bg-violet-50 dark:bg-violet-500/10 dark:text-violet-400 hover:bg-violet-100 dark:hover:bg-violet-500/20 border border-transparent hover:border-violet-200 dark:hover:border-violet-500/30",
  brand:
    "text-brand-primary hover:text-brand-primary/80 bg-brand-primary/5 dark:bg-brand-primary/10 hover:bg-brand-primary/10 dark:hover:bg-brand-primary/20 border border-transparent hover:border-brand-primary/20 dark:hover:bg-brand-primary/30",
};

/**
 * A small, square icon button designed for table action cells.
 * Supports two sizes: `md` (36×36px, default) and `sm` (32×32px).
 * Automatically wraps in a Tooltip if a `title` prop is provided.
 *
 * @example
 * <TableIconButton iconColor="blue" btnSize="sm" title="Edit Item" onClick={handleEdit}>
 *   <Edit size={16} />
 * </TableIconButton>
 */
export const TableIconButton = React.forwardRef<
  HTMLButtonElement,
  TableIconButtonProps
>(
  (
    {
      iconColor = "slate",
      btnSize = "md",
      animate = "scale",
      tooltipSide = "top",
      className,
      children,
      title,
      ...props
    },
    ref,
  ) => {
    const button = (
      <Button
        ref={ref}
        variant="ghost"
        size="icon"
        animate={animate}
        className={cn(
          btnSize === "sm" ? "h-8 w-8" : "h-9 w-9",
          "shadow-sm transition-all duration-300",
          colorMap[iconColor],
          className,
        )}
        {...props}
      >
        {children}
      </Button>
    );

    if (title) {
      return (
        <Tooltip content={title} side={tooltipSide}>
          {button}
        </Tooltip>
      );
    }

    return button;
  },
);

TableIconButton.displayName = "TableIconButton";
