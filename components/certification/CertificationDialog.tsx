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

export interface Certification {
  id: string;
  name: string;
  organization: string;
  date: string;
  credentialUrl: string;
}

interface CertificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  certification: Certification | null;
  onSave: (cert: Certification) => void;
}

const emptyCert: Certification = {
  id: "",
  name: "",
  organization: "",
  date: "",
  credentialUrl: "",
};

export function CertificationDialog({
  open,
  onOpenChange,
  certification,
  onSave,
}: CertificationDialogProps) {
  const [form, setForm] = useState<Certification>(emptyCert);
  const [prevOpen, setPrevOpen] = useState(false);

  if (open && !prevOpen) {
    setForm(
      certification
        ? certification
        : { ...emptyCert, id: crypto.randomUUID() }
    );
  }
  if (open !== prevOpen) {
    setPrevOpen(open);
  }

  function updateField<K extends keyof Certification>(
    key: K,
    value: Certification[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSave() {
    if (!form.name || !form.organization || !form.date) return;
    onSave(form);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {certification ? "Edit Certification" : "Add Certification"}
          </DialogTitle>
          <DialogDescription>
            Enter your certification details below.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="certName">Certification Name *</Label>
            <Input
              id="certName"
              value={form.name}
              onChange={(e) => updateField("name", e.target.value)}
              placeholder="e.g. AWS Solutions Architect"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="certOrg">Organization *</Label>
            <Input
              id="certOrg"
              value={form.organization}
              onChange={(e) => updateField("organization", e.target.value)}
              placeholder="e.g. Amazon Web Services"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="certDate">Date *</Label>
            <Input
              id="certDate"
              type="month"
              value={form.date}
              onChange={(e) => updateField("date", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="credentialUrl">Credential URL (optional)</Label>
            <Input
              id="credentialUrl"
              type="url"
              value={form.credentialUrl}
              onChange={(e) => updateField("credentialUrl", e.target.value)}
              placeholder="https://..."
            />
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
