"use client";

import { useAtom, useAtomValue } from "jotai";
import { FileText, Plus, Loader2, Award } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CertificationCard } from "@/components/certification/CertificationCard";
import {
  CertificationDialog,
  type Certification,
} from "@/components/certification/CertificationDialog";
import {
  useCertifications,
  useCreateCertification,
  useUpdateCertification,
  useDeleteCertification,
} from "@/features/certification/use-certifications";
import { activeResumeIdAtom } from "@/features/resume/atoms";
import {
  certificationDialogOpenAtom,
  editingCertificationAtom,
} from "@/features/certification/atoms";
import type { CertificationType } from "@/features/certification/types";

function dateToString(value: string | Date | null | undefined): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  const y = value.getFullYear();
  const m = String(value.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

function toDialogCert(cert: CertificationType): Certification {
  return {
    id: cert.id,
    name: cert.name,
    organization: "",
    date: dateToString(cert.date),
    credentialUrl: "",
  };
}

export default function CertificationsPage() {
  const activeResumeId = useAtomValue(activeResumeIdAtom);
  const { data: certifications, isLoading } = useCertifications(
    activeResumeId ?? ""
  );
  const createCertification = useCreateCertification();
  const updateCertification = useUpdateCertification(activeResumeId ?? "");
  const deleteCertification = useDeleteCertification(activeResumeId ?? "");

  const [dialogOpen, setDialogOpen] = useAtom(certificationDialogOpenAtom);
  const [editing, setEditing] = useAtom(editingCertificationAtom);

  function openNew() {
    setEditing(null);
    setDialogOpen(true);
  }

  function openEdit(cert: Certification) {
    setEditing(cert);
    setDialogOpen(true);
  }

  function handleDelete(id: string) {
    deleteCertification.mutate(id, {
      onSuccess: () => toast.success("Certification deleted"),
      onError: (error) => toast.error(error.message),
    });
  }

  function handleSave(cert: Certification) {
    if (!activeResumeId) return;

    const existing = certifications?.find((c) => c.id === cert.id);
    if (existing) {
      updateCertification.mutate(
        {
          id: cert.id,
          name: cert.name,
          date: cert.date,
        },
        {
          onSuccess: () => {
            setDialogOpen(false);
            toast.success("Certification updated");
          },
          onError: (error) => toast.error(error.message),
        }
      );
    } else {
      createCertification.mutate(
        {
          resumeId: activeResumeId,
          name: cert.name,
          date: cert.date,
        },
        {
          onSuccess: () => {
            setDialogOpen(false);
            toast.success("Certification added");
          },
          onError: (error) => toast.error(error.message),
        }
      );
    }
  }

  const displayCerts: Certification[] = (certifications ?? []).map(toDialogCert);

  if (!activeResumeId) {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="size-5 text-amber-600" />
            <h1 className="text-2xl font-bold text-gray-900">Certifications</h1>
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
            <FileText className="size-5 text-amber-600" />
            <h1 className="text-2xl font-bold text-gray-900">Certifications</h1>
            {certifications && (
              <span className="text-sm text-muted-foreground">
                ({certifications.length})
              </span>
            )}
          </div>
          <Button size="sm" onClick={openNew}>
            <Plus className="size-4 mr-1" />
            Add Certification
          </Button>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your professional certifications.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : displayCerts.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {displayCerts.map((cert) => (
            <CertificationCard
              key={cert.id}
              certification={cert}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border-2 border-dashed border-gray-200 p-8 text-center">
          <Award className="mx-auto size-8 text-gray-300 mb-2" />
          <p className="text-sm text-muted-foreground">
            No certifications added yet.
          </p>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2"
            onClick={openNew}
          >
            <Plus className="size-4 mr-1" />
            Add your first certification
          </Button>
        </div>
      )}

      <CertificationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        certification={editing}
        onSave={handleSave}
      />
    </div>
  );
}
