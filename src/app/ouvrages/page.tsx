import type { Metadata } from "next";
import Link from "next/link";

import { BookCover } from "@/components/book-cover";
import { ButtonLink, Container, Notice } from "@/components/ui";
import { pageContext } from "@/lib/contexte";
import { groupBooksForLanguage, languageName } from "@/lib/langue";

export const metadata: Metadata = {
  title: "Les ouvrages",
  description:
    "Les ouvrages d'interprétation de l'ECG de la collection IHU Liryc. Vingt pages consultables en ligne, téléchargement gratuit.",
};

export default async function BooksPage() {
  const { language, source, t } = await pageContext();
  const groups = groupBooksForLanguage(language);

  // Vrai quand aucun ouvrage n'existe dans la langue du visiteur : on le lui
  // dit, plutot que de le laisser croire que le catalogue est vide.
  const hasBooksInLanguage = groups.some(
    (group) => group.isPreferred && group.books.length > 0,
  );

  return (
    <>
      <section className="bg-liryc-navy py-16 text-white sm:py-20">
        <Container>
          <p className="mb-3 text-[0.78rem] font-bold tracking-[0.16em] text-liryc-cyan uppercase">
            {t("books.eyebrow")}
          </p>
          <h1 className="max-w-[24ch] text-[2rem] leading-[2.5rem] font-black sm:text-title-1 sm:leading-title-1">
            {t("books.title")}
          </h1>
          <p className="mt-6 max-w-[62ch] text-[1.05rem] leading-relaxed text-white/85">
            {t("books.intro")}
          </p>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container className="space-y-6">
          {!hasBooksInLanguage ? (
            <Notice tone="info">{t("books.noneInLanguage")}</Notice>
          ) : null}
          {source === "navigateur" ? (
            <p className="text-[0.88rem] text-liryc-ink">
              {t("lang.detected")}
            </p>
          ) : null}
        </Container>

        <Container className="mt-10 space-y-20">
          {groups
            .filter((group) => group.books.length > 0)
            .map((group) => (
              <section key={group.language}>
                <h2 className="mb-10 flex flex-wrap items-baseline gap-3 border-b-2 border-liryc-navy pb-4 text-title-3 leading-title-3 text-liryc-navy">
                  {t("books.sectionIn")} {languageName(group.language, language)}
                  {group.isPreferred ? (
                    <span className="bg-liryc-cyan-soft px-2.5 py-1 text-[0.7rem] font-bold tracking-wide text-liryc-teal uppercase">
                      {t("books.inYourLanguage")}
                    </span>
                  ) : null}
                </h2>

                <div className="space-y-16">
                  {group.books.map((book) => (
                    <article
                      key={book.slug}
                      className="grid gap-10 md:grid-cols-[220px_1fr]"
                    >
                      <Link href={`/ouvrages/${book.slug}`} className="block">
                        <BookCover
                          book={book}
                          volumeLabel={`${t("books.volume")} ${book.volume}`}
                        />
                      </Link>

                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <p className="text-[0.72rem] font-bold tracking-[0.14em] text-liryc-cyan uppercase">
                            {t("books.volume")} {book.volume}
                          </p>
                          {book.published ? (
                            <span className="bg-[#f2f9ed] px-2.5 py-1 text-[0.7rem] font-bold tracking-wide text-liryc-green uppercase">
                              {t("books.available")}
                            </span>
                          ) : (
                            <span className="bg-liryc-mist px-2.5 py-1 text-[0.7rem] font-bold tracking-wide text-liryc-ink uppercase">
                              {t("books.comingSoon")}
                            </span>
                          )}
                        </div>

                        <h3 className="mt-3 text-[1.6rem] leading-[2rem] text-liryc-navy">
                          <Link
                            href={`/ouvrages/${book.slug}`}
                            className="hover:text-liryc-teal"
                          >
                            {book.title}
                          </Link>
                        </h3>
                        <p className="mt-1 text-[1.05rem] text-liryc-teal">
                          {book.subtitle}
                        </p>
                        <p className="mt-5 max-w-[70ch] text-[0.98rem] leading-relaxed text-liryc-ink">
                          {book.description}
                        </p>

                        <div className="mt-7 flex flex-wrap gap-4">
                          {book.published ? (
                            <>
                              <ButtonLink
                                href={`/ouvrages/${book.slug}/apercu`}
                                variant="secondary"
                              >
                                {t("book.preview")}
                              </ButtonLink>
                              <ButtonLink
                                href={`/api/telechargement/${book.slug}`}
                              >
                                {t("book.download")}
                              </ButtonLink>
                            </>
                          ) : (
                            <ButtonLink
                              href={`/ouvrages/${book.slug}`}
                              variant="secondary"
                            >
                              {t("books.details")}
                            </ButtonLink>
                          )}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
        </Container>
      </section>
    </>
  );
}
