import React from "react";
import { cn } from "@lib/utils";

export type TypographyVariant =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "body1"
  | "body2"
  | "body3"
  | "body4"
  | "body5"
  | "span";

export type TypographyWeight =
  | "thin"
  | "light"
  | "normal"
  | "medium"
  | "semibold"
  | "bold"
  | "extrabold"
  | "black"
  | "inherit";

interface TypographyProps {
  variant?: TypographyVariant;
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
  weight?: TypographyWeight;
  color?: string;
  italic?: boolean;
}

const variantStyles: Record<TypographyVariant, string> = {
  h1: "text-3xl tracking-tight",
  h2: "text-2xl",
  h3: "text-xl",
  h4: "text-base",
  h5: "text-sm",
  h6: "text-xs",
  body1: "text-lg",
  body2: "text-base",
  body3: "text-sm",
  body4: "text-sm",
  body5: "text-xs",
  span: "text-inherit",
};

const weightStyles: Record<TypographyWeight, string> = {
  thin: "font-thin",
  light: "font-light",
  normal: "font-normal",
  medium: "font-medium",
  semibold: "font-semibold",
  bold: "font-bold",
  extrabold: "font-extrabold",
  black: "font-black",
  inherit: "font-[inherit]",
};

const defaultWeights: Record<TypographyVariant, TypographyWeight> = {
  h1: "extrabold",
  h2: "bold",
  h3: "bold",
  h4: "semibold",
  h5: "bold",
  h6: "bold",
  body1: "normal",
  body2: "normal",
  body3: "normal",
  body4: "medium",
  body5: "medium",
  span: "inherit",
};

const defaultColors: Record<TypographyVariant, string> = {
  h1: "text-foreground",
  h2: "text-foreground",
  h3: "text-foreground",
  h4: "text-foreground",
  h5: "text-foreground",
  h6: "text-foreground",
  body1: "text-muted-foreground",
  body2: "text-muted-foreground",
  body3: "text-muted-foreground",
  body4: "text-muted-foreground",
  body5: "text-muted-foreground",
  span: "text-inherit",
};

const defaultElements: Record<TypographyVariant, React.ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  body1: "p",
  body2: "p",
  body3: "p",
  body4: "p",
  body5: "p",
  span: "span",
};

export const Typography: React.FC<TypographyProps> = ({
  variant = "body3",
  children,
  className,
  as,
  weight,
  color,
  italic,
}) => {
  const Component = as || defaultElements[variant] || "p";
  const finalWeight = weight || defaultWeights[variant];
  const finalColor = color || defaultColors[variant];

  return (
    <Component
      className={cn(
        variantStyles[variant],
        weightStyles[finalWeight],
        finalColor,
        italic && "italic",
        className,
      )}
    >
      {children}
    </Component>
  );
};
