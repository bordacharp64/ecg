import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import {
  createLoginToken,
  isEmailDomainAllowed,
  normalizeEmail,
} from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { sendLoginLink } from "@/lib/mailer";
import { rateLimit } from "@/lib/rate-limit";
import { fieldErrors, registrationSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const formData = await request.formData();
  const parsed = registrationSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!parsed.success) {
    return NextResponse.json(
      { errors: fieldErrors(parsed.error) },
      { status: 422 },
    );
  }

  const data = parsed.data;
  const email = normalizeEmail(data.email);

  if (!isEmailDomainAllowed(email)) {
    return NextResponse.json(
      {
        errors: {
          email:
            "Les inscriptions sont réservées aux adresses e-mail institutionnelles. Utilisez votre adresse universitaire.",
        },
      },
      { status: 422 },
    );
  }

  // Deux garde-fous : par adresse (evite le renvoi en boucle) et globalement
  // (evite qu'un script ne se serve du site pour expedier des e-mails).
  const perEmail = rateLimit({
    key: `inscription:${email}`,
    limit: 3,
    windowMs: 15 * 60_000,
  });
  const global = rateLimit({
    key: "inscription:global",
    limit: 60,
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

  const now = new Date();

  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  let user = existing;
  let isNewAccount = true;

  if (existing) {
    // Compte deja connu : on ne divulgue pas son existence, on met a jour la
    // fiche declarative et on envoie un lien de connexion classique.
    isNewAccount = false;
    const [updated] = await db
      .update(users)
      .set({
        firstName: data.firstName,
        lastName: data.lastName,
        profile: data.profile,
        institution: data.institution,
        country: data.country,
        studyYear: data.studyYear,
        newsletterOptIn: data.newsletterOptIn,
        privacyAcceptedAt: now,
      })
      .where(eq(users.id, existing.id))
      .returning();
    user = updated;
  } else {
    const [created] = await db
      .insert(users)
      .values({
        email,
        firstName: data.firstName,
        lastName: data.lastName,
        profile: data.profile,
        institution: data.institution,
        country: data.country,
        studyYear: data.studyYear,
        newsletterOptIn: data.newsletterOptIn,
        privacyAcceptedAt: now,
      })
      .returning();
    user = created;
  }

  if (!user) {
    return NextResponse.json(
      { message: "L'inscription n'a pas pu être enregistrée. Réessayez." },
      { status: 500 },
    );
  }

  const token = await createLoginToken(user.id);
  const base = (process.env.APP_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  );

  await sendLoginLink({
    to: user.email,
    firstName: user.firstName,
    url: `${base}/auth/verifier?token=${encodeURIComponent(token)}`,
    isNewAccount,
  });

  return NextResponse.json({ ok: true, email: user.email });
}
