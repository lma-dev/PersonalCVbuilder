import { requireAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateCertificationSchema = z.object({
  date: z.string().optional(),
  name: z.string().min(1).optional(),
  sortOrder: z.number().int().optional(),
});

async function verifyCertificationOwnership(certId: string, userId: string) {
  const certification = await prisma.resumeCertification.findUnique({
    where: { id: certId },
    include: { resume: { select: { userId: true, deletedAt: true } } },
  });

  if (!certification || certification.resume.deletedAt) {
    return { error: "Certification not found", status: 404 } as const;
  }
  if (certification.resume.userId !== userId) {
    return { error: "Forbidden", status: 403 } as const;
  }
  return { certification } as const;
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const userId = (session.user as any).id as string;
    const { id } = await params;

    const ownership = await verifyCertificationOwnership(id, userId);
    if ("error" in ownership) {
      return Response.json({ error: ownership.error }, { status: ownership.status });
    }

    const body = await req.json();
    const result = updateCertificationSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { date, ...rest } = result.data;

    const certification = await prisma.resumeCertification.update({
      where: { id },
      data: {
        ...rest,
        ...(date !== undefined ? { date: new Date(date) } : {}),
      },
    });

    return Response.json(certification);
  } catch (error) {
    if (error instanceof Response) throw error;
    return Response.json({ error: "Failed to update certification" }, { status: 500 });
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

    const ownership = await verifyCertificationOwnership(id, userId);
    if ("error" in ownership) {
      return Response.json({ error: ownership.error }, { status: ownership.status });
    }

    await prisma.resumeCertification.delete({ where: { id } });

    return Response.json({ message: "Certification deleted" });
  } catch (error) {
    if (error instanceof Response) throw error;
    return Response.json({ error: "Failed to delete certification" }, { status: 500 });
  }
}
