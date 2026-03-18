export class ExperienceError extends Error {
  public readonly code: string;

  constructor(message: string, code: string = "EXPERIENCE_ERROR") {
    super(message);
    this.name = "ExperienceError";
    this.code = code;
  }

  static notFound(id: string) {
    return new ExperienceError(
      `Experience not found: ${id}`,
      "EXPERIENCE_NOT_FOUND"
    );
  }

  static invalidDates() {
    return new ExperienceError(
      "End date must be after start date",
      "EXPERIENCE_INVALID_DATES"
    );
  }
}
