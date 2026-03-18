"use client";

import type { ResumeExport } from "@/features/resume/export/types";

interface ResumePreviewProps {
  resume: ResumeExport;
}

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "Present";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short" });
}

function formatFullDate(date: Date | string | null | undefined): string {
  if (!date) return "";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 mb-3">
      <h2 className="text-sm font-bold uppercase tracking-wider text-gray-800">
        {children}
      </h2>
      <div className="mt-1 h-[2px] bg-blue-600" />
    </div>
  );
}

export function ResumePreview({ resume }: ResumePreviewProps) {
  const hasPersonalInfo =
    resume.nationality || resume.dateOfBirth || resume.gender;

  // Group skills by category
  const skillsByCategory = new Map<
    string,
    Array<{ name: string; level: string | null }>
  >();
  for (const skill of resume.skills) {
    if (!skillsByCategory.has(skill.category)) {
      skillsByCategory.set(skill.category, []);
    }
    skillsByCategory.get(skill.category)!.push({
      name: skill.name,
      level: skill.level,
    });
  }

  return (
    <div
      className="mx-auto bg-white shadow-lg print:shadow-none"
      style={{
        width: "210mm",
        minHeight: "297mm",
        padding: "16mm 18mm",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900">{resume.fullName}</h1>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-3 text-xs text-gray-500">
          {resume.email && <span>{resume.email}</span>}
          {resume.email && resume.phone && (
            <span className="text-gray-300">|</span>
          )}
          {resume.phone && <span>{resume.phone}</span>}
          {(resume.email || resume.phone) && resume.address && (
            <span className="text-gray-300">|</span>
          )}
          {resume.address && <span>{resume.address}</span>}
        </div>
      </div>

      <div className="mt-3 border-t border-gray-300" />

      {/* Personal Information */}
      {hasPersonalInfo && (
        <>
          <SectionHeading>Personal Information</SectionHeading>
          <div className="flex flex-wrap gap-x-6 text-sm text-gray-600">
            {resume.nationality && (
              <span>
                <span className="font-medium text-gray-700">Nationality:</span>{" "}
                {resume.nationality}
              </span>
            )}
            {resume.dateOfBirth && (
              <span>
                <span className="font-medium text-gray-700">
                  Date of Birth:
                </span>{" "}
                {formatFullDate(resume.dateOfBirth)}
              </span>
            )}
            {resume.gender && (
              <span>
                <span className="font-medium text-gray-700">Gender:</span>{" "}
                {resume.gender}
              </span>
            )}
          </div>
        </>
      )}

      {/* Work Experience */}
      {resume.experiences.length > 0 && (
        <>
          <SectionHeading>Work Experience</SectionHeading>
          <div className="space-y-5">
            {resume.experiences.map((exp, i) => (
              <div key={i}>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-sm font-bold text-gray-800">
                    {exp.companyName}
                  </h3>
                  <span className="shrink-0 text-xs text-gray-500">
                    {formatDate(exp.startDate)} - {formatDate(exp.endDate)}
                  </span>
                </div>
                {exp.employmentType && (
                  <p className="text-xs italic text-gray-500">
                    {exp.employmentType}
                  </p>
                )}

                {exp.projects.length > 0 && (
                  <div className="mt-2 space-y-3 pl-3">
                    {exp.projects.map((proj, j) => (
                      <div key={j}>
                        <p className="text-sm font-semibold text-gray-700">
                          {proj.projectName}
                        </p>
                        {(resume.languageMode === "EN" ||
                          resume.languageMode === "BOTH") &&
                          proj.descriptionEn && (
                            <p className="mt-0.5 text-xs text-gray-600">
                              {resume.languageMode === "BOTH" && (
                                <span className="font-medium text-gray-500">
                                  [EN]{" "}
                                </span>
                              )}
                              {proj.descriptionEn}
                            </p>
                          )}
                        {(resume.languageMode === "JP" ||
                          resume.languageMode === "BOTH") &&
                          proj.descriptionJp && (
                            <p className="mt-0.5 text-xs text-gray-600">
                              {resume.languageMode === "BOTH" && (
                                <span className="font-medium text-gray-500">
                                  [JP]{" "}
                                </span>
                              )}
                              {proj.descriptionJp}
                            </p>
                          )}
                        {proj.technologies.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {proj.technologies.map((tech, k) => (
                              <span
                                key={k}
                                className="rounded bg-blue-50 px-1.5 py-0.5 text-[10px] font-medium text-blue-700"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* Education */}
      {resume.educations.length > 0 && (
        <>
          <SectionHeading>Education</SectionHeading>
          <div className="space-y-3">
            {resume.educations.map((edu, i) => (
              <div key={i}>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-sm font-bold text-gray-800">
                    {edu.schoolName}
                  </h3>
                  <span className="shrink-0 text-xs text-gray-500">
                    {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                  </span>
                </div>
                <div className="flex gap-x-4 text-xs text-gray-600">
                  {edu.major && <span>{edu.major}</span>}
                  {edu.status && <span>{edu.status}</span>}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Skills */}
      {resume.skills.length > 0 && (
        <>
          <SectionHeading>Skills</SectionHeading>
          <div className="space-y-2">
            {Array.from(skillsByCategory.entries()).map(
              ([category, skills]) => (
                <div key={category}>
                  <span className="text-sm font-bold text-gray-800">
                    {category}:
                  </span>{" "}
                  <span className="text-xs text-gray-600">
                    {skills
                      .map((s) => (s.level ? `${s.name} (${s.level})` : s.name))
                      .join(", ")}
                  </span>
                </div>
              )
            )}
          </div>
        </>
      )}

      {/* Certifications */}
      {resume.certifications.length > 0 && (
        <>
          <SectionHeading>Certifications</SectionHeading>
          <div className="space-y-1">
            {resume.certifications.map((cert, i) => (
              <div key={i} className="flex items-baseline justify-between">
                <span className="text-sm text-gray-700">{cert.name}</span>
                <span className="text-xs text-gray-500">
                  {formatDate(cert.date)}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
