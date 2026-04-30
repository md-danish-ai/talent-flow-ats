"use client";

import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { NavSection } from "@lib/routes/types";
import { ADMIN_ROUTES } from "@lib/routes/admin";
import { PROJECT_LEAD_ROUTES } from "@lib/routes/project-lead";
import { Button } from "@components/ui-elements/Button";

import { useSidebar } from "./SidebarProvider";
import { NavItem } from "./NavItem";
import { CollapsedNavItem } from "./CollapsedNavItem";
import { useMe } from "@hooks/api/user/use-me";
import { Avatar } from "@components/ui-elements/Avatar";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@lib/utils";

export const Sidebar = ({ role = "admin" }: { role?: string }) => {
  const pathname = usePathname();
  const routes = role === "project_lead" ? PROJECT_LEAD_ROUTES : ADMIN_ROUTES;
  const {
    isMobileOpen,
    isCollapsed,
    toggleSidebar,
    closeMobileSidebar,
    expandSidebar,
  } = useSidebar();
  const router = useRouter();
  const { data: user } = useMe();

  const handleLogout = () => {
    // Clear all auth cookies
    document.cookie =
      "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";
    document.cookie =
      "user_info=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT";

    // Redirect to sign-in
    router.push("/sign-in");
  };

  const [expandedSection, setExpandedSection] = useState<string | null>(() => {
    const active = routes.find(
      (s: NavSection) =>
        s.type !== "item" &&
        s.items.some(
          (item: { href: string }) =>
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href + "/")),
        ),
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
              {routes.map((section: NavSection) => (
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
              {routes.map((section: NavSection) => (
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
            {routes.map((section: NavSection) => (
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

          {/* User Profile & Logout Section at Bottom */}
          <div
            className={cn(
              "mt-auto border-t border-border/40 bg-slate-50/30 dark:bg-slate-900/10",
              isCollapsed ? "p-2" : "p-4 space-y-3",
            )}
          >
            {/* Profile Info */}
            <div
              className={cn(
                "flex items-center gap-3",
                isCollapsed ? "flex-col py-2" : "px-1",
              )}
            >
              <Avatar
                name={user?.username || "User"}
                variant="brand"
                size="sm"
              />
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-950 dark:text-white truncate uppercase tracking-tight">
                    {user?.username || "Loading..."}
                  </p>
                  <p className="text-[10px] font-bold text-brand-primary uppercase tracking-widest opacity-80">
                    {role.replace("_", " ")}
                  </p>
                </div>
              )}
            </div>

            {/* Logout Action */}
            <Button
              variant="ghost"
              onClick={handleLogout}
              className={cn(
                "w-full transition-all duration-300 group flex items-center text-slate-500 dark:text-slate-400 hover:text-brand-primary hover:bg-brand-primary/10 border border-transparent hover:border-brand-primary/20",
                isCollapsed
                  ? "justify-center h-10 p-0"
                  : "justify-start px-3 h-11 gap-3 rounded-xl",
              )}
              title="Logout"
            >
              <LogOut
                size={18}
                className="group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300 shrink-0"
              />
              {!isCollapsed && (
                <span className="text-[11px] font-bold uppercase tracking-widest group-hover:translate-x-1 transition-transform duration-300">
                  Sign Out
                </span>
              )}
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};
