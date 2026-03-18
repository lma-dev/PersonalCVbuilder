import { z } from "zod";

export const createEducationSchema = z.object({
  resumeId: z.string().cuid(),
  startDate: z.string().datetime({ offset: true }),
  endDate: z.string().datetime({ offset: true }).nullish(),
  schoolName: z.string().min(1, "School name is required").max(300),
  major: z.string().max(200).nullish(),
  status: z.string().max(100).nullish(),
  sortOrder: z.number().int().min(0).optional().default(0),
});

export const updateEducationSchema = z.object({
  id: z.string().cuid(),
  startDate: z.string().datetime({ offset: true }).optional(),
  endDate: z.string().datetime({ offset: true }).nullish(),
  schoolName: z.string().min(1).max(300).optional(),
  major: z.string().max(200).nullish(),
  status: z.string().max(100).nullish(),
  sortOrder: z.number().int().min(0).optional(),
});

export type CreateEducationSchema = z.infer<typeof createEducationSchema>;
export type UpdateEducationSchema = z.infer<typeof updateEducationSchema>;
