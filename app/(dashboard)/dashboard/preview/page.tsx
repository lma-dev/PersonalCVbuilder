"use client";

import { useAtomValue } from "jotai";
import { activeResumeIdAtom } from "@/features/resume/atoms";
import { useResume } from "@/features/resume/use-resumes";
import { ResumePreview } from "@/components/ResumePreview";
import { Button } from "@/components/ui/button";
import { Download, FileSpreadsheet, FileJson, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ResumeExport } from "@/features/resume/export/types";

function triggerDownload(resumeId: string, format: "pdf" | "excel" | "json") {
  const url = `/api/resumes/${resumeId}/export?format=${format}`;
  window.open(url, "_blank");
}

export default function PreviewPage() {
  const activeResumeId = useAtomValue(activeResumeIdAtom);
  const { data: resume, isLoading, error } = useResume(activeResumeId ?? "");

  if (!activeResumeId) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900">
            No resume selected
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Select a resume from the dashboard to preview it.
          </p>
          <Link href="/dashboard">
            <Button variant="secondary" size="sm" className="mt-4">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <p className="text-sm text-gray-500">Loading resume...</p>
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900">
            Failed to load resume
          </p>
          <p className="mt-1 text-sm text-gray-500">
            {error?.message ?? "Resume not found."}
          </p>
          <Link href="/dashboard">
            <Button variant="secondary" size="sm" className="mt-4">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Transform ResumeWithRelations to ResumeExport
  const exportData: ResumeExport = {
    title: resume.title,
    status: resume.status,
    languageMode: resume.languageMode,
    fullName: resume.fullName,
    email: resume.email,
    phone: resume.phone,
    address: resume.address,
    nationality: resume.nationality,
    dateOfBirth: resume.dateOfBirth,
    gender: resume.gender,
    educations: resume.educations.map((edu) => ({
      schoolName: edu.schoolName,
      major: edu.major,
      status: edu.status,
      startDate: edu.startDate,
      endDate: edu.endDate,
    })),
    experiences: resume.experiences.map((exp) => ({
      companyName: exp.companyName,
      employmentType: exp.employmentType,
      startDate: exp.startDate,
      endDate: exp.endDate,
      projects: exp.projects.map((proj) => ({
        projectName: proj.projectName,
        descriptionEn: proj.descriptionEn,
        descriptionJp: proj.descriptionJp,
        technologies: Array.isArray(proj.technologies)
          ? (proj.technologies as string[])
          : [],
      })),
    })),
    skills: resume.skills.map((skill) => ({
      category: skill.category,
      name: skill.name,
      level: skill.level,
    })),
    certifications: resume.certifications.map((cert) => ({
      name: cert.name,
      date: cert.date,
    })),
  };

  return (
    <div className="p-6">
      {/* Toolbar */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Resume Preview</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => triggerDownload(activeResumeId, "pdf")}
          >
            <Download className="mr-1 h-4 w-4" />
            PDF
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => triggerDownload(activeResumeId, "excel")}
          >
            <FileSpreadsheet className="mr-1 h-4 w-4" />
            Excel
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => triggerDownload(activeResumeId, "json")}
          >
            <FileJson className="mr-1 h-4 w-4" />
            JSON
          </Button>
        </div>
      </div>

      {/* Preview */}
      <div className="overflow-auto">
        <ResumePreview resume={exportData} />
      </div>
    </div>
  );
}
