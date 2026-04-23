"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@lib/utils";

interface ListingTransitionProps {
  children: React.ReactNode;
  isLoading: boolean;
  isBackgroundLoading?: boolean;
  /** Unique key to trigger animation when state changes (e.g. key={isLoading ? 'skeleton' : 'table'}) */
  animationKey?: string;
  className?: string;
}

/**
 * A reusable wrapper that provides smooth cross-fade transitions between
 * different listing states (e.g., Skeleton vs Table) and handles background
 * loading opacity.
 */
export function ListingTransition({
  children,
  isLoading,
  isBackgroundLoading,
  animationKey,
  className,
}: ListingTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={animationKey || (isLoading ? "loading" : "content")}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className={cn(
          "flex-1 flex flex-col min-w-0",
          isBackgroundLoading &&
            "opacity-60 pointer-events-none transition-opacity duration-300",
          className,
        )}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
