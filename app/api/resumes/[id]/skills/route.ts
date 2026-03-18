import { requireAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createSkillSchema = z.object({
  category: z.string().min(1, "Category is required"),
  name: z.string().min(1, "Name is required"),
  level: z.string().optional().nullable(),
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

    const skills = await prisma.resumeSkill.findMany({
      where: { resumeId },
      orderBy: { sortOrder: "asc" },
    });

    return Response.json(skills);
  } catch (error) {
    if (error instanceof Response) throw error;
    return Response.json({ error: "Failed to fetch skills" }, { status: 500 });
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
    const result = createSkillSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const skill = await prisma.resumeSkill.create({
      data: { ...result.data, resumeId },
    });

    return Response.json(skill, { status: 201 });
  } catch (error) {
    if (error instanceof Response) throw error;
    return Response.json({ error: "Failed to create skill" }, { status: 500 });
  }
}
