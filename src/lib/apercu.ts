import { PDFDocument } from "pdf-lib";

import type { Book } from "#content/livres.ts";
import { openBookFile } from "@/lib/storage";

/**
 * Extrait les premieres pages d'un ouvrage pour la consultation en ligne.
 *
 * L'extrait est fabrique cote serveur, jamais cote navigateur : le PDF complet
 * ne quitte donc pas le serveur avant que la fiche d'identification ne soit
 * remplie. Un visiteur qui inspecte le reseau ne voit passer que les vingt
 * pages autorisees.
 */

type CacheEntry = { bytes: Uint8Array; pageCount: number; builtAt: number };

/**
 * Cache en memoire : l'extraction coute quelques centaines de millisecondes
 * sur un gros manuel, et le meme extrait est demande par tous les visiteurs.
 * La duree de vie evite de servir un extrait perime apres remplacement du PDF.
 */
const CACHE_TTL_MS = 30 * 60_000;
const cache = new Map<string, CacheEntry>();

/** Vide le cache d'un ouvrage, ou du catalogue entier. */
export function clearPreviewCache(slug?: string): void {
  if (slug) cache.delete(slug);
  else cache.clear();
}

async function readWholeFile(fileName: string): Promise<Uint8Array> {
  const { stream } = await openBookFile(fileName);
  const chunks: Uint8Array[] = [];
  const reader = stream.getReader();

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }

  const total = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  return bytes;
}

export type Preview = {
  bytes: Uint8Array;
  /** Nombre de pages effectivement presentes dans l'extrait. */
  pageCount: number;
};

export async function buildPreview(book: Book): Promise<Preview> {
  const cached = cache.get(book.slug);
  if (cached && Date.now() - cached.builtAt < CACHE_TTL_MS) {
    return { bytes: cached.bytes, pageCount: cached.pageCount };
  }

  const source = await PDFDocument.load(await readWholeFile(book.fileName), {
    // Un manuel edite avec Acrobat contient souvent des objets que pdf-lib
    // juge non conformes ; on tolere, l'extraction des pages n'en depend pas.
    ignoreEncryption: false,
    throwOnInvalidObject: false,
  });

  // Un ouvrage plus court que l'apercu annonce ne doit pas faire echouer la
  // consultation : on prend ce qui existe.
  const wanted = Math.max(1, book.previewPages);
  const pageCount = Math.min(wanted, source.getPageCount());

  const extract = await PDFDocument.create();
  extract.setTitle(`${book.title} — ${book.subtitle}`);
  extract.setSubject("Aperçu des premières pages");
  extract.setCreator("Bibliothèque ECG — IHU Liryc");

  const pages = await extract.copyPages(
    source,
    Array.from({ length: pageCount }, (_, index) => index),
  );
  for (const page of pages) extract.addPage(page);

  const bytes = await extract.save({ useObjectStreams: true });
  cache.set(book.slug, { bytes, pageCount, builtAt: Date.now() });

  return { bytes, pageCount };
}
