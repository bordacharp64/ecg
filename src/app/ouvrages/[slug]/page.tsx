import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { books, getBook, translationsOf } from "#content/livres.ts";
import { BookCover } from "@/components/book-cover";
import { ButtonLink, Container, Notice } from "@/components/ui";
import { pageContext } from "@/lib/contexte";
import { languageName } from "@/lib/langue";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return books.map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) return { title: "Ouvrage introuvable" };

  return {
    title: book.title,
    description: book.description.slice(0, 300),
    openGraph: { title: book.title, locale: book.language },
  };
}

/** "2026-09" -> "septembre 2026", dans la langue de la page. */
function formatUpdatedAt(value: string, locale: string): string {
  const [year, month] = value.split("-");
  const monthIndex = Number(month) - 1;
  if (!year || Number.isNaN(monthIndex)) return value;

  try {
    const formatter = new Intl.DateTimeFormat(locale, {
      month: "long",
      year: "numeric",
    });
    return formatter.format(new Date(Number(year), monthIndex, 1));
  } catch {
    return value;
  }
}

export default async function BookPage({ params }: Params) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) notFound();

  const { language, t } = await pageContext();
  const otherVersions = translationsOf(book);

  return (
    <>
      <section className="bg-liryc-navy py-14 text-white sm:py-16">
        <Container>
          <nav aria-label={t("book.breadcrumb")} className="mb-8 text-[0.85rem]">
            <ol className="flex flex-wrap items-center gap-2 text-white/65">
              <li>
                <Link href="/" className="font-bold hover:text-liryc-cyan">
                  {t("nav.home")}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/ouvrages"
                  className="font-bold hover:text-liryc-cyan"
                >
                  {t("nav.books")}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-white">
                {book.title}
              </li>
            </ol>
          </nav>

          <div className="grid gap-12 md:grid-cols-[280px_1fr]">
            <div className="max-w-[280px] shadow-2xl">
              <BookCover
                book={book}
                volumeLabel={`${t("books.volume")} ${book.volume}`}
              />
            </div>

            <div>
              <p className="text-[0.78rem] font-bold tracking-[0.16em] text-liryc-cyan uppercase">
                {t("books.volume")} {book.volume}
              </p>
              <h1 className="mt-3 text-[1.95rem] leading-[2.4rem] font-black sm:text-[2.6rem] sm:leading-[3rem]">
                {book.title}
              </h1>
              <p className="mt-3 text-[1.15rem] text-liryc-cyan">
                {book.subtitle}
              </p>

              <dl className="mt-9 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/15 pt-7 text-[0.9rem]">
                <div>
                  <dt className="font-bold tracking-[0.1em] text-liryc-cyan uppercase">
                    {t("book.format")}
                  </dt>
                  <dd className="mt-1 text-white/85">{t("book.formatValue")}</dd>
                </div>
                <div>
                  <dt className="font-bold tracking-[0.1em] text-liryc-cyan uppercase">
                    {t("book.language")}
                  </dt>
                  <dd className="mt-1 text-white/85">
                    {languageName(book.language, language)}
                  </dd>
                </div>
                {book.pages ? (
                  <div>
                    <dt className="font-bold tracking-[0.1em] text-liryc-cyan uppercase">
                      {t("book.pages")}
                    </dt>
                    <dd className="mt-1 text-white/85">{book.pages}</dd>
                  </div>
                ) : null}
                <div>
                  <dt className="font-bold tracking-[0.1em] text-liryc-cyan uppercase">
                    {t("book.version")}
                  </dt>
                  <dd className="mt-1 text-white/85">
                    {formatUpdatedAt(book.updatedAt, language)}
                  </dd>
                </div>
                <div>
                  <dt className="font-bold tracking-[0.1em] text-liryc-cyan uppercase">
                    {t("book.price")}
                  </dt>
                  <dd className="mt-1 text-white/85">{t("home.free")}</dd>
                </div>
              </dl>

              <div className="mt-9 flex flex-wrap gap-4">
                {book.published ? (
                  <>
                    <ButtonLink href={`/ouvrages/${book.slug}/apercu`}>
                      {t("book.preview")}
                    </ButtonLink>
                    <ButtonLink
                      href={`/api/telechargement/${book.slug}`}
                      variant="ghost"
                    >
                      {t("book.download")}
                    </ButtonLink>
                  </>
                ) : (
                  <ButtonLink href="/ouvrages" variant="ghost">
                    {t("nav.books")}
                  </ButtonLink>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="grid gap-14 lg:grid-cols-[1fr_360px]">
          <div className="max-w-[952px]">
            <div className="prose-liryc">
              <h2>{t("book.presentation")}</h2>
              <p>{book.description}</p>

              <h2>{t("book.whatYouFind")}</h2>
              <ul>
                {book.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <h2>{t("book.contents")}</h2>
              <ol className="mt-4 space-y-3">
                {book.contents.map((item, index) => (
                  <li key={item} className="flex gap-4">
                    <span className="w-8 shrink-0 text-[0.9rem] font-black text-liryc-cyan">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.98rem] leading-relaxed text-liryc-ink">
                      {item}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <aside className="space-y-6">
            {!book.published ? (
              <Notice tone="info" title={t("book.comingSoonTitle")}>
                {t("book.comingSoonBody")}
              </Notice>
            ) : null}

            {otherVersions.length > 0 ? (
              <div className="border border-liryc-line p-7">
                <h2 className="text-title-4 leading-title-4 text-liryc-navy">
                  {t("book.otherVersionsTitle")}
                </h2>
                <ul className="mt-4 space-y-2.5 text-[0.93rem]">
                  {otherVersions.map((version) => (
                    <li key={version.slug}>
                      <Link
                        href={`/ouvrages/${version.slug}`}
                        className="font-bold text-liryc-teal hover:text-liryc-navy"
                      >
                        {languageName(version.language, language)}
                      </Link>
                      {!version.published ? (
                        <span className="ml-2 text-liryc-ink">
                          ({t("books.comingSoon")})
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <div className="border border-liryc-line bg-liryc-mist p-7">
              <h2 className="text-title-4 leading-title-4 text-liryc-navy">
                {t("book.readingTitle")}
              </h2>
              <p className="mt-3 text-[0.92rem] leading-relaxed text-liryc-ink">
                {t("book.readingBody")}
              </p>
              <Link
                href="/aide"
                className="mt-4 inline-block text-[0.9rem] font-bold text-liryc-teal hover:text-liryc-navy"
              >
                {t("book.readingLink")} →
              </Link>
            </div>

            <div className="border border-liryc-line p-7">
              <h2 className="text-title-4 leading-title-4 text-liryc-navy">
                {t("book.usageTitle")}
              </h2>
              <p className="mt-3 text-[0.92rem] leading-relaxed text-liryc-ink">
                {t("book.usageBody")}
              </p>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
