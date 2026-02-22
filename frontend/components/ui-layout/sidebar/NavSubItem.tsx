"use client";

import React from "react";
import Link from "next/link";
import { NAV_ACTIVE, NAV_IDLE } from "./styles";
import { useRipple, RippleContainer } from "@components/ui-elements/Ripple";

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
  const { ripples, createRipple, removeRipple } = useRipple();

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    createRipple(event);
    if (onClick) onClick();
  };

  return (
    <Link
      href={href}
      onClick={handleLinkClick}
      className={`relative overflow-hidden flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group/item ${
        isActive ? NAV_ACTIVE : NAV_IDLE
      }`}
    >
      <div
        className={`relative z-10 w-1.5 h-1.5 rounded-full transition-all duration-200 ${
          isActive
            ? "bg-brand-primary scale-125"
            : "bg-slate-300 dark:bg-slate-700 group-hover/item:bg-brand-primary"
        }`}
      />
      <span className="relative z-10 truncate">{label}</span>

      <RippleContainer
        ripples={ripples}
        onRemove={removeRipple}
        color="bg-brand-primary/15"
      />
    </Link>
  );
};
