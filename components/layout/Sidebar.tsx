"use client";

import { usePathname } from "next/navigation";
import { FileText } from "lucide-react";
import { sidebarItems } from "@/config/navigation";
import { SidebarItem } from "./SidebarItem";
import { UserProfile } from "./UserProfile";
import { cn } from "@/lib/utils";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  function isActive(href: string) {
    if (href === "/dashboard") {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(href);
  }

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex h-full w-60 flex-col border-r border-gray-200 bg-white transition-transform duration-200 lg:z-30 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-gray-200 px-5">
          <FileText className="h-6 w-6 text-blue-600" />
          <span className="text-lg font-bold text-gray-900">CV Architect</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {sidebarItems.map((item) => (
            <SidebarItem
              key={item.id}
              href={item.href}
              label={item.label}
              icon={item.icon}
              isActive={isActive(item.href)}
              onClick={onClose}
            />
          ))}
        </nav>

        {/* User Profile */}
        <div className="border-t border-gray-200 p-3">
          <UserProfile />
        </div>
      </aside>
    </>
  );
}
