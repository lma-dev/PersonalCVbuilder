import type { ResumeStatus } from "../types";
import { ResumeError } from "../error";
import { getResume } from "../data";

export async function validateOwnership(resumeId: string, userId: string) {
  const resume = await getResume(resumeId);

  if (!resume) {
    throw ResumeError.notFound(resumeId);
  }

  if (resume.userId !== userId) {
    throw ResumeError.unauthorized();
  }

  return resume;
}

const VALID_TRANSITIONS: Record<ResumeStatus, ResumeStatus[]> = {
  DRAFT: ["FINAL"],
  FINAL: ["DRAFT"],
};

export function canTransitionStatus(
  currentStatus: ResumeStatus,
  newStatus: ResumeStatus
): boolean {
  if (currentStatus === newStatus) return true;
  return VALID_TRANSITIONS[currentStatus]?.includes(newStatus) ?? false;
}

export function assertStatusTransition(
  currentStatus: ResumeStatus,
  newStatus: ResumeStatus
) {
  if (!canTransitionStatus(currentStatus, newStatus)) {
    throw ResumeError.invalidStatusTransition(currentStatus, newStatus);
  }
}
