"use client";

import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { Menu, FileText, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { activeResumeIdAtom } from "@/features/resume/atoms";
import { toast } from "sonner";

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const activeResumeId = useAtomValue(activeResumeIdAtom);
  const router = useRouter();

  function handleDownloadPdf() {
    if (!activeResumeId) {
      toast.error("No resume selected. Please select a resume first.");
      return;
    }
    const url = `/api/resumes/${activeResumeId}/export?format=pdf`;
    window.open(url, "_blank");
  }

  function handlePreview() {
    if (!activeResumeId) {
      toast.error("No resume selected. Please select a resume first.");
      return;
    }
    router.push("/dashboard/preview");
  }

  return (
    <header className="fixed top-0 right-0 left-0 z-40 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6 lg:left-60">
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuClick}
          className="rounded-md p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Logo (visible on mobile when sidebar is hidden) */}
        <div className="flex items-center gap-2 lg:hidden">
          <FileText className="h-5 w-5 text-blue-600" />
          <span className="font-bold text-gray-900">CV Architect</span>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={handlePreview}>
          <Eye className="h-4 w-4" />
          <span className="hidden sm:inline">Preview</span>
        </Button>
        <Button variant="primary" size="sm" onClick={handleDownloadPdf}>
          <Download className="h-4 w-4" />
          <span className="hidden sm:inline">Download PDF</span>
        </Button>
      </div>
    </header>
  );
}
