import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getBook } from "#content/livres.ts";
import { db } from "@/lib/db";
import { readers } from "@/lib/db/schema";
import { normalizeEmail, rememberReader } from "@/lib/lecteur";
import { rateLimit } from "@/lib/rate-limit";
import { fieldErrors, identificationSchema } from "@/lib/validation";

/**
 * Enregistre la fiche d'identification et ouvre le droit au telechargement.
 *
 * Une adresse deja connue met sa fiche a jour plutot que d'echouer : un
 * etudiant qui change de faculte ou d'appareil ne doit pas se heurter a un
 * « cette adresse est deja utilisee » sur un site de telechargement gratuit.
 */
export async function POST(request: Request) {
  const formData = await request.formData();
  const parsed = identificationSchema.safeParse(
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

  const perEmail = rateLimit({
    key: `identification:${email}`,
    limit: 10,
    windowMs: 15 * 60_000,
  });
  const global = rateLimit({
    key: "identification:global",
    limit: 200,
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

  // L'ouvrage demande n'est pas obligatoire, mais s'il est fourni on verifie
  // qu'il existe : cela evite de renvoyer le visiteur vers une URL morte.
  const requestedSlug = String(formData.get("book") ?? "").trim();
  const book = requestedSlug ? getBook(requestedSlug) : undefined;
  if (requestedSlug && (!book || !book.published)) {
    return NextResponse.json(
      { message: "Cet ouvrage n'est pas disponible." },
      { status: 404 },
    );
  }

  const now = new Date();
  const values = {
    email,
    firstName: data.firstName,
    lastName: data.lastName,
    country: data.country,
    status: data.status,
    university: data.resolvedUniversity,
    language: data.language,
    newsletterOptIn: data.newsletterOptIn,
    privacyAcceptedAt: now,
    lastSeenAt: now,
  };

  const [reader] = await db
    .insert(readers)
    .values(values)
    .onConflictDoUpdate({ target: readers.email, set: values })
    .returning();

  if (!reader) {
    return NextResponse.json(
      { message: "Votre fiche n'a pas pu être enregistrée. Réessayez." },
      { status: 500 },
    );
  }

  await rememberReader(reader.id);

  return NextResponse.json({
    ok: true,
    downloadUrl: book ? `/api/telechargement/${book.slug}` : null,
  });
}

/** Indique au formulaire si l'appareil est deja identifie. */
export async function GET() {
  const { currentReader } = await import("@/lib/lecteur");
  const reader = await currentReader().catch(() => null);

  return NextResponse.json({
    identified: Boolean(reader),
    firstName: reader?.firstName ?? null,
  });
}
