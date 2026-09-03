import type { Metadata } from "next";

import { count, desc, sql } from "drizzle-orm";

import { books } from "#content/livres.ts";
import { countryName } from "#content/pays.ts";
import { getStatus } from "#content/statuts.ts";
import { Container } from "@/components/ui";
import { db } from "@/lib/db";
import { downloads, previewViews, readers } from "@/lib/db/schema";
import { languageName } from "@/lib/langue";
import { currentReader, isAdminEmail } from "@/lib/lecteur";
import { localFileExists, storageDriver } from "@/lib/storage";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const reader = await currentReader().catch(() => null);

  // Un visiteur non autorise ne doit pas apprendre que cette page existe :
  // 404 plutot que 403.
  if (!reader || !isAdminEmail(reader.email)) {
    const { notFound } = await import("next/navigation");
    notFound();
  }

  const [
    [totals],
    perBook,
    perPreview,
    perCountry,
    perStatus,
    perUniversity,
    perLanguage,
    recent,
  ] = await Promise.all([
    db
      .select({
        lecteurs: count(),
        abonnes: sql<number>`count(*) filter (where ${readers.newsletterOptIn})`,
      })
      .from(readers),

    db
      .select({ slug: downloads.bookSlug, total: count() })
      .from(downloads)
      .groupBy(downloads.bookSlug),

    db
      .select({ slug: previewViews.bookSlug, total: count() })
      .from(previewViews)
      .groupBy(previewViews.bookSlug),

    db
      .select({ country: readers.country, total: count() })
      .from(readers)
      .groupBy(readers.country)
      .orderBy(desc(count()))
      .limit(15),

    db
      .select({ status: readers.status, total: count() })
      .from(readers)
      .groupBy(readers.status)
      .orderBy(desc(count())),

    db
      .select({ university: readers.university, total: count() })
      .from(readers)
      .groupBy(readers.university)
      .orderBy(desc(count()))
      .limit(15),

    db
      .select({ language: downloads.bookLanguage, total: count() })
      .from(downloads)
      .groupBy(downloads.bookLanguage)
      .orderBy(desc(count())),

    db
      .select({
        firstName: readers.firstName,
        lastName: readers.lastName,
        university: readers.university,
        country: readers.country,
        createdAt: readers.createdAt,
      })
      .from(readers)
      .orderBy(desc(readers.createdAt))
      .limit(10),
  ]);

  const totalDownloads = perBook.reduce((sum, row) => sum + row.total, 0);
  const totalPreviews = perPreview.reduce((sum, row) => sum + row.total, 0);

  // En stockage local, on verifie que chaque PDF annonce est bien depose :
  // c'est la panne la plus courante a la mise en ligne d'un nouveau volume.
  const missingFiles =
    storageDriver() === "local"
      ? books.filter(
          (book) => book.published && !localFileExists(book.fileName),
        )
      : [];

  const cards = [
    { label: "Lecteurs identifiés", value: totals?.lecteurs ?? 0 },
    { label: "Téléchargements", value: totalDownloads },
    { label: "Aperçus consultés", value: totalPreviews },
    { label: "Abonnés aux parutions", value: Number(totals?.abonnes ?? 0) },
  ];

  return (
    <>
      <section className="bg-liryc-navy py-14 text-white">
        <Container>
          <p className="mb-3 text-[0.78rem] font-bold tracking-[0.16em] text-liryc-cyan uppercase">
            Réservé à l&apos;équipe formation
          </p>
          <h1 className="text-[2rem] leading-[2.5rem] font-black">
            Diffusion des ouvrages
          </h1>
        </Container>
      </section>

      <section className="py-14">
        <Container className="space-y-14">
          {missingFiles.length > 0 ? (
            <div className="border-l-4 border-liryc-red bg-[#fdf0f2] p-7">
              <p className="font-bold text-liryc-navy">
                {missingFiles.length === 1
                  ? "Un ouvrage est annoncé comme disponible, mais son PDF est absent du stockage"
                  : "Des ouvrages sont annoncés comme disponibles, mais leurs PDF sont absents du stockage"}
              </p>
              <ul className="mt-3 space-y-1.5 text-[0.93rem] text-liryc-ink">
                {missingFiles.map((book) => (
                  <li key={book.slug}>
                    <strong>{book.title}</strong> — fichier attendu :{" "}
                    <code>{book.fileName}</code>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[0.93rem] text-liryc-ink">
                Le téléchargement et l&apos;aperçu échoueront tant que ces
                fichiers ne sont pas déposés.
              </p>
            </div>
          ) : null}

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {cards.map((card) => (
              <div
                key={card.label}
                className="border border-liryc-line bg-liryc-mist p-6"
              >
                <p className="text-[0.78rem] font-bold tracking-[0.12em] text-liryc-teal uppercase">
                  {card.label}
                </p>
                <p className="mt-2 text-[2.2rem] leading-none font-black text-liryc-navy">
                  {card.value}
                </p>
              </div>
            ))}
          </div>

          {/* Par ouvrage : aperçus et telechargements cote a cote, pour voir
              quels volumes convertissent la consultation en telechargement. */}
          <div>
            <h2 className="text-title-3 leading-title-3 text-liryc-teal">
              Par ouvrage
            </h2>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[560px] text-[0.93rem]">
                <thead>
                  <tr className="border-b-2 border-liryc-navy text-left">
                    <th className="pb-2 font-bold">Ouvrage</th>
                    <th className="pb-2 font-bold">Langue</th>
                    <th className="pb-2 text-right font-bold">Aperçus</th>
                    <th className="pb-2 text-right font-bold">
                      Téléchargements
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => (
                    <tr key={book.slug} className="border-b border-liryc-line">
                      <td className="py-2.5">
                        {book.title}
                        {!book.published ? (
                          <span className="ml-2 text-liryc-ink">
                            (à paraître)
                          </span>
                        ) : null}
                      </td>
                      <td className="py-2.5">
                        {languageName(book.language, "fr")}
                      </td>
                      <td className="py-2.5 text-right">
                        {perPreview.find((r) => r.slug === book.slug)?.total ?? 0}
                      </td>
                      <td className="py-2.5 text-right font-bold">
                        {perBook.find((r) => r.slug === book.slug)?.total ?? 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-title-3 leading-title-3 text-liryc-teal">
                Par statut
              </h2>
              <table className="mt-5 w-full text-[0.93rem]">
                <thead>
                  <tr className="border-b-2 border-liryc-navy text-left">
                    <th className="pb-2 font-bold">Statut</th>
                    <th className="pb-2 text-right font-bold">Lecteurs</th>
                  </tr>
                </thead>
                <tbody>
                  {perStatus.map((row) => (
                    <tr key={row.status} className="border-b border-liryc-line">
                      <td className="py-2.5">
                        {getStatus(row.status)?.label ?? row.status}
                      </td>
                      <td className="py-2.5 text-right font-bold">
                        {row.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div>
              <h2 className="text-title-3 leading-title-3 text-liryc-teal">
                Par pays
              </h2>
              <table className="mt-5 w-full text-[0.93rem]">
                <thead>
                  <tr className="border-b-2 border-liryc-navy text-left">
                    <th className="pb-2 font-bold">Pays</th>
                    <th className="pb-2 text-right font-bold">Lecteurs</th>
                  </tr>
                </thead>
                <tbody>
                  {perCountry.map((row) => (
                    <tr key={row.country} className="border-b border-liryc-line">
                      <td className="py-2.5">
                        {countryName(row.country, "fr")}
                      </td>
                      <td className="py-2.5 text-right font-bold">
                        {row.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-title-3 leading-title-3 text-liryc-teal">
                Principales facultés
              </h2>
              <table className="mt-5 w-full text-[0.93rem]">
                <thead>
                  <tr className="border-b-2 border-liryc-navy text-left">
                    <th className="pb-2 font-bold">Faculté</th>
                    <th className="pb-2 text-right font-bold">Lecteurs</th>
                  </tr>
                </thead>
                <tbody>
                  {perUniversity.map((row) => (
                    <tr
                      key={row.university}
                      className="border-b border-liryc-line"
                    >
                      <td className="py-2.5">{row.university}</td>
                      <td className="py-2.5 text-right font-bold">
                        {row.total}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="space-y-12">
              <div>
                <h2 className="text-title-3 leading-title-3 text-liryc-teal">
                  Par langue téléchargée
                </h2>
                <table className="mt-5 w-full text-[0.93rem]">
                  <thead>
                    <tr className="border-b-2 border-liryc-navy text-left">
                      <th className="pb-2 font-bold">Langue</th>
                      <th className="pb-2 text-right font-bold">
                        Téléchargements
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {perLanguage.map((row) => (
                      <tr
                        key={row.language}
                        className="border-b border-liryc-line"
                      >
                        <td className="py-2.5">
                          {languageName(row.language, "fr")}
                        </td>
                        <td className="py-2.5 text-right font-bold">
                          {row.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <h2 className="text-title-3 leading-title-3 text-liryc-teal">
                  Derniers lecteurs
                </h2>
                <ul className="mt-5 space-y-2.5 text-[0.93rem]">
                  {recent.map((row, index) => (
                    <li
                      key={index}
                      className="flex flex-wrap justify-between gap-3 border-b border-liryc-line pb-2.5"
                    >
                      <span>
                        <strong>
                          {row.firstName} {row.lastName}
                        </strong>{" "}
                        <span className="text-liryc-ink">
                          · {row.university} ({countryName(row.country, "fr")})
                        </span>
                      </span>
                      <time dateTime={row.createdAt.toISOString()}>
                        {row.createdAt.toLocaleDateString("fr-FR")}
                      </time>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="border-l-4 border-liryc-cyan bg-liryc-cyan-soft p-7">
            <h2 className="text-title-4 leading-title-4 text-liryc-navy">
              Export
            </h2>
            <p className="mt-2 text-[0.93rem] leading-relaxed text-liryc-ink">
              Export CSV des lecteurs, pour vos rapports d&apos;activité. Ce
              fichier contient des données personnelles : ne le diffusez pas
              hors de l&apos;équipe et supprimez-le après usage.
            </p>
            <a
              href="/api/admin/export"
              className="mt-4 inline-block font-bold text-liryc-teal hover:text-liryc-navy"
            >
              Télécharger l&apos;export CSV →
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
