import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getBook } from "#content/livres.ts";
import { PreviewReader } from "@/components/preview-reader";
import { ButtonLink, Container, Notice } from "@/components/ui";
import { pageContext } from "@/lib/contexte";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) return { title: "Ouvrage introuvable" };

  return {
    title: `Aperçu — ${book.title}`,
    description: `Les ${book.previewPages} premières pages de « ${book.title} », consultables en ligne.`,
    // L'apercu n'a pas a etre indexe : c'est la fiche de l'ouvrage qui doit
    // remonter dans les resultats de recherche.
    robots: { index: false, follow: true },
  };
}

export default async function PreviewPage({ params }: Params) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) notFound();

  const { t } = await pageContext();

  // Un volume a paraitre n'a pas de fichier : on le dit clairement plutot que
  // d'ouvrir un lecteur qui echouerait.
  if (!book.published) {
    return (
      <section className="py-20">
        <Container className="max-w-[640px] space-y-8">
          <Notice tone="info" title={t("book.comingSoonTitle")}>
            {t("book.comingSoonBody")}
          </Notice>
          <ButtonLink href="/ouvrages">{t("nav.books")}</ButtonLink>
        </Container>
      </section>
    );
  }

  return (
    <>
      <section className="bg-liryc-navy py-10 text-white">
        <Container>
          <nav aria-label={t("book.breadcrumb")} className="mb-6 text-[0.85rem]">
            <ol className="flex flex-wrap items-center gap-2 text-white/65">
              <li>
                <Link href="/ouvrages" className="font-bold hover:text-liryc-cyan">
                  {t("nav.books")}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href={`/ouvrages/${book.slug}`}
                  className="font-bold hover:text-liryc-cyan"
                >
                  {book.title}
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-white">
                {t("preview.title")}
              </li>
            </ol>
          </nav>

          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-[0.78rem] font-bold tracking-[0.16em] text-liryc-cyan uppercase">
                {t("preview.pagesOf", { n: book.previewPages })}
              </p>
              <h1 className="mt-2 text-[1.7rem] leading-[2.1rem] font-black sm:text-[2.2rem] sm:leading-[2.6rem]">
                {book.title}
              </h1>
            </div>
            <ButtonLink href={`/api/telechargement/${book.slug}`}>
              {t("book.download")}
            </ButtonLink>
          </div>
        </Container>
      </section>

      <section className="py-10 sm:py-14">
        <Container className="space-y-8">
          <PreviewReader
            previewUrl={`/api/apercu/${book.slug}`}
            downloadUrl={`/api/telechargement/${book.slug}`}
            bookHref={`/ouvrages/${book.slug}`}
            labels={{
              loading: t("preview.loading"),
              failed: t("preview.failed"),
              page: t("preview.page"),
              of2: t("preview.of2"),
              previous: t("preview.previous"),
              next: t("preview.next"),
              zoomIn: t("preview.zoomIn"),
              zoomOut: t("preview.zoomOut"),
              endTitle: t("preview.endTitle"),
              endBody: t("preview.endBody"),
              download: t("book.download"),
              backToBook: t("preview.backToBook"),
            }}
          />

          <p className="max-w-[80ch] text-[0.88rem] leading-relaxed text-liryc-ink">
            {t("preview.notice")}
          </p>
        </Container>
      </section>
    </>
  );
}
