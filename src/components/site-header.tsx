import Link from "next/link";

import { LanguagePicker } from "@/components/language-picker";
import { Container } from "@/components/ui";
import type { Translator } from "@/lib/i18n";

export function SiteHeader({
  t,
  currentPath,
}: {
  t: Translator;
  currentPath: string;
}) {
  const navigation = [
    { href: "/", label: t("nav.home") },
    { href: "/ouvrages", label: t("nav.books") },
    { href: "/la-collection", label: t("nav.collection") },
    { href: "/aide", label: t("nav.help") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-liryc-line bg-white/95 backdrop-blur">
      <Container className="flex min-h-[72px] items-center justify-between gap-4 py-2 sm:gap-6">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label={t("brand.homeLabel")}
        >
          {/* Emplacement du logo officiel : remplacer par public/logo-liryc.svg */}
          <span
            aria-hidden="true"
            className="flex h-10 w-10 shrink-0 items-center justify-center bg-liryc-navy"
          >
            <svg viewBox="0 0 40 24" className="h-5 w-7" role="presentation">
              <path
                d="M1 14h7l2.5-7 3.5 13 4-18 3.5 12 2.5-5h14"
                fill="none"
                stroke="#47bad4"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="leading-tight">
            <span className="block text-[1.05rem] font-black tracking-tight text-liryc-navy">
              {t("brand.title")}
            </span>
            {/* Masque sur les ecrans etroits : sur deux lignes, il faisait
                deborder la barre. */}
            <span className="hidden text-[0.7rem] font-bold tracking-[0.14em] text-liryc-teal uppercase sm:block">
              {t("brand.subtitle")}
            </span>
          </span>
        </Link>

        <nav
          aria-label={t("nav.mainLabel")}
          className="hidden items-center gap-7 lg:flex"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[0.9rem] font-bold text-liryc-navy transition-colors hover:text-liryc-teal"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <div className="hidden sm:block">
            <LanguagePicker
              language={t.language}
              currentPath={currentPath}
              label={t("lang.label")}
              chooseLabel={t("lang.chooseLabel")}
            />
          </div>
          <Link
            href="/ouvrages"
            className="shrink-0 bg-liryc-teal px-4 py-2.5 text-[0.9rem] font-bold whitespace-nowrap text-white transition-colors hover:bg-liryc-navy sm:px-5"
          >
            {t("nav.books")}
          </Link>
        </div>
      </Container>

      {/* Navigation repliee sur mobile : une seule ligne defilante. */}
      <nav
        aria-label={t("nav.mainLabel")}
        className="border-t border-liryc-line lg:hidden"
      >
        <Container className="flex items-center justify-between gap-5 py-3">
          <div className="flex gap-5 overflow-x-auto">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 text-[0.85rem] font-bold text-liryc-navy"
              >
                {item.label}
              </Link>
            ))}
          </div>
          <div className="shrink-0 sm:hidden">
            <LanguagePicker
              language={t.language}
              currentPath={currentPath}
              label={t("lang.label")}
              chooseLabel={t("lang.chooseLabel")}
            />
          </div>
        </Container>
      </nav>
    </header>
  );
}
