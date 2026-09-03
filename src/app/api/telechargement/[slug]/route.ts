import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getBook } from "#content/livres.ts";
import { db } from "@/lib/db";
import { downloads, readers } from "@/lib/db/schema";
import { currentReader } from "@/lib/lecteur";
import { rateLimit } from "@/lib/rate-limit";
import { openBookFile } from "@/lib/storage";

function appUrl(): string {
  return (process.env.APP_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

/**
 * Unique porte d'entree vers les PDF complets. Les fichiers ne sont jamais
 * servis comme ressources statiques : ils vivent hors du dossier public, et
 * chaque telechargement passe ici, ou la fiche d'identification est verifiee
 * puis le telechargement journalise.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const book = getBook(slug);
  if (!book || !book.published) {
    return NextResponse.json(
      { message: "Cet ouvrage n'est pas disponible." },
      { status: 404 },
    );
  }

  const reader = await currentReader();
  if (!reader) {
    // Pas encore identifie : on renvoie vers la fiche, en gardant l'ouvrage
    // demande pour enchainer sur le telechargement une fois remplie.
    return NextResponse.redirect(
      new URL(`/ouvrages/${book.slug}/telecharger`, appUrl()),
      { status: 303 },
    );
  }

  // Garde-fou contre l'aspiration automatisee de la bibliotheque.
  const limit = rateLimit({
    key: `telechargement:${reader.id}`,
    limit: 40,
    windowMs: 60 * 60_000,
  });
  if (!limit.allowed) {
    return NextResponse.json(
      {
        message:
          "Trop de téléchargements en peu de temps. Réessayez dans un moment.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }

  let file;
  try {
    file = await openBookFile(book.fileName);
  } catch (error) {
    console.error("Téléchargement impossible :", error);
    return NextResponse.json(
      {
        message:
          "Le fichier est momentanément indisponible. Merci de réessayer plus tard.",
      },
      { status: 503 },
    );
  }

  // Journalisation apres ouverture reussie du fichier, pour ne pas compter des
  // telechargements qui n'ont pas eu lieu. Un echec d'ecriture ne doit jamais
  // priver l'etudiant de son livre.
  await Promise.all([
    db
      .insert(downloads)
      .values({
        readerId: reader.id,
        bookSlug: book.slug,
        bookLanguage: book.language,
      })
      .catch((error) =>
        console.error("Journalisation du téléchargement impossible :", error),
      ),
    db
      .update(readers)
      .set({ lastSeenAt: new Date() })
      .where(eq(readers.id, reader.id))
      .catch(() => undefined),
  ]);

  const headers = new Headers({
    "Content-Type": "application/pdf",
    // `attachment` force l'enregistrement : c'est ce qui permet d'ouvrir
    // ensuite le fichier dans un lecteur PDF complet, seul capable d'afficher
    // les fonctions interactives.
    "Content-Disposition": `attachment; filename="${book.slug}.pdf"; filename*=UTF-8''${encodeURIComponent(book.fileName)}`,
    "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff",
  });

  if (file.size !== null) headers.set("Content-Length", String(file.size));

  return new NextResponse(file.stream, { status: 200, headers });
}
