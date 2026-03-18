export class EducationError extends Error {
  public readonly code: string;

  constructor(message: string, code: string = "EDUCATION_ERROR") {
    super(message);
    this.name = "EducationError";
    this.code = code;
  }

  static notFound(id: string) {
    return new EducationError(
      `Education not found: ${id}`,
      "EDUCATION_NOT_FOUND"
    );
  }

  static invalidDates() {
    return new EducationError(
      "End date must be after start date",
      "EDUCATION_INVALID_DATES"
    );
  }
}
