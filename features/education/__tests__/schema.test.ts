import {
  createEducationSchema,
  updateEducationSchema,
} from "@/features/education/schema";

const VALID_CUID = "clxxxxxxxxxxxxxxxxxxxxxxxxx";
const VALID_DATETIME = "2024-01-15T00:00:00.000Z";

describe("createEducationSchema", () => {
  it("accepts valid input with required fields", () => {
    const result = createEducationSchema.safeParse({
      resumeId: VALID_CUID,
      startDate: VALID_DATETIME,
      schoolName: "University of Tokyo",
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid input with all fields", () => {
    const result = createEducationSchema.safeParse({
      resumeId: VALID_CUID,
      startDate: VALID_DATETIME,
      endDate: "2028-03-31T00:00:00.000Z",
      schoolName: "University of Tokyo",
      major: "Computer Science",
      status: "Graduated",
      sortOrder: 1,
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty schoolName", () => {
    const result = createEducationSchema.safeParse({
      resumeId: VALID_CUID,
      startDate: VALID_DATETIME,
      schoolName: "",
    });
    expect(result.success).toBe(false);
  });

  it("accepts null endDate (nullish)", () => {
    const result = createEducationSchema.safeParse({
      resumeId: VALID_CUID,
      startDate: VALID_DATETIME,
      schoolName: "University of Tokyo",
      endDate: null,
    });
    expect(result.success).toBe(true);
  });

  it("accepts undefined endDate (nullish)", () => {
    const result = createEducationSchema.safeParse({
      resumeId: VALID_CUID,
      startDate: VALID_DATETIME,
      schoolName: "University of Tokyo",
    });
    expect(result.success).toBe(true);
  });

  it("defaults sortOrder to 0", () => {
    const result = createEducationSchema.parse({
      resumeId: VALID_CUID,
      startDate: VALID_DATETIME,
      schoolName: "University of Tokyo",
    });
    expect(result.sortOrder).toBe(0);
  });

  it("rejects invalid startDate", () => {
    const result = createEducationSchema.safeParse({
      resumeId: VALID_CUID,
      startDate: "not-a-date",
      schoolName: "University of Tokyo",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid resumeId", () => {
    const result = createEducationSchema.safeParse({
      resumeId: "not-a-cuid",
      startDate: VALID_DATETIME,
      schoolName: "University of Tokyo",
    });
    expect(result.success).toBe(false);
  });

  it("rejects schoolName exceeding max length", () => {
    const result = createEducationSchema.safeParse({
      resumeId: VALID_CUID,
      startDate: VALID_DATETIME,
      schoolName: "a".repeat(301),
    });
    expect(result.success).toBe(false);
  });

  it("accepts null for nullish fields", () => {
    const result = createEducationSchema.safeParse({
      resumeId: VALID_CUID,
      startDate: VALID_DATETIME,
      schoolName: "University of Tokyo",
      major: null,
      status: null,
    });
    expect(result.success).toBe(true);
  });
});

describe("updateEducationSchema", () => {
  it("accepts valid update with just id", () => {
    const result = updateEducationSchema.safeParse({
      id: VALID_CUID,
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid update with id and optional fields", () => {
    const result = updateEducationSchema.safeParse({
      id: VALID_CUID,
      schoolName: "MIT",
      major: "Physics",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing id", () => {
    const result = updateEducationSchema.safeParse({
      schoolName: "MIT",
    });
    expect(result.success).toBe(false);
  });
});
