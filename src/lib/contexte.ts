import { cookies, headers } from "next/headers";

import { translator, type Translator } from "@/lib/i18n";
import { LANGUAGE_COOKIE, resolveLanguage } from "@/lib/langue";

export type PageContext = {
  language: string;
  /** Comment la langue a ete determinee : sert a proposer un changement. */
  source: "cookie" | "navigateur" | "defaut";
  t: Translator;
};

/**
 * Contexte linguistique de la requete en cours. A appeler dans chaque page
 * ou composant serveur qui affiche du texte ou classe des ouvrages.
 *
 * Toute page qui appelle cette fonction est rendue a la demande et non
 * pre-generee : c'est voulu, puisque le contenu depend de l'en-tete
 * Accept-Language du visiteur.
 */
export async function pageContext(): Promise<PageContext> {
  const [jar, headerList] = await Promise.all([cookies(), headers()]);

  const { language, source } = resolveLanguage({
    cookieValue: jar.get(LANGUAGE_COOKIE)?.value ?? null,
    acceptLanguage: headerList.get("accept-language"),
  });

  return { language, source, t: translator(language) };
}
