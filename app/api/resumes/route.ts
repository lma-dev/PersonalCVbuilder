import { requireAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const createResumeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  status: z.enum(["DRAFT", "FINAL"]).optional(),
  languageMode: z.enum(["EN", "JP", "BOTH"]).optional(),
  fullName: z.string().min(1, "Full name is required"),
  email: z.string().email().optional().nullable(),
  phone: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  nationality: z.string().optional().nullable(),
  dateOfBirth: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
});

export async function GET() {
  try {
    const session = await requireAuth();
    const userId = (session.user as any).id as string;

    const resumes = await prisma.resume.findMany({
      where: { userId, deletedAt: null },
      orderBy: { updatedAt: "desc" },
    });

    return Response.json(resumes);
  } catch (error) {
    if (error instanceof Response) throw error;
    return Response.json({ error: "Failed to fetch resumes" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await requireAuth();
    const userId = (session.user as any).id as string;

    const body = await req.json();
    const result = createResumeSchema.safeParse(body);

    if (!result.success) {
      return Response.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { dateOfBirth, ...rest } = result.data;

    const resume = await prisma.resume.create({
      data: {
        ...rest,
        userId,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      },
    });

    return Response.json(resume, { status: 201 });
  } catch (error) {
    if (error instanceof Response) throw error;
    return Response.json({ error: "Failed to create resume" }, { status: 500 });
  }
}
