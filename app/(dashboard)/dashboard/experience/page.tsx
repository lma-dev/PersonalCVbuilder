"use client";

import { useAtom, useAtomValue } from "jotai";
import { Briefcase, Plus, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ExperienceCard } from "@/components/experience/ExperienceCard";
import {
  ExperienceDialog,
  type Experience,
} from "@/components/experience/ExperienceDialog";
import {
  useExperiences,
  useCreateExperience,
  useUpdateExperience,
  useDeleteExperience,
} from "@/features/experience/use-experiences";
import { activeResumeIdAtom } from "@/features/resume/atoms";
import {
  experienceDialogOpenAtom,
  editingExperienceAtom,
} from "@/features/experience/atoms";
import type { ExperienceWithProjects } from "@/features/experience/types";

function dateToString(value: string | Date | null | undefined): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  const y = value.getFullYear();
  const m = String(value.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function toDialogExperience(exp: ExperienceWithProjects): Experience {
  return {
    id: exp.id,
    company: exp.companyName,
    employmentType: exp.employmentType ?? "Full-time",
    startDate: dateToString(exp.startDate),
    endDate: dateToString(exp.endDate),
    roleTitleEn: "",
    roleTitleJp: "",
    descriptionEn: "",
    descriptionJp: "",
    projects: exp.projects.map((p) => ({
      name: p.projectName,
      description: p.descriptionEn ?? "",
      tags: Array.isArray(p.technologies) ? (p.technologies as string[]) : [],
    })),
  };
}

export default function ExperiencePage() {
  const activeResumeId = useAtomValue(activeResumeIdAtom);
  const { data: experiences, isLoading } = useExperiences(
    activeResumeId ?? ""
  );
  const createExperience = useCreateExperience();
  const updateExperience = useUpdateExperience(activeResumeId ?? "");
  const deleteExperience = useDeleteExperience(activeResumeId ?? "");

  const [dialogOpen, setDialogOpen] = useAtom(experienceDialogOpenAtom);
  const [editing, setEditing] = useAtom(editingExperienceAtom);

  function openNew() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(exp: Experience) {
    setEditing(exp);
    setDialogOpen(true);
  }

  function handleDelete(id: string) {
    deleteExperience.mutate(id, {
      onSuccess: () => toast.success("Experience deleted"),
      onError: (error) => toast.error(error.message),
    });
  }

  function handleSave(exp: Experience) {
    if (!activeResumeId) return;

    const existing = experiences?.find((e) => e.id === exp.id);
    if (existing) {
      updateExperience.mutate(
        {
          id: exp.id,
          companyName: exp.company,
          employmentType: exp.employmentType,
          startDate: exp.startDate,
          endDate: exp.endDate || null,
        },
        {
          onSuccess: () => toast.success("Experience updated"),
          onError: (error) => toast.error(error.message),
        }
      );
    } else {
      createExperience.mutate(
        {
          resumeId: activeResumeId,
          companyName: exp.company,
          employmentType: exp.employmentType,
          startDate: exp.startDate,
          endDate: exp.endDate || null,
        },
        {
          onSuccess: () => toast.success("Experience added"),
          onError: (error) => toast.error(error.message),
        }
      );
    }
  }

  // Convert API data to dialog format for display
  const displayExperiences: Experience[] = (experiences ?? []).map(
    toDialogExperience
  );

  if (!activeResumeId) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="size-5 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              Work Experience
            </h1>
          </div>
        </div>
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-12 text-center">
          <FileText className="mx-auto size-10 text-gray-300 mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            No resume selected
          </h3>
          <p className="text-sm text-muted-foreground">
            Go to Basic Info to select or create a resume first.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Briefcase className="size-5 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">
              Work Experience
            </h1>
            {experiences && (
              <span className="text-sm text-muted-foreground">
                ({experiences.length})
              </span>
            )}
          </div>
          <Button size="sm" onClick={openNew}>
            <Plus className="size-4 mr-1" />
            Add Experience
          </Button>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your work history and projects.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : displayExperiences.length > 0 ? (
        <div className="space-y-4">
          {displayExperiences.map((exp) => (
            <ExperienceCard
              key={exp.id}
              experience={exp}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
          <Briefcase className="mx-auto size-8 text-gray-300 mb-2" />
          <p className="text-sm text-muted-foreground">
            No work experience added yet.
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2"
            onClick={openNew}
          >
            <Plus className="size-4 mr-1" />
            Add your first experience
          </Button>
        </div>
      )}

      <ExperienceDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        experience={editing}
        onSave={handleSave}
      />
    </div>
  );
}
