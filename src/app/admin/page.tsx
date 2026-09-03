import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { count, desc, eq, sql } from "drizzle-orm";

import { books } from "@/../content/livres";
import { Container } from "@/components/ui";
import { currentUser, isAdminEmail } from "@/lib/auth";
import { db } from "@/lib/db";
import { downloads, users } from "@/lib/db/schema";
import { localFileExists, storageDriver } from "@/lib/storage";

export const metadata: Metadata = {
  title: "Administration",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const user = await currentUser();

  // Un visiteur non autorise ne doit pas apprendre que cette page existe.
  if (!user || !isAdminEmail(user.email)) notFound();

  const [[totals], perBook, perInstitution, perProfile, recent] =
    await Promise.all([
      db
        .select({
          inscrits: count(),
          confirmes: sql<number>`count(${users.emailVerifiedAt})`,
          abonnes: sql<number>`count(*) filter (where ${users.newsletterOptIn})`,
        })
        .from(users),

      db
        .select({ slug: downloads.bookSlug, total: count() })
        .from(downloads)
        .groupBy(downloads.bookSlug)
        .orderBy(desc(count())),

      db
        .select({ institution: users.institution, total: count() })
        .from(users)
        .groupBy(users.institution)
        .orderBy(desc(count()))
        .limit(15),

      db
        .select({ profile: users.profile, total: count() })
        .from(users)
        .groupBy(users.profile)
        .orderBy(desc(count())),

      db
        .select({
          firstName: users.firstName,
          lastName: users.lastName,
          institution: users.institution,
          createdAt: users.createdAt,
        })
        .from(users)
        .orderBy(desc(users.createdAt))
        .limit(10),
    ]);

  const totalDownloads = perBook.reduce((sum, row) => sum + row.total, 0);

  // En stockage local, on peut verifier que chaque PDF annonce est bien depose :
  // c'est la panne la plus courante a la mise en ligne d'un nouveau volume.
  const isLocalStorage = storageDriver() === "local";
  const missingFiles = isLocalStorage
    ? books.filter((book) => book.published && !localFileExists(book.fileName))
    : [];

  const cards = [
    { label: "Comptes créés", value: totals?.inscrits ?? 0 },
    { label: "Adresses confirmées", value: Number(totals?.confirmes ?? 0) },
    { label: "Téléchargements", value: totalDownloads },
    { label: "Abonnés aux actualités", value: Number(totals?.abonnes ?? 0) },
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
                Le téléchargement échouera pour les étudiants tant que ces
                fichiers ne sont pas déposés dans le dossier de stockage.
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

          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <h2 className="text-title-3 leading-title-3 text-liryc-teal">
                Par ouvrage
              </h2>
              <table className="mt-5 w-full text-[0.93rem]">
                <thead>
                  <tr className="border-b-2 border-liryc-navy text-left">
                    <th className="pb-2 font-bold">Ouvrage</th>
                    <th className="pb-2 text-right font-bold">
                      Téléchargements
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {books.map((book) => {
                    const row = perBook.find((r) => r.slug === book.slug);
                    return (
                      <tr key={book.slug} className="border-b border-liryc-line">
                        <td className="py-2.5">{book.title}</td>
                        <td className="py-2.5 text-right font-bold">
                          {row?.total ?? 0}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div>
              <h2 className="text-title-3 leading-title-3 text-liryc-teal">
                Par profil
              </h2>
              <table className="mt-5 w-full text-[0.93rem]">
                <thead>
                  <tr className="border-b-2 border-liryc-navy text-left">
                    <th className="pb-2 font-bold">Profil</th>
                    <th className="pb-2 text-right font-bold">Comptes</th>
                  </tr>
                </thead>
                <tbody>
                  {perProfile.map((row) => (
                    <tr key={row.profile} className="border-b border-liryc-line">
                      <td className="py-2.5">{row.profile}</td>
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
                Principaux établissements
              </h2>
              <table className="mt-5 w-full text-[0.93rem]">
                <thead>
                  <tr className="border-b-2 border-liryc-navy text-left">
                    <th className="pb-2 font-bold">Établissement</th>
                    <th className="pb-2 text-right font-bold">Comptes</th>
                  </tr>
                </thead>
                <tbody>
                  {perInstitution.map((row) => (
                    <tr
                      key={row.institution}
                      className="border-b border-liryc-line"
                    >
                      <td className="py-2.5">{row.institution}</td>
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
                Dernières inscriptions
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
                        · {row.institution}
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

          <div className="border-l-4 border-liryc-cyan bg-liryc-cyan-soft p-7">
            <h2 className="text-title-4 leading-title-4 text-liryc-navy">
              Export
            </h2>
            <p className="mt-2 text-[0.93rem] leading-relaxed text-liryc-ink">
              Export CSV des comptes, pour vos rapports d&apos;activité. Ce
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
