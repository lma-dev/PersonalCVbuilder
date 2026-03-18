import { z } from "zod";

export const createCertificationSchema = z.object({
  resumeId: z.string().cuid(),
  date: z.string().datetime({ offset: true }),
  name: z.string().min(1, "Certification name is required").max(300),
  sortOrder: z.number().int().min(0).optional().default(0),
});

export const updateCertificationSchema = z.object({
  id: z.string().cuid(),
  date: z.string().datetime({ offset: true }).optional(),
  name: z.string().min(1).max(300).optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export type CreateCertificationSchema = z.infer<typeof createCertificationSchema>;
export type UpdateCertificationSchema = z.infer<typeof updateCertificationSchema>;
