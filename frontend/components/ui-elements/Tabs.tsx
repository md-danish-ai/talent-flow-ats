"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@lib/utils";

export interface TabItem {
    label: string;
    value: string;
    icon?: React.ReactNode;
}

interface TabsProps {
    tabs: TabItem[];
    activeTab: string;
    onChange: (value: string) => void;
    className?: string;
    variant?: "pills" | "underline";
}

export const Tabs: React.FC<TabsProps> = ({
    tabs,
    activeTab,
    onChange,
    className,
    variant = "pills",
}) => {
    return (
        <div
            className={cn(
                "flex p-1 space-x-1 bg-muted/30 backdrop-blur-sm rounded-xl border border-border/50 w-fit",
                variant === "underline" && "bg-transparent border-none p-0 space-x-6 rounded-none",
                className
            )}
        >
            {tabs.map((tab) => {
                const isActive = activeTab === tab.value;
                return (
                    <button
                        key={tab.value}
                        onClick={() => onChange(tab.value)}
                        className={cn(
                            "relative px-4 py-2 text-sm font-semibold transition-all duration-300 rounded-lg outline-none",
                            variant === "underline" && "px-0 py-3 rounded-none",
                            isActive ? "text-brand-primary" : "text-muted-foreground hover:text-foreground"
                        )}
                    >
                        <div className="flex items-center gap-2 relative z-10">
                            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
                            <span>{tab.label}</span>
                        </div>
                        {isActive && variant === "pills" && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute inset-0 bg-white dark:bg-slate-800 rounded-lg shadow-sm z-0"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                        {isActive && variant === "underline" && (
                            <motion.div
                                layoutId="activeTabUnderline"
                                className="absolute bottom-0 left-0 right-0 h-1 bg-brand-primary rounded-full z-0"
                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                            />
                        )}
                    </button>
                );
            })}
        </div>
    );
};
