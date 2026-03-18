"use client";

import { useAtom, useAtomValue } from "jotai";
import { GraduationCap, Plus, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { EducationCard } from "@/components/education/EducationCard";
import { EducationDialog } from "@/components/education/EducationDialog";
import {
  useEducations,
  useCreateEducation,
  useUpdateEducation,
  useDeleteEducation,
} from "@/features/education/use-educations";
import { activeResumeIdAtom } from "@/features/resume/atoms";
import {
  educationDialogOpenAtom,
  editingEducationAtom,
} from "@/features/education/atoms";
import type { EducationType } from "@/features/education/types";

export default function EducationPage() {
  const activeResumeId = useAtomValue(activeResumeIdAtom);
  const { data: educations, isLoading } = useEducations(activeResumeId ?? "");
  const createEducation = useCreateEducation();
  const updateEducation = useUpdateEducation(activeResumeId ?? "");
  const deleteEducation = useDeleteEducation(activeResumeId ?? "");

  const [dialogOpen, setDialogOpen] = useAtom(educationDialogOpenAtom);
  const [editing, setEditing] = useAtom(editingEducationAtom);

  function openNew() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(education: EducationType) {
    setEditing(education);
    setDialogOpen(true);
  }

  function handleDelete(id: string) {
    deleteEducation.mutate(id, {
      onSuccess: () => toast.success("Education entry deleted"),
      onError: (error) => toast.error(error.message),
    });
  }

  function handleSave(data: {
    schoolName: string;
    major: string;
    startDate: string;
    endDate: string;
    status: string;
  }) {
    if (editing) {
      updateEducation.mutate(
        {
          id: editing.id,
          schoolName: data.schoolName,
          major: data.major || null,
          startDate: data.startDate,
          endDate: data.endDate || null,
          status: data.status || null,
        },
        {
          onSuccess: () => {
            setDialogOpen(false);
            toast.success("Education updated");
          },
          onError: (error) => toast.error(error.message),
        }
      );
    } else {
      if (!activeResumeId) return;
      createEducation.mutate(
        {
          resumeId: activeResumeId,
          schoolName: data.schoolName,
          major: data.major || null,
          startDate: data.startDate,
          endDate: data.endDate || null,
          status: data.status || null,
        },
        {
          onSuccess: () => {
            setDialogOpen(false);
            toast.success("Education added");
          },
          onError: (error) => toast.error(error.message),
        }
      );
    }
  }

  if (!activeResumeId) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <GraduationCap className="size-5 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900">Education</h1>
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
            <GraduationCap className="size-5 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900">Education</h1>
            {educations && (
              <span className="text-sm text-muted-foreground">
                ({educations.length})
              </span>
            )}
          </div>
          <Button size="sm" onClick={openNew}>
            <Plus className="size-4 mr-1" />
            Add Education
          </Button>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your educational background.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : educations && educations.length > 0 ? (
        <div className="space-y-4">
          {educations.map((edu) => (
            <EducationCard
              key={edu.id}
              education={edu}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
          <GraduationCap className="mx-auto size-8 text-gray-300 mb-2" />
          <p className="text-sm text-muted-foreground">
            No education entries added yet.
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2"
            onClick={openNew}
          >
            <Plus className="size-4 mr-1" />
            Add your first education
          </Button>
        </div>
      )}

      <EducationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        education={editing}
        onSave={handleSave}
        isPending={createEducation.isPending || updateEducation.isPending}
      />
    </div>
  );
}
