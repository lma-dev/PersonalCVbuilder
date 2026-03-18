import { prisma } from "@/lib/prisma";
import type { CreateResumeInput, UpdateResumeInput } from "../types";

export async function createResume(userId: string, input: CreateResumeInput) {
  return prisma.resume.create({
    data: {
      userId,
      title: input.title,
      fullName: input.fullName,
      email: input.email ?? null,
      phone: input.phone ?? null,
      address: input.address ?? null,
      nationality: input.nationality ?? null,
      dateOfBirth: input.dateOfBirth ? new Date(input.dateOfBirth) : null,
      gender: input.gender ?? null,
      status: input.status ?? "DRAFT",
      languageMode: input.languageMode ?? "BOTH",
    },
  });
}

export async function getResume(id: string) {
  return prisma.resume.findFirst({
    where: { id, deletedAt: null },
  });
}

export async function getResumeWithRelations(id: string) {
  return prisma.resume.findFirst({
    where: { id, deletedAt: null },
    include: {
      educations: { orderBy: { sortOrder: "asc" } },
      experiences: {
        orderBy: { sortOrder: "asc" },
        include: {
          projects: { orderBy: { sortOrder: "asc" } },
        },
      },
      skills: { orderBy: { sortOrder: "asc" } },
      certifications: { orderBy: { sortOrder: "asc" } },
    },
  });
}

export async function listByUser(userId: string) {
  return prisma.resume.findMany({
    where: { userId, deletedAt: null },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      fullName: true,
      status: true,
      languageMode: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

export async function updateResume(input: UpdateResumeInput) {
  const { id, ...data } = input;
  return prisma.resume.update({
    where: { id },
    data: {
      ...data,
      dateOfBirth: data.dateOfBirth !== undefined
        ? data.dateOfBirth
          ? new Date(data.dateOfBirth)
          : null
        : undefined,
    },
  });
}

export async function softDeleteResume(id: string) {
  return prisma.resume.update({
    where: { id },
    data: { deletedAt: new Date() },
  });
}
