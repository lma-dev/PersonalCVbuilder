"use client";

import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { EducationType } from "@/features/education/types";

function dateToString(value: string | Date | null | undefined): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  const y = value.getFullYear();
  const m = String(value.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

interface EducationFormData {
  schoolName: string;
  major: string;
  startDate: string;
  endDate: string;
  status: string;
}

const EDUCATION_STATUSES = [
  "Enrolled",
  "Graduated",
  "Dropped Out",
  "On Leave",
];

const emptyForm: EducationFormData = {
  schoolName: "",
  major: "",
  startDate: "",
  endDate: "",
  status: "Enrolled",
};

interface EducationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  education: EducationType | null;
  onSave: (data: EducationFormData) => void;
  isPending?: boolean;
}

export function EducationDialog({
  open,
  onOpenChange,
  education,
  onSave,
  isPending,
}: EducationDialogProps) {
  const [form, setForm] = useState<EducationFormData>(emptyForm);
  const [prevOpen, setPrevOpen] = useState(false);

  if (open && !prevOpen) {
    setForm(
      education
        ? {
            schoolName: education.schoolName ?? "",
            major: education.major ?? "",
            startDate: dateToString(education.startDate),
            endDate: dateToString(education.endDate),
            status: education.status ?? "Enrolled",
          }
        : { ...emptyForm }
    );
  }
  if (open !== prevOpen) {
    setPrevOpen(open);
  }

  function updateField<K extends keyof EducationFormData>(
    key: K,
    value: EducationFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    if (!form.schoolName || !form.startDate) return;
    onSave(form);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {education ? "Edit Education" : "Add Education"}
          </DialogTitle>
          <DialogDescription>
            Enter your education details below.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="schoolName">School Name *</Label>
            <Input
              id="schoolName"
              value={form.schoolName}
              onChange={(e) => updateField("schoolName", e.target.value)}
              placeholder="e.g. University of Tokyo"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="major">Major / Field of Study</Label>
            <Input
              id="major"
              value={form.major}
              onChange={(e) => updateField("major", e.target.value)}
              placeholder="e.g. Computer Science"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eduStartDate">Start Date *</Label>
              <Input
                id="eduStartDate"
                type="month"
                value={form.startDate}
                onChange={(e) => updateField("startDate", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="eduEndDate">End Date</Label>
              <Input
                id="eduEndDate"
                type="month"
                value={form.endDate}
                onChange={(e) => updateField("endDate", e.target.value)}
                placeholder="Leave empty if current"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="eduStatus">Status</Label>
            <Select
              value={form.status}
              onValueChange={(v) => updateField("status", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EDUCATION_STATUSES.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isPending || !form.schoolName || !form.startDate}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
