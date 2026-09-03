import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { getBook } from "#content/livres.ts";
import { countryOptions } from "#content/pays.ts";
import { groupedStatuses } from "#content/statuts.ts";
import { IdentificationForm } from "@/components/identification-form";
import { Container, Notice } from "@/components/ui";
import { pageContext } from "@/lib/contexte";
import { currentReader } from "@/lib/lecteur";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const book = getBook(slug);
  return {
    title: book ? `Télécharger — ${book.title}` : "Télécharger",
    robots: { index: false, follow: false },
  };
}

export default async function DownloadPage({ params }: Params) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book || !book.published) notFound();

  const { language, t } = await pageContext();

  // Deja identifie sur cet appareil : la fiche a deja ete remplie une fois,
  // la redemander serait une friction gratuite.
  const reader = await currentReader().catch(() => null);
  if (reader) redirect(`/api/telechargement/${book.slug}`);

  return (
    <>
      <section className="bg-liryc-navy py-14 text-white sm:py-16">
        <Container>
          <p className="mb-3 text-[0.78rem] font-bold tracking-[0.16em] text-liryc-cyan uppercase">
            {t("home.badge")}
          </p>
          <h1 className="text-[2rem] leading-[2.5rem] font-black sm:text-[2.6rem] sm:leading-[3rem]">
            {t("form.title")}
          </h1>
          <p className="mt-5 max-w-[58ch] text-[1.05rem] leading-relaxed text-white/85">
            {t("form.intro")}
          </p>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container className="grid gap-14 lg:grid-cols-[1fr_340px]">
          <div className="max-w-[640px]">
            <IdentificationForm
              bookSlug={book.slug}
              language={language}
              countries={countryOptions(language)}
              statusGroups={groupedStatuses()}
              labels={{
                firstName: t("form.firstName"),
                lastName: t("form.lastName"),
                email: t("form.email"),
                emailHelp: t("form.emailHelp"),
                country: t("form.country"),
                countryPlaceholder: t("form.countryPlaceholder"),
                status: t("form.status"),
                statusPlaceholder: t("form.statusPlaceholder"),
                university: t("form.university"),
                universityPlaceholder: t("form.universityPlaceholder"),
                universityOther: t("form.universityOther"),
                universityFreeText: t("form.universityFreeText"),
                universityAfterCountry: t("form.universityAfterCountry"),
                privacyBefore: t("form.privacyBefore"),
                privacyLink: t("form.privacyLink"),
                privacyAfter: t("form.privacyAfter"),
                newsletter: t("form.newsletter"),
                consents: t("form.consents"),
                submit: t("form.submit"),
                submitting: t("form.submitting"),
                startingTitle: t("form.startingTitle"),
                startingBody: t("form.startingBody"),
                startingLink: t("form.startingLink"),
                serverError: t("form.serverError"),
              }}
            />
          </div>

          <aside className="space-y-6">
            <div className="border border-liryc-line bg-liryc-mist p-7">
              <h2 className="text-title-4 leading-title-4 text-liryc-navy">
                {book.title}
              </h2>
              <p className="mt-2 text-[0.93rem] text-liryc-teal">
                {book.subtitle}
              </p>
              <p className="mt-4 text-[0.9rem] text-liryc-ink">
                {t("book.formatValue")}
              </p>
              <Link
                href={`/ouvrages/${book.slug}/apercu`}
                className="mt-4 inline-block text-[0.9rem] font-bold text-liryc-teal hover:text-liryc-navy"
              >
                {t("book.preview")} →
              </Link>
            </div>

            <Notice tone="info" title={t("book.readingTitle")}>
              {t("book.readingBody")}
            </Notice>
          </aside>
        </Container>
      </section>
    </>
  );
}
