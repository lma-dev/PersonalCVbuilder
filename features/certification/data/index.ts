import { prisma } from "@/lib/prisma";
import type {
  CreateCertificationInput,
  UpdateCertificationInput,
} from "../types";

export async function createCertification(input: CreateCertificationInput) {
  return prisma.resumeCertification.create({
    data: {
      resumeId: input.resumeId,
      date: new Date(input.date),
      name: input.name,
      sortOrder: input.sortOrder ?? 0,
    },
  });
}

export async function getCertification(id: string) {
  return prisma.resumeCertification.findUnique({
    where: { id },
  });
}

export async function listByResume(resumeId: string) {
  return prisma.resumeCertification.findMany({
    where: { resumeId },
    orderBy: { sortOrder: "asc" },
  });
}

export async function updateCertification(input: UpdateCertificationInput) {
  const { id, ...data } = input;
  return prisma.resumeCertification.update({
    where: { id },
    data: {
      ...data,
      date: data.date ? new Date(data.date) : undefined,
    },
  });
}

export async function deleteCertification(id: string) {
  return prisma.resumeCertification.delete({
    where: { id },
  });
}
