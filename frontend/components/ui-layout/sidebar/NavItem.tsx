"use client";

import React from "react";
import { NavSection } from "@lib/config/adminRoutes";
import { NavItemLink } from "./NavItemLink";
import { CollapsibleHeader } from "./CollapsibleHeader";
import { AnimatedCollapsible } from "./AnimatedCollapsible";
import { NavSubItem } from "./NavSubItem";

interface NavItemProps {
  section: NavSection;
  pathname: string;
  expandedSection: string | null;
  onToggleSection: (title: string) => void;
  onClose: () => void;
}

/**
 * Universal nav item — renders a flat link or an animated collapsible group.
 * Used by both the desktop expanded sidebar and the mobile sidebar.
 */
export const NavItem: React.FC<NavItemProps> = ({
  section,
  pathname,
  expandedSection,
  onToggleSection,
  onClose,
}) => {
  const isItem = section.type === "item";
  const isSectionActive = isItem
    ? pathname === section.href
    : section.items.some((item) => pathname === item.href);
  const isOpen = expandedSection === section.title;

  if (isItem) {
    return (
      <NavItemLink section={section} pathname={pathname} onClick={onClose} />
    );
  }

  return (
    <div className="space-y-1">
      <CollapsibleHeader
        section={section}
        isActive={isSectionActive}
        isOpen={isOpen}
        onToggle={() => onToggleSection(section.title)}
      />
      <AnimatedCollapsible isOpen={isOpen}>
        {section.items.map((item) => (
          <NavSubItem
            key={item.label}
            label={item.label}
            href={item.href}
            pathname={pathname}
            onClick={onClose}
          />
        ))}
      </AnimatedCollapsible>
    </div>
  );
};
