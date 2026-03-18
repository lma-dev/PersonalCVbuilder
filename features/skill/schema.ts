import { z } from "zod";

const VALID_LEVELS = ["beginner", "intermediate", "advanced", "expert"] as const;

export const createSkillSchema = z.object({
  resumeId: z.string().cuid(),
  category: z.string().min(1, "Category is required").max(100),
  name: z.string().min(1, "Skill name is required").max(200),
  level: z.enum(VALID_LEVELS).nullish(),
  sortOrder: z.number().int().min(0).optional().default(0),
});

export const updateSkillSchema = z.object({
  id: z.string().cuid(),
  category: z.string().min(1).max(100).optional(),
  name: z.string().min(1).max(200).optional(),
  level: z.enum(VALID_LEVELS).nullish(),
  sortOrder: z.number().int().min(0).optional(),
});

export type CreateSkillSchema = z.infer<typeof createSkillSchema>;
export type UpdateSkillSchema = z.infer<typeof updateSkillSchema>;
