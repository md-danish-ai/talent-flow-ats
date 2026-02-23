"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { ADMIN_ROUTES, NavSection } from "@lib/config/adminRoutes";
import { Button } from "@components/ui-elements/Button";

import { useSidebar } from "./SidebarProvider";
import { NavItem } from "./NavItem";
import { CollapsedNavItem } from "./CollapsedNavItem";

export const Sidebar = () => {
  const pathname = usePathname();
  const {
    isMobileOpen,
    isCollapsed,
    toggleSidebar,
    closeMobileSidebar,
    expandSidebar,
  } = useSidebar();

  const [expandedSection, setExpandedSection] = useState<string | null>(() => {
    const active = ADMIN_ROUTES.find(
      (s: NavSection) =>
        s.type !== "item" &&
        s.items.some((item: { href: string }) => pathname === item.href),
    );
    return active ? active.title : null;
  });

  const toggleSection = (title: string) => {
    setExpandedSection((prev) => (prev === title ? null : title));
  };

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 min-[900px]:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 bottom-0 z-50 bg-background border-r border-transparent transition-all duration-300 ease-in-out
          min-[900px]:relative min-[900px]:translate-x-0
          ${isCollapsed ? "w-20" : "w-[280px]"}
          ${isMobileOpen ? "translate-x-0 w-80" : "-translate-x-full min-[900px]:translate-x-0"}
        `}
      >
        <Button
          variant="ghost"
          color="default"
          size="icon-sm"
          onClick={toggleSidebar}
          className="hidden min-[900px]:flex absolute -right-3 top-20 w-6 h-6 bg-card border border-border shadow-sm z-50"
        >
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${isCollapsed ? "" : "rotate-180"}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </Button>

        <div className="flex items-center justify-between p-4 min-[900px]:hidden">
          <Button
            variant="ghost"
            color="default"
            size="icon-sm"
            className="min-[900px]:hidden"
            onClick={toggleSidebar}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </Button>
        </div>

        <div className="flex flex-col h-full overflow-hidden">
          {isCollapsed && (
            <nav className="hidden min-[900px]:flex flex-col flex-1 overflow-y-auto py-6 px-2 space-y-2">
              {ADMIN_ROUTES.map((section: NavSection) => (
                <CollapsedNavItem
                  key={section.title}
                  section={section}
                  pathname={pathname}
                  onExpand={() => {
                    expandSidebar();
                    toggleSection(section.title);
                  }}
                />
              ))}
            </nav>
          )}

          {!isCollapsed && (
            <nav className="hidden min-[900px]:block flex-1 overflow-y-auto py-6 px-4 space-y-2">
              {ADMIN_ROUTES.map((section: NavSection) => (
                <NavItem
                  key={section.title}
                  section={section}
                  pathname={pathname}
                  expandedSection={expandedSection}
                  onToggleSection={toggleSection}
                  onClose={closeMobileSidebar}
                />
              ))}
            </nav>
          )}

          <nav className="min-[900px]:hidden flex-1 overflow-y-auto px-4 py-6 space-y-2">
            {ADMIN_ROUTES.map((section: NavSection) => (
              <NavItem
                key={section.title}
                section={section}
                pathname={pathname}
                expandedSection={expandedSection}
                onToggleSection={toggleSection}
                onClose={closeMobileSidebar}
              />
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};
