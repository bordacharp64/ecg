import { NextResponse } from "next/server";

import { getBook } from "@/../content/livres";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { downloads } from "@/lib/db/schema";
import { rateLimit } from "@/lib/rate-limit";
import { openBookFile } from "@/lib/storage";

/**
 * Unique porte d'entree vers les PDF. Les fichiers ne sont jamais servis
 * comme des ressources statiques : ils vivent hors de `public/`, et chaque
 * telechargement passe ici, ou la session est verifiee puis journalisee.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  const user = await currentUser();
  if (!user) {
    // Un visiteur non connecte est renvoye vers la connexion, pas vers une
    // page d'erreur : c'est le cas courant d'un lien partage.
    return NextResponse.redirect(
      new URL("/connexion", process.env.APP_URL ?? "http://localhost:3000"),
      { status: 303 },
    );
  }

  const book = getBook(slug);
  if (!book || !book.published) {
    return NextResponse.json(
      { message: "Cet ouvrage n'est pas disponible." },
      { status: 404 },
    );
  }

  // Garde-fou contre l'aspiration automatisee de la bibliotheque.
  const limit = rateLimit({
    key: `telechargement:${user.id}`,
    limit: 30,
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

  // Journalisation apres ouverture reussie du fichier, pour ne pas compter
  // des telechargements qui n'ont pas eu lieu.
  await db
    .insert(downloads)
    .values({ userId: user.id, bookSlug: book.slug })
    .catch((error) => {
      // Un echec de journalisation ne doit pas priver l'etudiant de son livre.
      console.error("Journalisation du téléchargement impossible :", error);
    });

  const headers = new Headers({
    "Content-Type": "application/pdf",
    // `attachment` force l'enregistrement du fichier : c'est ce qui permet
    // ensuite de l'ouvrir dans un lecteur PDF complet, seul capable
    // d'afficher les fonctions interactives.
    "Content-Disposition": `attachment; filename="${book.slug}.pdf"; filename*=UTF-8''${encodeURIComponent(book.fileName)}`,
    "Cache-Control": "private, no-store",
    "X-Content-Type-Options": "nosniff",
  });

  if (file.size !== null) {
    headers.set("Content-Length", String(file.size));
  }

  return new NextResponse(file.stream, { status: 200, headers });
}
