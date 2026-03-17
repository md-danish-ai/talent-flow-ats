import {
  LayoutDashboard,
  HelpCircle,
  FileText,
  BarChart3,
  Settings,
  Package,
  Building2,
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
  href?: string;
  items: NavItem[];
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
      { label: "Typing Test", href: "/admin/questions/typing-test" },
      { label: "Lead Generation", href: "/admin/questions/lead-generation" },
      { label: "Contact Details", href: "/admin/questions/contact-details" },
    ],
  },
  {
    title: "Papers Setup",
    icon: <FileText className="w-5 h-5" />,
    type: "collapsible",
    items: [
      { label: "Paper Setup", href: "/admin/paper/setup" },
      { label: "Set Today's Papers", href: "/admin/paper/today-papers" },
      { label: "Reset User Status", href: "/admin/paper/reset-user" },
    ],
  },
  {
    title: "Results",
    icon: <BarChart3 className="w-5 h-5" />,
    type: "collapsible",
    items: [
      { label: "All Statistics", href: "/admin/results" },
      { label: "Individual Results", href: "/admin/results/user-results" },
    ],
  },
  {
    title: "Management",
    icon: <Building2 className="w-5 h-5" />,
    type: "collapsible",
    items: [
      { label: "Admins", href: "/admin/management/admins" },
      { label: "Users", href: "/admin/management/users" },
      { label: "Departments", href: "/admin/management/department" },
      { label: "Subjects & Levels", href: "/admin/management/subject-level" },
    ],
  },
  {
    title: "System Config",
    icon: <Settings className="w-5 h-5" />,
    type: "collapsible",
    items: [
      { label: "Auth Rules", href: "/admin/settings/auth" },
      { label: "Notification Center", href: "/admin/notifications" },
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
