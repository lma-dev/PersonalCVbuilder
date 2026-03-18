export class ResumeError extends Error {
  public readonly code: string;

  constructor(message: string, code: string = "RESUME_ERROR") {
    super(message);
    this.name = "ResumeError";
    this.code = code;
  }

  static notFound(id: string) {
    return new ResumeError(`Resume not found: ${id}`, "RESUME_NOT_FOUND");
  }

  static unauthorized() {
    return new ResumeError(
      "You do not have permission to access this resume",
      "RESUME_UNAUTHORIZED"
    );
  }

  static invalidStatusTransition(from: string, to: string) {
    return new ResumeError(
      `Cannot transition resume status from ${from} to ${to}`,
      "RESUME_INVALID_STATUS_TRANSITION"
    );
  }
}
