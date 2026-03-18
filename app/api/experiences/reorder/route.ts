import { requireAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string().min(1),
      sortOrder: z.number().int(),
    })
  ),
});

export async function PATCH(req: Request) {
  try {
    const session = await requireAuth();
    const userId = (session.user as any).id as string;

    const body = await req.json();
    const result = reorderSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { items } = result.data;

    // Verify all experiences belong to the user
    const experiences = await prisma.resumeExperience.findMany({
      where: { id: { in: items.map((i) => i.id) } },
      include: { resume: { select: { userId: true, deletedAt: true } } },
    });

    if (experiences.length !== items.length) {
      return Response.json({ error: "Some experiences not found" }, { status: 404 });
    }

    const unauthorized = experiences.some(
      (exp: { resume: { userId: string; deletedAt: Date | null } }) => exp.resume.userId !== userId || exp.resume.deletedAt
    );
    if (unauthorized) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    // Update all sort orders in a transaction
    await prisma.$transaction(
      items.map((item) =>
        prisma.resumeExperience.update({
          where: { id: item.id },
          data: { sortOrder: item.sortOrder },
        })
      )
    );

    return Response.json({ message: "Reorder successful" });
  } catch (error) {
    if (error instanceof Response) throw error;
    return Response.json({ error: "Failed to reorder experiences" }, { status: 500 });
  }
}
