import { validateEducationDates } from "../index";
import { EducationError } from "../../error";

describe("validateEducationDates", () => {
  it("does not throw when endDate is undefined", () => {
    expect(() => validateEducationDates("2020-09-01")).not.toThrow();
  });

  it("does not throw when endDate is null", () => {
    expect(() => validateEducationDates("2020-09-01", null)).not.toThrow();
  });

  it("does not throw when endDate is after startDate", () => {
    expect(() =>
      validateEducationDates("2020-09-01", "2024-06-01")
    ).not.toThrow();
  });

  it("throws EducationError when endDate equals startDate", () => {
    expect(() =>
      validateEducationDates("2020-09-01", "2020-09-01")
    ).toThrow(EducationError);
  });

  it("throws EducationError when endDate is before startDate", () => {
    expect(() =>
      validateEducationDates("2024-06-01", "2020-09-01")
    ).toThrow(EducationError);
  });

  it("throws with code EDUCATION_INVALID_DATES", () => {
    try {
      validateEducationDates("2024-06-01", "2020-09-01");
      expect.unreachable("should have thrown");
    } catch (error) {
      expect(error).toBeInstanceOf(EducationError);
      expect((error as EducationError).code).toBe("EDUCATION_INVALID_DATES");
    }
  });

  it("works with Date objects", () => {
    expect(() =>
      validateEducationDates(new Date("2020-09-01"), new Date("2024-06-01"))
    ).not.toThrow();

    expect(() =>
      validateEducationDates(new Date("2024-06-01"), new Date("2020-09-01"))
    ).toThrow(EducationError);
  });
});
