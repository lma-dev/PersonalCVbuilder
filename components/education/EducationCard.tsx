"use client";

import { Pencil, Trash2, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import type { EducationType } from "@/features/education/types";

function formatDate(value: string | Date | null | undefined) {
  if (!value) return "Present";
  const date = typeof value === "string" ? new Date(value) : value;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

interface EducationCardProps {
  education: EducationType;
  onEdit: (education: EducationType) => void;
  onDelete: (id: string) => void;
}

export function EducationCard({
  education,
  onEdit,
  onDelete,
}: EducationCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
            <GraduationCap className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg">{education.schoolName}</CardTitle>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              {education.major && (
                <span className="font-medium text-foreground">
                  {education.major}
                </span>
              )}
              {education.status && (
                <Badge variant="secondary" className="text-xs">
                  {education.status}
                </Badge>
              )}
              <span>
                {formatDate(education.startDate)} &mdash;{" "}
                {formatDate(education.endDate)}
              </span>
            </div>
          </div>
        </div>
        <CardAction>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onEdit(education)}
            >
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(education.id)}
            >
              <Trash2 className="size-4 text-red-500" />
            </Button>
          </div>
        </CardAction>
      </CardHeader>
    </Card>
  );
}
