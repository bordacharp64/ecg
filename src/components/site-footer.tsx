import Link from "next/link";

import { Container } from "@/components/ui";

export function SiteFooter() {
  return (
    <footer className="mt-24 bg-liryc-navy text-white">
      <Container className="grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="text-[1.15rem] font-black">Bibliothèque ECG</p>
          <p className="mt-1 text-[0.72rem] font-bold tracking-[0.14em] text-liryc-cyan uppercase">
            IHU Liryc · Formation
          </p>
          <p className="mt-5 max-w-[38ch] text-[0.92rem] leading-relaxed text-white/75">
            Une collection d&apos;ouvrages d&apos;interprétation de
            l&apos;électrocardiogramme, mise gratuitement à la disposition des
            étudiants en médecine par l&apos;institut de rythmologie et
            modélisation cardiaque.
          </p>
        </div>

        <nav aria-label="Navigation du pied de page">
          <p className="mb-4 text-[0.78rem] font-bold tracking-[0.14em] text-liryc-cyan uppercase">
            Naviguer
          </p>
          <ul className="space-y-2.5 text-[0.92rem] text-white/85">
            <li>
              <Link href="/ouvrages" className="hover:text-liryc-cyan">
                Les ouvrages
              </Link>
            </li>
            <li>
              <Link href="/la-collection" className="hover:text-liryc-cyan">
                La collection
              </Link>
            </li>
            <li>
              <Link href="/aide" className="hover:text-liryc-cyan">
                Aide à la lecture
              </Link>
            </li>
            <li>
              <Link href="/inscription" className="hover:text-liryc-cyan">
                S&apos;inscrire
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Informations légales">
          <p className="mb-4 text-[0.78rem] font-bold tracking-[0.14em] text-liryc-cyan uppercase">
            Informations
          </p>
          <ul className="space-y-2.5 text-[0.92rem] text-white/85">
            <li>
              <Link href="/mentions-legales" className="hover:text-liryc-cyan">
                Mentions légales
              </Link>
            </li>
            <li>
              <Link href="/confidentialite" className="hover:text-liryc-cyan">
                Données personnelles
              </Link>
            </li>
            <li>
              <a
                href="https://www.ihu-liryc.fr"
                className="hover:text-liryc-cyan"
                rel="noreferrer"
              >
                ihu-liryc.fr
              </a>
            </li>
          </ul>
        </nav>
      </Container>

      <div className="border-t border-white/15">
        <Container className="flex flex-col gap-2 py-6 text-[0.82rem] text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} IHU Liryc. Tous droits réservés.</p>
          <p>
            Ouvrages diffusés à des fins pédagogiques, sans reproduction ni
            revente.
          </p>
        </Container>
      </div>
    </footer>
  );
}
