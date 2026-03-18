"use client";

import { useMemo, useState } from "react";
import { useAtom, useAtomValue } from "jotai";
import { Zap, Plus, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SkillCard } from "@/components/skills/SkillCard";
import {
  SkillDialog,
  type SkillCategory,
} from "@/components/skills/SkillDialog";
import { AddCategoryDialog } from "@/components/skills/AddCategoryDialog";
import { EditCategoryDialog } from "@/components/skills/EditCategoryDialog";
import { DeleteCategoryDialog } from "@/components/skills/DeleteCategoryDialog";
import {
  useSkills,
  useCreateSkill,
  useUpdateSkill,
  useDeleteSkill,
} from "@/features/skill/use-skills";
import { activeResumeIdAtom } from "@/features/resume/atoms";
import {
  skillDialogOpenAtom,
  editingSkillCategoryAtom,
  addCategoryDialogOpenAtom,
} from "@/features/skill/atoms";
import type { SkillType } from "@/features/skill/types";

/** Group flat skill records by category into SkillCategory[] for the UI. */
function groupByCategory(skills: SkillType[]): SkillCategory[] {
  const map = new Map<string, SkillCategory>();
  for (const s of skills) {
    const cat = s.category ?? "Uncategorized";
    if (!map.has(cat)) {
      map.set(cat, { id: cat, name: cat, skills: [] });
    }
    map.get(cat)!.skills.push({
      name: s.name,
      level: (s.level as "Basic" | "Intermediate" | "Advanced") ?? undefined,
    });
  }
  return Array.from(map.values());
}

