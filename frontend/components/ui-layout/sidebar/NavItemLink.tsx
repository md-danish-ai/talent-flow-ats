"use client";

import React from "react";
import { NavSection } from "@lib/routes/types";
import { NAV_ACTIVE, NAV_IDLE, ICON_ACTIVE, ICON_IDLE } from "./styles";
import { Typography } from "@components/ui-elements/Typography";
import { Button } from "@components/ui-elements/Button";
import { cn } from "@lib/utils";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const handleLinkClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (section.href) {
      router.push(section.href);
    }
    if (onClick) onClick();
  };

  return (
    <Button
      variant="text"
      color="default"
      fullWidth
      creativeHover={false}
      onClick={handleLinkClick}
      className={cn(
        "relative overflow-hidden w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-300 hover:scale-[1.05] active:scale-[0.95] group",
        isActive ? NAV_ACTIVE : NAV_IDLE,
      )}
    >
      <div className="flex items-center gap-3 w-full text-left">
        <Typography
          variant="span"
          className={isActive ? ICON_ACTIVE : ICON_IDLE}
        >
          {section.icon}
        </Typography>
        <Typography variant="body4" weight="semibold" as="span" color="inherit">
          {section.title}
        </Typography>
      </div>
    </Button>
  );
};
