export interface ResumeExport {
  title: string;
  status: string;
  languageMode: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  nationality: string | null;
  dateOfBirth: Date | null;
  gender: string | null;
  educations: Array<{
    schoolName: string;
    major: string | null;
    status: string | null;
    startDate: Date;
    endDate: Date | null;
  }>;
  experiences: Array<{
    companyName: string;
    employmentType: string | null;
    startDate: Date;
    endDate: Date | null;
    projects: Array<{
      projectName: string;
      descriptionEn: string | null;
      descriptionJp: string | null;
      technologies: string[];
    }>;
  }>;
  skills: Array<{
    category: string;
    name: string;
    level: string | null;
  }>;
  certifications: Array<{
    name: string;
    date: Date;
  }>;
}