export default function SkillsPage() {
  const activeResumeId = useAtomValue(activeResumeIdAtom);
  const { data: skills, isLoading } = useSkills(activeResumeId ?? "");
  const createSkill = useCreateSkill();
  const updateSkill = useUpdateSkill(activeResumeId ?? "");
  const deleteSkill = useDeleteSkill(activeResumeId ?? "");

  const [dialogOpen, setDialogOpen] = useAtom(skillDialogOpenAtom);
  const [editingCategory, setEditingCategory] = useAtom(editingSkillCategoryAtom);
  const [, setAddCategoryOpen] = useAtom(addCategoryDialogOpenAtom);

  const [editCategoryDialogOpen, setEditCategoryDialogOpen] = useState(false);
  const [deleteCategoryDialogOpen, setDeleteCategoryDialogOpen] = useState(false);
  const [targetCategory, setTargetCategory] = useState<SkillCategory | null>(null);

  const categories = useMemo(
    () => groupByCategory(skills ?? []),
    [skills]
  );

  function openEdit(category: SkillCategory) {
    setEditingCategory(category);
    setDialogOpen(true);
  }

  function openEditCategory(category: SkillCategory) {
    setTargetCategory(category);
    setEditCategoryDialogOpen(true);
  }

  function openDeleteCategory(category: SkillCategory) {
    setTargetCategory(category);
    setDeleteCategoryDialogOpen(true);
  }

  function handleEditCategory(newName: string) {
    if (!activeResumeId || !targetCategory) return;

    const categorySkills = skills?.filter(
      (s) => (s.category ?? "Uncategorized") === targetCategory.name
    ) ?? [];

    for (const s of categorySkills) {
      updateSkill.mutate(
        { id: s.id, category: newName },
        { onError: (error) => toast.error(error.message) }
      );
    }

    toast.success("Category renamed");
    setEditCategoryDialogOpen(false);
  }

  function handleDeleteCategory() {
    if (!activeResumeId || !targetCategory) return;

    const categorySkills = skills?.filter(
      (s) => (s.category ?? "Uncategorized") === targetCategory.name
    ) ?? [];

    for (const s of categorySkills) {
      deleteSkill.mutate(s.id, {
        onError: (error) => toast.error(error.message),
      });
    }

    toast.success("Category deleted");
    setDeleteCategoryDialogOpen(false);
  }

  function handleSave(updated: SkillCategory) {
    if (!activeResumeId || !editingCategory) return;

    const original = skills?.filter(
      (s) => (s.category ?? "Uncategorized") === editingCategory.name
    ) ?? [];

    // Find skills to delete (in original but not in updated)
    const updatedNames = new Set(updated.skills.map((s) => s.name));
    const toDelete = original.filter((s) => !updatedNames.has(s.name));

    // Find skills to add (in updated but not in original)
    const originalNames = new Set(original.map((s) => s.name));
    const toAdd = updated.skills.filter((s) => !originalNames.has(s.name));

    // Find skills to update (level changed)
    const toUpdate = updated.skills.filter((s) => {
      const orig = original.find((o) => o.name === s.name);
      return orig && orig.level !== s.level;
    });

    // Execute mutations
    for (const s of toDelete) {
      deleteSkill.mutate(s.id, {
        onError: (error) => toast.error(error.message),
      });
    }
    for (const s of toAdd) {
      createSkill.mutate(
        {
          resumeId: activeResumeId,
          category: updated.name,
          name: s.name,
          level: s.level ?? null,
        },
        {
          onError: (error) => toast.error(error.message),
        }
      );
    }
    for (const s of toUpdate) {
      const orig = original.find((o) => o.name === s.name);
      if (orig) {
        updateSkill.mutate(
          { id: orig.id, level: s.level ?? null },
          {
            onError: (error) => toast.error(error.message),
          }
        );
      }
    }

    toast.success("Skills updated");
    setDialogOpen(false);
  }

  function handleAddCategory(categoryName: string) {
    if (!activeResumeId) return;
    createSkill.mutate(
      {
        resumeId: activeResumeId,
        category: categoryName,
        name: "New Skill",
        level: "Intermediate",
      },
      {
        onSuccess: () =>
          toast.success(
            "Category created with a placeholder skill. Edit it to add more."
          ),
        onError: (error) => toast.error(error.message),
      }
    );
  }

  const totalSkills = categories.reduce(
    (acc, c) => acc + c.skills.length,
    0
  );

  if (!activeResumeId) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="size-5 text-yellow-600" />
            <h1 className="text-2xl font-bold text-gray-900">Skills</h1>
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
            <Zap className="size-5 text-yellow-600" />
            <h1 className="text-2xl font-bold text-gray-900">Skills</h1>
            <span className="text-sm text-muted-foreground">
              ({totalSkills})
            </span>
          </div>
          <Button size="sm" onClick={() => setAddCategoryOpen(true)}>
            <Plus className="size-4 mr-1" />
            Add Category
          </Button>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your technical and professional skills.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {categories.map((category) => (
            <SkillCard
              key={category.id}
              category={category}
              onEdit={openEdit}
              onEditCategory={openEditCategory}
              onDeleteCategory={openDeleteCategory}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
          <Zap className="mx-auto size-8 text-gray-300 mb-2" />
          <p className="text-sm text-muted-foreground">
            No skills added yet.
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2"
            onClick={() => setAddCategoryOpen(true)}
          >
            <Plus className="size-4 mr-1" />
            Add your first skill category
          </Button>
        </div>
      )}

      <SkillDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        category={editingCategory}
        onSave={handleSave}
      />
      <AddCategoryDialog onSave={handleAddCategory} />
      <EditCategoryDialog
        open={editCategoryDialogOpen}
        onOpenChange={setEditCategoryDialogOpen}
        categoryName={targetCategory?.name ?? ""}
        onSave={handleEditCategory}
      />
      <DeleteCategoryDialog
        open={deleteCategoryDialogOpen}
        onOpenChange={setDeleteCategoryDialogOpen}
        categoryName={targetCategory?.name ?? ""}
        skillCount={targetCategory?.skills.length ?? 0}
        onConfirm={handleDeleteCategory}
      />
    </div>
  );
}
