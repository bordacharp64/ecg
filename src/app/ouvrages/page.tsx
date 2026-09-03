import type { Metadata } from "next";
import Link from "next/link";

import { books } from "@/../content/livres";
import { BookCover } from "@/components/book-cover";
import { ButtonLink, Container, SectionTitle } from "@/components/ui";
import { currentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Les ouvrages",
  description:
    "Les quatre ouvrages d'interprétation de l'ECG de la collection IHU Liryc : sémiologie, troubles du rythme, troubles de la conduction, ischémie myocardique.",
};

export default async function BooksPage() {
  const user = await currentUser().catch(() => null);

  return (
    <>
      <section className="bg-liryc-navy py-16 text-white sm:py-20">
        <Container>
          <p className="mb-3 text-[0.78rem] font-bold tracking-[0.16em] text-liryc-cyan uppercase">
            La collection
          </p>
          <h1 className="max-w-[24ch] text-[2rem] leading-[2.5rem] font-black sm:text-title-1 sm:leading-title-1">
            Les ouvrages
          </h1>
          <p className="mt-6 max-w-[62ch] text-[1.05rem] leading-relaxed text-white/85">
            Quatre volumes en français, en PDF interactif. La consultation des
            fiches est libre ; le téléchargement demande un compte, gratuit.
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="space-y-16">
          {books.map((book) => (
            <article
              key={book.slug}
              className="grid gap-10 border-b border-liryc-line pb-16 last:border-0 last:pb-0 md:grid-cols-[260px_1fr]"
            >
              <Link href={`/ouvrages/${book.slug}`} className="block">
                <BookCover book={book} />
              </Link>

              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <p className="text-[0.72rem] font-bold tracking-[0.14em] text-liryc-cyan uppercase">
                    {book.volume}
                  </p>
                  {book.published ? (
                    <span className="bg-[#f2f9ed] px-2.5 py-1 text-[0.7rem] font-bold tracking-wide text-liryc-green uppercase">
                      Disponible
                    </span>
                  ) : (
                    <span className="bg-liryc-mist px-2.5 py-1 text-[0.7rem] font-bold tracking-wide text-liryc-ink uppercase">
                      À paraître
                    </span>
                  )}
                </div>

                <h2 className="mt-3 text-[1.6rem] leading-[2rem] text-liryc-navy">
                  <Link
                    href={`/ouvrages/${book.slug}`}
                    className="hover:text-liryc-teal"
                  >
                    {book.title}
                  </Link>
                </h2>
                <p className="mt-1 text-[1.05rem] text-liryc-teal">
                  {book.subtitle}
                </p>
                <p className="mt-5 max-w-[70ch] text-[0.98rem] leading-relaxed text-liryc-ink">
                  {book.description}
                </p>

                <div className="mt-7 flex flex-wrap gap-4">
                  <ButtonLink
                    href={`/ouvrages/${book.slug}`}
                    variant="secondary"
                  >
                    Fiche détaillée
                  </ButtonLink>
                  {book.published ? (
                    <ButtonLink
                      href={user ? "/bibliotheque" : "/inscription"}
                    >
                      {user ? "Télécharger" : "S'inscrire pour télécharger"}
                    </ButtonLink>
                  ) : null}
                </div>
              </div>
            </article>
          ))}
        </Container>
      </section>

      <section className="bg-liryc-mist py-16">
        <Container>
          <SectionTitle
            eyebrow="Accès"
            title="Un compte suffit pour toute la collection"
            intro="L'inscription est gratuite et donne accès aux volumes déjà parus comme à ceux qui viendront. Vous serez informé de chaque nouvelle parution si vous le souhaitez."
          />
          <div className="mt-8">
            <ButtonLink href={user ? "/bibliotheque" : "/inscription"}>
              {user ? "Ouvrir ma bibliothèque" : "Créer mon compte"}
            </ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
