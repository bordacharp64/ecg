import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { RegistrationForm } from "@/components/registration-form";
import { Container } from "@/components/ui";
import { currentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Inscription",
  description:
    "Créez votre compte gratuit pour télécharger les ouvrages d'interprétation de l'ECG de l'IHU Liryc.",
  robots: { index: true, follow: true },
};

export default async function RegistrationPage() {
  const user = await currentUser().catch(() => null);
  if (user) redirect("/bibliotheque");

  return (
    <>
      <section className="bg-liryc-navy py-14 text-white sm:py-16">
        <Container>
          <p className="mb-3 text-[0.78rem] font-bold tracking-[0.16em] text-liryc-cyan uppercase">
            Accès gratuit
          </p>
          <h1 className="max-w-[26ch] text-[2rem] leading-[2.5rem] font-black sm:text-[2.6rem] sm:leading-[3rem]">
            Créer mon compte
          </h1>
          <p className="mt-5 max-w-[58ch] text-[1.05rem] leading-relaxed text-white/85">
            Une minute, aucun mot de passe, aucun paiement. Ces quelques
            informations nous servent à mesurer la diffusion des ouvrages auprès
            des facultés.
          </p>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container className="grid gap-14 lg:grid-cols-[1fr_340px]">
          <div className="max-w-[640px]">
            <RegistrationForm />
          </div>

          <aside className="space-y-6">
            <div className="border border-liryc-line bg-liryc-mist p-7">
              <h2 className="text-title-4 leading-title-4 text-liryc-navy">
                Pourquoi ces informations ?
              </h2>
              <div className="prose-liryc mt-4 text-[0.92rem]">
                <ul>
                  <li>
                    Faculté et année : pour savoir où et à quel niveau les
                    ouvrages sont utilisés
                  </li>
                  <li>
                    Adresse e-mail : pour vous connecter et vous prévenir des
                    nouvelles versions
                  </li>
                  <li>
                    Rien d&apos;autre n&apos;est collecté, et rien n&apos;est
                    transmis à un tiers
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-l-4 border-liryc-cyan bg-liryc-cyan-soft p-7">
              <h2 className="text-title-4 leading-title-4 text-liryc-navy">
                Sans mot de passe
              </h2>
              <p className="mt-3 text-[0.92rem] leading-relaxed text-liryc-ink">
                À chaque connexion, vous recevez un lien par e-mail. Rien à
                retenir, rien à perdre.
              </p>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
