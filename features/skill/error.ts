export class SkillError extends Error {
  public readonly code: string;

  constructor(message: string, code: string = "SKILL_ERROR") {
    super(message);
    this.name = "SkillError";
    this.code = code;
  }

  static notFound(id: string) {
    return new SkillError(`Skill not found: ${id}`, "SKILL_NOT_FOUND");
  }

  static invalidLevel(level: string) {
    return new SkillError(
      `Invalid skill level: ${level}. Must be one of: beginner, intermediate, advanced, expert`,
      "SKILL_INVALID_LEVEL"
    );
  }
}
