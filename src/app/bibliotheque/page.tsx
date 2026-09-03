import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";

import { desc, eq } from "drizzle-orm";

import { books } from "@/../content/livres";
import { BookCover } from "@/components/book-cover";
import { ButtonLink, Container, Notice } from "@/components/ui";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { downloads } from "@/lib/db/schema";

export const metadata: Metadata = {
  title: "Ma bibliothèque",
  robots: { index: false, follow: false },
};

type Props = { searchParams: Promise<{ bienvenue?: string }> };

export default async function LibraryPage({ searchParams }: Props) {
  const user = await currentUser();
  if (!user) redirect("/connexion");

  const { bienvenue } = await searchParams;

  const history = await db
    .select({ bookSlug: downloads.bookSlug, createdAt: downloads.createdAt })
    .from(downloads)
    .where(eq(downloads.userId, user.id))
    .orderBy(desc(downloads.createdAt))
    .limit(200);

  const alreadyDownloaded = new Set(history.map((row) => row.bookSlug));

  return (
    <>
      <section className="bg-liryc-navy py-14 text-white sm:py-16">
        <Container>
          <p className="mb-3 text-[0.78rem] font-bold tracking-[0.16em] text-liryc-cyan uppercase">
            Espace personnel
          </p>
          <h1 className="text-[2rem] leading-[2.5rem] font-black sm:text-[2.6rem] sm:leading-[3rem]">
            Bonjour {user.firstName}
          </h1>
          <p className="mt-5 max-w-[58ch] text-[1.05rem] leading-relaxed text-white/85">
            Vos ouvrages sont ci-dessous. Ils restent accessibles à chaque
            connexion, et les versions mises à jour remplacent les précédentes.
          </p>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container className="space-y-10">
          {bienvenue ? (
            <Notice tone="success" title="Compte activé">
              Votre adresse e-mail est confirmée. Bienvenue dans la bibliothèque
              ECG de l&apos;IHU Liryc.
            </Notice>
          ) : null}

          <Notice tone="info" title="Avant de commencer">
            Ces PDF sont interactifs. Enregistrez le fichier, puis ouvrez-le
            avec un lecteur PDF complet (Adobe Acrobat Reader) : la visionneuse
            du navigateur n&apos;affiche pas les interprétations masquées ni les
            renvois du sommaire.{" "}
            <Link href="/aide" className="font-bold underline">
              Guide de lecture
            </Link>
          </Notice>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {books.map((book) => (
              <article
                key={book.slug}
                className="flex flex-col border border-liryc-line"
              >
                <Link href={`/ouvrages/${book.slug}`}>
                  <BookCover book={book} />
                </Link>

                <div className="flex flex-1 flex-col p-5">
                  <p className="text-[0.7rem] font-bold tracking-[0.14em] text-liryc-cyan uppercase">
                    {book.volume}
                  </p>
                  <h2 className="mt-2 text-title-4 leading-title-4 text-liryc-navy">
                    {book.title}
                  </h2>

                  <div className="mt-4 flex-1" />

                  {book.published ? (
                    <>
                      <a
                        href={`/api/telechargement/${book.slug}`}
                        className="block bg-liryc-teal px-4 py-3 text-center text-[0.9rem] font-bold text-white transition-colors hover:bg-liryc-navy"
                      >
                        {alreadyDownloaded.has(book.slug)
                          ? "Télécharger à nouveau"
                          : "Télécharger le PDF"}
                      </a>
                      <Link
                        href={`/ouvrages/${book.slug}`}
                        className="mt-3 block text-center text-[0.85rem] font-bold text-liryc-teal hover:text-liryc-navy"
                      >
                        Voir le sommaire
                      </Link>
                    </>
                  ) : (
                    <p className="bg-liryc-mist px-4 py-3 text-center text-[0.88rem] font-bold text-liryc-ink">
                      À paraître
                    </p>
                  )}
                </div>
              </article>
            ))}
          </div>

          {history.length > 0 ? (
            <div className="border-t border-liryc-line pt-10">
              <h2 className="text-title-3 leading-title-3 text-liryc-teal">
                Vos derniers téléchargements
              </h2>
              <ul className="mt-5 space-y-2.5">
                {history.slice(0, 8).map((row, index) => {
                  const book = books.find((b) => b.slug === row.bookSlug);
                  return (
                    <li
                      key={`${row.bookSlug}-${index}`}
                      className="flex flex-wrap justify-between gap-3 border-b border-liryc-line pb-2.5 text-[0.92rem]"
                    >
                      <span className="font-bold text-liryc-navy">
                        {book?.title ?? row.bookSlug}
                      </span>
                      <time
                        dateTime={row.createdAt.toISOString()}
                        className="text-liryc-ink"
                      >
                        {row.createdAt.toLocaleDateString("fr-FR", {
                          day: "2-digit",
                          month: "long",
                          year: "numeric",
                        })}
                      </time>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}

          <div className="pt-4">
            <ButtonLink href="/mon-compte" variant="secondary">
              Gérer mon compte
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
