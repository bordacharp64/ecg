import Link from "next/link";

import { Container } from "@/components/ui";
import type { Translator } from "@/lib/i18n";

export function SiteFooter({ t }: { t: Translator }) {
  return (
    <footer className="mt-24 bg-liryc-navy text-white">
      <Container className="grid gap-12 py-16 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <p className="text-[1.15rem] font-black">{t("brand.title")}</p>
          <p className="mt-1 text-[0.72rem] font-bold tracking-[0.14em] text-liryc-cyan uppercase">
            {t("brand.subtitle")}
          </p>
          <p className="mt-5 max-w-[38ch] text-[0.92rem] leading-relaxed text-white/75">
            {t("footer.blurb")}
          </p>
        </div>

        <nav aria-label={t("footer.navigate")}>
          <p className="mb-4 text-[0.78rem] font-bold tracking-[0.14em] text-liryc-cyan uppercase">
            {t("footer.navigate")}
          </p>
          <ul className="space-y-2.5 text-[0.92rem] text-white/85">
            <li>
              <Link href="/ouvrages" className="hover:text-liryc-cyan">
                {t("nav.books")}
              </Link>
            </li>
            <li>
              <Link href="/la-collection" className="hover:text-liryc-cyan">
                {t("nav.collection")}
              </Link>
            </li>
            <li>
              <Link href="/aide" className="hover:text-liryc-cyan">
                {t("nav.help")}
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label={t("footer.information")}>
          <p className="mb-4 text-[0.78rem] font-bold tracking-[0.14em] text-liryc-cyan uppercase">
            {t("footer.information")}
          </p>
          <ul className="space-y-2.5 text-[0.92rem] text-white/85">
            <li>
              <Link href="/mentions-legales" className="hover:text-liryc-cyan">
                {t("footer.legal")}
              </Link>
            </li>
            <li>
              <Link href="/confidentialite" className="hover:text-liryc-cyan">
                {t("footer.privacy")}
              </Link>
            </li>
            <li>
              <Link href="/mes-donnees" className="hover:text-liryc-cyan">
                {t("footer.myData")}
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
          <p>
            © {new Date().getFullYear()} IHU Liryc. {t("footer.rights")}
          </p>
          <p>{t("footer.usage")}</p>
        </Container>
      </div>
    </footer>
  );
}
