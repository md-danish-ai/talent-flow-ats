import React from "react";

export interface NavItem {
  label: string;
  href: string;
}

export type NavSectionType = "item" | "collapsible";

export interface NavSection {
  title: string;
  icon: React.ReactNode;
  type: NavSectionType;
  href?: string;
  items: NavItem[];
}
