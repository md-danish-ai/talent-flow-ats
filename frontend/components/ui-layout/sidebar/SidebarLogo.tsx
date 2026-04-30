"use client";

import React from "react";
import Link from "next/link";

import { Logo } from "@components/ui-elements/Logo";

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
  return (
    <Link href="/admin/dashboard" className="block" onClick={onClose}>
      <Logo iconOnly={isCollapsed && !isOpen} size="md" />
    </Link>
  );
};
