import { requireAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const updateResumeSchema = z.object({
  title: z.string().min(1).optional(),
  status: z.enum(["DRAFT", "FINAL"]).optional(),
  languageMode: z.enum(["EN", "JP", "BOTH"]).optional(),
  fullName: z.string().min(1).optional(),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  nationality: z.string().optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const userId = (session.user as any).id as string;
    const { id } = await params;

    const resume = await prisma.resume.findUnique({
      where: { id, deletedAt: null },
      include: {
        experiences: {
          orderBy: { sortOrder: "asc" },
          include: {
            projects: { orderBy: { sortOrder: "asc" } },
          },
        },
        skills: { orderBy: { sortOrder: "asc" } },
        certifications: { orderBy: { sortOrder: "asc" } },
        educations: { orderBy: { sortOrder: "asc" } },
      },
    });

    if (!resume) {
      return Response.json({ error: "Resume not found" }, { status: 404 });
    }

    if (resume.userId !== userId) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    return Response.json(resume);
  } catch (error) {
    if (error instanceof Response) throw error;
    return Response.json({ error: "Failed to fetch resume" }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireAuth();
    const userId = (session.user as any).id as string;
    const { id } = await params;

    const existing = await prisma.resume.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) {
      return Response.json({ error: "Resume not found" }, { status: 404 });
    }
    if (existing.userId !== userId) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const result = updateResumeSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { dateOfBirth, ...rest } = result.data;

    const resume = await prisma.resume.update({
      where: { id },
      data: {
        ...rest,
        ...(dateOfBirth !== undefined
          ? { dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null }
          : {}),
      },
    });

    return Response.json(resume);
  } catch (error) {
    if (error instanceof Response) throw error;
    return Response.json({ error: "Failed to update resume" }, { status: 500 });
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

    const existing = await prisma.resume.findUnique({ where: { id } });
    if (!existing || existing.deletedAt) {
      return Response.json({ error: "Resume not found" }, { status: 404 });
    }
    if (existing.userId !== userId) {
      return Response.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.resume.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return Response.json({ message: "Resume deleted" });
  } catch (error) {
    if (error instanceof Response) throw error;
    return Response.json({ error: "Failed to delete resume" }, { status: 500 });
  }
}
