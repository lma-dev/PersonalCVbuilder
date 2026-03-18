"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

export interface SkillCategory {
  id: string;
  name: string;
  skills: Skill[];
}

export interface Skill {
  name: string;
  level?: "Basic" | "Intermediate" | "Advanced";
}

const LEVELS: Skill["level"][] = ["Basic", "Intermediate", "Advanced"];

const levelColors: Record<string, string> = {
  Basic: "bg-gray-100 text-gray-700",
  Intermediate: "bg-blue-50 text-blue-700",
  Advanced: "bg-green-50 text-green-700",
};

interface SkillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: SkillCategory | null;
  onSave: (category: SkillCategory) => void;
}

export function SkillDialog({
  open,
  onOpenChange,
  category,
  onSave,
}: SkillDialogProps) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState("");
  const [newLevel, setNewLevel] = useState<Skill["level"]>("Intermediate");
  const [prevOpen, setPrevOpen] = useState(false);

  if (open && !prevOpen) {
    setSkills(category ? category.skills : []);
    setNewSkill("");
  }
  if (open !== prevOpen) {
    setPrevOpen(open);
  }

  function addSkill() {
    const name = newSkill.trim();
    if (!name || skills.some((s) => s.name === name)) return;
    setSkills((prev) => [...prev, { name, level: newLevel }]);
    setNewSkill("");
  }

  function removeSkill(index: number) {
    setSkills((prev) => prev.filter((_, i) => i !== index));
  }

  function cycleLevel(index: number) {
    setSkills((prev) => {
      const updated = [...prev];
      const current = updated[index].level ?? "Intermediate";
      const nextIndex = (LEVELS.indexOf(current) + 1) % LEVELS.length;
      updated[index] = { ...updated[index], level: LEVELS[nextIndex] };
      return updated;
    });
  }

  function handleSave() {
    if (!category) return;
    onSave({ ...category, skills });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Skills</DialogTitle>
          <DialogDescription>
            {category?.name ?? "Category"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Add Skill Input */}
          <div className="space-y-2">
            <Label>Add Skill</Label>
            <div className="flex gap-2">
              <Input
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addSkill();
                  }
                }}
                placeholder="Type skill name and press Enter"
                className="flex-1"
              />
              <select
                value={newLevel}
                onChange={(e) =>
                  setNewLevel(e.target.value as Skill["level"])
                }
                className="h-9 rounded-md border border-input bg-transparent px-2 text-sm"
              >
                {LEVELS.map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
              <Button type="button" variant="secondary" size="sm" onClick={addSkill}>
                Add
              </Button>
            </div>
          </div>

          {/* Skills List */}
          <div className="space-y-2">
            <Label>Skills ({skills.length})</Label>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span
                  key={i}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium ${
                    levelColors[skill.level ?? "Intermediate"]
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => cycleLevel(i)}
                    className="hover:underline"
                    title="Click to cycle level"
                  >
                    {skill.name}
                  </button>
                  <span className="text-[10px] opacity-60">
                    {skill.level}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeSkill(i)}
                    className="ml-0.5 hover:opacity-100 opacity-60"
                  >
                    <X className="size-3" />
                  </button>
                </span>
              ))}
              {skills.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  No skills added yet.
                </p>
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
