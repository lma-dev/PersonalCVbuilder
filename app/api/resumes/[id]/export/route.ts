import { requireAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { generateResumePdf } from "@/features/resume/export/pdf";
import { generateResumeExcel } from "@/features/resume/export/excel";
import { generateResumeJson } from "@/features/resume/export/json";
import type { ResumeExport } from "@/features/resume/export/types";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const userId = (session.user as any).id as string;
    const { id } = await params;

    const url = new URL(req.url);
    const format = url.searchParams.get("format") ?? "pdf";

    if (!["pdf", "excel", "json"].includes(format)) {
      return Response.json(
        { error: "Invalid format. Use pdf, excel, or json." },
        { status: 400 }
      );
    }

    // Fetch full resume with all relations
    const resume = await prisma.resume.findUnique({
      where: { id, deletedAt: null },
      include: {
        educations: { orderBy: { sortOrder: "asc" } },
        experiences: {
          orderBy: { sortOrder: "asc" },
          include: {
            projects: { orderBy: { sortOrder: "asc" } },
          },
        },
        skills: { orderBy: { sortOrder: "asc" } },
        certifications: { orderBy: { sortOrder: "asc" } },
      },
    });

    if (!resume) {
      return Response.json({ error: "Resume not found" }, { status: 404 });
    }

    if (resume.userId !== userId) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    // Transform to ResumeExport shape
    const exportData: ResumeExport = {
      title: resume.title,
      status: resume.status,
      languageMode: resume.languageMode,
      fullName: resume.fullName,
      email: resume.email,
      phone: resume.phone,
      address: resume.address,
      nationality: resume.nationality,
      dateOfBirth: resume.dateOfBirth,
      gender: resume.gender,
      educations: resume.educations.map((edu: any) => ({
        schoolName: edu.schoolName,
        major: edu.major,
        status: edu.status,
        startDate: edu.startDate,
        endDate: edu.endDate,
      })),
      experiences: resume.experiences.map((exp: any) => ({
        companyName: exp.companyName,
        employmentType: exp.employmentType,
        startDate: exp.startDate,
        endDate: exp.endDate,
        projects: exp.projects.map((proj: any) => ({
          projectName: proj.projectName,
          descriptionEn: proj.descriptionEn,
          descriptionJp: proj.descriptionJp,
          technologies: Array.isArray(proj.technologies)
            ? (proj.technologies as string[])
            : [],
        })),
      })),
      skills: resume.skills.map((skill: any) => ({
        category: skill.category,
        name: skill.name,
        level: skill.level,
      })),
      certifications: resume.certifications.map((cert: any) => ({
        name: cert.name,
        date: cert.date,
      })),
    };

    const safeName = resume.fullName.replace(/[^a-zA-Z0-9_-]/g, "_");

    if (format === "pdf") {
      const buffer = await generateResumePdf(exportData);
      return new Response(new Uint8Array(buffer), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${safeName}_Resume.pdf"`,
        },
      });
    }

    if (format === "excel") {
      const buffer = await generateResumeExcel(exportData);
      return new Response(new Uint8Array(buffer), {
        headers: {
          "Content-Type":
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          "Content-Disposition": `attachment; filename="${safeName}_Resume.xlsx"`,
        },
      });
    }

    // JSON
    const jsonStr = generateResumeJson(exportData);
    return new Response(jsonStr, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${safeName}_Resume.json"`,
      },
    });
  } catch (error) {
    if (error instanceof Response) throw error;
    console.error("Export error:", error);
    return Response.json(
      { error: "Failed to generate export" },
      { status: 500 }
    );
  }
}
