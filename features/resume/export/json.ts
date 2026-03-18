import type { ResumeExport } from "./types";

export function generateResumeJson(resume: ResumeExport): string {
  return JSON.stringify(resume, null, 2);
}
