import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/lib/db";
import { downloads, readers } from "@/lib/db/schema";
import { currentReader, forgetReader } from "@/lib/lecteur";

/**
 * Droit d'acces et de portabilite (RGPD art. 15 et 20) : renvoie l'intégralité
 * des donnees du lecteur, dans un format lisible et reutilisable.
 */
export async function GET() {
  const reader = await currentReader();
  if (!reader) {
    return NextResponse.json(
      { message: "Aucune donnée enregistrée sur cet appareil." },
      { status: 404 },
    );
  }

  const history = await db
    .select({
      bookSlug: downloads.bookSlug,
      bookLanguage: downloads.bookLanguage,
      createdAt: downloads.createdAt,
    })
    .from(downloads)
    .where(eq(downloads.readerId, reader.id));

  const payload = {
    exporteLe: new Date().toISOString(),
    lecteur: {
      email: reader.email,
      prenom: reader.firstName,
      nom: reader.lastName,
      pays: reader.country,
      statut: reader.status,
      faculte: reader.university,
      langue: reader.language,
      premierTelechargementLe: reader.createdAt,
      dernierPassageLe: reader.lastSeenAt,
      consentementConfidentialiteLe: reader.privacyAcceptedAt,
      annoncesDeParution: reader.newsletterOptIn,
    },
    telechargements: history,
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition":
        'attachment; filename="mes-donnees-bibliotheque-ecg.json"',
      "Cache-Control": "private, no-store",
    },
  });
}

/**
 * Droit a l'effacement (RGPD art. 17). Definitif : la cascade sur les cles
 * etrangeres emporte l'historique de telechargement.
 */
export async function DELETE() {
  const reader = await currentReader();
  if (!reader) {
    return NextResponse.json(
      { message: "Aucune donnée enregistrée sur cet appareil." },
      { status: 404 },
    );
  }

  await db.delete(readers).where(eq(readers.id, reader.id));
  await forgetReader();

  return NextResponse.json({ ok: true });
}
