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
  onRefresh: (silent?: boolean) => void;
  onToggleFilter?: () => void;
  isFilterOpen?: boolean;
  activeFiltersCount?: number;
  badgePosition?: "left" | "right";
}

export function ListingBadge({
  isLoading,
  isBackgroundLoading,
  totalItems,
  itemLabel = "Records",
}: Pick<
  ListingHeaderActionsProps,
  "isLoading" | "isBackgroundLoading" | "totalItems" | "itemLabel"
>) {
  return (
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
  );
}

export function ListingIcons({
  isLoading,
  isBackgroundLoading,
  onRefresh,
  onToggleFilter,
  isFilterOpen,
  activeFiltersCount = 0,
}: Pick<
  ListingHeaderActionsProps,
  | "isLoading"
  | "isBackgroundLoading"
  | "onRefresh"
  | "onToggleFilter"
  | "isFilterOpen"
  | "activeFiltersCount"
>) {
  return (
    <div className="flex items-center gap-2">
      <Tooltip content="Refresh Data" side="bottom">
        <Button
          variant="action"
          size="rounded-icon"
          animate="scale"
          iconAnimation="rotate-180"
          onClick={() => onRefresh(false)}
          disabled={isLoading}
          aria-label="Refresh list"
        >
          <div
            className={cn((isLoading || isBackgroundLoading) && "animate-spin")}
          >
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
            iconAnimation="none"
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
  badgePosition = "left",
}: ListingHeaderActionsProps) {
  const badge = (
    <ListingBadge
      isLoading={isLoading}
      isBackgroundLoading={isBackgroundLoading}
      totalItems={totalItems}
      itemLabel={itemLabel}
    />
  );

  const icons = (
    <ListingIcons
      isLoading={isLoading}
      isBackgroundLoading={isBackgroundLoading}
      onRefresh={onRefresh}
      onToggleFilter={onToggleFilter}
      isFilterOpen={isFilterOpen}
      activeFiltersCount={activeFiltersCount}
    />
  );

  return (
    <div className="flex items-center gap-3">
      {badgePosition === "left" && (
        <>
          {badge}
          <div className="h-6 w-px bg-border/50 mx-1" />
        </>
      )}

      {icons}

      {badgePosition === "right" && (
        <>
          <div className="h-6 w-px bg-border/50 mx-1" />
          {badge}
        </>
      )}
    </div>
  );
}
