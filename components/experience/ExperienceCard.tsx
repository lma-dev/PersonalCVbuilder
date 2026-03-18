"use client";

import { Pencil, Trash2, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardAction,
} from "@/components/ui/card";
import type { Experience } from "./ExperienceDialog";

function formatDate(dateStr: string) {
  if (!dateStr) return "Present";
  const [year, month] = dateStr.split("-");
  const date = new Date(Number(year), Number(month) - 1);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

interface ExperienceCardProps {
  experience: Experience;
  onEdit: (experience: Experience) => void;
  onDelete: (id: string) => void;
}

export function ExperienceCard({
  experience,
  onEdit,
  onDelete,
}: ExperienceCardProps) {
  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
            <Briefcase className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <CardTitle className="text-lg">{experience.roleTitleEn}</CardTitle>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">
                {experience.company}
              </span>
              <Badge variant="secondary" className="text-xs">
                {experience.employmentType}
              </Badge>
              <span>
                {formatDate(experience.startDate)} &mdash;{" "}
                {formatDate(experience.endDate)}
              </span>
            </div>
          </div>
        </div>
        <CardAction>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" onClick={() => onEdit(experience)}>
              <Pencil className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(experience.id)}
            >
              <Trash2 className="size-4 text-red-500" />
            </Button>
          </div>
        </CardAction>
      </CardHeader>

      <CardContent>
        {/* Bilingual Descriptions */}
        {(experience.descriptionEn || experience.descriptionJp) && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {experience.descriptionEn && (
              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  English
                </p>
                {experience.roleTitleEn && (
                  <p className="text-sm font-medium">{experience.roleTitleEn}</p>
                )}
                <p className="mt-1 text-sm text-muted-foreground whitespace-pre-line">
                  {experience.descriptionEn}
                </p>
              </div>
            )}
            {experience.descriptionJp && (
              <div>
                <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Japanese
                </p>
                {experience.roleTitleJp && (
                  <p className="text-sm font-medium">{experience.roleTitleJp}</p>
                )}
                <p className="mt-1 text-sm text-muted-foreground whitespace-pre-line">
                  {experience.descriptionJp}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Projects */}
        {experience.projects.length > 0 && (
          <div className="mt-4 space-y-3">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Projects & Achievements
            </p>
            {experience.projects.map((project, i) => (
              <div
                key={i}
                className="rounded-lg border border-gray-100 bg-gray-50/50 p-3"
              >
                <p className="font-medium text-sm">{project.name}</p>
                {project.description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {project.description}
                  </p>
                )}
                {project.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {project.tags.map((tag, ti) => (
                      <span
                        key={ti}
                        className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
