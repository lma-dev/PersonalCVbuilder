import {
  createCertificationSchema,
  updateCertificationSchema,
} from "@/features/certification/schema";

const VALID_CUID = "clxxxxxxxxxxxxxxxxxxxxxxxxx";
const VALID_DATETIME = "2024-01-15T00:00:00.000Z";

describe("createCertificationSchema", () => {
  it("accepts valid input with required fields", () => {
    const result = createCertificationSchema.safeParse({
      resumeId: VALID_CUID,
      date: VALID_DATETIME,
      name: "AWS Solutions Architect",
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid input with all fields", () => {
    const result = createCertificationSchema.safeParse({
      resumeId: VALID_CUID,
      date: VALID_DATETIME,
      name: "AWS Solutions Architect",
      sortOrder: 3,
    });
    expect(result.success).toBe(true);
  });

  it("rejects empty name", () => {
    const result = createCertificationSchema.safeParse({
      resumeId: VALID_CUID,
      date: VALID_DATETIME,
      name: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid date format", () => {
    const result = createCertificationSchema.safeParse({
      resumeId: VALID_CUID,
      date: "2024-01-15",
      name: "AWS Solutions Architect",
    });
    expect(result.success).toBe(false);
  });

  it("rejects non-ISO date string", () => {
    const result = createCertificationSchema.safeParse({
      resumeId: VALID_CUID,
      date: "January 15, 2024",
      name: "AWS Solutions Architect",
    });
    expect(result.success).toBe(false);
  });

  it("defaults sortOrder to 0", () => {
    const result = createCertificationSchema.parse({
      resumeId: VALID_CUID,
      date: VALID_DATETIME,
      name: "AWS Solutions Architect",
    });
    expect(result.sortOrder).toBe(0);
  });

  it("rejects invalid resumeId", () => {
    const result = createCertificationSchema.safeParse({
      resumeId: "not-a-cuid",
      date: VALID_DATETIME,
      name: "AWS Solutions Architect",
    });
    expect(result.success).toBe(false);
  });

  it("rejects name exceeding max length", () => {
    const result = createCertificationSchema.safeParse({
      resumeId: VALID_CUID,
      date: VALID_DATETIME,
      name: "a".repeat(301),
    });
    expect(result.success).toBe(false);
  });
});

describe("updateCertificationSchema", () => {
  it("accepts valid update with just id", () => {
    const result = updateCertificationSchema.safeParse({
      id: VALID_CUID,
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid update with id and optional fields", () => {
    const result = updateCertificationSchema.safeParse({
      id: VALID_CUID,
      name: "Updated Certification",
      date: VALID_DATETIME,
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing id", () => {
    const result = updateCertificationSchema.safeParse({
      name: "Updated Certification",
    });
    expect(result.success).toBe(false);
  });
});
