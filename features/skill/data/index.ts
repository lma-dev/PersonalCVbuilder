import { prisma } from "@/lib/prisma";
import type { CreateSkillInput, UpdateSkillInput } from "../types";

export async function createSkill(input: CreateSkillInput) {
  return prisma.resumeSkill.create({
    data: {
      resumeId: input.resumeId,
      category: input.category,
      name: input.name,
      level: input.level ?? null,
      sortOrder: input.sortOrder ?? 0,
    },
  });
}

export async function getSkill(id: string) {
  return prisma.resumeSkill.findUnique({
    where: { id },
  });
}

export async function listByResume(resumeId: string) {
  return prisma.resumeSkill.findMany({
    where: { resumeId },
    orderBy: { sortOrder: "asc" },
  });
}

export async function updateSkill(input: UpdateSkillInput) {
  const { id, ...data } = input;
  return prisma.resumeSkill.update({
    where: { id },
    data,
  });
}

export async function deleteSkill(id: string) {
  return prisma.resumeSkill.delete({
    where: { id },
  });
}
