"use client";

import React from "react";
import Link from "next/link";
import { NAV_ACTIVE, NAV_IDLE } from "./styles";

interface NavSubItemProps {
  label: string;
  href: string;
  pathname: string;
  onClick?: () => void;
}

/** Single sub-item link inside a collapsible section */
export const NavSubItem: React.FC<NavSubItemProps> = ({
  label,
  href,
  pathname,
  onClick,
}) => {
  const isActive = pathname === href;
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors group/item ${
        isActive ? NAV_ACTIVE : NAV_IDLE
      }`}
    >
      <div
        className={`w-1.5 h-1.5 rounded-full transition-all duration-200 ${
          isActive
            ? "bg-brand-primary scale-125"
            : "bg-slate-300 dark:bg-slate-700 group-hover/item:bg-brand-primary"
        }`}
      />
      <span className="truncate">{label}</span>
    </Link>
  );
};
