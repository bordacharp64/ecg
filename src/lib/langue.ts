import { books, catalogueLanguages, type Book } from "#content/livres.ts";

/**
 * Langues de l'interface. Le site s'ouvre en francais ; l'anglais suit des que
 * la premiere traduction est en ligne. Ajouter une langue ici ne suffit pas :
 * il faut aussi traduire les libelles dans `src/lib/i18n.ts`.
 */
export const UI_LANGUAGES = ["fr", "en"] as const;
export const DEFAULT_LANGUAGE = "fr";

/**
 * Langues privilegiees quand la langue du visiteur n'existe pas au catalogue.
 * L'ordre compte : le francais d'abord, puis l'anglais.
 */
export const FALLBACK_LANGUAGES = ["fr", "en"];

export const LANGUAGE_COOKIE = "ecg_langue";

/** Nom d'une langue dans sa propre langue : « Français », « English ». */
export function languageName(code: string, inLocale = code): string {
  try {
    const names = new Intl.DisplayNames([inLocale], { type: "language" });
    const name = names.of(code) ?? code;
    return name.charAt(0).toLocaleUpperCase(inLocale) + name.slice(1);
  } catch {
    return code.toUpperCase();
  }
}

/**
 * Analyse un en-tete Accept-Language et renvoie les codes de langue par
 * qualite decroissante. « fr-CA » est ramene a « fr » : le catalogue raisonne
 * par langue, pas par variante regionale.
 */
export function parseAcceptLanguage(header: string | null): string[] {
  if (!header) return [];

  return header
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const qParam = params.find((p) => p.trim().startsWith("q="));
      const quality = qParam ? Number.parseFloat(qParam.split("=")[1]) : 1;
      return {
        language: tag.trim().toLowerCase().split("-")[0],
        quality: Number.isFinite(quality) ? quality : 0,
      };
    })
    .filter((entry) => entry.language && entry.language !== "*")
    .sort((a, b) => b.quality - a.quality)
    .map((entry) => entry.language)
    .filter((language, index, all) => all.indexOf(language) === index);
}

/**
 * Langue retenue pour le visiteur, par ordre de priorite :
 *   1. le choix explicite enregistre dans le cookie (il gagne toujours) ;
 *   2. la premiere langue de son navigateur presente au catalogue ;
 *   3. la premiere langue de son navigateur disponible dans l'interface ;
 *   4. le francais.
 *
 * L'etape 2 passe avant l'etape 3 a dessein : un visiteur hispanophone dont le
 * navigateur demande « es, en » doit recevoir les livres en espagnol s'ils
 * existent, meme si l'interface n'est pas encore traduite en espagnol.
 */
export function resolveLanguage(options: {
  cookieValue?: string | null;
  acceptLanguage?: string | null;
}): { language: string; source: "cookie" | "navigateur" | "defaut" } {
  const { cookieValue, acceptLanguage } = options;

  const cookie = cookieValue?.trim().toLowerCase();
  if (cookie && isSelectableLanguage(cookie)) {
    return { language: cookie, source: "cookie" };
  }

  const preferred = parseAcceptLanguage(acceptLanguage ?? null);
  const catalogue = catalogueLanguages();

  const inCatalogue = preferred.find((code) => catalogue.includes(code));
  if (inCatalogue) return { language: inCatalogue, source: "navigateur" };

  const inUi = preferred.find((code) =>
    (UI_LANGUAGES as readonly string[]).includes(code),
  );
  if (inUi) return { language: inUi, source: "navigateur" };

  return { language: DEFAULT_LANGUAGE, source: "defaut" };
}

/** Une langue est selectionnable si l'interface la parle ou si des livres l'utilisent. */
export function isSelectableLanguage(code: string): boolean {
  return (
    (UI_LANGUAGES as readonly string[]).includes(code) ||
    catalogueLanguages().includes(code)
  );
}

// --------------------------------------------------------------------------
// Classement du catalogue
// --------------------------------------------------------------------------

export type BookGroup = {
  /** Titre de la section, par ex. « Ouvrages en français ». */
  language: string;
  /** Vrai s'il s'agit de la langue du visiteur. */
  isPreferred: boolean;
  books: Book[];
};

/**
 * Trie les ouvrages pour un visiteur donne :
 *   - d'abord ceux dans sa langue ;
 *   - puis, s'il n'y en a aucun, le francais et l'anglais ;
 *   - enfin les autres langues.
 * A l'interieur d'une langue, les volumes suivent l'ordre de la collection, et
 * les volumes disponibles passent devant ceux a paraitre.
 */
export function groupBooksForLanguage(language: string): BookGroup[] {
  const catalogue = catalogueLanguages();

  const order: string[] = [];
  if (catalogue.includes(language)) order.push(language);
  for (const code of FALLBACK_LANGUAGES) {
    if (code !== language && catalogue.includes(code)) order.push(code);
  }
  for (const code of catalogue) {
    if (!order.includes(code)) order.push(code);
  }

  return order.map((code) => ({
    language: code,
    isPreferred: code === language,
    books: books
      .filter((book) => book.language === code)
      .sort(
        (a, b) =>
          Number(b.published) - Number(a.published) || a.volume - b.volume,
      ),
  }));
}

/**
 * Liste plate, dans l'ordre de priorite. Utilisee la ou l'on ne veut pas de
 * sections : page d'accueil, listes courtes.
 */
export function booksForLanguage(language: string): Book[] {
  return groupBooksForLanguage(language).flatMap((group) => group.books);
}

/**
 * La meilleure version d'une oeuvre pour un visiteur : sa langue si elle
 * existe, sinon le francais, sinon l'anglais, sinon n'importe laquelle.
 */
export function bestVersionOf(work: string, language: string): Book | undefined {
  const versions = books.filter((book) => book.work === work);
  const preference = [
    language,
    ...FALLBACK_LANGUAGES.filter((code) => code !== language),
  ];

  for (const code of preference) {
    const published = versions.find((b) => b.language === code && b.published);
    if (published) return published;
  }
  for (const code of preference) {
    const any = versions.find((book) => book.language === code);
    if (any) return any;
  }
  return versions[0];
}

/**
 * Un representant par oeuvre, dans la meilleure langue disponible pour le
 * visiteur : c'est ce qu'il faut afficher sur la page d'accueil, ou l'on veut
 * quatre volumes et non huit traductions.
 */
export function worksForLanguage(language: string): Book[] {
  const seen = new Set<string>();
  const result: Book[] = [];

  for (const book of booksForLanguage(language)) {
    if (seen.has(book.work)) continue;
    const best = bestVersionOf(book.work, language);
    if (best) {
      seen.add(book.work);
      result.push(best);
    }
  }

  return result.sort(
    (a, b) => Number(b.published) - Number(a.published) || a.volume - b.volume,
  );
}
