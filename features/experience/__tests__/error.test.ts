import { ExperienceError } from "@/features/experience/error";

describe("ExperienceError", () => {
  it("is an instance of Error and ExperienceError", () => {
    const error = new ExperienceError("test");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(ExperienceError);
  });

  it("has correct name", () => {
    const error = new ExperienceError("test");

    expect(error.name).toBe("ExperienceError");
  });

  it("defaults code to EXPERIENCE_ERROR", () => {
    const error = new ExperienceError("test");

    expect(error.code).toBe("EXPERIENCE_ERROR");
  });

  describe("notFound", () => {
    it("creates error with EXPERIENCE_NOT_FOUND code", () => {
      const error = ExperienceError.notFound("exp-456");

      expect(error.code).toBe("EXPERIENCE_NOT_FOUND");
      expect(error.message).toContain("exp-456");
      expect(error).toBeInstanceOf(ExperienceError);
    });
  });

  describe("invalidDates", () => {
    it("creates error with EXPERIENCE_INVALID_DATES code", () => {
      const error = ExperienceError.invalidDates();

      expect(error.code).toBe("EXPERIENCE_INVALID_DATES");
      expect(error.message).toContain("date");
      expect(error).toBeInstanceOf(ExperienceError);
    });
  });
});
