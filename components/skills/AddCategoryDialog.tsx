"use client";

import { useState } from "react";
import { useAtom } from "jotai";
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
import { addCategoryDialogOpenAtom } from "@/features/skill/atoms";

interface AddCategoryDialogProps {
  onSave: (categoryName: string) => void;
}

export function AddCategoryDialog({ onSave }: AddCategoryDialogProps) {
  const [open, setOpen] = useAtom(addCategoryDialogOpenAtom);
  const [name, setName] = useState("");
  const [prevOpen, setPrevOpen] = useState(false);

  if (open && !prevOpen) {
    setName("");
  }
  if (open !== prevOpen) {
    setPrevOpen(open);
  }

  function handleSave() {
    if (!name.trim()) return;
    onSave(name.trim());
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Add Category</DialogTitle>
          <DialogDescription>
            Enter a name for the new skill category.
          </DialogDescription>
        </DialogHeader>

        <div className="py-2">
          <div className="space-y-2">
            <Label htmlFor="categoryName">Category Name *</Label>
            <Input
              id="categoryName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSave();
                }
              }}
              placeholder="e.g. Frontend, Backend, DevOps"
              autoFocus
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim()}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
