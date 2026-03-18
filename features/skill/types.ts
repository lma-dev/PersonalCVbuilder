import type { ResumeSkill } from "@/app/generated/prisma";

export type SkillType = ResumeSkill;

export type CreateSkillInput = {
  resumeId: string;
  category: string;
  name: string;
  level?: string | null;
  sortOrder?: number;
};

export type UpdateSkillInput = Partial<Omit<CreateSkillInput, "resumeId">> & {
  id: string;
};
