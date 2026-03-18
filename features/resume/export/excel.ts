import ExcelJS from "exceljs";
import type { ResumeExport } from "./types";

function formatDate(date: Date | string | null | undefined): string {
  if (!date) return "";
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

const HEADER_FILL: ExcelJS.FillPattern = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FF2563EB" },
};

const HEADER_FONT: Partial<ExcelJS.Font> = {
  bold: true,
  color: { argb: "FFFFFFFF" },
  size: 11,
};

function styleHeaderRow(sheet: ExcelJS.Worksheet) {
  const row = sheet.getRow(1);
  row.eachCell((cell) => {
    cell.fill = HEADER_FILL;
    cell.font = HEADER_FONT;
    cell.alignment = { vertical: "middle", horizontal: "left" };
  });
  row.height = 24;
}

export async function generateResumeExcel(
  resume: ResumeExport
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = resume.fullName;
  workbook.created = new Date();

  // ========== Sheet 1: Personal Info ==========
  const personalSheet = workbook.addWorksheet("Personal Info");
  personalSheet.columns = [
    { header: "Field", key: "field", width: 20 },
    { header: "Value", key: "value", width: 50 },
  ];
  styleHeaderRow(personalSheet);

  const personalRows: Array<{ field: string; value: string }> = [
    { field: "Full Name", value: resume.fullName },
    { field: "Email", value: resume.email ?? "" },
    { field: "Phone", value: resume.phone ?? "" },
    { field: "Address", value: resume.address ?? "" },
    { field: "Nationality", value: resume.nationality ?? "" },
    { field: "Date of Birth", value: formatFullDate(resume.dateOfBirth) },
    { field: "Gender", value: resume.gender ?? "" },
    { field: "Status", value: resume.status },
    { field: "Language Mode", value: resume.languageMode },
    { field: "Title", value: resume.title },
  ];
  for (const row of personalRows) {
    personalSheet.addRow(row);
  }

  // ========== Sheet 2: Experience ==========
  const expSheet = workbook.addWorksheet("Experience");
  expSheet.columns = [
    { header: "Company", key: "company", width: 25 },
    { header: "Employment Type", key: "type", width: 18 },
    { header: "Start Date", key: "start", width: 14 },
    { header: "End Date", key: "end", width: 14 },
    { header: "Project", key: "project", width: 25 },
    { header: "Description (EN)", key: "descEn", width: 40 },
    { header: "Description (JP)", key: "descJp", width: 40 },
    { header: "Technologies", key: "tech", width: 35 },
  ];
  styleHeaderRow(expSheet);

  for (const exp of resume.experiences) {
    if (exp.projects.length === 0) {
      expSheet.addRow({
        company: exp.companyName,
        type: exp.employmentType ?? "",
        start: formatDate(exp.startDate),
        end: formatDate(exp.endDate),
        project: "",
        descEn: "",
        descJp: "",
        tech: "",
      });
    } else {
      for (const proj of exp.projects) {
        expSheet.addRow({
          company: exp.companyName,
          type: exp.employmentType ?? "",
          start: formatDate(exp.startDate),
          end: formatDate(exp.endDate),
          project: proj.projectName,
          descEn: proj.descriptionEn ?? "",
          descJp: proj.descriptionJp ?? "",
          tech: proj.technologies.join(", "),
        });
      }
    }
  }

  // ========== Sheet 3: Education ==========
  const eduSheet = workbook.addWorksheet("Education");
  eduSheet.columns = [
    { header: "School Name", key: "school", width: 30 },
    { header: "Major", key: "major", width: 25 },
    { header: "Status", key: "status", width: 18 },
    { header: "Start Date", key: "start", width: 14 },
    { header: "End Date", key: "end", width: 14 },
  ];
  styleHeaderRow(eduSheet);

  for (const edu of resume.educations) {
    eduSheet.addRow({
      school: edu.schoolName,
      major: edu.major ?? "",
      status: edu.status ?? "",
      start: formatDate(edu.startDate),
      end: formatDate(edu.endDate),
    });
  }

  // ========== Sheet 4: Skills ==========
  const skillSheet = workbook.addWorksheet("Skills");
  skillSheet.columns = [
    { header: "Category", key: "category", width: 20 },
    { header: "Skill Name", key: "name", width: 30 },
    { header: "Level", key: "level", width: 18 },
  ];
  styleHeaderRow(skillSheet);

  for (const skill of resume.skills) {
    skillSheet.addRow({
      category: skill.category,
      name: skill.name,
      level: skill.level ?? "",
    });
  }

  // ========== Sheet 5: Certifications ==========
  const certSheet = workbook.addWorksheet("Certifications");
  certSheet.columns = [
    { header: "Certification Name", key: "name", width: 40 },
    { header: "Date", key: "date", width: 18 },
  ];
  styleHeaderRow(certSheet);

  for (const cert of resume.certifications) {
    certSheet.addRow({
      name: cert.name,
      date: formatDate(cert.date),
    });
  }

  const arrayBuffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(arrayBuffer);
}
