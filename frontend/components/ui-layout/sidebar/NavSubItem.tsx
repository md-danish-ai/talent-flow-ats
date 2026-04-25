"use client";

import React from "react";
import { NAV_ACTIVE, NAV_IDLE } from "./styles";
import { Button } from "@components/ui-elements/Button";
import { cn } from "@lib/utils";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const handleLinkClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    router.push(href);
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
        "relative overflow-hidden flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-300 hover:scale-[1.05] active:scale-[0.95] group/item",
        isActive ? NAV_ACTIVE : NAV_IDLE,
      )}
    >
      <div className="flex items-center gap-3 w-full text-left">
        <div
          className={cn(
            "relative z-10 w-1.5 h-1.5 rounded-full transition-all duration-200 shrink-0",
            isActive
              ? "bg-brand-primary scale-125"
              : "bg-slate-300 dark:bg-slate-700 group-hover/item:bg-brand-primary",
          )}
        />
        <span className="relative z-10 truncate">{label}</span>
      </div>
    </Button>
  );
};
