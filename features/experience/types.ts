import type {
  ResumeExperience,
  ResumeProject,
} from "@/app/generated/prisma";

export type ExperienceType = ResumeExperience;

export type ExperienceWithProjects = ResumeExperience & {
  projects: ResumeProject[];
};

export type CreateExperienceInput = {
  resumeId: string;
  companyName: string;
  employmentType?: string | null;
  startDate: string;
  endDate?: string | null;
  sortOrder?: number;
};

export type UpdateExperienceInput = Partial<Omit<CreateExperienceInput, "resumeId">> & {
  id: string;
};

export type ReorderExperienceInput = {
  id: string;
  sortOrder: number;
}[];
