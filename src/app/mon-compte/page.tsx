import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AccountActions } from "@/components/account-actions";
import { Button, Container } from "@/components/ui";
import { currentUser, isAdminEmail } from "@/lib/auth";
import { profiles } from "@/lib/validation";

export const metadata: Metadata = {
  title: "Mon compte",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const user = await currentUser();
  if (!user) redirect("/connexion");

  const profileLabel =
    profiles.find((option) => option.value === user.profile)?.label ??
    user.profile;

  const rows: Array<[string, string]> = [
    ["Nom", `${user.firstName} ${user.lastName}`],
    ["Adresse e-mail", user.email],
    ["Profil", profileLabel],
    ["Établissement", user.institution],
    ["Pays", user.country],
    ["Année d'études", user.studyYear ? `${user.studyYear}e année` : "—"],
    [
      "Informations de formation",
      user.newsletterOptIn ? "Abonné" : "Non abonné",
    ],
    [
      "Inscrit le",
      user.createdAt.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }),
    ],
  ];

  return (
    <>
      <section className="bg-liryc-navy py-14 text-white sm:py-16">
        <Container>
          <h1 className="text-[2rem] leading-[2.5rem] font-black sm:text-[2.6rem] sm:leading-[3rem]">
            Mon compte
          </h1>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container className="max-w-[820px] space-y-14">
          <div>
            <h2 className="text-title-3 leading-title-3 text-liryc-teal">
              Mes informations
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
              Pour corriger une information, écrivez à{" "}
              <a
                href="mailto:formation@ihu-liryc.fr"
                className="font-bold text-liryc-teal underline"
              >
                formation@ihu-liryc.fr
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="text-title-3 leading-title-3 text-liryc-teal">
              Mes données personnelles
            </h2>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-liryc-ink">
              Conformément au règlement général sur la protection des données,
              vous pouvez récupérer une copie de vos données ou demander leur
              effacement à tout moment.
            </p>

            <div className="mt-6 space-y-5">
              <a
                href="/api/compte"
                className="inline-flex items-center justify-center border-2 border-liryc-teal bg-white px-7 py-3.5 text-[0.95rem] font-bold text-liryc-teal transition-colors hover:bg-liryc-teal hover:text-white"
              >
                Télécharger mes données (JSON)
              </a>
              <AccountActions />
            </div>
          </div>

          {isAdminEmail(user.email) ? (
            <div className="border-l-4 border-liryc-cyan bg-liryc-cyan-soft p-7">
              <h2 className="text-title-4 leading-title-4 text-liryc-navy">
                Espace d&apos;administration
              </h2>
              <p className="mt-2 text-[0.93rem] text-liryc-ink">
                Votre adresse figure dans la liste des administrateurs.
              </p>
              <a
                href="/admin"
                className="mt-4 inline-block font-bold text-liryc-teal hover:text-liryc-navy"
              >
                Voir les statistiques de diffusion →
              </a>
            </div>
          ) : null}

          <form action="/api/deconnexion" method="post">
            <Button type="submit" variant="secondary">
              Se déconnecter
            </Button>
          </form>
        </Container>
      </section>
    </>
  );
}
