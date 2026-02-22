"use client";

import React from "react";
import Link from "next/link";
import { NavSection } from "@data/navigation";
import { NAV_ACTIVE, NAV_IDLE, ICON_ACTIVE, ICON_IDLE } from "./styles";
import { Typography } from "@components/ui-elements/Typography";
import { useRipple, RippleContainer } from "@components/ui-elements/Ripple";

interface NavItemLinkProps {
  section: NavSection;
  pathname: string;
  onClick?: () => void;
}

/** Single flat nav link — used when section.type === "item" */
export const NavItemLink: React.FC<NavItemLinkProps> = ({
  section,
  pathname,
  onClick,
}) => {
  const isActive = pathname === section.href;
  const { ripples, createRipple, removeRipple } = useRipple();

  const handleLinkClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    createRipple(event);
    if (onClick) onClick();
  };

  return (
    <Link
      href={section.href!}
      onClick={handleLinkClick}
      className={`relative overflow-hidden w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group ${
        isActive ? NAV_ACTIVE : NAV_IDLE
      }`}
    >
      <Typography variant="span" className={isActive ? ICON_ACTIVE : ICON_IDLE}>
        {section.icon}
      </Typography>
      <Typography variant="body4" weight="semibold" as="span" color="inherit">
        {section.title}
      </Typography>

      <RippleContainer
        ripples={ripples}
        onRemove={removeRipple}
        color="bg-brand-primary/20"
      />
    </Link>
  );
};
