"use client";

import React from "react";
import Link from "next/link";
import { NavSection } from "@data/navigation";
import { NAV_ACTIVE, NAV_IDLE, ICON_ACTIVE, ICON_IDLE } from "./styles";
import { Typography } from "@components/ui-elements/Typography";

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
  return (
    <Link
      href={section.href!}
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all group ${
        isActive ? NAV_ACTIVE : NAV_IDLE
      }`}
    >
      <Typography variant="span" className={isActive ? ICON_ACTIVE : ICON_IDLE}>
        {section.icon}
      </Typography>
      <Typography variant="body4" weight="semibold" as="span" color="inherit">
        {section.title}
      </Typography>
    </Link>
  );
};
