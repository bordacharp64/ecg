import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = (process.env.APP_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  );

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Espaces personnels, aperçus et fichiers : rien a indexer. Les
        // aperçus sont exclus pour que ce soit la fiche de l'ouvrage qui
        // remonte dans les resultats, et non un lecteur PDF sans contexte.
        disallow: [
          "/mes-donnees",
          "/admin",
          "/api/",
          "/ouvrages/*/apercu",
          "/ouvrages/*/telecharger",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
