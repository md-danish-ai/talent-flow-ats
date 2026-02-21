"use client";

import React from "react";
import Link from "next/link";

import { Typography } from "@components/ui-elements/Typography";

interface SidebarLogoProps {
  isCollapsed: boolean;
  isOpen: boolean;
  onClose?: () => void;
}

export const SidebarLogo: React.FC<SidebarLogoProps> = ({
  isCollapsed,
  isOpen,
  onClose,
}) => {
  const showFullLogo = !isCollapsed || isOpen;

  return (
    <Link
      href="/admin/dashboard"
      className="flex items-center gap-2"
      onClick={onClose}
    >
      <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center text-white font-bold shrink-0">
        A
      </div>
      {showFullLogo && (
        <Typography
          variant="body1"
          weight="bold"
          as="span"
          className="text-slate-900 tracking-tight whitespace-nowrap"
        >
          ArcInterview
        </Typography>
      )}
    </Link>
  );
};
