import { z } from "zod";

export const createProjectSchema = z.object({
  experienceId: z.string().cuid(),
  projectName: z.string().min(1, "Project name is required").max(200),
  descriptionEn: z.string().max(5000).nullish(),
  descriptionJp: z.string().max(5000).nullish(),
  technologies: z.array(z.string()).optional().default([]),
  sortOrder: z.number().int().min(0).optional().default(0),
});

export const updateProjectSchema = z.object({
  id: z.string().cuid(),
  projectName: z.string().min(1).max(200).optional(),
  descriptionEn: z.string().max(5000).nullish(),
  descriptionJp: z.string().max(5000).nullish(),
  technologies: z.array(z.string()).optional(),
  sortOrder: z.number().int().min(0).optional(),
});

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;
export type UpdateProjectSchema = z.infer<typeof updateProjectSchema>;
