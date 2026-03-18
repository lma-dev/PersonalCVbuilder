import { generateResumeJson } from "@/features/resume/export/json";
import type { ResumeExport } from "@/features/resume/export/types";

const sampleResume: ResumeExport = {
  title: "Software Engineer CV",
  status: "draft",
  languageMode: "en",
  fullName: "John Doe",
  email: "john@example.com",
  phone: "+81-90-1234-5678",
  address: "Tokyo, Japan",
  nationality: "US",
  dateOfBirth: new Date("1990-01-15"),
  gender: "male",
  educations: [
    {
      schoolName: "MIT",
      major: "Computer Science",
      status: "graduated",
      startDate: new Date("2008-09-01"),
      endDate: new Date("2012-06-01"),
    },
  ],
  experiences: [
    {
      companyName: "Acme Corp",
      employmentType: "full-time",
      startDate: new Date("2012-07-01"),
      endDate: null,
      projects: [
        {
          projectName: "Platform Rebuild",
          descriptionEn: "Rebuilt the main platform",
          descriptionJp: null,
          technologies: ["TypeScript", "React"],
        },
      ],
    },
  ],
  skills: [
    { category: "Programming", name: "TypeScript", level: "expert" },
  ],
  certifications: [
    { name: "AWS Solutions Architect", date: new Date("2020-03-01") },
  ],
};

describe("generateResumeJson", () => {
  it("returns a valid JSON string", () => {
    const result = generateResumeJson(sampleResume);

    expect(() => JSON.parse(result)).not.toThrow();
  });

  it("can be parsed back to match the original object", () => {
    const result = generateResumeJson(sampleResume);
    const parsed = JSON.parse(result);

    expect(parsed.title).toBe(sampleResume.title);
    expect(parsed.fullName).toBe(sampleResume.fullName);
    expect(parsed.email).toBe(sampleResume.email);
    expect(parsed.skills).toEqual(sampleResume.skills);
  });

  it("is pretty-printed with 2-space indentation", () => {
    const result = generateResumeJson(sampleResume);

    expect(result).toContain("\n");
    expect(result).toContain("  ");
    // Verify it matches JSON.stringify with indent 2
    expect(result).toBe(JSON.stringify(sampleResume, null, 2));
  });

  it("handles empty arrays", () => {
    const emptyResume: ResumeExport = {
      title: "Empty CV",
      status: "draft",
      languageMode: "en",
      fullName: "Jane Doe",
      email: null,
      phone: null,
      address: null,
      nationality: null,
      dateOfBirth: null,
      gender: null,
      educations: [],
      experiences: [],
      skills: [],
      certifications: [],
    };

    const result = generateResumeJson(emptyResume);
    const parsed = JSON.parse(result);

    expect(parsed.educations).toEqual([]);
    expect(parsed.experiences).toEqual([]);
    expect(parsed.skills).toEqual([]);
    expect(parsed.certifications).toEqual([]);
  });
});
