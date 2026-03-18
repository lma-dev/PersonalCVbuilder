import { validateExperienceDates } from "../index";
import { ExperienceError } from "../../error";

describe("validateExperienceDates", () => {
  it("does not throw when endDate is undefined", () => {
    expect(() => validateExperienceDates("2024-01-01")).not.toThrow();
  });

  it("does not throw when endDate is null", () => {
    expect(() => validateExperienceDates("2024-01-01", null)).not.toThrow();
  });

  it("does not throw when endDate is after startDate", () => {
    expect(() =>
      validateExperienceDates("2024-01-01", "2024-06-01")
    ).not.toThrow();
  });

  it("throws ExperienceError when endDate equals startDate", () => {
    expect(() =>
      validateExperienceDates("2024-01-01", "2024-01-01")
    ).toThrow(ExperienceError);
  });

  it("throws ExperienceError when endDate is before startDate", () => {
    expect(() =>
      validateExperienceDates("2024-06-01", "2024-01-01")
    ).toThrow(ExperienceError);
  });

  it("throws with code EXPERIENCE_INVALID_DATES", () => {
    try {
      validateExperienceDates("2024-06-01", "2024-01-01");
      expect.unreachable("should have thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(ExperienceError);
      expect((error as ExperienceError).code).toBe("EXPERIENCE_INVALID_DATES");
    }
  });

  it("works with Date objects", () => {
    expect(() =>
      validateExperienceDates(new Date("2024-01-01"), new Date("2024-06-01"))
    ).not.toThrow();

    expect(() =>
      validateExperienceDates(new Date("2024-06-01"), new Date("2024-01-01"))
    ).toThrow(ExperienceError);
  });
});
