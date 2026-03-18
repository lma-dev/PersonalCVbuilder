import { validateSkillLevel } from "../index";
import { SkillError } from "../../error";

describe("validateSkillLevel", () => {
  it("does not throw when level is undefined", () => {
    expect(() => validateSkillLevel()).not.toThrow();
  });

  it("does not throw when level is null", () => {
    expect(() => validateSkillLevel(null)).not.toThrow();
  });

  it.each(["beginner", "intermediate", "advanced", "expert"])(
    'does not throw for valid level "%s"',
    (level) => {
      expect(() => validateSkillLevel(level)).not.toThrow();
    }
  );

  it.each(["Beginner", "INTERMEDIATE", "Advanced", "EXPERT"])(
    'is case insensitive: "%s" is valid',
    (level) => {
      expect(() => validateSkillLevel(level)).not.toThrow();
    }
  );

  it("throws SkillError for invalid level", () => {
    expect(() => validateSkillLevel("master")).toThrow(SkillError);
  });

  it("throws with code SKILL_INVALID_LEVEL", () => {
    try {
      validateSkillLevel("master");
      expect.unreachable("should have thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(SkillError);
      expect((error as SkillError).code).toBe("SKILL_INVALID_LEVEL");
    }
  });

  it("includes the invalid level in the error message", () => {
    try {
      validateSkillLevel("master");
      expect.unreachable("should have thrown");
    } catch (error) {
      expect((error as SkillError).message).toContain("master");
    }
  });
});
