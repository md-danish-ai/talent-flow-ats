"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@lib/utils";

export interface TabItem {
    label: string;
    value: string;
    icon?: React.ReactNode;
}

import { useRipple, RippleContainer } from "./Ripple";

interface TabsProps {
    tabs: TabItem[];
    activeTab: string;
    onChange: (value: string) => void;
    className?: string;
    variant?: "pills" | "underline" | "glass" | "bordered" | "gradient";
    orientation?: "horizontal" | "vertical";
    size?: "sm" | "md" | "lg";
    fullWidth?: boolean;
    animationType?: "spring" | "bounce" | "smooth" | "elastic" | "pop" | "jelly" | "none";
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(({
    tabs,
    activeTab,
    onChange,
    className,
    variant = "pills",
    orientation = "horizontal",
    size = "md",
    fullWidth = false,
    animationType = "spring",
}, ref) => {
    const isVertical = orientation === "vertical";
    const { ripples, createRipple, removeRipple } = useRipple();

    const transitions = {
        spring: { type: "spring", bounce: 0.15, duration: 0.5 } as const,
        bounce: { type: "spring", bounce: 0.5, duration: 0.6 } as const,
        smooth: { type: "tween", ease: "easeInOut", duration: 0.3 } as const,
        elastic: { type: "spring", damping: 5, stiffness: 100, mass: 1 } as const,
        pop: { type: "spring", bounce: 0.4, duration: 0.3 } as const,
        jelly: { type: "spring", bounce: 0.6, duration: 0.8, velocity: 2 } as const,
        none: { duration: 0 } as const
    };

    const containerStyles = cn(
        "flex p-1 gap-1.5 transition-all duration-300",
        isVertical ? "flex-col h-fit" : "flex-row items-center",
        fullWidth ? "w-full" : "w-fit",

        // Variant Backgrounds
        variant === "pills" && "bg-muted/30 backdrop-blur-sm rounded-xl border border-border/50",
        variant === "glass" && "bg-white/10 dark:bg-black/20 backdrop-blur-md rounded-2xl border border-white/20 dark:border-white/10 shadow-xl",
        variant === "bordered" && "bg-transparent border-2 border-border/40 rounded-xl",
        variant === "underline" && "bg-transparent border-none p-0 gap-8 rounded-none",
        variant === "gradient" && "bg-muted/20 rounded-xl",

        className
    );

    const sizeStyles = {
        sm: isVertical ? "py-2 px-4 text-xs" : "px-4 py-2 text-xs",
        md: isVertical ? "py-2.5 px-6 text-sm" : "px-6 py-2.5 text-sm",
        lg: isVertical ? "py-3 px-8 text-base" : "px-8 py-3 text-base",
    };

    return (
        <div className={containerStyles} ref={ref}>
            {tabs.map((tab) => {
                const isActive = activeTab === tab.value;
                const handleTabClick = (e: React.MouseEvent<HTMLButtonElement>) => {
                    createRipple(e);
                    onChange(tab.value);
                };

                return (
                    <button
                        key={tab.value}
                        onClick={handleTabClick}
                        className={cn(
                            "relative font-semibold transition-all duration-300 rounded-lg outline-none group overflow-hidden",
                            sizeStyles[size],
                            fullWidth ? "flex-1" : "flex-none",
                            variant === "underline" && "rounded-none",
                            isActive ? "text-brand-primary" : "text-muted-foreground hover:text-foreground",
                            isVertical && "w-full"
                        )}
                    >
                        <div className={cn(
                            "flex items-center gap-2 relative z-10 w-full",
                            isVertical ? "justify-start" : "justify-center"
                        )}>
                            {tab.icon && <span className={cn("shrink-0 transition-transform duration-300", isActive && "scale-110")}>{tab.icon}</span>}
                            <span>{tab.label}</span>
                        </div>

                        {isActive && (
                            <motion.div
                                layoutId={`activeTab-${variant}`}
                                className={cn(
                                    "absolute z-0",
                                    variant === "pills" && "inset-0 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-border/20",
                                    variant === "glass" && "inset-0 bg-white/40 dark:bg-white/10 rounded-xl shadow-lg border border-white/30",
                                    variant === "bordered" && "inset-0 bg-brand-primary/5 border-2 border-brand-primary rounded-lg",
                                    variant === "gradient" && "inset-0 bg-gradient-to-r from-brand-primary/20 to-brand-secondary/20 rounded-lg border-b-2 border-brand-primary",
                                    variant === "underline" && (
                                        isVertical
                                            ? "left-0 top-0 bottom-0 w-1 bg-brand-primary rounded-full"
                                            : "bottom-0 left-0 right-0 h-1 bg-brand-primary rounded-full"
                                    )
                                )}
                                transition={transitions[animationType]}
                            />
                        )}

                        {/* Hover effect for inactive tabs */}
                        {!isActive && (
                            <div className={cn(
                                "absolute inset-0 bg-foreground/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200",
                                variant === "underline" && "opacity-0"
                            )} />
                        )}

                        <RippleContainer ripples={ripples} onRemove={removeRipple} color="bg-brand-primary/10" />
                    </button>
                );
            })}
        </div>
    );
});

Tabs.displayName = "Tabs";
