import { ExperienceError } from "../error";

export function validateExperienceDates(
  startDate: string | Date,
  endDate?: string | Date | null
) {
  if (!endDate) return;

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end <= start) {
    throw ExperienceError.invalidDates();
  }
}
