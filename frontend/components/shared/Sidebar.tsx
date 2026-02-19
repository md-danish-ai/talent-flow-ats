"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV_LINKS, NavSection } from "./constants/navigation";

import { SidebarLogo } from "./components/SidebarLogo";
import { useSidebarContext } from "./components/SidebarProvider";

// Nav Item for Desktop
const DesktopNavItem = ({
  section,
  pathname,
  expandedSection,
  isCollapsed,
  onToggleSection,
  onClose,
  onExpand,
}: {
  section: NavSection;
  pathname: string;
  expandedSection: string | null;
  isCollapsed: boolean;
  onToggleSection: (title: string) => void;
  onClose: () => void;
  onExpand: () => void;
}) => {
  const isSectionActive = section.items.some((item) => pathname === item.href);
  const isContentOpen = expandedSection === section.title;

  if (isCollapsed) {
    return (
      <div className="relative group flex flex-col items-center">
        <button
          onClick={onExpand}
          className={`w-12 h-12 flex items-center justify-center rounded-xl transition-all
          ${isSectionActive ? "bg-orange-50 text-[#F96331]" : "text-slate-500 hover:bg-orange-50 hover:text-[#F96331]"}
        `}
        >
          {section.icon}
        </button>

        <div className="absolute left-full ml-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 overflow-hidden">
          <div className="p-3 border-b border-slate-100 bg-slate-50">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              {section.title}
            </span>
          </div>
          <div className="p-1">
            {section.items.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`block px-3 py-2 rounded-lg text-sm transition-colors ${pathname === item.href ? "text-[#F96331] font-bold bg-orange-50" : "text-slate-600 hover:bg-orange-50 hover:text-[#F96331]"}`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <button
        onClick={() => onToggleSection(section.title)}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all
        ${isSectionActive ? "text-[#F96331] bg-orange-50/30" : "text-slate-600 hover:bg-orange-50 hover:text-[#F96331]"}
      `}
      >
        <div className="flex items-center gap-3">
          <span
            className={
              isSectionActive
                ? "text-[#F96331]"
                : "text-slate-400 group-hover:text-slate-600"
            }
          >
            {section.icon}
          </span>
          <span className="font-semibold">{section.title}</span>
        </div>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${isContentOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isContentOpen && (
        <div className="pl-11 space-y-1 animate-in slide-in-from-top-1 duration-200">
          {section.items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              onClick={onClose}
              className={`block px-3 py-2 rounded-lg text-sm transition-colors
              ${
                pathname === item.href
                  ? "text-[#F96331] font-bold bg-orange-50/50"
                  : "text-slate-500 hover:text-[#F96331] hover:bg-orange-50/50"
              }
            `}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export const Sidebar = () => {
  const pathname = usePathname();
  const {
    isMobileOpen,
    isCollapsed,
    toggleSidebar,
    closeMobileSidebar,
    expandSidebar,
  } = useSidebarContext();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (title: string) => {
    setExpandedSection(expandedSection === title ? null : title);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 min-[900px]:hidden"
          onClick={closeMobileSidebar}
        />
      )}

      {/* Sidebar Content */}
      <aside
        className={`
        fixed top-0 left-0 bottom-0 z-50 bg-white border-r border-slate-200 transition-all duration-300 ease-in-out
        min-[900px]:static min-[900px]:translate-x-0
        ${isCollapsed ? "w-20" : "w-[280px]"}
        ${isMobileOpen ? "translate-x-0 w-80" : "-translate-x-full min-[900px]:translate-x-0"}
      `}
      >
        {/* Edge Toggle Button - Desktop Only */}
        <button
          onClick={toggleSidebar}
          className="hidden min-[900px]:flex absolute -right-3 top-20 w-6 h-6 bg-white border border-slate-200 rounded-full items-center justify-center text-slate-400 hover:text-[#F96331] hover:border-[#F96331] shadow-sm z-50 transition-all"
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
        </button>

        <div className="flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div
            className={`p-6 flex items-center border-b border-slate-200 h-[73px]
            ${isCollapsed && !isMobileOpen ? "justify-center" : "justify-between"}
          `}
          >
            <SidebarLogo
              isCollapsed={isCollapsed}
              isOpen={isMobileOpen}
              onClose={closeMobileSidebar}
            />

            {isMobileOpen && (
              <button
                onClick={closeMobileSidebar}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg min-[900px]:hidden"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>

          {/* Desktop Navigation List */}
          <nav
            className={`hidden min-[900px]:block flex-1 overflow-y-auto py-6 space-y-2
            ${isCollapsed ? "px-2" : "px-4"}
          `}
          >
            {ADMIN_NAV_LINKS.map((section) => (
              <DesktopNavItem
                key={section.title}
                section={section}
                pathname={pathname}
                expandedSection={expandedSection}
                isCollapsed={isCollapsed}
                onToggleSection={toggleSection}
                onClose={closeMobileSidebar}
                onExpand={() => {
                  expandSidebar();
                  toggleSection(section.title);
                }}
              />
            ))}
          </nav>

          {/* Mobile Navigation List (Flat Version) */}
          <nav className="min-[900px]:hidden flex-1 overflow-y-auto p-4 space-y-8 mt-4">
            {ADMIN_NAV_LINKS.map((section) => (
              <div key={section.title}>
                <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.1em] mb-4 px-3">
                  {section.title}
                </h4>
                <ul className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.label}>
                        <Link
                          href={item.href}
                          onClick={closeMobileSidebar}
                          className={`
                             flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                             ${
                               isActive
                                 ? "bg-orange-50 text-[#F96331]"
                                 : "text-slate-600 hover:bg-orange-50 hover:text-[#F96331]"
                             }
                           `}
                        >
                          {item.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};
