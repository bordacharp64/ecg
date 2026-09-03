/**
 * =========================================================================
 *  CATALOGUE DES OUVRAGES
 * =========================================================================
 *  Un ouvrage = une oeuvre dans une langue. La traduction anglaise du
 *  volume 1 est donc une seconde entree, avec le meme `work` mais
 *  `language: "en"`. C'est ce qui permet au site de proposer d'abord la
 *  version dans la langue du visiteur.
 *
 *  POUR CHAQUE OUVRAGE
 *    slug        identifiant dans l'URL (minuscules, tirets, sans accent)
 *    work        identifiant de l'oeuvre, commun a toutes ses traductions
 *    language    code de langue ISO 639-1 : "fr", "en", "es", "de", "it"...
 *    fileName    nom exact du PDF depose dans le stockage prive
 *    volume      numero du volume dans la collection (1, 2, 3, 4...)
 *    accent      couleur de la vignette : "teal" | "cyan" | "orange" | "green" | "purple"
 *    published   false = affiche « a paraitre », ni apercu ni telechargement
 *    previewPages nombre de pages consultables en ligne sans telechargement
 *    coverImage  chemin dans public/, ou null pour la couverture generee
 *    pages       nombre de pages de l'ouvrage complet (indicatif)
 *    updatedAt   date de la version en ligne, au format "AAAA-MM"
 *
 *  AJOUTER UNE TRADUCTION
 *  Dupliquez l'entree, changez `slug`, `language`, `fileName` et traduisez
 *  les textes. Gardez le meme `work` et le meme `volume`.
 * =========================================================================
 */

export type BookAccent = "teal" | "cyan" | "orange" | "green" | "purple";

export type Book = {
  slug: string;
  work: string;
  language: string;
  fileName: string;
  title: string;
  subtitle: string;
  volume: number;
  accent: BookAccent;
  published: boolean;
  previewPages: number;
  coverImage: string | null;
  pages: number | null;
  updatedAt: string;
  description: string;
  highlights: string[];
  contents: string[];
};

