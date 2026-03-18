import { requireAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateEducationSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional().nullable(),
  schoolName: z.string().min(1).optional(),
  major: z.string().optional().nullable(),
  status: z.string().optional().nullable(),
  sortOrder: z.number().int().optional(),
});

async function verifyEducationOwnership(educationId: string, userId: string) {
  const education = await prisma.resumeEducation.findUnique({
    where: { id: educationId },
    include: { resume: { select: { userId: true, deletedAt: true } } },
  });

  if (!education || education.resume.deletedAt) {
    return { error: "Education not found", status: 404 } as const;
  }
  if (education.resume.userId !== userId) {
    return { error: "Forbidden", status: 403 } as const;
  }
  return { education } as const;
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const userId = (session.user as any).id as string;
    const { id } = await params;

    const ownership = await verifyEducationOwnership(id, userId);
    if ("error" in ownership) {
      return Response.json({ error: ownership.error }, { status: ownership.status });
    }

    const body = await req.json();
    const result = updateEducationSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { startDate, endDate, ...rest } = result.data;

    const education = await prisma.resumeEducation.update({
      where: { id },
      data: {
        ...rest,
        ...(startDate !== undefined ? { startDate: new Date(startDate) } : {}),
        ...(endDate !== undefined
          ? { endDate: endDate ? new Date(endDate) : null }
          : {}),
      },
    });

    return Response.json(education);
  } catch (error) {
    if (error instanceof Response) throw error;
    return Response.json({ error: "Failed to update education" }, { status: 500 });
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

    const ownership = await verifyEducationOwnership(id, userId);
    if ("error" in ownership) {
      return Response.json({ error: ownership.error }, { status: ownership.status });
    }

    await prisma.resumeEducation.delete({ where: { id } });

    return Response.json({ message: "Education deleted" });
  } catch (error) {
    if (error instanceof Response) throw error;
    return Response.json({ error: "Failed to delete education" }, { status: 500 });
  }
}
