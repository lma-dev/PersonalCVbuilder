import { requireAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createProjectSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  descriptionEn: z.string().optional().nullable(),
  descriptionJp: z.string().optional().nullable(),
  technologies: z.array(z.string()).optional(),
  sortOrder: z.number().int().optional(),
});

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const userId = (session.user as any).id as string;
    const { id: experienceId } = await params;

    const experience = await prisma.resumeExperience.findUnique({
      where: { id: experienceId },
      include: { resume: { select: { userId: true, deletedAt: true } } },
    });

    if (!experience || experience.resume.deletedAt) {
      return Response.json({ error: "Experience not found" }, { status: 404 });
    }
    if (experience.resume.userId !== userId) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const result = createProjectSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { technologies, ...rest } = result.data;

    const project = await prisma.resumeProject.create({
      data: {
        ...rest,
        experienceId,
        technologies: technologies ?? [],
      },
    });

    return Response.json(project, { status: 201 });
  } catch (error) {
    if (error instanceof Response) throw error;
    return Response.json({ error: "Failed to create project" }, { status: 500 });
  }
}
