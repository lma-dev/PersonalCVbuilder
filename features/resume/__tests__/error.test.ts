import { ResumeError } from "@/features/resume/error";

describe("ResumeError", () => {
  it("is an instance of Error and ResumeError", () => {
    const error = new ResumeError("test");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ResumeError);
  });

  it("has correct name", () => {
    const error = new ResumeError("test");

    expect(error.name).toBe("ResumeError");
  });

  it("defaults code to RESUME_ERROR", () => {
    const error = new ResumeError("test");

    expect(error.code).toBe("RESUME_ERROR");
  });

  describe("notFound", () => {
    it("creates error with RESUME_NOT_FOUND code", () => {
      const error = ResumeError.notFound("abc-123");

      expect(error.code).toBe("RESUME_NOT_FOUND");
      expect(error.message).toContain("abc-123");
      expect(error).toBeInstanceOf(ResumeError);
    });
  });

  describe("unauthorized", () => {
    it("creates error with RESUME_UNAUTHORIZED code", () => {
      const error = ResumeError.unauthorized();

      expect(error.code).toBe("RESUME_UNAUTHORIZED");
      expect(error.message).toContain("permission");
      expect(error).toBeInstanceOf(ResumeError);
    });
  });

  describe("invalidStatusTransition", () => {
    it("creates error with RESUME_INVALID_STATUS_TRANSITION code", () => {
      const error = ResumeError.invalidStatusTransition("draft", "archived");

      expect(error.code).toBe("RESUME_INVALID_STATUS_TRANSITION");
      expect(error.message).toContain("draft");
      expect(error.message).toContain("archived");
      expect(error).toBeInstanceOf(ResumeError);
    });
  });
});
