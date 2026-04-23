import { LayoutDashboard } from "lucide-react";
import { NavSection } from "./types";

export const PROJECT_LEAD_ROUTES: NavSection[] = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    type: "item",
    href: "/project-lead/dashboard",
    items: [],
  },
];
