import type { ResumeCertification } from "@/app/generated/prisma";

export type CertificationType = ResumeCertification;

export type CreateCertificationInput = {
  resumeId: string;
  date: string;
  name: string;
  sortOrder?: number;
};

export type UpdateCertificationInput = Partial<Omit<CreateCertificationInput, "resumeId">> & {
  id: string;
};
