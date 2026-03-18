import { requireAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createExperienceSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  employmentType: z.string().optional().nullable(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().optional().nullable(),
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

    const experiences = await prisma.resumeExperience.findMany({
      where: { resumeId },
      orderBy: { sortOrder: "asc" },
      include: {
        projects: { orderBy: { sortOrder: "asc" } },
      },
    });

    return Response.json(experiences);
  } catch (error) {
    if (error instanceof Response) throw error;
    return Response.json({ error: "Failed to fetch experiences" }, { status: 500 });
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
    const result = createExperienceSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { startDate, endDate, ...rest } = result.data;

    const experience = await prisma.resumeExperience.create({
      data: {
        ...rest,
        resumeId,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
      },
    });

    return Response.json(experience, { status: 201 });
  } catch (error) {
    if (error instanceof Response) throw error;
    return Response.json({ error: "Failed to create experience" }, { status: 500 });
  }
}
