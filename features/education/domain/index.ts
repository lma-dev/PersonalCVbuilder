import { EducationError } from "../error";

export function validateEducationDates(
  startDate: string | Date,
  endDate?: string | Date | null
) {
  if (!endDate) return;

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (end <= start) {
    throw EducationError.invalidDates();
  }
}
