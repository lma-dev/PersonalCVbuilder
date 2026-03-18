import { z } from "zod";

export const createExperienceSchema = z.object({
  resumeId: z.string().cuid(),
  companyName: z.string().min(1, "Company name is required").max(200),
  employmentType: z.string().max(100).nullish(),
  startDate: z.string().datetime({ offset: true }),
  endDate: z.string().datetime({ offset: true }).nullish(),
  sortOrder: z.number().int().min(0).optional().default(0),
});

export const updateExperienceSchema = z.object({
  id: z.string().cuid(),
  companyName: z.string().min(1).max(200).optional(),
  employmentType: z.string().max(100).nullish(),
  startDate: z.string().datetime({ offset: true }).optional(),
  endDate: z.string().datetime({ offset: true }).nullish(),
  sortOrder: z.number().int().min(0).optional(),
});

export type CreateExperienceSchema = z.infer<typeof createExperienceSchema>;
export type UpdateExperienceSchema = z.infer<typeof updateExperienceSchema>;
