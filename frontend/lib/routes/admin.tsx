import {
  LayoutDashboard,
  HelpCircle,
  FileText,
  BarChart3,
  Package,
  Building2,
  Bell,
} from "lucide-react";
import { NavSection, NavSectionType } from "./types";

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
      { label: "Typing Test", href: "/admin/questions/typing-test" },
      { label: "Lead Generation", href: "/admin/questions/lead-generation" },
      {
        label: "Company Contact Details",
        href: "/admin/questions/contact-details",
      },
    ],
  },
  {
    title: "Papers Setup",
    icon: <FileText className="w-5 h-5" />,
    type: "collapsible",
    items: [
      { label: "Paper Setup", href: "/admin/paper/setup" },
      { label: "Set Today's Papers", href: "/admin/paper/today-papers" },
      { label: "Auto-Assignment", href: "/admin/paper/auto-assignment" },
      { label: "Reset User Status", href: "/admin/paper/reset-status" },
    ],
  },
  {
    title: "Results",
    icon: <BarChart3 className="w-5 h-5" />,
    type: "collapsible",
    items: [
      { label: "Round 1 Results", href: "/admin/results/round-1" },
      { label: "Round 2 (F2F) Results", href: "/admin/results/round-2" },
    ],
  },
  {
    title: "Management",
    icon: <Building2 className="w-5 h-5" />,
    type: "collapsible",
    items: [
      { label: "Admins", href: "/admin/management/admins" },
      { label: "Project Leads", href: "/admin/management/project-leads" },
      { label: "Users", href: "/admin/management/users" },
      { label: "Departments", href: "/admin/management/department" },
      { label: "Subjects & Levels", href: "/admin/management/subject-level" },
    ],
  },
  {
    title: "Notifications",
    icon: <Bell className="w-5 h-5" />,
    type: "item",
    href: "/admin/notifications",
    items: [],
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
