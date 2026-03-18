import { requireAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateSkillSchema = z.object({
  category: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  level: z.string().optional().nullable(),
  sortOrder: z.number().int().optional(),
});

async function verifySkillOwnership(skillId: string, userId: string) {
  const skill = await prisma.resumeSkill.findUnique({
    where: { id: skillId },
    include: { resume: { select: { userId: true, deletedAt: true } } },
  });

  if (!skill || skill.resume.deletedAt) {
    return { error: "Skill not found", status: 404 } as const;
  }
  if (skill.resume.userId !== userId) {
    return { error: "Forbidden", status: 403 } as const;
  }
  return { skill } as const;
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const userId = (session.user as any).id as string;
    const { id } = await params;

    const ownership = await verifySkillOwnership(id, userId);
    if ("error" in ownership) {
      return Response.json({ error: ownership.error }, { status: ownership.status });
    }

    const body = await req.json();
    const result = updateSkillSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const skill = await prisma.resumeSkill.update({
      where: { id },
      data: result.data,
    });

    return Response.json(skill);
  } catch (error) {
    if (error instanceof Response) throw error;
    return Response.json({ error: "Failed to update skill" }, { status: 500 });
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

    const ownership = await verifySkillOwnership(id, userId);
    if ("error" in ownership) {
      return Response.json({ error: ownership.error }, { status: ownership.status });
    }

    await prisma.resumeSkill.delete({ where: { id } });

    return Response.json({ message: "Skill deleted" });
  } catch (error) {
    if (error instanceof Response) throw error;
    return Response.json({ error: "Failed to delete skill" }, { status: 500 });
  }
}
