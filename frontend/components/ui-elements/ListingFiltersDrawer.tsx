"use client";

import React from "react";
import { RotateCcw } from "lucide-react";
import { Button } from "@components/ui-elements/Button";
import { InlineDrawer } from "@components/ui-elements/InlineDrawer";
import { DynamicFilterRenderer } from "@components/ui-elements/DynamicFilterRenderer";
import { filterRegistry } from "@lib/filters/registry";
import { FilterConfig, FilterOption } from "@types";
import "@lib/filters/init"; // Initialize registry

interface ListingFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  registryKey: string;
  filters: Record<string, unknown>;
  onFilterChange: (key: string, value: unknown) => void;
  onReset: () => void;
  isLoading?: boolean;
  /** Custom options for specific filters (e.g. dynamic subjects) */
  dynamicOptions?: Record<string, FilterOption[]>;
}

export function ListingFiltersDrawer({
  isOpen,
  onClose,
  registryKey,
  filters,
  onFilterChange,
  onReset,
  isLoading = false,
  dynamicOptions = {},
}: ListingFiltersDrawerProps) {
  const configs = filterRegistry.getFilters(registryKey);

  return (
    <InlineDrawer isOpen={isOpen} onClose={onClose} title="Filters">
      <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-40">
        {configs.map((config) => {
          // Merge static options with dynamic options if provided
          const mergedConfig: FilterConfig = {
            ...config,
            options: dynamicOptions[config.id] || config.options,
          };

          return (
            <DynamicFilterRenderer
              key={config.id}
              config={mergedConfig}
              value={filters[config.id]}
              onChange={(val) => onFilterChange(config.id, val)}
              isLoading={isLoading}
            />
          );
        })}

        <div className="pt-2">
          <Button
            variant="outline"
            color="primary"
            size="md"
            shadow
            animate="scale"
            iconAnimation="rotate-360"
            startIcon={<RotateCcw size={18} />}
            onClick={onReset}
            className="font-bold w-full h-12"
            title="Reset Filters"
          >
            Reset All Filters
          </Button>
        </div>
      </div>
    </InlineDrawer>
  );
}
