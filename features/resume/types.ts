import type {
  Resume as PrismaResume,
  ResumeEducation,
  ResumeExperience,
  ResumeSkill,
  ResumeCertification,
  ResumeProject,
  ResumeStatus,
  LanguageMode,
} from "@/app/generated/prisma";

export type Resume = PrismaResume;

export type ResumeWithRelations = PrismaResume & {
  educations: ResumeEducation[];
  experiences: (ResumeExperience & { projects: ResumeProject[] })[];
  skills: ResumeSkill[];
  certifications: ResumeCertification[];
};

export type CreateResumeInput = {
  title: string;
  fullName: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  nationality?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  status?: ResumeStatus;
  languageMode?: LanguageMode;
};

export type UpdateResumeInput = Partial<CreateResumeInput> & {
  id: string;
};

export type ResumeListItem = Pick<
  PrismaResume,
  "id" | "title" | "fullName" | "status" | "languageMode" | "createdAt" | "updatedAt"
>;

export type { ResumeStatus, LanguageMode };
