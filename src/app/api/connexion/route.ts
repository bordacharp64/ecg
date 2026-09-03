import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { createLoginToken, normalizeEmail } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { sendLoginLink } from "@/lib/mailer";
import { rateLimit } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const formData = await request.formData();
  const parsed = loginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Cette adresse e-mail n'est pas valide." },
      { status: 422 },
    );
  }

  const email = normalizeEmail(parsed.data.email);

  const perEmail = rateLimit({
    key: `connexion:${email}`,
    limit: 5,
    windowMs: 15 * 60_000,
  });
  const global = rateLimit({
    key: "connexion:global",
    limit: 100,
    windowMs: 10 * 60_000,
  });

  if (!perEmail.allowed || !global.allowed) {
    return NextResponse.json(
      {
        message:
          "Trop de demandes en peu de temps. Patientez quelques minutes avant de réessayer.",
      },
      { status: 429 },
    );
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (user) {
    const token = await createLoginToken(user.id);
    const base = (process.env.APP_URL ?? "http://localhost:3000").replace(
      /\/$/,
      "",
    );

    await sendLoginLink({
      to: user.email,
      firstName: user.firstName,
      url: `${base}/auth/verifier?token=${encodeURIComponent(token)}`,
      isNewAccount: false,
    });
  }

  // Reponse identique que le compte existe ou non : on n'offre pas au visiteur
  // un moyen de tester si une adresse est inscrite (enumeration de comptes).
  return NextResponse.json({ ok: true, email });
}
