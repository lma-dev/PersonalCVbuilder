"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface Project {
  name: string;
  description: string;
  tags: string[];
}

export interface Experience {
  id: string;
  company: string;
  employmentType: string;
  startDate: string;
  endDate: string;
  roleTitleEn: string;
  roleTitleJp: string;
  descriptionEn: string;
  descriptionJp: string;
  projects: Project[];
}

interface ExperienceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  experience: Experience | null;
  onSave: (experience: Experience) => void;
}

const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Freelance",
  "Internship",
];

const emptyExperience: Experience = {
  id: "",
  company: "",
  employmentType: "Full-time",
  startDate: "",
  endDate: "",
  roleTitleEn: "",
  roleTitleJp: "",
  descriptionEn: "",
  descriptionJp: "",
  projects: [],
};

export function ExperienceDialog({
  open,
  onOpenChange,
  experience,
  onSave,
}: ExperienceDialogProps) {
  const [form, setForm] = useState<Experience>(emptyExperience);
  const [tagInput, setTagInput] = useState<Record<number, string>>({});
  const [prevOpen, setPrevOpen] = useState(false);

  if (open && !prevOpen) {
    setForm(
      experience ? experience : { ...emptyExperience, id: crypto.randomUUID() }
    );
    setTagInput({});
  }
  if (open !== prevOpen) {
    setPrevOpen(open);
  }

  function updateField<K extends keyof Experience>(
    key: K,
    value: Experience[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function addProject() {
    setForm((prev) => ({
      ...prev,
      projects: [...prev.projects, { name: "", description: "", tags: [] }],
    }));
  }

  function updateProject(index: number, field: keyof Project, value: string) {
    setForm((prev) => {
      const projects = [...prev.projects];
      projects[index] = { ...projects[index], [field]: value };
      return { ...prev, projects };
    });
  }

  function removeProject(index: number) {
    setForm((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  }

  function addTag(projectIndex: number) {
    const tag = tagInput[projectIndex]?.trim();
    if (!tag) return;
    setForm((prev) => {
      const projects = [...prev.projects];
      if (!projects[projectIndex].tags.includes(tag)) {
        projects[projectIndex] = {
          ...projects[projectIndex],
          tags: [...projects[projectIndex].tags, tag],
        };
      }
      return { ...prev, projects };
    });
    setTagInput((prev) => ({ ...prev, [projectIndex]: "" }));
  }

  function removeTag(projectIndex: number, tagIndex: number) {
    setForm((prev) => {
      const projects = [...prev.projects];
      projects[projectIndex] = {
        ...projects[projectIndex],
        tags: projects[projectIndex].tags.filter((_, i) => i !== tagIndex),
      };
      return { ...prev, projects };
    });
  }

  function handleSave() {
    if (!form.company || !form.roleTitleEn || !form.startDate) return;
    onSave(form);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {experience ? "Edit Experience" : "Add Experience"}
          </DialogTitle>
          <DialogDescription>
            Fill in your work experience details below.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {/* Company & Type */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company">Company Name *</Label>
              <Input
                id="company"
                value={form.company}
                onChange={(e) => updateField("company", e.target.value)}
                placeholder="e.g. Acme Corp"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="employmentType">Employment Type</Label>
              <Select
                value={form.employmentType}
                onValueChange={(v) => updateField("employmentType", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EMPLOYMENT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="month"
                value={form.startDate}
                onChange={(e) => updateField("startDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="month"
                value={form.endDate}
                onChange={(e) => updateField("endDate", e.target.value)}
                placeholder="Leave empty for Present"
              />
            </div>
          </div>

          {/* Role Titles */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="roleTitleEn">Role Title (EN) *</Label>
              <Input
                id="roleTitleEn"
                value={form.roleTitleEn}
                onChange={(e) => updateField("roleTitleEn", e.target.value)}
                placeholder="e.g. Senior Software Engineer"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="roleTitleJp">Role Title (JP)</Label>
              <Input
                id="roleTitleJp"
                value={form.roleTitleJp}
                onChange={(e) => updateField("roleTitleJp", e.target.value)}
                placeholder="e.g. シニアソフトウェアエンジニア"
              />
            </div>
          </div>

          {/* Descriptions */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="descriptionEn">Description (EN)</Label>
              <Textarea
                id="descriptionEn"
                value={form.descriptionEn}
                onChange={(e) => updateField("descriptionEn", e.target.value)}
                placeholder="Describe your role and responsibilities..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="descriptionJp">Description (JP)</Label>
              <Textarea
                id="descriptionJp"
                value={form.descriptionJp}
                onChange={(e) => updateField("descriptionJp", e.target.value)}
                placeholder="役割と責任について記述してください..."
                rows={3}
              />
            </div>
          </div>

          {/* Projects */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">
                Projects & Achievements
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addProject}
              >
                <Plus className="size-4 mr-1" />
                Add Project
              </Button>
            </div>

            {form.projects.map((project, pi) => (
              <div
                key={pi}
                className="rounded-lg border border-gray-200 p-4 space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 space-y-2">
                    <Label>Project Name</Label>
                    <Input
                      value={project.name}
                      onChange={(e) =>
                        updateProject(pi, "name", e.target.value)
                      }
                      placeholder="e.g. Payment System Redesign"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="mt-6 shrink-0"
                    onClick={() => removeProject(pi)}
                  >
                    <X className="size-4" />
                  </Button>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={project.description}
                    onChange={(e) =>
                      updateProject(pi, "description", e.target.value)
                    }
                    placeholder="What did you accomplish?"
                    rows={2}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tech Tags</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {project.tags.map((tag, ti) => (
                      <span
                        key={ti}
                        className="inline-flex items-center gap-1 rounded-full bg-blue-50 text-blue-700 px-3 py-1 text-xs font-medium"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(pi, ti)}
                          className="hover:text-blue-900"
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      value={tagInput[pi] ?? ""}
                      onChange={(e) =>
                        setTagInput((prev) => ({
                          ...prev,
                          [pi]: e.target.value,
                        }))
                      }
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          addTag(pi);
                        }
                      }}
                      placeholder="Type tag and press Enter"
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => addTag(pi)}
                    >
                      Add
                    </Button>
                  </div>
                </div>
              </div>
            ))}
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
