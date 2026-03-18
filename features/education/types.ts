import type { ResumeEducation } from "@/app/generated/prisma";

export type EducationType = ResumeEducation;

export type CreateEducationInput = {
  resumeId: string;
  startDate: string;
  endDate?: string | null;
  schoolName: string;
  major?: string | null;
  status?: string | null;
  sortOrder?: number;
};

export type UpdateEducationInput = Partial<Omit<CreateEducationInput, "resumeId">> & {
  id: string;
};
