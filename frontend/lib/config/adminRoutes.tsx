import React from "react";
import {
  LayoutDashboard,
  HelpCircle,
  FileText,
  BarChart3,
  Settings,
  Package,
  Users,
  Layers,
} from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
}

export type NavSectionType = "item" | "collapsible";

export interface NavSection {
  title: string;
  icon: React.ReactNode;
  type: NavSectionType;
  href?: string; // Used when type is "item"
  items: NavItem[]; // Used when type is "collapsible"
}

export const ADMIN_ROUTES: NavSection[] = [
  {
    title: "Dashboard",
    icon: <LayoutDashboard className="w-5 h-5" />,
    type: "item",
    href: "/admin/dashboard",
    items: [],
  },
  {
    title: "Questions",
    icon: <HelpCircle className="w-5 h-5" />,
    type: "collapsible",
    items: [
      { label: "Multiple Choice", href: "/admin/questions/mcq" },
      { label: "Image Based MCQ", href: "/admin/questions/image-mcq" },
      { label: "Subjective Questions", href: "/admin/questions/subjective" },
      { label: "Image Subjective", href: "/admin/questions/image-subjective" },
      { label: "Passage Content", href: "/admin/questions/passage" },
    ],
  },
  {
    title: "Papers",
    icon: <FileText className="w-5 h-5" />,
    type: "collapsible",
    items: [
      { label: "Paper Setup", href: "/admin/paper/setup" },
      { label: "Company Contact", href: "/admin/paper/contact-details" },
      { label: "Lead Generation", href: "/admin/paper/lead-generation" },
      { label: "Typing Test", href: "/admin/paper/typing-test" },
      { label: "Reset User", href: "/admin/paper/reset-user" },
      { label: "Set Today's Papers", href: "/admin/paper/today-papers" },
    ],
  },
  {
    title: "Results",
    icon: <BarChart3 className="w-5 h-5" />,
    type: "collapsible",
    items: [{ label: "View All Results", href: "/admin/results" }],
  },
  {
    title: "Management",
    icon: <Users className="w-5 h-5" />,
    type: "collapsible",
    items: [
      { label: "Admins", href: "/admin/management/admins" },
      { label: "Users", href: "/admin/management/users" },
      { label: "Add Subject & Level", href: "/admin/management/subject-level" },
    ],
  },
  {
    title: "Settings",
    icon: <Settings className="w-5 h-5" />,
    type: "collapsible",
    items: [
      { label: "Allow Authenticated Users", href: "/admin/settings/auth" },
      { label: "Subject Management", href: "/admin/settings/add-subject" },
    ],
  },
  ...(process.env.NEXT_PUBLIC_APP_ENV === "dev"
    ? [
      {
        title: "Packages",
        icon: <Package className="w-5 h-5" />,
        type: "item" as NavSectionType,
        href: "/admin/packages",
        items: [],
      },
    ]
    : []),
];
