import {
  createProjectSchema,
  updateProjectSchema,
} from "@/features/project/schema";

const VALID_CUID = "clxxxxxxxxxxxxxxxxxxxxxxxxx";

describe("createProjectSchema", () => {
  it("accepts valid input with required fields", () => {
    const result = createProjectSchema.safeParse({
      experienceId: VALID_CUID,
      projectName: "E-commerce Platform",
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid input with all fields", () => {
    const result = createProjectSchema.safeParse({
      experienceId: VALID_CUID,
      projectName: "E-commerce Platform",
      descriptionEn: "Built a scalable platform",
      descriptionJp: "スケーラブルなプラットフォームを構築",
      technologies: ["React", "Node.js", "PostgreSQL"],
      sortOrder: 2,
    });
    expect(result.success).toBe(true);
  });

  it("defaults technologies to empty array", () => {
    const result = createProjectSchema.parse({
      experienceId: VALID_CUID,
      projectName: "E-commerce Platform",
    });
    expect(result.technologies).toEqual([]);
  });

  it("defaults sortOrder to 0", () => {
    const result = createProjectSchema.parse({
      experienceId: VALID_CUID,
      projectName: "E-commerce Platform",
    });
    expect(result.sortOrder).toBe(0);
  });

  it("rejects empty projectName", () => {
    const result = createProjectSchema.safeParse({
      experienceId: VALID_CUID,
      projectName: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid experienceId", () => {
    const result = createProjectSchema.safeParse({
      experienceId: "not-a-cuid",
      projectName: "E-commerce Platform",
    });
    expect(result.success).toBe(false);
  });

  it("rejects descriptionEn exceeding max length", () => {
    const result = createProjectSchema.safeParse({
      experienceId: VALID_CUID,
      projectName: "E-commerce Platform",
      descriptionEn: "a".repeat(5001),
    });
    expect(result.success).toBe(false);
  });

  it("accepts null for nullish fields", () => {
    const result = createProjectSchema.safeParse({
      experienceId: VALID_CUID,
      projectName: "E-commerce Platform",
      descriptionEn: null,
      descriptionJp: null,
    });
    expect(result.success).toBe(true);
  });
});

describe("updateProjectSchema", () => {
  it("accepts valid update with just id", () => {
    const result = updateProjectSchema.safeParse({
      id: VALID_CUID,
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid update with id and optional fields", () => {
    const result = updateProjectSchema.safeParse({
      id: VALID_CUID,
      projectName: "Updated Project",
      technologies: ["TypeScript"],
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing id", () => {
    const result = updateProjectSchema.safeParse({
      projectName: "Updated Project",
    });
    expect(result.success).toBe(false);
  });
});
