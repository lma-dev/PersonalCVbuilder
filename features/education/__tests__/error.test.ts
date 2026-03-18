import { EducationError } from "@/features/education/error";

describe("EducationError", () => {
  it("is an instance of Error and EducationError", () => {
    const error = new EducationError("test");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(EducationError);
  });

  it("has correct name", () => {
    const error = new EducationError("test");

    expect(error.name).toBe("EducationError");
  });

  it("defaults code to EDUCATION_ERROR", () => {
    const error = new EducationError("test");

    expect(error.code).toBe("EDUCATION_ERROR");
  });

  describe("notFound", () => {
    it("creates error with EDUCATION_NOT_FOUND code", () => {
      const error = EducationError.notFound("edu-101");

      expect(error.code).toBe("EDUCATION_NOT_FOUND");
      expect(error.message).toContain("edu-101");
      expect(error).toBeInstanceOf(EducationError);
    });
  });

  describe("invalidDates", () => {
    it("creates error with EDUCATION_INVALID_DATES code", () => {
      const error = EducationError.invalidDates();

      expect(error.code).toBe("EDUCATION_INVALID_DATES");
      expect(error.message).toContain("date");
      expect(error).toBeInstanceOf(EducationError);
    });
  });
});
