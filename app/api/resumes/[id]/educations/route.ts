import { requireAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createEducationSchema = z.object({
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional().nullable(),
  schoolName: z.string().min(1, "School name is required"),
  major: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  sortOrder: z.number().int().optional(),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const userId = (session.user as any).id as string;
    const { id: resumeId } = await params;

    const resume = await prisma.resume.findUnique({ where: { id: resumeId } });
    if (!resume || resume.deletedAt) {
      return Response.json({ error: "Resume not found" }, { status: 404 });
    }
    if (resume.userId !== userId) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const educations = await prisma.resumeEducation.findMany({
      where: { resumeId },
      orderBy: { sortOrder: "asc" },
    });

    return Response.json(educations);
  } catch (error) {
    if (error instanceof Response) throw error;
    return Response.json({ error: "Failed to fetch educations" }, { status: 500 });
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const userId = (session.user as any).id as string;
    const { id: resumeId } = await params;

    const resume = await prisma.resume.findUnique({ where: { id: resumeId } });
    if (!resume || resume.deletedAt) {
      return Response.json({ error: "Resume not found" }, { status: 404 });
    }
    if (resume.userId !== userId) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const result = createEducationSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { startDate, endDate, ...rest } = result.data;

    const education = await prisma.resumeEducation.create({
      data: {
        ...rest,
        resumeId,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    return Response.json(education, { status: 201 });
  } catch (error) {
    if (error instanceof Response) throw error;
    return Response.json({ error: "Failed to create education" }, { status: 500 });
  }
}
