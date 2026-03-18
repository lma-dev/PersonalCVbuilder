import { prisma } from "@/lib/prisma";
import type {
  CreateExperienceInput,
  UpdateExperienceInput,
  ReorderExperienceInput,
} from "../types";

export async function createExperience(input: CreateExperienceInput) {
  return prisma.resumeExperience.create({
    data: {
      resumeId: input.resumeId,
      companyName: input.companyName,
      employmentType: input.employmentType ?? null,
      startDate: new Date(input.startDate),
      endDate: input.endDate ? new Date(input.endDate) : null,
      sortOrder: input.sortOrder ?? 0,
    },
  });
}

export async function getExperience(id: string) {
  return prisma.resumeExperience.findUnique({
    where: { id },
  });
}

export async function getExperienceWithProjects(id: string) {
  return prisma.resumeExperience.findUnique({
    where: { id },
    include: { projects: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function listByResume(resumeId: string) {
  return prisma.resumeExperience.findMany({
    where: { resumeId },
    orderBy: { sortOrder: "asc" },
    include: { projects: { orderBy: { sortOrder: "asc" } } },
  });
}

export async function updateExperience(input: UpdateExperienceInput) {
  const { id, ...data } = input;
  return prisma.resumeExperience.update({
    where: { id },
    data: {
      ...data,
      startDate: data.startDate ? new Date(data.startDate) : undefined,
      endDate: data.endDate !== undefined
        ? data.endDate
          ? new Date(data.endDate)
          : null
        : undefined,
    },
  });
}

export async function deleteExperience(id: string) {
  return prisma.resumeExperience.delete({
    where: { id },
  });
}

export async function reorderExperiences(items: ReorderExperienceInput) {
  return prisma.$transaction(
    items.map((item) =>
      prisma.resumeExperience.update({
        where: { id: item.id },
        data: { sortOrder: item.sortOrder },
      })
    )
  );
}