export const books: Book[] = [
  // =======================================================================
  //  VOLUME 1 — Semiologie
  // =======================================================================
  {
    slug: "semiologie-electrocardiographique",
    work: "semiologie",
    language: "fr",
    fileName: "semiologie-electrocardiographique-fr.pdf",
    title: "Sémiologie électrocardiographique",
    subtitle: "Lire un ECG : la grammaire du tracé",
    volume: 1,
    accent: "teal",
    published: true,
    previewPages: 20,
    coverImage: null,
    pages: null,
    updatedAt: "2026-09",
    description:
      "Le point de départ de la collection. Cet ouvrage reprend, signal par signal, la sémiologie de l'électrocardiogramme normal et pathologique : de la genèse du potentiel d'action à la lecture méthodique des douze dérivations. Les tracés sont interactifs : mesures, calibrations et légendes se dévoilent au survol.",
    highlights: [
      "Une méthode de lecture systématique, applicable en stage dès le premier jour",
      "Plus de 100 tracés authentiques annotés et cliquables",
      "Les pièges classiques de l'interprétation, signalés au fil du texte",
    ],
    contents: [
      "Genèse et propagation de l'activation cardiaque",
      "Les dérivations : construction et projection vectorielle",
      "Onde P, intervalle PR, complexe QRS, segment ST, onde T, onde U",
      "L'axe électrique et son calcul",
      "La méthode de lecture en huit temps",
      "Les variantes de la normale selon l'âge et le morphotype",
    ],
  },

  // -----------------------------------------------------------------------
  // A COMPLETER : titres et textes reels des volumes 2 a 4, puis passer
  // `published` a true quand le PDF correspondant est en ligne.
  // -----------------------------------------------------------------------
  {
    slug: "troubles-du-rythme",
    work: "rythme",
    language: "fr",
    fileName: "troubles-du-rythme-fr.pdf",
    title: "Les troubles du rythme",
    subtitle: "Reconnaître et classer les arythmies",
    volume: 2,
    accent: "cyan",
    published: false,
    previewPages: 20,
    coverImage: null,
    pages: null,
    updatedAt: "2026-09",
    description:
      "Des extrasystoles isolées aux tachycardies ventriculaires soutenues : une démarche diagnostique pour identifier le mécanisme d'une arythmie à partir du seul tracé de surface.",
    highlights: [
      "Arbres décisionnels devant une tachycardie régulière puis irrégulière",
      "Les manœuvres diagnostiques et leur interprétation",
      "Cas cliniques progressifs avec correction détaillée",
    ],
    contents: [
      "Mécanismes des arythmies : automatisme, réentrée, post-dépolarisations",
      "Tachycardies supraventriculaires",
      "Fibrillation et flutter atriaux",
      "Tachycardies ventriculaires et diagnostic différentiel",
      "Les arythmies de l'enfant et du sportif",
    ],
  },
  {
    slug: "troubles-de-la-conduction",
    work: "conduction",
    language: "fr",
    fileName: "troubles-de-la-conduction-fr.pdf",
    title: "Les troubles de la conduction",
    subtitle: "Blocs sino-auriculaires, atrio-ventriculaires et de branche",
    volume: 3,
    accent: "purple",
    published: false,
    previewPages: 20,
    coverImage: null,
    pages: null,
    updatedAt: "2026-09",
    description:
      "Localiser le siège d'un bloc, en apprécier le degré et le risque évolutif : les critères électrocardiographiques qui orientent la décision, jusqu'à l'indication de stimulation.",
    highlights: [
      "Du bloc de premier degré au bloc complet : critères et sièges",
      "Blocs de branche, hémiblocs et blocs bi- et trifasciculaires",
      "Reconnaître les tracés de stimulateur cardiaque",
    ],
    contents: [
      "Dysfonction sinusale",
      "Blocs atrio-ventriculaires : degrés et localisation",
      "Blocs de branche droit et gauche",
      "Hémiblocs et associations",
      "ECG et stimulation cardiaque",
    ],
  },
  {
    slug: "ecg-et-ischemie-myocardique",
    work: "ischemie",
    language: "fr",
    fileName: "ecg-et-ischemie-myocardique-fr.pdf",
    title: "ECG et ischémie myocardique",
    subtitle: "L'urgence coronaire sur le tracé",
    volume: 4,
    accent: "orange",
    published: false,
    previewPages: 20,
    coverImage: null,
    pages: null,
    updatedAt: "2026-09",
    description:
      "Le tracé au service de la décision urgente : reconnaître un syndrome coronaire aigu, en déduire le territoire et l'artère coupable, et repérer les formes trompeuses qui retardent la reperfusion.",
    highlights: [
      "Territoires coronaires et artère coupable déduits du tracé",
      "Les équivalents de sus-décalage à ne pas manquer",
      "Diagnostics différentiels du sus-décalage de ST",
    ],
    contents: [
      "Physiopathologie du signal ischémique",
      "Syndromes coronaires aigus avec sus-décalage de ST",
      "Formes sans sus-décalage et équivalents",
      "Séquelles de nécrose",
      "Les pièges : repolarisation précoce, péricardite, Brugada, embolie pulmonaire",
    ],
  },

  // =======================================================================
  //  TRADUCTIONS
  // =======================================================================
  //  Exemple de traduction anglaise du volume 1, laissee en « a paraitre ».
  //  Elle sert de gabarit : dupliquez-la pour chaque nouvelle langue. Tant
  //  que `published` vaut false, elle n'apparait que comme annonce.
  {
    slug: "electrocardiographic-semiology",
    work: "semiologie",
    language: "en",
    fileName: "semiologie-electrocardiographique-en.pdf",
    title: "Electrocardiographic Semiology",
    subtitle: "Reading an ECG: the grammar of the tracing",
    volume: 1,
    accent: "teal",
    published: false,
    previewPages: 20,
    coverImage: null,
    pages: null,
    updatedAt: "2026-09",
    description:
      "The starting point of the collection. Signal by signal, this volume covers the semiology of the normal and abnormal electrocardiogram, from the genesis of the action potential to the systematic reading of the twelve leads. The tracings are interactive: measurements, calibration and labels are revealed on hover.",
    highlights: [
      "A systematic reading method, usable on the ward from day one",
      "Over 100 annotated, clickable real-world tracings",
      "The classic interpretation pitfalls, flagged throughout",
    ],
    contents: [
      "Genesis and propagation of cardiac activation",
      "The leads: construction and vector projection",
      "P wave, PR interval, QRS complex, ST segment, T wave, U wave",
      "The electrical axis and how to compute it",
      "The eight-step reading method",
      "Normal variants by age and body habitus",
    ],
  },
];

export function getBook(slug: string): Book | undefined {
  return books.find((book) => book.slug === slug);
}

/** Toutes les langues effectivement presentes au catalogue. */
export function catalogueLanguages(): string[] {
  return [...new Set(books.map((book) => book.language))];
}

/** Langues dans lesquelles au moins un ouvrage est telechargeable. */
export function publishedLanguages(): string[] {
  return [
    ...new Set(books.filter((book) => book.published).map((b) => b.language)),
  ];
}

/** Les traductions d'une meme oeuvre, la version donnee exclue. */
export function translationsOf(book: Book): Book[] {
  return books.filter(
    (other) => other.work === book.work && other.slug !== book.slug,
  );
}
