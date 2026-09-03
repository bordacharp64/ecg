import type { Metadata } from "next";

import { desc, eq } from "drizzle-orm";

import { getBook } from "#content/livres.ts";
import { countryName } from "#content/pays.ts";
import { getStatus } from "#content/statuts.ts";
import { DataActions } from "@/components/data-actions";
import { ButtonLink, Container, Notice } from "@/components/ui";
import { pageContext } from "@/lib/contexte";
import { db } from "@/lib/db";
import { downloads } from "@/lib/db/schema";
import { currentReader, isAdminEmail } from "@/lib/lecteur";

export const metadata: Metadata = {
  title: "Mes données",
  robots: { index: false, follow: false },
};

const CONTACT_EMAIL = "formation@ihu-liryc.fr";

export default async function MyDataPage() {
  const { language, t } = await pageContext();
  const reader = await currentReader().catch(() => null);

  if (!reader) {
    return (
      <>
        <section className="bg-liryc-navy py-14 text-white sm:py-16">
          <Container>
            <h1 className="text-[2rem] leading-[2.5rem] font-black sm:text-[2.6rem] sm:leading-[3rem]">
              {t("data.title")}
            </h1>
          </Container>
        </section>
        <section className="py-14 sm:py-20">
          <Container className="max-w-[720px] space-y-8">
            <Notice tone="info">{t("data.none")}</Notice>
            <p className="text-[0.95rem] text-liryc-ink">
              {t("data.correctBody")}{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-bold text-liryc-teal underline"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
            <ButtonLink href="/ouvrages">{t("nav.books")}</ButtonLink>
          </Container>
        </section>
      </>
    );
  }

  const history = await db
    .select({
      bookSlug: downloads.bookSlug,
      createdAt: downloads.createdAt,
    })
    .from(downloads)
    .where(eq(downloads.readerId, reader.id))
    .orderBy(desc(downloads.createdAt))
    .limit(50);

  const rows: Array<[string, string]> = [
    [t("form.firstName"), reader.firstName],
    [t("form.lastName"), reader.lastName],
    [t("form.email"), reader.email],
    [t("form.country"), countryName(reader.country, language)],
    [t("form.status"), getStatus(reader.status)?.label ?? reader.status],
    [t("form.university"), reader.university],
  ];

  return (
    <>
      <section className="bg-liryc-navy py-14 text-white sm:py-16">
        <Container>
          <h1 className="text-[2rem] leading-[2.5rem] font-black sm:text-[2.6rem] sm:leading-[3rem]">
            {t("data.title")}
          </h1>
          <p className="mt-5 max-w-[58ch] text-[1.05rem] leading-relaxed text-white/85">
            {t("data.intro")}
          </p>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container className="max-w-[820px] space-y-14">
          <div>
            <h2 className="text-title-3 leading-title-3 text-liryc-teal">
              {t("data.myInfo")}
            </h2>
            <dl className="mt-6 divide-y divide-liryc-line border-y border-liryc-line">
              {rows.map(([label, value]) => (
                <div
                  key={label}
                  className="flex flex-wrap justify-between gap-3 py-3.5 text-[0.95rem]"
                >
                  <dt className="font-bold text-liryc-navy">{label}</dt>
                  <dd className="text-liryc-ink">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-4 text-[0.88rem] leading-relaxed text-liryc-ink">
              {t("data.correctBody")}{" "}
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-bold text-liryc-teal underline"
              >
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </div>

          {history.length > 0 ? (
            <div>
              <h2 className="text-title-3 leading-title-3 text-liryc-teal">
                {t("data.myDownloads")}
              </h2>
              <ul className="mt-5 space-y-2.5">
                {history.map((row, index) => (
                  <li
                    key={`${row.bookSlug}-${index}`}
                    className="flex flex-wrap justify-between gap-3 border-b border-liryc-line pb-2.5 text-[0.92rem]"
                  >
                    <span className="font-bold text-liryc-navy">
                      {getBook(row.bookSlug)?.title ?? row.bookSlug}
                    </span>
                    <time dateTime={row.createdAt.toISOString()}>
                      {row.createdAt.toLocaleDateString(language, {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </time>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div>
            <h2 className="text-title-3 leading-title-3 text-liryc-teal">
              {t("data.rightsTitle")}
            </h2>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-liryc-ink">
              {t("data.rightsBody")}
            </p>

            <div className="mt-6 space-y-5">
              <a
                href="/api/compte"
                className="inline-flex items-center justify-center border-2 border-liryc-teal bg-white px-7 py-3.5 text-[0.95rem] font-bold text-liryc-teal transition-colors hover:bg-liryc-teal hover:text-white"
              >
                {t("data.export")}
              </a>
              <DataActions
                labels={{
                  delete: t("data.delete"),
                  deleteConfirmTitle: t("data.deleteConfirmTitle"),
                  deleteConfirmBody: t("data.deleteConfirmBody"),
                  deleteConfirm: t("data.deleteConfirm"),
                  cancel: t("data.cancel"),
                  deleteFailed: t("data.deleteFailed"),
                }}
              />
            </div>
          </div>

          {isAdminEmail(reader.email) ? (
            <div className="border-l-4 border-liryc-cyan bg-liryc-cyan-soft p-7">
              <h2 className="text-title-4 leading-title-4 text-liryc-navy">
                Espace d&apos;administration
              </h2>
              <a
                href="/admin"
                className="mt-3 inline-block font-bold text-liryc-teal hover:text-liryc-navy"
              >
                Voir les statistiques de diffusion →
              </a>
            </div>
          ) : null}
        </Container>
      </section>
    </>
  );
}
