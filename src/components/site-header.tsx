import Link from "next/link";

import { Container } from "@/components/ui";
import type { User } from "@/lib/db/schema";

const navigation = [
  { href: "/", label: "Accueil" },
  { href: "/ouvrages", label: "Les ouvrages" },
  { href: "/la-collection", label: "La collection" },
  { href: "/aide", label: "Aide à la lecture" },
];

export function SiteHeader({ user }: { user: User | null }) {
  return (
    <header className="sticky top-0 z-50 border-b border-liryc-line bg-white/95 backdrop-blur">
      <Container className="flex min-h-[72px] items-center justify-between gap-4 py-2 sm:gap-6">
        <Link
          href="/"
          className="flex items-center gap-3"
          aria-label="Bibliothèque ECG, IHU Liryc — retour à l'accueil"
        >
          {/* Emplacement du logo officiel : remplacer par public/logo-liryc.svg */}
          <span
            aria-hidden="true"
            className="flex h-10 w-10 items-center justify-center bg-liryc-navy"
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
              Bibliothèque ECG
            </span>
            {/* Le surtitre est masque sur les ecrans les plus etroits :
                sur deux lignes, il faisait deborder la barre. */}
            <span className="hidden text-[0.7rem] font-bold tracking-[0.14em] text-liryc-teal uppercase sm:block">
              IHU Liryc · Formation
            </span>
          </span>
        </Link>

        <nav
          aria-label="Navigation principale"
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

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/mon-compte"
                className="hidden text-[0.9rem] font-bold text-liryc-teal hover:text-liryc-navy sm:inline"
              >
                {user.firstName}
              </Link>
              <Link
                href="/bibliotheque"
                className="shrink-0 bg-liryc-teal px-4 py-2.5 text-[0.9rem] font-bold whitespace-nowrap text-white transition-colors hover:bg-liryc-navy sm:px-5"
              >
                <span className="sm:hidden">Mes livres</span>
                <span className="hidden sm:inline">Ma bibliothèque</span>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/connexion"
                className="hidden text-[0.9rem] font-bold text-liryc-teal hover:text-liryc-navy sm:inline"
              >
                Se connecter
              </Link>
              <Link
                href="/inscription"
                className="shrink-0 bg-liryc-teal px-4 py-2.5 text-[0.9rem] font-bold whitespace-nowrap text-white transition-colors hover:bg-liryc-navy sm:px-5"
              >
                S&apos;inscrire
              </Link>
            </>
          )}
        </div>
      </Container>

      {/* Navigation repliee sur mobile : une seule ligne defilante. */}
      <nav
        aria-label="Navigation principale (mobile)"
        className="border-t border-liryc-line lg:hidden"
      >
        <Container className="flex gap-5 overflow-x-auto py-3">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 text-[0.85rem] font-bold text-liryc-navy"
            >
              {item.label}
            </Link>
          ))}
        </Container>
      </nav>
    </header>
  );
}
