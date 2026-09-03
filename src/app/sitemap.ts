import type { MetadataRoute } from "next";

import { books } from "#content/livres.ts";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.APP_URL ?? "http://localhost:3000").replace(
    /\/$/,
    "",
  );

  const staticRoutes = [
    "",
    "/ouvrages",
    "/la-collection",
    "/aide",
    "/mentions-legales",
    "/confidentialite",
  ];

  return [
    ...staticRoutes.map((path) => ({
      url: `${base}${path}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    // Les fiches d'ouvrage sont les pages a faire remonter : ce sont elles qui
    // repondent a une recherche du type « ECG semiologie PDF gratuit ».
    ...books.map((book) => ({
      url: `${base}/ouvrages/${book.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
