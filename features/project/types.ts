import type { ResumeProject } from "@/app/generated/prisma";

export type ProjectType = ResumeProject;

export type CreateProjectInput = {
  experienceId: string;
  projectName: string;
  descriptionEn?: string | null;
  descriptionJp?: string | null;
  technologies?: string[];
  sortOrder?: number;
};

export type UpdateProjectInput = Partial<Omit<CreateProjectInput, "experienceId">> & {
  id: string;
};
