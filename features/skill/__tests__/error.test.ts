import { SkillError } from "@/features/skill/error";

describe("SkillError", () => {
  it("is an instance of Error and SkillError", () => {
    const error = new SkillError("test");

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(SkillError);
  });

  it("has correct name", () => {
    const error = new SkillError("test");

    expect(error.name).toBe("SkillError");
  });

  it("defaults code to SKILL_ERROR", () => {
    const error = new SkillError("test");

    expect(error.code).toBe("SKILL_ERROR");
  });

  describe("notFound", () => {
    it("creates error with SKILL_NOT_FOUND code", () => {
      const error = SkillError.notFound("skill-789");

      expect(error.code).toBe("SKILL_NOT_FOUND");
      expect(error.message).toContain("skill-789");
      expect(error).toBeInstanceOf(SkillError);
    });
  });

  describe("invalidLevel", () => {
    it("creates error with SKILL_INVALID_LEVEL code", () => {
      const error = SkillError.invalidLevel("godlike");

      expect(error.code).toBe("SKILL_INVALID_LEVEL");
      expect(error.message).toContain("godlike");
      expect(error).toBeInstanceOf(SkillError);
    });
  });
});
