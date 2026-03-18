import PDFDocument from "pdfkit";
import type { ResumeExport } from "./types";

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

const COLORS = {
  primary: "#1a1a2e" as const,
  secondary: "#4a4a6a" as const,
  accent: "#2563eb" as const,
  muted: "#6b7280" as const,
  border: "#d1d5db" as const,
  light: "#f3f4f6" as const,
};

const MARGIN = { left: 50, right: 50, top: 50, bottom: 50 };
const PAGE_WIDTH = 595.28; // A4
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN.left - MARGIN.right;

export async function generateResumePdf(
  resume: ResumeExport
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];

    const doc = new PDFDocument({
      size: "A4",
      margins: MARGIN,
      info: {
        Title: `${resume.fullName} - Resume`,
        Author: resume.fullName,
      },
    });

    doc.on("data", (chunk: Buffer) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    let y = MARGIN.top;

    // --- Helper: check for page break ---
    function ensureSpace(needed: number) {
      if (y + needed > 841.89 - MARGIN.bottom) {
        doc.addPage();
        y = MARGIN.top;
      }
    }

    // --- Helper: draw section heading ---
    function sectionHeading(title: string) {
      ensureSpace(40);
      y += 16;
      doc
        .fontSize(13)
        .font("Helvetica-Bold")
        .fillColor(COLORS.primary)
        .text(title.toUpperCase(), MARGIN.left, y);
      y += 18;
      doc
        .moveTo(MARGIN.left, y)
        .lineTo(MARGIN.left + CONTENT_WIDTH, y)
        .strokeColor(COLORS.accent)
        .lineWidth(1.5)
        .stroke();
      y += 10;
    }

    // --- Helper: draw text and advance y ---
    function drawText(
      text: string,
      options: {
        fontSize?: number;
        font?: string;
        color?: string;
        x?: number;
        width?: number;
        align?: "left" | "center" | "right";
      } = {}
    ) {
      const {
        fontSize = 10,
        font = "Helvetica",
        color = COLORS.secondary,
        x = MARGIN.left,
        width = CONTENT_WIDTH,
        align = "left",
      } = options;
      doc.fontSize(fontSize).font(font).fillColor(color);
      const height = doc.heightOfString(text, { width, align });
      ensureSpace(height + 4);
      doc.text(text, x, y, { width, align });
      y += height + 2;
    }

    // ========== HEADER ==========
    doc
      .fontSize(26)
      .font("Helvetica-Bold")
      .fillColor(COLORS.primary)
      .text(resume.fullName, MARGIN.left, y, {
        width: CONTENT_WIDTH,
        align: "center",
      });
    y += 34;

    // Contact info row
    const contactParts: string[] = [];
    if (resume.email) contactParts.push(resume.email);
    if (resume.phone) contactParts.push(resume.phone);
    if (resume.address) contactParts.push(resume.address);

    if (contactParts.length > 0) {
      doc
        .fontSize(9)
        .font("Helvetica")
        .fillColor(COLORS.muted)
        .text(contactParts.join("  |  "), MARGIN.left, y, {
          width: CONTENT_WIDTH,
          align: "center",
        });
      y += 16;
    }

    // Divider
    doc
      .moveTo(MARGIN.left, y)
      .lineTo(MARGIN.left + CONTENT_WIDTH, y)
      .strokeColor(COLORS.border)
      .lineWidth(0.5)
      .stroke();
    y += 6;

    // ========== PERSONAL INFORMATION ==========
    const hasPersonalInfo =
      resume.nationality || resume.dateOfBirth || resume.gender;
    if (hasPersonalInfo) {
      sectionHeading("Personal Information");

      const personalItems: string[] = [];
      if (resume.nationality)
        personalItems.push(`Nationality: ${resume.nationality}`);
      if (resume.dateOfBirth)
        personalItems.push(
          `Date of Birth: ${formatFullDate(resume.dateOfBirth)}`
        );
      if (resume.gender) personalItems.push(`Gender: ${resume.gender}`);

      drawText(personalItems.join("    |    "), {
        fontSize: 10,
        color: COLORS.secondary,
      });
    }

    // ========== WORK EXPERIENCE ==========
    if (resume.experiences.length > 0) {
      sectionHeading("Work Experience");

      for (const exp of resume.experiences) {
        ensureSpace(50);

        // Company name and dates
        const dateRange = `${formatDate(exp.startDate)} - ${formatDate(exp.endDate)}`;
        doc
          .fontSize(11)
          .font("Helvetica-Bold")
          .fillColor(COLORS.primary)
          .text(exp.companyName, MARGIN.left, y, {
            width: CONTENT_WIDTH * 0.65,
            continued: false,
          });

        doc
          .fontSize(9)
          .font("Helvetica")
          .fillColor(COLORS.muted)
          .text(dateRange, MARGIN.left + CONTENT_WIDTH * 0.65, y, {
            width: CONTENT_WIDTH * 0.35,
            align: "right",
          });
        y += 16;

        if (exp.employmentType) {
          drawText(exp.employmentType, {
            fontSize: 9,
            font: "Helvetica-Oblique",
            color: COLORS.muted,
          });
        }

        // Projects
        for (const project of exp.projects) {
          ensureSpace(30);
          y += 4;

          drawText(project.projectName, {
            fontSize: 10,
            font: "Helvetica-Bold",
            color: COLORS.secondary,
            x: MARGIN.left + 10,
            width: CONTENT_WIDTH - 10,
          });

          const isBoth = resume.languageMode === "BOTH";

          if (
            resume.languageMode === "EN" ||
            resume.languageMode === "BOTH"
          ) {
            if (project.descriptionEn) {
              const label = isBoth ? "[EN] " : "";
              drawText(`${label}${project.descriptionEn}`, {
                fontSize: 9,
                color: COLORS.secondary,
                x: MARGIN.left + 10,
                width: CONTENT_WIDTH - 10,
              });
            }
          }

          if (
            resume.languageMode === "JP" ||
            resume.languageMode === "BOTH"
          ) {
            if (project.descriptionJp) {
              const label = isBoth ? "[JP] " : "";
              drawText(`${label}${project.descriptionJp}`, {
                fontSize: 9,
                color: COLORS.secondary,
                x: MARGIN.left + 10,
                width: CONTENT_WIDTH - 10,
              });
            }
          }

          // Technologies
          if (project.technologies.length > 0) {
            y += 2;
            drawText(`Technologies: ${project.technologies.join(", ")}`, {
              fontSize: 8,
              font: "Helvetica-Oblique",
              color: COLORS.accent,
              x: MARGIN.left + 10,
              width: CONTENT_WIDTH - 10,
            });
          }
        }

        y += 8;
      }
    }

    // ========== EDUCATION ==========
    if (resume.educations.length > 0) {
      sectionHeading("Education");

      for (const edu of resume.educations) {
        ensureSpace(40);

        const dateRange = `${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}`;

        doc
          .fontSize(11)
          .font("Helvetica-Bold")
          .fillColor(COLORS.primary)
          .text(edu.schoolName, MARGIN.left, y, {
            width: CONTENT_WIDTH * 0.65,
          });

        doc
          .fontSize(9)
          .font("Helvetica")
          .fillColor(COLORS.muted)
          .text(dateRange, MARGIN.left + CONTENT_WIDTH * 0.65, y, {
            width: CONTENT_WIDTH * 0.35,
            align: "right",
          });
        y += 16;

        const details: string[] = [];
        if (edu.major) details.push(edu.major);
        if (edu.status) details.push(edu.status);
        if (details.length > 0) {
          drawText(details.join("  |  "), {
            fontSize: 9,
            color: COLORS.secondary,
          });
        }

        y += 6;
      }
    }

    // ========== SKILLS ==========
    if (resume.skills.length > 0) {
      sectionHeading("Skills");

      // Group by category
      const grouped = new Map<
        string,
        Array<{ name: string; level: string | null }>
      >();
      for (const skill of resume.skills) {
        if (!grouped.has(skill.category)) {
          grouped.set(skill.category, []);
        }
        grouped.get(skill.category)!.push({
          name: skill.name,
          level: skill.level,
        });
      }

      for (const [category, skills] of grouped) {
        ensureSpace(24);
        doc
          .fontSize(10)
          .font("Helvetica-Bold")
          .fillColor(COLORS.primary)
          .text(`${category}:`, MARGIN.left, y, { continued: false });
        y += 14;

        const skillTexts = skills.map((s) =>
          s.level ? `${s.name} (${s.level})` : s.name
        );
        drawText(skillTexts.join(",  "), {
          fontSize: 9,
          color: COLORS.secondary,
          x: MARGIN.left + 10,
          width: CONTENT_WIDTH - 10,
        });
        y += 4;
      }
    }

    // ========== CERTIFICATIONS ==========
    if (resume.certifications.length > 0) {
      sectionHeading("Certifications");

      for (const cert of resume.certifications) {
        ensureSpace(20);
        const dateStr = formatDate(cert.date);
        doc
          .fontSize(10)
          .font("Helvetica")
          .fillColor(COLORS.secondary)
          .text(cert.name, MARGIN.left, y, {
            width: CONTENT_WIDTH * 0.75,
          });
        doc
          .fontSize(9)
          .font("Helvetica")
          .fillColor(COLORS.muted)
          .text(dateStr, MARGIN.left + CONTENT_WIDTH * 0.75, y, {
            width: CONTENT_WIDTH * 0.25,
            align: "right",
          });
        y += 16;
      }
    }

    doc.end();
  });
}
