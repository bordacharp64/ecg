import { NextResponse } from "next/server";

import { getBook } from "#content/livres.ts";
import { buildPreview } from "@/lib/apercu";
import { db } from "@/lib/db";
import { previewViews } from "@/lib/db/schema";
import { rateLimit } from "@/lib/rate-limit";

/**
 * Sert l'extrait consultable en ligne. Libre d'acces : c'est precisement le
 * but, feuilleter avant de laisser ses coordonnees. Seules les pages
 * autorisees sont produites, en amont, par `buildPreview`.
 */
export async function GET(
  request: Request,
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

  // L'extraction est couteuse en memoire : on borne le debit global, sans
  // gener un visiteur qui feuillette normalement.
  const limit = rateLimit({
    key: "apercu:global",
    limit: 240,
    windowMs: 60_000,
  });
  if (!limit.allowed) {
    return NextResponse.json(
      { message: "Trop de demandes simultanées. Réessayez dans un instant." },
      {
        status: 429,
        headers: { "Retry-After": String(limit.retryAfterSeconds) },
      },
    );
  }

  let preview;
  try {
    preview = await buildPreview(book);
  } catch (error) {
    console.error(`Aperçu impossible pour ${slug} :`, error);
    return NextResponse.json(
      { message: "L'aperçu est momentanément indisponible." },
      { status: 503 },
    );
  }

  // Une seule consultation comptee par ouverture de l'apercu : le lecteur
  // pdf.js demande le fichier une fois puis navigue en memoire. Les requetes
  // de reprise (Range) ne sont pas comptees.
  if (!request.headers.get("range")) {
    await db
      .insert(previewViews)
      .values({ bookSlug: book.slug, bookLanguage: book.language })
      .catch((error) => {
        console.error("Comptage de l'aperçu impossible :", error);
      });
  }

  return new NextResponse(preview.bytes as unknown as BodyInit, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Length": String(preview.bytes.byteLength),
      // `inline` : l'extrait est fait pour etre lu dans la page, pas enregistre.
      "Content-Disposition": `inline; filename="apercu-${book.slug}.pdf"`,
      "Cache-Control": "public, max-age=3600",
      "X-Content-Type-Options": "nosniff",
      "X-Preview-Pages": String(preview.pageCount),
    },
  });
}
