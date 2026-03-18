"use client";

import { Pencil, Trash2, MoreVertical } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import type { SkillCategory } from "./SkillDialog";

const levelColors: Record<string, string> = {
  Basic: "bg-gray-100 text-gray-600",
  Intermediate: "bg-blue-50 text-blue-700",
  Advanced: "bg-green-50 text-green-700",
};

interface SkillCardProps {
  category: SkillCategory;
  onEdit: (category: SkillCategory) => void;
  onEditCategory: (category: SkillCategory) => void;
  onDeleteCategory: (category: SkillCategory) => void;
}

export function SkillCard({
  category,
  onEdit,
  onEditCategory,
  onDeleteCategory,
}: SkillCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-base">{category.name}</CardTitle>
        <CardAction>
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <MoreVertical className="size-4" />
            </Button>
            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-full z-50 mt-1 w-40 rounded-md border bg-popover p-1 shadow-md">
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                    onClick={() => {
                      setMenuOpen(false);
                      onEdit(category);
                    }}
                  >
                    <Pencil className="size-3.5" />
                    Edit Skills
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                    onClick={() => {
                      setMenuOpen(false);
                      onEditCategory(category);
                    }}
                  >
                    <Pencil className="size-3.5" />
                    Rename Category
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      setMenuOpen(false);
                      onDeleteCategory(category);
                    }}
                  >
                    <Trash2 className="size-3.5" />
                    Delete Category
                  </button>
                </div>
              </>
            )}
          </div>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {category.skills.map((skill, i) => (
            <span
              key={i}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${
                levelColors[skill.level ?? "Intermediate"]
              }`}
            >
              {skill.name}
              <span className="text-[10px] opacity-50">{skill.level}</span>
            </span>
          ))}
          {category.skills.length === 0 && (
            <p className="text-sm text-muted-foreground italic">
              Click edit to add skills
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
