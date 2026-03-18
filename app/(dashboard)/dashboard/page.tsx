"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import { User, Plus, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useResumes,
  useResume,
  useCreateResume,
  useUpdateResume,
} from "@/features/resume/use-resumes";
import { activeResumeIdAtom } from "@/features/resume/atoms";

export default function BasicInfoPage() {
  const [activeResumeId, setActiveResumeId] = useAtom(activeResumeIdAtom);
  const [newResumeOpen, setNewResumeOpen] = useState(false);
  const [newResumeTitle, setNewResumeTitle] = useState("");
  const [newResumeName, setNewResumeName] = useState("");

  const { data: resumes, isLoading: resumesLoading } = useResumes();
  const { data: resume, isLoading: resumeLoading } = useResume(
    activeResumeId ?? ""
  );
  const createResume = useCreateResume();
  const updateResume = useUpdateResume();

  // Form state
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [nationality, setNationality] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");

  // Auto-select first resume if none selected
  if (!activeResumeId && resumes && resumes.length > 0) {
    setActiveResumeId(resumes[0].id);
  }

  // Populate form when resume data loads
  const [prevResumeId, setPrevResumeId] = useState<string | null>(null);
  const currentResumeId = resume?.id ?? null;
  if (currentResumeId !== prevResumeId) {
    setPrevResumeId(currentResumeId);
    if (resume) {
      setFullName(resume.fullName ?? "");
      setEmail(resume.email ?? "");
      setPhone(resume.phone ?? "");
      setAddress(resume.address ?? "");
      setNationality(resume.nationality ?? "");
      setDateOfBirth(
        resume.dateOfBirth
          ? new Date(resume.dateOfBirth).toISOString().split("T")[0]
          : ""
      );
      setGender(resume.gender ?? "");
    }
  }

  function handleCreateResume() {
    if (!newResumeTitle.trim() || !newResumeName.trim()) return;
    createResume.mutate(
      { title: newResumeTitle.trim(), fullName: newResumeName.trim() },
      {
        onSuccess: (data) => {
          setActiveResumeId(data.id);
          setNewResumeOpen(false);
          setNewResumeTitle("");
          setNewResumeName("");
          toast.success("Resume created successfully");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  }

  function handleSave() {
    if (!activeResumeId) return;
    updateResume.mutate(
      {
        id: activeResumeId,
        fullName: fullName || undefined,
        email: email || null,
        phone: phone || null,
        address: address || null,
        nationality: nationality || null,
        dateOfBirth: dateOfBirth || null,
        gender: gender || null,
      },
      {
        onSuccess: () => {
          toast.success("Basic info saved");
        },
        onError: (error) => {
          toast.error(error.message);
        },
      }
    );
  }

  if (resumesLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <User className="size-5 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Basic Info</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          Select a resume and manage your personal information.
        </p>
      </div>

      {/* Resume Selector */}
      <div className="flex items-end gap-3 mb-6">
        <div className="flex-1 space-y-2">
          <Label>Active Resume</Label>
          {resumes && resumes.length > 0 ? (
            <Select
              value={activeResumeId ?? ""}
              onValueChange={(value) => setActiveResumeId(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a resume" />
              </SelectTrigger>
              <SelectContent>
                {resumes.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.title} — {r.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-sm text-muted-foreground py-2">
              No resumes yet. Create one to get started.
            </p>
          )}
        </div>
        <Button onClick={() => setNewResumeOpen(true)}>
          <Plus className="size-4 mr-1" />
          New Resume
        </Button>
      </div>

      {/* Personal Info Form */}
      {activeResumeId ? (
        resumeLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 234-567-8900"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input
                      id="nationality"
                      value={nationality}
                      onChange={(e) => setNationality(e.target.value)}
                      placeholder="e.g. Japanese"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="City, Country"
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={gender} onValueChange={setGender}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                        <SelectItem value="Prefer not to say">
                          Prefer not to say
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    onClick={handleSave}
                    disabled={updateResume.isPending || !fullName.trim()}
                  >
                    {updateResume.isPending && (
                      <Loader2 className="size-4 mr-1 animate-spin" />
                    )}
                    Save Changes
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )
      ) : !resumes || resumes.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <FileText className="mx-auto size-10 text-gray-300 mb-3" />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">
                No resumes yet
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first resume to start building your CV.
              </p>
              <Button onClick={() => setNewResumeOpen(true)}>
                <Plus className="size-4 mr-1" />
                Create Resume
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {/* New Resume Dialog */}
      <Dialog open={newResumeOpen} onOpenChange={setNewResumeOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Resume</DialogTitle>
            <DialogDescription>
              Give your resume a title and enter your name to get started.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="resumeTitle">Resume Title *</Label>
              <Input
                id="resumeTitle"
                value={newResumeTitle}
                onChange={(e) => setNewResumeTitle(e.target.value)}
                placeholder="e.g. Software Engineer CV"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="resumeName">Full Name *</Label>
              <Input
                id="resumeName"
                value={newResumeName}
                onChange={(e) => setNewResumeName(e.target.value)}
                placeholder="e.g. John Doe"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setNewResumeOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateResume}
              disabled={
                createResume.isPending ||
                !newResumeTitle.trim() ||
                !newResumeName.trim()
              }
            >
              {createResume.isPending && (
                <Loader2 className="size-4 mr-1 animate-spin" />
              )}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
