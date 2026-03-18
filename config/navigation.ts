import {
  User,
  GraduationCap,
  Briefcase,
  Zap,
  FileText,
  Settings,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface SidebarNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
}

export const sidebarItems: SidebarNavItem[] = [
  { id: "basic", label: "Basic Info", icon: User, href: "/dashboard" },
  { id: "education", label: "Education", icon: GraduationCap, href: "/dashboard/education" },
  { id: "experience", label: "Work Experience", icon: Briefcase, href: "/dashboard/experience" },
  { id: "skills", label: "Skills", icon: Zap, href: "/dashboard/skills" },
  { id: "certifications", label: "Certifications", icon: FileText, href: "/dashboard/certifications" },
  { id: "settings", label: "Settings", icon: Settings, href: "/dashboard/settings" },
];
