import { LayoutDashboard, Bell } from "lucide-react";
import { NavSection } from "./types";

export const PROJECT_LEAD_ROUTES: NavSection[] = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    type: "item",
    href: "/project-lead/dashboard",
    items: [],
  },
  {
    title: "Candidates",
    icon: <LayoutDashboard className="w-5 h-5" />, // Will change icon later
    type: "item",
    href: "/project-lead/users",
    items: [],
  },
  {
    title: "Notifications",
    icon: <Bell className="w-5 h-5" />, // Will change icon later
    type: "item",
    href: "/project-lead/notifications",
    items: [],
  },
];
