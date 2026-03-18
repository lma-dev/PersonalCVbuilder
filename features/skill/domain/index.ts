import { SkillError } from "../error";

const VALID_LEVELS = ["beginner", "intermediate", "advanced", "expert"];

export function validateSkillLevel(level?: string | null) {
  if (!level) return;

  if (!VALID_LEVELS.includes(level.toLowerCase())) {
    throw SkillError.invalidLevel(level);
  }
}
