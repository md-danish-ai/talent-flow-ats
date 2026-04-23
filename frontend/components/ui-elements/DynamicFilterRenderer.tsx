"use client";

import React from "react";
import { FilterConfig, DynamicFilterRendererProps } from "@types";
import { SelectDropdown } from "@components/ui-elements/SelectDropdown";
import { SearchInput } from "@components/ui-elements/SearchInput";
import { Typography } from "@components/ui-elements/Typography";
import { Tabs } from "@components/ui-elements/Tabs";
import { Switch } from "@components/ui-elements/Switch";
import { DateRangePicker } from "@components/ui-elements/DateRangePicker";

export function DynamicFilterRenderer({
  config,
  value,
  onChange,
  isLoading,
}: DynamicFilterRendererProps) {
  const labelElement = (
    <Typography
      variant="body5"
      weight="bold"
      className="uppercase tracking-widest text-muted-foreground mb-3 block"
    >
      {config.label}
    </Typography>
  );

  switch (config.type) {
    case "tabs":
      return (
        <div className="flex flex-col">
          {labelElement}
          <Tabs
            tabs={(config.options || []).map((o) => ({
              label: o.label,
              value: String(o.id),
            }))}
            activeTab={String(value)}
            onChange={(val) => onChange(val as unknown)}
            fullWidth
            {...config.props}
          />
        </div>
      );

    case "switch":
      return (
        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/20 border border-border/50">
          <Typography variant="body4" weight="semibold">
            {config.label}
          </Typography>
          <Switch
            checked={Boolean(value)}
            onChange={(val) => onChange(val as unknown)}
            {...config.props}
          />
        </div>
      );

    case "date-range": {
      const dateVal = value as { label?: string } | undefined;
      return (
        <div className="flex flex-col">
          {labelElement}
          <DateRangePicker
            onRangeChange={(range, label) => onChange({ range, label } as unknown)}
            initialLabel={dateVal?.label || "Today"}
            {...(config.props || {})}
          />
        </div>
      );
    }

    case "select":
      return (
        <div className="flex flex-col">
          {labelElement}
          <SelectDropdown
            options={config.options || []}
            value={value as string | number | undefined}
            onChange={(val) => onChange(val as unknown)}
            placeholder={config.placeholder}
            isLoading={isLoading}
            aria-label={`Filter by ${config.label}`}
            {...config.props}
          />
        </div>
      );

    case "search":
      return (
        <div className="flex flex-col">
          {labelElement}
          <SearchInput
            placeholder={config.placeholder}
            value={value as string}
            onSearch={(val) => onChange(val as unknown)}
            aria-label={`Search ${config.label}`}
            {...config.props}
          />
        </div>
      );

    default:
      return null;
  }
}
