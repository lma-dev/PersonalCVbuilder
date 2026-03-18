import { requireAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createCertificationSchema = z.object({
  date: z.string().min(1, "Date is required"),
  name: z.string().min(1, "Name is required"),
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

    const certifications = await prisma.resumeCertification.findMany({
      where: { resumeId },
      orderBy: { sortOrder: "asc" },
    });

    return Response.json(certifications);
  } catch (error) {
    if (error instanceof Response) throw error;
    return Response.json({ error: "Failed to fetch certifications" }, { status: 500 });
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
    const result = createCertificationSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { date, ...rest } = result.data;

    const certification = await prisma.resumeCertification.create({
      data: {
        ...rest,
        resumeId,
        date: new Date(date),
      },
    });

    return Response.json(certification, { status: 201 });
  } catch (error) {
    if (error instanceof Response) throw error;
    return Response.json({ error: "Failed to create certification" }, { status: 500 });
  }
}
