import { createResumeSchema, updateResumeSchema } from "@/features/resume/schema";

const VALID_CUID = "clxxxxxxxxxxxxxxxxxxxxxxxxx";
const VALID_DATETIME = "2024-01-15T00:00:00.000Z";

describe("createResumeSchema", () => {
  it("accepts valid input with required fields only", () => {
    const result = createResumeSchema.safeParse({
      title: "My Resume",
      fullName: "John Doe",
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid input with all fields", () => {
    const result = createResumeSchema.safeParse({
      title: "My Resume",
      fullName: "John Doe",
      email: "john@example.com",
      phone: "+81-90-1234-5678",
      address: "Tokyo, Japan",
      nationality: "Japanese",
      dateOfBirth: VALID_DATETIME,
      gender: "Male",
      status: "FINAL",
      languageMode: "EN",
    });
    expect(result.success).toBe(true);
  });

  it("defaults status to DRAFT", () => {
    const result = createResumeSchema.parse({
      title: "My Resume",
      fullName: "John Doe",
    });
    expect(result.status).toBe("DRAFT");
  });

  it("defaults languageMode to BOTH", () => {
    const result = createResumeSchema.parse({
      title: "My Resume",
      fullName: "John Doe",
    });
    expect(result.languageMode).toBe("BOTH");
  });

  it("rejects empty title", () => {
    const result = createResumeSchema.safeParse({
      title: "",
      fullName: "John Doe",
    });
    expect(result.success).toBe(false);
  });

  it("rejects empty fullName", () => {
    const result = createResumeSchema.safeParse({
      title: "My Resume",
      fullName: "",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid email format", () => {
    const result = createResumeSchema.safeParse({
      title: "My Resume",
      fullName: "John Doe",
      email: "not-an-email",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid dateOfBirth (not ISO datetime)", () => {
    const result = createResumeSchema.safeParse({
      title: "My Resume",
      fullName: "John Doe",
      dateOfBirth: "January 15, 2024",
    });
    expect(result.success).toBe(false);
  });

  it("accepts null and undefined for nullish fields", () => {
    const result = createResumeSchema.safeParse({
      title: "My Resume",
      fullName: "John Doe",
      email: null,
      phone: undefined,
    });
    expect(result.success).toBe(true);
  });

  it("rejects title exceeding max length", () => {
    const result = createResumeSchema.safeParse({
      title: "a".repeat(201),
      fullName: "John Doe",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid status value", () => {
    const result = createResumeSchema.safeParse({
      title: "My Resume",
      fullName: "John Doe",
      status: "ARCHIVED",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid languageMode value", () => {
    const result = createResumeSchema.safeParse({
      title: "My Resume",
      fullName: "John Doe",
      languageMode: "FR",
    });
    expect(result.success).toBe(false);
  });
});

describe("updateResumeSchema", () => {
  it("accepts valid update with just id", () => {
    const result = updateResumeSchema.safeParse({
      id: VALID_CUID,
    });
    expect(result.success).toBe(true);
  });

  it("accepts valid update with id and optional fields", () => {
    const result = updateResumeSchema.safeParse({
      id: VALID_CUID,
      title: "Updated Title",
      status: "FINAL",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing id", () => {
    const result = updateResumeSchema.safeParse({
      title: "Updated Title",
    });
    expect(result.success).toBe(false);
  });

  it("rejects invalid id (not a CUID)", () => {
    const result = updateResumeSchema.safeParse({
      id: "not-a-cuid",
    });
    expect(result.success).toBe(false);
  });
});
