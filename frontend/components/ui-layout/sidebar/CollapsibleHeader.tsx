"use client";

import React from "react";
import { NavSection } from "@data/navigation";
import { NAV_ACTIVE, NAV_IDLE, ICON_ACTIVE, ICON_IDLE } from "./styles";
import { Typography } from "@components/ui-elements/Typography";
import { Button } from "@components/ui-elements/Button";

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
    onClick={onToggle}
    className={`w-full flex items-center justify-between px-3 py-2.5 text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group ${
      isActive ? NAV_ACTIVE : NAV_IDLE
    }`}
  >
    <div className="flex items-center gap-3 text-left">
      <Typography variant="span" className={isActive ? ICON_ACTIVE : ICON_IDLE}>
        {section.icon}
      </Typography>
      <Typography variant="body4" weight="semibold" as="span" color="inherit">
        {section.title}
      </Typography>
    </div>
    <svg
      className={`w-4 h-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
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
  </Button>
);
