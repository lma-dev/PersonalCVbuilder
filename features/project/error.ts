export class ProjectError extends Error {
  public readonly code: string;

  constructor(message: string, code: string = "PROJECT_ERROR") {
    super(message);
    this.name = "ProjectError";
    this.code = code;
  }

  static notFound(id: string) {
    return new ProjectError(
      `Project not found: ${id}`,
      "PROJECT_NOT_FOUND"
    );
  }
}
