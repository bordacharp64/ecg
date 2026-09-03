import type { Metadata, Viewport } from "next";
import { Lato } from "next/font/google";

import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { currentUser } from "@/lib/auth";

import "./globals.css";

/**
 * Lato : la police du site institutionnel ihu-liryc.fr. Servie depuis le
 * domaine du site (et non depuis Google) pour eviter tout transfert de
 * donnees vers un tiers, conformement a la doctrine CNIL sur les polices
 * distantes.
 */
const lato = Lato({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "700", "900"],
  display: "swap",
  variable: "--font-lato",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_URL ?? "http://localhost:3000"),
  title: {
    default: "Bibliothèque ECG · IHU Liryc",
    template: "%s · Bibliothèque ECG · IHU Liryc",
  },
  description:
    "Quatre ouvrages d'interprétation de l'électrocardiogramme, en PDF interactif, offerts aux étudiants en médecine par l'IHU Liryc.",
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Bibliothèque ECG · IHU Liryc",
    title: "Bibliothèque ECG · IHU Liryc",
    description:
      "Quatre ouvrages d'interprétation de l'ECG, en PDF interactif, offerts aux étudiants en médecine.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#044251",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await currentUser().catch(() => null);

  return (
    <html lang="fr" className={lato.variable}>
      <body className="flex min-h-screen flex-col antialiased">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-liryc-navy focus:px-4 focus:py-2 focus:font-bold focus:text-white"
        >
          Aller au contenu principal
        </a>
        <SiteHeader user={user} />
        <main id="contenu" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
