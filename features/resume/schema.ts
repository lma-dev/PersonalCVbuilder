import { z } from "zod";

export const createResumeSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  fullName: z.string().min(1, "Full name is required").max(200),
  email: z.string().email("Invalid email").nullish(),
  phone: z.string().max(50).nullish(),
  address: z.string().max(500).nullish(),
  nationality: z.string().max(100).nullish(),
  dateOfBirth: z.string().datetime({ offset: true }).nullish(),
  gender: z.string().max(50).nullish(),
  status: z.enum(["DRAFT", "FINAL"]).optional().default("DRAFT"),
  languageMode: z.enum(["EN", "JP", "BOTH"]).optional().default("BOTH"),
});

export const updateResumeSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1).max(200).optional(),
  fullName: z.string().min(1).max(200).optional(),
  email: z.string().email().nullish(),
  phone: z.string().max(50).nullish(),
  address: z.string().max(500).nullish(),
  nationality: z.string().max(100).nullish(),
  dateOfBirth: z.string().datetime({ offset: true }).nullish(),
  gender: z.string().max(50).nullish(),
  status: z.enum(["DRAFT", "FINAL"]).optional(),
  languageMode: z.enum(["EN", "JP", "BOTH"]).optional(),
});

export type CreateResumeSchema = z.infer<typeof createResumeSchema>;
export type UpdateResumeSchema = z.infer<typeof updateResumeSchema>;
