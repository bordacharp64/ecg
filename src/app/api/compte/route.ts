import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { closeAllSessions, closeSession, currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { downloads, users } from "@/lib/db/schema";

/**
 * Droit d'acces (RGPD art. 15) : renvoie l'integralite des donnees
 * du compte au format JSON.
 */
export async function GET() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ message: "Non authentifié." }, { status: 401 });
  }

  const history = await db
    .select({ bookSlug: downloads.bookSlug, createdAt: downloads.createdAt })
    .from(downloads)
    .where(eq(downloads.userId, user.id));

  const payload = {
    exporteLe: new Date().toISOString(),
    compte: {
      email: user.email,
      prenom: user.firstName,
      nom: user.lastName,
      profil: user.profile,
      etablissement: user.institution,
      pays: user.country,
      anneeEtudes: user.studyYear,
      inscritLe: user.createdAt,
      adresseConfirmeeLe: user.emailVerifiedAt,
      consentementConfidentialiteLe: user.privacyAcceptedAt,
      informationsFormation: user.newsletterOptIn,
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
 * Droit a l'effacement (RGPD art. 17). La suppression est definitive :
 * la cascade sur les cles etrangeres emporte les sessions, les jetons de
 * connexion et l'historique de telechargement.
 */
export async function DELETE() {
  const user = await currentUser();
  if (!user) {
    return NextResponse.json({ message: "Non authentifié." }, { status: 401 });
  }

  await closeAllSessions(user.id);
  await db.delete(users).where(eq(users.id, user.id));
  await closeSession();

  return NextResponse.json({ ok: true });
}
