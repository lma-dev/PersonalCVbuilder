import {
  createExperienceSchema,
  updateExperienceSchema,
} from "@/features/experience/schema";

const VALID_CUID = "clxxxxxxxxxxxxxxxxxxxxxxxxx";
const VALID_DATETIME = "2024-01-15T00:00:00.000Z";

describe("createExperienceSchema", () => {
  it("accepts valid input with required fields", () => {
    const result = createExperienceSchema.safeParse({
      resumeId: VALID_CUID,
      companyName: "Acme Corp",
      startDate: VALID_DATETIME,
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid input with all fields", () => {
    const result = createExperienceSchema.safeParse({
      resumeId: VALID_CUID,
      companyName: "Acme Corp",
      employmentType: "Full-time",
      startDate: VALID_DATETIME,
      endDate: "2025-06-01T00:00:00.000Z",
      sortOrder: 1,
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty companyName", () => {
    const result = createExperienceSchema.safeParse({
      resumeId: VALID_CUID,
      companyName: "",
      startDate: VALID_DATETIME,
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid startDate", () => {
    const result = createExperienceSchema.safeParse({
      resumeId: VALID_CUID,
      companyName: "Acme Corp",
      startDate: "not-a-date",
    });
    expect(result.success).toBe(false);
  });

  it("defaults sortOrder to 0", () => {
    const result = createExperienceSchema.parse({
      resumeId: VALID_CUID,
      companyName: "Acme Corp",
      startDate: VALID_DATETIME,
    });
    expect(result.sortOrder).toBe(0);
  });

  it("accepts null endDate", () => {
    const result = createExperienceSchema.safeParse({
      resumeId: VALID_CUID,
      companyName: "Acme Corp",
      startDate: VALID_DATETIME,
      endDate: null,
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid resumeId", () => {
    const result = createExperienceSchema.safeParse({
      resumeId: "not-a-cuid",
      companyName: "Acme Corp",
      startDate: VALID_DATETIME,
    });
    expect(result.success).toBe(false);
  });

  it("rejects negative sortOrder", () => {
    const result = createExperienceSchema.safeParse({
      resumeId: VALID_CUID,
      companyName: "Acme Corp",
      startDate: VALID_DATETIME,
      sortOrder: -1,
    });
    expect(result.success).toBe(false);
  });
});

describe("updateExperienceSchema", () => {
  it("accepts valid update with just id", () => {
    const result = updateExperienceSchema.safeParse({
      id: VALID_CUID,
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid update with id and optional fields", () => {
    const result = updateExperienceSchema.safeParse({
      id: VALID_CUID,
      companyName: "New Company",
      startDate: VALID_DATETIME,
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing id", () => {
    const result = updateExperienceSchema.safeParse({
      companyName: "New Company",
    });
    expect(result.success).toBe(false);
  });
});
