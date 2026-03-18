import { prisma } from "@/lib/prisma";
import type { CreateProjectInput, UpdateProjectInput } from "../types";

export async function createProject(input: CreateProjectInput) {
  return prisma.resumeProject.create({
    data: {
      experienceId: input.experienceId,
      projectName: input.projectName,
      descriptionEn: input.descriptionEn ?? null,
      descriptionJp: input.descriptionJp ?? null,
      technologies: input.technologies ?? [],
      sortOrder: input.sortOrder ?? 0,
    },
  });
}

export async function getProject(id: string) {
  return prisma.resumeProject.findUnique({
    where: { id },
  });
}

export async function listByExperience(experienceId: string) {
  return prisma.resumeProject.findMany({
    where: { experienceId },
    orderBy: { sortOrder: "asc" },
  });
}

export async function updateProject(input: UpdateProjectInput) {
  const { id, ...data } = input;
  return prisma.resumeProject.update({
    where: { id },
    data,
  });
}

export async function deleteProject(id: string) {
  return prisma.resumeProject.delete({
    where: { id },
  });
}
