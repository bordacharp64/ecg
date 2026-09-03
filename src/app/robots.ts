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
        // Espaces personnels et fichiers : rien a indexer.
        disallow: [
          "/bibliotheque",
          "/mon-compte",
          "/admin",
          "/api/",
          "/auth/",
          "/connexion",
        ],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
  };
}
