"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DateRangePicker } from "@components/ui-elements/DateRangePicker";
import { Button } from "@components/ui-elements/Button";
import { RotateCcw, RefreshCw } from "lucide-react";
import { Tooltip } from "@components/ui-elements/Tooltip";

interface DateRangeHeaderActionsProps {
  initialLabel?: string;
  onRefresh?: () => Promise<void>;
  isLoading?: boolean;
  showRefresh?: boolean;
}

export const DateRangeHeaderActions: React.FC<DateRangeHeaderActionsProps> = ({
  initialLabel = "Today",
  onRefresh,
  isLoading = false,
  showRefresh = true,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleRefresh = () => {
    router.refresh(); // Trigger server-side re-fetch
  };

  const handleRangeChange = (
    range: { from: string; to: string } | null,
    label: string,
  ) => {
    const params = new URLSearchParams(searchParams.toString());

    if (range) {
      params.set("date_from", range.from);
      params.set("date_to", range.to);
      params.delete("date"); // Clear single date if range is set
    } else {
      params.delete("date_from");
      params.delete("date_to");
      params.delete("date");
    }

    params.set("label", label);

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 w-full">
      <DateRangePicker
        onRangeChange={handleRangeChange}
        initialLabel={initialLabel}
        className="w-full"
      />
      {showRefresh && (
        <Tooltip content="Refresh candidates list">
          <Button
            variant="action"
            size="rounded-icon"
            animate="scale"
            onClick={onRefresh || handleRefresh}
            disabled={isLoading}
          >
            {isLoading ? (
              <RefreshCw size={18} className="animate-spin" />
            ) : (
              <RotateCcw size={18} />
            )}
          </Button>
        </Tooltip>
      )}
    </div>
  );
};
