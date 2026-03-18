import {
  createSkillSchema,
  updateSkillSchema,
} from "@/features/skill/schema";

const VALID_CUID = "clxxxxxxxxxxxxxxxxxxxxxxxxx";

describe("createSkillSchema", () => {
  it("accepts valid input with required fields", () => {
    const result = createSkillSchema.safeParse({
      resumeId: VALID_CUID,
      category: "Programming",
      name: "TypeScript",
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid input with all fields", () => {
    const result = createSkillSchema.safeParse({
      resumeId: VALID_CUID,
      category: "Programming",
      name: "TypeScript",
      level: "advanced",
      sortOrder: 1,
    });
    expect(result.success).toBe(true);
  });

  it("accepts all valid level values", () => {
    const levels = ["beginner", "intermediate", "advanced", "expert"] as const;
    for (const level of levels) {
      const result = createSkillSchema.safeParse({
        resumeId: VALID_CUID,
        category: "Programming",
        name: "TypeScript",
        level,
      });
      expect(result.success).toBe(true);
    }
  });

  it("rejects invalid level value", () => {
    const result = createSkillSchema.safeParse({
      resumeId: VALID_CUID,
      category: "Programming",
      name: "TypeScript",
      level: "master",
    });
    expect(result.success).toBe(false);
  });

  it("accepts null level (nullish)", () => {
    const result = createSkillSchema.safeParse({
      resumeId: VALID_CUID,
      category: "Programming",
      name: "TypeScript",
      level: null,
    });
    expect(result.success).toBe(true);
  });

  it("accepts undefined level (nullish)", () => {
    const result = createSkillSchema.safeParse({
      resumeId: VALID_CUID,
      category: "Programming",
      name: "TypeScript",
      level: undefined,
    });
    expect(result.success).toBe(true);
  });

  it("defaults sortOrder to 0", () => {
    const result = createSkillSchema.parse({
      resumeId: VALID_CUID,
      category: "Programming",
      name: "TypeScript",
    });
    expect(result.sortOrder).toBe(0);
  });

  it("rejects empty category", () => {
    const result = createSkillSchema.safeParse({
      resumeId: VALID_CUID,
      category: "",
      name: "TypeScript",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty name", () => {
    const result = createSkillSchema.safeParse({
      resumeId: VALID_CUID,
      category: "Programming",
      name: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid resumeId", () => {
    const result = createSkillSchema.safeParse({
      resumeId: "not-a-cuid",
      category: "Programming",
      name: "TypeScript",
    });
    expect(result.success).toBe(false);
  });
});

describe("updateSkillSchema", () => {
  it("accepts valid update with just id", () => {
    const result = updateSkillSchema.safeParse({
      id: VALID_CUID,
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid update with id and optional fields", () => {
    const result = updateSkillSchema.safeParse({
      id: VALID_CUID,
      name: "JavaScript",
      level: "expert",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing id", () => {
    const result = updateSkillSchema.safeParse({
      name: "JavaScript",
    });
    expect(result.success).toBe(false);
  });
});
