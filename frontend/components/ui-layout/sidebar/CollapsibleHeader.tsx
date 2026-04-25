"use client";

import React from "react";
import { NavSection } from "@lib/routes/types";
import { NAV_ACTIVE, NAV_IDLE, ICON_ACTIVE, ICON_IDLE } from "./styles";
import { Typography } from "@components/ui-elements/Typography";
import { Button } from "@components/ui-elements/Button";
import { cn } from "@lib/utils";

interface CollapsibleHeaderProps {
  section: NavSection;
  isActive: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

/** Collapsible section header button with animated chevron */
export const CollapsibleHeader: React.FC<CollapsibleHeaderProps> = ({
  section,
  isActive,
  isOpen,
  onToggle,
}) => (
  <Button
    variant="text"
    color="default"
    fullWidth
    creativeHover={false}
    onClick={onToggle}
    className={cn(
      "w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium transition-all duration-300 hover:scale-[1.05] active:scale-[0.95] group",
      isActive ? NAV_ACTIVE : NAV_IDLE,
    )}
  >
    <div className="flex items-center gap-3 text-left">
      <Typography variant="span" className={isActive ? ICON_ACTIVE : ICON_IDLE}>
        {section.icon}
      </Typography>
      <Typography variant="body4" weight="semibold" as="span" color="inherit">
        {section.title}
      </Typography>
    </div>
    <div className="flex items-center justify-center shrink-0">
      <svg
        className={cn(
          "w-4 h-4 transition-transform duration-300",
          isOpen ? "rotate-180 text-brand-primary" : "text-muted-foreground/60",
        )}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    </div>
  </Button>
);
