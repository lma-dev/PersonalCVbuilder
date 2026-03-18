"use client";

import { Pencil, Trash2, ExternalLink, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Certification } from "./CertificationDialog";

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const [year, month] = dateStr.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

interface CertificationCardProps {
  certification: Certification;
  onEdit: (cert: Certification) => void;
  onDelete: (id: string) => void;
}

export function CertificationCard({
  certification,
  onEdit,
  onDelete,
}: CertificationCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md group">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3 min-w-0">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <Award className="size-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">
                {formatDate(certification.date)}
              </p>
              <p className="font-semibold text-sm mt-0.5 leading-snug">
                {certification.name}
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                {certification.organization}
              </p>
              {certification.credentialUrl && (
                <a
                  href={certification.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1 text-xs text-blue-600 hover:underline"
                >
                  View Credential
                  <ExternalLink className="size-3" />
                </a>
              )}
            </div>
          </div>
          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={() => onEdit(certification)}
            >
              <Pencil className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              onClick={() => onDelete(certification.id)}
            >
              <Trash2 className="size-3.5 text-red-500" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
