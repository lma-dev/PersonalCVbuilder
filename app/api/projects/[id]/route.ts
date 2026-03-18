import { requireAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateProjectSchema = z.object({
  projectName: z.string().min(1).optional(),
  descriptionEn: z.string().optional().nullable(),
  descriptionJp: z.string().optional().nullable(),
  technologies: z.array(z.string()).optional(),
  sortOrder: z.number().int().optional(),
});

async function verifyProjectOwnership(projectId: string, userId: string) {
  const project = await prisma.resumeProject.findUnique({
    where: { id: projectId },
    include: {
      experience: {
        include: { resume: { select: { userId: true, deletedAt: true } } },
      },
    },
  });

  if (!project || project.experience.resume.deletedAt) {
    return { error: "Project not found", status: 404 } as const;
  }
  if (project.experience.resume.userId !== userId) {
    return { error: "Forbidden", status: 403 } as const;
  }
  return { project } as const;
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const userId = (session.user as any).id as string;
    const { id } = await params;

    const ownership = await verifyProjectOwnership(id, userId);
    if ("error" in ownership) {
      return Response.json({ error: ownership.error }, { status: ownership.status });
    }

    const body = await req.json();
    const result = updateProjectSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { technologies, ...rest } = result.data;

    const project = await prisma.resumeProject.update({
      where: { id },
      data: {
        ...rest,
        ...(technologies !== undefined ? { technologies } : {}),
      },
    });

    return Response.json(project);
  } catch (error) {
    if (error instanceof Response) throw error;
    return Response.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const userId = (session.user as any).id as string;
    const { id } = await params;

    const ownership = await verifyProjectOwnership(id, userId);
    if ("error" in ownership) {
      return Response.json({ error: ownership.error }, { status: ownership.status });
    }

    await prisma.resumeProject.delete({ where: { id } });

    return Response.json({ message: "Project deleted" });
  } catch (error) {
    if (error instanceof Response) throw error;
    return Response.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
