"use client";

import React from "react";
import Link from "next/link";
import { NavSection } from "@/data/navigation";

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

  const iconCls = `w-12 h-12 flex items-center justify-center rounded-xl transition-all ${
    isSectionActive
      ? "bg-orange-50 text-[#F96331]"
      : "text-slate-500 hover:bg-orange-50 hover:text-[#F96331]"
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
      <div className="absolute left-full ml-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
        <div className="p-3 border-b border-slate-100 bg-slate-50">
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            {section.title}
          </span>
        </div>
        {!isItem && (
          <div className="p-1">
            {section.items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                  pathname === item.href
                    ? "text-[#F96331] font-bold bg-orange-50"
                    : "text-slate-600 hover:bg-orange-50 hover:text-[#F96331]"
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
