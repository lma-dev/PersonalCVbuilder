import { requireAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateExperienceSchema = z.object({
  companyName: z.string().min(1).optional(),
  employmentType: z.string().optional().nullable(),
  startDate: z.string().optional(),
  endDate: z.string().optional().nullable(),
  sortOrder: z.number().int().optional(),
});

async function verifyExperienceOwnership(experienceId: string, userId: string) {
  const experience = await prisma.resumeExperience.findUnique({
    where: { id: experienceId },
    include: { resume: { select: { userId: true, deletedAt: true } } },
  });

  if (!experience || experience.resume.deletedAt) {
    return { error: "Experience not found", status: 404 } as const;
  }
  if (experience.resume.userId !== userId) {
    return { error: "Forbidden", status: 403 } as const;
  }
  return { experience } as const;
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const userId = (session.user as any).id as string;
    const { id } = await params;

    const ownership = await verifyExperienceOwnership(id, userId);
    if ("error" in ownership) {
      return Response.json({ error: ownership.error }, { status: ownership.status });
    }

    const body = await req.json();
    const result = updateExperienceSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { startDate, endDate, ...rest } = result.data;

    const experience = await prisma.resumeExperience.update({
      where: { id },
      data: {
        ...rest,
        ...(startDate !== undefined ? { startDate: new Date(startDate) } : {}),
        ...(endDate !== undefined
          ? { endDate: endDate ? new Date(endDate) : null }
          : {}),
      },
    });

    return Response.json(experience);
  } catch (error) {
    if (error instanceof Response) throw error;
    return Response.json({ error: "Failed to update experience" }, { status: 500 });
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

    const ownership = await verifyExperienceOwnership(id, userId);
    if ("error" in ownership) {
      return Response.json({ error: ownership.error }, { status: ownership.status });
    }

    await prisma.resumeExperience.delete({ where: { id } });

    return Response.json({ message: "Experience deleted" });
  } catch (error) {
    if (error instanceof Response) throw error;
    return Response.json({ error: "Failed to delete experience" }, { status: 500 });
  }
}
