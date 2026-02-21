"use client";

import React from "react";
import Link from "next/link";
import { NavSection } from "@data/navigation";
import { NAV_ACTIVE, NAV_IDLE } from "./styles";

interface CollapsedNavItemProps {
  section: NavSection;
  pathname: string;
  onExpand: () => void;
}

/**
 * Icon-only sidebar item rendered when the desktop sidebar is collapsed.
 * Shows a hover flyout tooltip/menu with section title and sub-links.
 */
export const CollapsedNavItem: React.FC<CollapsedNavItemProps> = ({
  section,
  pathname,
  onExpand,
}) => {
  const isItem = section.type === "item";
  const isSectionActive = isItem
    ? pathname === section.href
    : section.items.some((item) => pathname === item.href);

  const iconCls = `w-12 h-12 flex items-center justify-center rounded-md transition-all ${
    isSectionActive
      ? "bg-brand-primary/10 dark:bg-brand-primary/20 text-brand-primary shadow-sm"
      : "text-slate-500 dark:text-slate-400 hover:bg-brand-primary/10 dark:hover:bg-brand-primary/15 hover:text-brand-primary"
  }`;

  return (
    <div className="relative group flex flex-col items-center">
      {isItem ? (
        <Link href={section.href!} className={iconCls}>
          {section.icon}
        </Link>
      ) : (
        <button onClick={onExpand} className={iconCls}>
          {section.icon}
        </button>
      )}

      {/* Hover flyout */}
      <div className="absolute left-full ml-2 w-48 bg-card border border-border rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
        <div className="p-3 border-b border-border bg-muted/20">
          <span className="text-xs font-bold text-foreground uppercase tracking-wider">
            {section.title}
          </span>
        </div>
        {!isItem && (
          <div className="p-1">
            {section.items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`block px-3 py-2 rounded-md text-sm transition-colors ${
                  pathname === item.href ? NAV_ACTIVE : NAV_IDLE
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
