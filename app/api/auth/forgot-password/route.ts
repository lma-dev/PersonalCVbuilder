import { randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { sendMail, buildResetPasswordEmail } from "@/lib/email";

export async function POST(req: Request) {
  const { email } = (await req.json()) as { email?: string };

  if (!email) {
    return Response.json({ error: "Email is required" }, { status: 400 });
  }

  // Always return 200 to avoid user enumeration
  const user = await prisma.user.findUnique({ where: { email } });

  if (user) {
    // Invalidate any existing unused tokens for this user
    await prisma.passwordResetToken.updateMany({
      where: { userId: user.id, usedAt: null },
      data: { usedAt: new Date() },
    });

    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.passwordResetToken.create({
      data: { userId: user.id, token, expiresAt },
    });

    const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/auth/reset-password?token=${token}`;

    try {
      const { subject, html } = buildResetPasswordEmail(resetUrl);
      await sendMail({ to: email, subject, html });
    } catch (err) {
      console.error("Failed to send reset email:", err);
      return Response.json(
        { error: "Failed to send email. Please try again later." },
        { status: 500 }
      );
    }
  }

  return Response.json({
    message:
      "If an account exists for this email, a password reset link has been sent.",
  });
}
