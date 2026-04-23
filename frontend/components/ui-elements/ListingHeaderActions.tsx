"use client";

import React from "react";
import { RefreshCcw, Loader2, Filter } from "lucide-react";
import { Button } from "./Button";
import { Tooltip } from "./Tooltip";
import { Badge } from "./Badge";
import { cn } from "@lib/utils";
import { AnimatePresence, motion } from "framer-motion";

interface ListingHeaderActionsProps {
  isLoading: boolean;
  isBackgroundLoading?: boolean;
  totalItems: number;
  itemLabel?: string;
  onRefresh: () => void;
  onToggleFilter?: () => void;
  isFilterOpen?: boolean;
  activeFiltersCount?: number;
}

/**
 * Standardized header actions for all listing pages.
 * Includes total count badge, background update spinner, refresh button, and filter toggle.
 */
export function ListingHeaderActions({
  isLoading,
  isBackgroundLoading,
  totalItems,
  itemLabel = "Records",
  onRefresh,
  onToggleFilter,
  isFilterOpen,
  activeFiltersCount = 0,
}: ListingHeaderActionsProps) {
  return (
    <div className="flex items-center gap-3">
      <AnimatePresence mode="popLayout">
        {isLoading || isBackgroundLoading ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 5 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 5 }}
            className="flex items-center gap-2 px-2 text-brand-primary"
          >
            <Loader2 size={14} className="animate-spin" />
            <span className="text-[10px] font-bold uppercase tracking-tighter">
              Updating...
            </span>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key="total-count"
          >
            <Badge
              variant="outline"
              color="default"
              className="font-bold border-border/50 bg-card whitespace-nowrap"
            >
              {totalItems} {itemLabel.toUpperCase()}
            </Badge>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="h-6 w-px bg-border/50 mx-1" />

      <Tooltip content="Refresh Data" side="bottom">
        <Button
          variant="action"
          size="rounded-icon"
          animate="scale"
          onClick={onRefresh}
          disabled={isLoading}
          aria-label="Refresh list"
        >
          <div className={cn((isLoading || isBackgroundLoading) && "animate-spin")}>
            <RefreshCcw size={18} />
          </div>
        </Button>
      </Tooltip>

      {onToggleFilter && (
        <Tooltip
          content={
            activeFiltersCount > 0
              ? `Filters (${activeFiltersCount} active)`
              : "Advanced Filters"
          }
        >
          <Button
            variant="action"
            size="rounded-icon"
            isActive={isFilterOpen}
            animate="scale"
            onClick={onToggleFilter}
            aria-label="Toggle filters"
            aria-expanded={isFilterOpen}
          >
            <div className="relative">
              <Filter size={18} />
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 rounded-full bg-brand-primary text-white text-[8px] font-black flex items-center justify-center leading-none border border-card animate-in zoom-in duration-300">
                  {activeFiltersCount}
                </span>
              )}
            </div>
          </Button>
        </Tooltip>
      )}
    </div>
  );
}
