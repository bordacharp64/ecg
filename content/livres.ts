/**
 * =========================================================================
 *  CATALOGUE DES OUVRAGES
 * =========================================================================
 *  C'est le seul fichier a modifier pour changer les textes, les titres, les
 *  sommaires ou ajouter un livre. Aucune connaissance de programmation n'est
 *  necessaire : il suffit de respecter les guillemets et les virgules.
 *
 *  Pour chaque livre :
 *    slug        identifiant technique dans l'URL (minuscules, tirets, sans accent)
 *    fileName    nom exact du fichier PDF depose dans le stockage prive
 *    title       titre affiche
 *    subtitle    sous-titre court
 *    volume      numero affiche sur la couverture ("Volume 1", ...)
 *    accent      couleur de la vignette : "teal" | "cyan" | "orange" | "green" | "purple"
 *    published   false = le livre apparait comme "a paraitre" et n'est pas telechargeable
 *    pages       nombre de pages (affiche a titre indicatif)
 *    updatedAt   date de la derniere version, au format "AAAA-MM"
 *    description 1 a 3 phrases de presentation
 *    highlights  points forts affiches en liste a puces
 *    contents    sommaire abrege
 * =========================================================================
 */

export type BookAccent = "teal" | "cyan" | "orange" | "green" | "purple";

export type Book = {
  slug: string;
  fileName: string;
  title: string;
  subtitle: string;
  volume: string;
  accent: BookAccent;
  published: boolean;
  pages: number | null;
  updatedAt: string;
  description: string;
  highlights: string[];
  contents: string[];
};

export const books: Book[] = [
  {
    slug: "semiologie-electrocardiographique",
    fileName: "semiologie-electrocardiographique.pdf",
    title: "Sémiologie électrocardiographique",
    subtitle: "Lire un ECG : la grammaire du tracé",
    volume: "Volume 1",
    accent: "teal",
    published: true,
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
  // A COMPLETER : les trois volumes suivants. Remplacez les titres et les
  // textes ci-dessous par les intitules reels, puis passez `published` a
  // true quand le PDF correspondant est en ligne.
  // -----------------------------------------------------------------------
  {
    slug: "troubles-du-rythme",
    fileName: "troubles-du-rythme.pdf",
    title: "Les troubles du rythme",
    subtitle: "Reconnaître et classer les arythmies",
    volume: "Volume 2",
    accent: "cyan",
    published: false,
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
    fileName: "troubles-de-la-conduction.pdf",
    title: "Les troubles de la conduction",
    subtitle: "Blocs sino-auriculaires, atrio-ventriculaires et de branche",
    volume: "Volume 3",
    accent: "purple",
    published: false,
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
    fileName: "ecg-et-ischemie-myocardique.pdf",
    title: "ECG et ischémie myocardique",
    subtitle: "L'urgence coronaire sur le tracé",
    volume: "Volume 4",
    accent: "orange",
    published: false,
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
];

export function getBook(slug: string): Book | undefined {
  return books.find((book) => book.slug === slug);
}

export const publishedBooks = () => books.filter((book) => book.published);
