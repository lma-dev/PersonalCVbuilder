import { prisma } from "@/lib/prisma";
import type { CreateEducationInput, UpdateEducationInput } from "../types";

export async function createEducation(input: CreateEducationInput) {
  return prisma.resumeEducation.create({
    data: {
      resumeId: input.resumeId,
      startDate: new Date(input.startDate),
      endDate: input.endDate ? new Date(input.endDate) : null,
      schoolName: input.schoolName,
      major: input.major ?? null,
      status: input.status ?? null,
      sortOrder: input.sortOrder ?? 0,
    },
  });
}

export async function getEducation(id: string) {
  return prisma.resumeEducation.findUnique({
    where: { id },
  });
}

export async function listByResume(resumeId: string) {
  return prisma.resumeEducation.findMany({
    where: { resumeId },
    orderBy: { sortOrder: "asc" },
  });
}

export async function updateEducation(input: UpdateEducationInput) {
  const { id, ...data } = input;
  return prisma.resumeEducation.update({
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

export async function deleteEducation(id: string) {
  return prisma.resumeEducation.delete({
    where: { id },
  });
}
