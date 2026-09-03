/**
 * =========================================================================
 *  LIBELLES DE L'INTERFACE
 * =========================================================================
 *  Le francais fait foi : toute clef absente d'une traduction retombe sur le
 *  francais plutot que d'afficher un identifiant technique.
 *
 *  AJOUTER UNE LANGUE
 *  Dupliquez le bloc `en`, traduisez, et ajoutez le code dans UI_LANGUAGES
 *  (src/lib/langue.ts). Le selecteur de langue se met a jour tout seul.
 *
 *  Les pages editoriales et juridiques (mentions legales, donnees
 *  personnelles, la collection, aide a la lecture) restent en francais : ce
 *  sont des textes propres a l'institut, a faire valider avant traduction.
 * =========================================================================
 */

/**
 * Le francais fait office de secours. Volontairement defini ici plutot
 * qu'importe depuis `langue.ts` : ce module ne doit dependre de rien, pour
 * rester testable et ne pas creer de cycle d'imports.
 */
const FALLBACK = "fr";

const fr = {
  // -- Navigation et pied de page -----------------------------------------
  "nav.home": "Accueil",
  "nav.books": "Les ouvrages",
  "nav.collection": "La collection",
  "nav.help": "Aide à la lecture",
  "nav.mainLabel": "Navigation principale",
  "nav.skipToContent": "Aller au contenu principal",
  "brand.title": "Bibliothèque ECG",
  "brand.subtitle": "IHU Liryc · Formation",
  "brand.homeLabel": "Bibliothèque ECG, IHU Liryc — retour à l'accueil",
  "footer.navigate": "Naviguer",
  "footer.information": "Informations",
  "footer.legal": "Mentions légales",
  "footer.privacy": "Données personnelles",
  "footer.myData": "Mes données",
  "footer.blurb":
    "Une collection d'ouvrages d'interprétation de l'électrocardiogramme, mise gratuitement à la disposition des étudiants en médecine par l'institut de rythmologie et modélisation cardiaque.",
  "footer.rights": "Tous droits réservés.",
  "footer.usage":
    "Ouvrages diffusés à des fins pédagogiques, sans reproduction ni revente.",

  // -- Sélecteur de langue ------------------------------------------------
  "lang.label": "Langue",
  "lang.chooseLabel": "Choisir la langue du site",
  "lang.detected":
    "Nous avons détecté votre langue automatiquement. Vous pouvez la changer à tout moment.",

  // -- Accueil ------------------------------------------------------------
  "home.badge": "Gratuit · Étudiants en médecine",
  "home.title1": "Apprendre à lire un ECG,",
  "home.title2": "tracé après tracé.",
  "home.intro":
    "Des ouvrages d'interprétation de l'électrocardiogramme, écrits et mis en page à l'IHU Liryc. Des PDF interactifs : les tracés se laissent explorer, mesurer et annoter. Mis à disposition sans frais des étudiants en médecine.",
  "home.cta": "Voir les ouvrages",
  "home.ctaSecondary": "Comment ça marche",
  "home.statBooks": "Ouvrages",
  "home.statAvailable": "Disponibles",
  "home.statPrice": "Prix",
  "home.free": "0 €",
  "home.collectionEyebrow": "La collection",
  "home.collectionTitle": "Quatre volumes, une progression",
  "home.collectionIntro":
    "Chaque volume se lit seul, mais la collection suit l'ordre dans lequel on apprend l'ECG : d'abord la grammaire du tracé, puis le rythme, la conduction et l'ischémie.",
  "home.stepsEyebrow": "En pratique",
  "home.stepsTitle": "Feuilleter, puis télécharger",
  "home.step1Title": "Je feuillette en ligne",
  "home.step1Body":
    "Les vingt premières pages de chaque ouvrage s'ouvrent directement dans le navigateur, sans rien remplir.",
  "home.step2Title": "Je remplis la fiche",
  "home.step2Body":
    "Au moment du téléchargement seulement : nom, pays, statut, faculté, e-mail. Moins d'une minute.",
  "home.step3Title": "Je télécharge",
  "home.step3Body":
    "Le PDF complet arrive aussitôt. Sur cet appareil, les téléchargements suivants sont en un clic.",
  "home.interactiveEyebrow": "Des PDF interactifs",
  "home.interactiveTitle": "Le tracé n'est pas une image, c'est un exercice",
  "home.interactiveIntro":
    "Les ouvrages exploitent les fonctions interactives du format PDF : masquer puis révéler une interprétation, dérouler une légende, se déplacer d'un chapitre à l'autre par les liens du sommaire.",
  "home.interactive1": "Interprétations masquées, à révéler après avoir cherché",
  "home.interactive2": "Sommaire cliquable et renvois internes entre chapitres",
  "home.interactive3": "Zoom sans perte sur les tracés, calibration visible",
  "home.interactive4": "Lecture hors ligne, sur ordinateur ou tablette",
  "home.interactiveLink": "Comment ouvrir un PDF interactif",
  "home.noticeTitle": "À savoir",
  "home.noticeBody":
    "Les fonctions interactives ne s'affichent pas dans la visionneuse PDF intégrée aux navigateurs, ni dans l'aperçu des messageries.",
  "home.noticeBody2":
    "Téléchargez le fichier, puis ouvrez-le avec un lecteur complet (Adobe Acrobat Reader, gratuit, sur ordinateur comme sur tablette). Le reste du contenu, lui, reste lisible partout.",

  // -- Catalogue ----------------------------------------------------------
  "books.title": "Les ouvrages",
  "books.eyebrow": "La collection",
  "books.intro":
    "Feuilletez les vingt premières pages de chaque volume sans rien remplir. La fiche d'identification n'est demandée qu'au téléchargement.",
  "books.inYourLanguage": "Dans votre langue",
  "books.otherLanguages": "Autres langues disponibles",
  "books.sectionIn": "Ouvrages en",
  "books.noneInLanguage":
    "Aucun ouvrage n'est encore paru dans votre langue. Voici les volumes disponibles en français et en anglais.",
  "books.volume": "Volume",
  "books.available": "Disponible",
  "books.comingSoon": "À paraître",
  "books.discover": "Découvrir",
  "books.details": "Fiche détaillée",
  "books.alsoIn": "Également en",

  // -- Fiche d'ouvrage ----------------------------------------------------
  "book.breadcrumb": "Fil d'Ariane",
  "book.format": "Format",
  "book.formatValue": "PDF interactif",
  "book.language": "Langue",
  "book.pages": "Pages",
  "book.version": "Version",
  "book.price": "Prix",
  "book.preview": "Feuilleter 20 pages",
  "book.previewShort": "Feuilleter",
  "book.download": "Télécharger le PDF",
  "book.downloadAgain": "Télécharger à nouveau",
  "book.notifyMe": "Être informé de la parution",
  "book.presentation": "Présentation",
  "book.whatYouFind": "Ce que vous y trouverez",
  "book.contents": "Sommaire",
  "book.readingTitle": "Lire ce PDF interactif",
  "book.readingBody":
    "Enregistrez le fichier sur votre appareil, puis ouvrez-le avec Adobe Acrobat Reader. Les interprétations masquées et les renvois du sommaire ne fonctionnent pas dans la visionneuse du navigateur.",
  "book.readingLink": "Guide de lecture",
  "book.usageTitle": "Conditions d'usage",
  "book.usageBody":
    "Ouvrage diffusé à des fins pédagogiques, pour un usage personnel. Sa reproduction, sa rediffusion et sa revente ne sont pas autorisées.",
  "book.comingSoonTitle": "Volume à paraître",
  "book.comingSoonBody":
    "Ce volume n'est pas encore disponible. Le volume 1 l'est, et suit la même méthode.",
  "book.otherVersionsTitle": "Autres langues",

  // -- Aperçu en ligne ----------------------------------------------------
  "preview.title": "Aperçu",
  "preview.of": "Aperçu de",
  "preview.pagesOf": "Les {n} premières pages",
  "preview.loading": "Chargement de l'aperçu…",
  "preview.failed":
    "L'aperçu n'a pas pu être chargé. Vous pouvez télécharger l'ouvrage complet, ou réessayer.",
  "preview.page": "Page",
  "preview.of2": "sur",
  "preview.previous": "Page précédente",
  "preview.next": "Page suivante",
  "preview.zoomIn": "Agrandir",
  "preview.zoomOut": "Réduire",
  "preview.endTitle": "Fin de l'aperçu",
  "preview.endBody":
    "Vous avez atteint la dernière page consultable en ligne. La suite est dans l'ouvrage complet, gratuit.",
  "preview.backToBook": "Retour à la fiche",
  "preview.notice":
    "Cet aperçu est une image des pages : les fonctions interactives ne s'activent que dans le PDF téléchargé, ouvert avec Adobe Acrobat Reader.",

  // -- Fiche d'identification ---------------------------------------------
  "form.title": "Avant de télécharger",
  "form.intro":
    "Ces informations nous servent à mesurer la diffusion des ouvrages auprès des facultés. Elles ne sont demandées qu'une fois : sur cet appareil, vos téléchargements suivants seront immédiats.",
  "form.downloading": "Vous allez télécharger",
  "form.firstName": "Prénom",
  "form.lastName": "Nom",
  "form.email": "Adresse e-mail",
  "form.emailHelp":
    "Votre adresse universitaire de préférence. Elle nous permet de vous prévenir des nouvelles versions si vous le souhaitez.",
  "form.country": "Pays",
  "form.countryPlaceholder": "Choisissez votre pays",
  "form.status": "Statut",
  "form.statusPlaceholder": "Choisissez votre statut",
  "form.university": "Faculté de médecine",
  "form.universityPlaceholder": "Choisissez votre faculté",
  "form.universityOther": "Autre faculté (préciser)",
  "form.universityFreeText": "Nom de votre faculté de médecine",
  "form.universityAfterCountry": "Choisissez d'abord votre pays",
  // La phrase de consentement est decoupee pour insérer le lien en son
  // milieu sans concatener du HTML dans une traduction.
  "form.privacyBefore": "J'ai lu et j'accepte la",
  "form.privacyLink": "politique de confidentialité",
  "form.privacyAfter": "ainsi que les conditions d'usage des ouvrages.",
  "form.newsletter":
    "Je souhaite être informé des nouvelles parutions et traductions. (facultatif)",
  "form.submit": "Valider et télécharger",
  "form.submitting": "Préparation du téléchargement…",
  "form.consents": "Consentements",
  "form.required": "Champ obligatoire",
  "form.optional": "facultatif",
  "form.startingTitle": "Téléchargement lancé",
  "form.startingBody":
    "Le téléchargement de votre ouvrage a démarré. S'il ne se lance pas, utilisez le lien ci-dessous.",
  "form.startingLink": "Relancer le téléchargement",
  "form.serverError":
    "Le serveur n'a pas répondu. Vérifiez votre connexion et réessayez.",
  "form.knownReaderTitle": "Vous êtes déjà identifié",
  "form.knownReaderBody":
    "Vos informations sont enregistrées sur cet appareil. Le téléchargement démarre immédiatement.",

  // -- Mes données --------------------------------------------------------
  "data.title": "Mes données",
  "data.intro":
    "Ces informations sont celles que vous avez saisies au moment d'un téléchargement.",
  "data.none":
    "Aucune information n'est enregistrée sur cet appareil. Si vous avez déjà téléchargé un ouvrage depuis un autre navigateur, écrivez-nous pour exercer vos droits.",
  "data.myInfo": "Mes informations",
  "data.myDownloads": "Mes téléchargements",
  "data.export": "Télécharger mes données (JSON)",
  "data.rightsTitle": "Mes droits",
  "data.rightsBody":
    "Conformément au règlement général sur la protection des données, vous pouvez récupérer une copie de vos données ou demander leur effacement à tout moment.",
  "data.delete": "Supprimer mes données",
  "data.deleteConfirmTitle": "Confirmer la suppression définitive ?",
  "data.deleteConfirmBody":
    "Vos informations et votre historique de téléchargement seront effacés sans possibilité de restauration. Les PDF déjà enregistrés sur vos appareils ne sont pas concernés.",
  "data.deleteConfirm": "Oui, supprimer définitivement",
  "data.cancel": "Annuler",
  "data.deleteFailed":
    "La suppression a échoué. Réessayez, ou écrivez-nous.",
  "data.correctBody": "Pour corriger une information, écrivez à",

  // -- Divers -------------------------------------------------------------
  "error.404Title": "Cette page n'existe pas",
  "error.404Body":
    "Le lien est peut-être erroné, ou la page a été déplacée. La bibliothèque, elle, est toujours là.",
  "error.backHome": "Retour à l'accueil",
} as const;

export type MessageKey = keyof typeof fr;

const en: Partial<Record<MessageKey, string>> = {
  "nav.home": "Home",
  "nav.books": "The books",
  "nav.collection": "The collection",
  "nav.help": "Reading guide",
  "nav.mainLabel": "Main navigation",
  "nav.skipToContent": "Skip to main content",
  "brand.title": "ECG Library",
  "brand.subtitle": "IHU Liryc · Education",
  "brand.homeLabel": "ECG Library, IHU Liryc — back to home",
  "footer.navigate": "Navigate",
  "footer.information": "Information",
  "footer.legal": "Legal notice",
  "footer.privacy": "Personal data",
  "footer.myData": "My data",
  "footer.blurb":
    "A collection of books on electrocardiogram interpretation, made freely available to medical students by the institute of cardiac rhythmology and modelling.",
  "footer.rights": "All rights reserved.",
  "footer.usage":
    "Distributed for educational purposes. No reproduction or resale.",

  "lang.label": "Language",
  "lang.chooseLabel": "Choose the site language",
  "lang.detected":
    "We detected your language automatically. You can change it at any time.",

  "home.badge": "Free · Medical students",
  "home.title1": "Learning to read an ECG,",
  "home.title2": "one tracing at a time.",
  "home.intro":
    "Books on electrocardiogram interpretation, written and typeset at IHU Liryc. Interactive PDFs: the tracings can be explored, measured and annotated. Made available to medical students at no cost.",
  "home.cta": "Browse the books",
  "home.ctaSecondary": "How it works",
  "home.statBooks": "Books",
  "home.statAvailable": "Available",
  "home.statPrice": "Price",
  "home.free": "Free",
  "home.collectionEyebrow": "The collection",
  "home.collectionTitle": "Four volumes, one progression",
  "home.collectionIntro":
    "Each volume stands alone, but the collection follows the order in which the ECG is actually learnt: first the grammar of the tracing, then rhythm, conduction and ischaemia.",
  "home.stepsEyebrow": "In practice",
  "home.stepsTitle": "Browse first, then download",
  "home.step1Title": "Browse online",
  "home.step1Body":
    "The first twenty pages of every book open straight in your browser, with nothing to fill in.",
  "home.step2Title": "Fill in the form",
  "home.step2Body":
    "Only when you download: name, country, status, medical school, e-mail. Under a minute.",
  "home.step3Title": "Download",
  "home.step3Body":
    "The full PDF arrives at once. On this device, later downloads take one click.",
  "home.interactiveEyebrow": "Interactive PDFs",
  "home.interactiveTitle": "A tracing is not a picture, it is an exercise",
  "home.interactiveIntro":
    "The books use the interactive features of the PDF format: hiding then revealing an interpretation, unfolding a caption, moving between chapters through the table of contents.",
  "home.interactive1": "Hidden interpretations, revealed once you have tried",
  "home.interactive2": "Clickable contents and cross-references between chapters",
  "home.interactive3": "Lossless zoom on the tracings, with visible calibration",
  "home.interactive4": "Offline reading, on a computer or a tablet",
  "home.interactiveLink": "How to open an interactive PDF",
  "home.noticeTitle": "Worth knowing",
  "home.noticeBody":
    "Interactive features do not appear in the PDF viewer built into web browsers, nor in e-mail previews.",
  "home.noticeBody2":
    "Download the file, then open it with a full reader (Adobe Acrobat Reader, free, on computer and tablet alike). The rest of the content stays readable anywhere.",

  "books.title": "The books",
  "books.eyebrow": "The collection",
  "books.intro":
    "Browse the first twenty pages of any volume with nothing to fill in. The identification form is only asked for at download.",
  "books.inYourLanguage": "In your language",
  "books.otherLanguages": "Also available in",
  "books.sectionIn": "Books in",
  "books.noneInLanguage":
    "No book has been published in your language yet. Here are the volumes available in French and English.",
  "books.volume": "Volume",
  "books.available": "Available",
  "books.comingSoon": "Coming soon",
  "books.discover": "Find out more",
  "books.details": "Full details",
  "books.alsoIn": "Also in",

  "book.breadcrumb": "Breadcrumb",
  "book.format": "Format",
  "book.formatValue": "Interactive PDF",
  "book.language": "Language",
  "book.pages": "Pages",
  "book.version": "Version",
  "book.price": "Price",
  "book.preview": "Browse 20 pages",
  "book.previewShort": "Browse",
  "book.download": "Download the PDF",
  "book.downloadAgain": "Download again",
  "book.notifyMe": "Notify me when it is out",
  "book.presentation": "About this book",
  "book.whatYouFind": "What you will find",
  "book.contents": "Contents",
  "book.readingTitle": "Reading this interactive PDF",
  "book.readingBody":
    "Save the file to your device, then open it with Adobe Acrobat Reader. Hidden interpretations and contents links do not work in the browser viewer.",
  "book.readingLink": "Reading guide",
  "book.usageTitle": "Terms of use",
  "book.usageBody":
    "Distributed for educational purposes, for personal use. Reproduction, redistribution and resale are not permitted.",
  "book.comingSoonTitle": "Coming soon",
  "book.comingSoonBody":
    "This volume is not available yet. Volume 1 is, and follows the same method.",
  "book.otherVersionsTitle": "Other languages",

  "preview.title": "Preview",
  "preview.of": "Preview of",
  "preview.pagesOf": "The first {n} pages",
  "preview.loading": "Loading the preview…",
  "preview.failed":
    "The preview could not be loaded. You can download the full book, or try again.",
  "preview.page": "Page",
  "preview.of2": "of",
  "preview.previous": "Previous page",
  "preview.next": "Next page",
  "preview.zoomIn": "Zoom in",
  "preview.zoomOut": "Zoom out",
  "preview.endTitle": "End of preview",
  "preview.endBody":
    "You have reached the last page available online. The rest is in the full book, free of charge.",
  "preview.backToBook": "Back to the book",
  "preview.notice":
    "This preview shows the pages as images: interactive features only work in the downloaded PDF, opened with Adobe Acrobat Reader.",

  "form.title": "Before you download",
  "form.intro":
    "We use these details to measure how widely the books reach medical schools. They are asked for once only: on this device, your later downloads will be immediate.",
  "form.downloading": "You are about to download",
  "form.firstName": "First name",
  "form.lastName": "Last name",
  "form.email": "E-mail address",
  "form.emailHelp":
    "Your university address preferably. It lets us tell you about new versions if you wish.",
  "form.country": "Country",
  "form.countryPlaceholder": "Choose your country",
  "form.status": "Status",
  "form.statusPlaceholder": "Choose your status",
  "form.university": "Medical school",
  "form.universityPlaceholder": "Choose your medical school",
  "form.universityOther": "Other school (please specify)",
  "form.universityFreeText": "Name of your medical school",
  "form.universityAfterCountry": "Choose your country first",
  "form.privacyBefore": "I have read and accept the",
  "form.privacyLink": "privacy policy",
  "form.privacyAfter": "as well as the terms of use of the books.",
  "form.newsletter":
    "I would like to hear about new volumes and translations. (optional)",
  "form.submit": "Confirm and download",
  "form.submitting": "Preparing your download…",
  "form.consents": "Consents",
  "form.required": "Required field",
  "form.optional": "optional",
  "form.startingTitle": "Download started",
  "form.startingBody":
    "Your download has started. If nothing happens, use the link below.",
  "form.startingLink": "Restart the download",
  "form.serverError":
    "The server did not respond. Check your connection and try again.",
  "form.knownReaderTitle": "You are already identified",
  "form.knownReaderBody":
    "Your details are saved on this device. The download starts immediately.",

  "data.title": "My data",
  "data.intro":
    "These are the details you entered when downloading a book.",
  "data.none":
    "No details are stored on this device. If you downloaded a book from another browser, write to us to exercise your rights.",
  "data.myInfo": "My details",
  "data.myDownloads": "My downloads",
  "data.export": "Download my data (JSON)",
  "data.rightsTitle": "My rights",
  "data.rightsBody":
    "Under the General Data Protection Regulation, you may obtain a copy of your data or request its erasure at any time.",
  "data.delete": "Delete my data",
  "data.deleteConfirmTitle": "Confirm permanent deletion?",
  "data.deleteConfirmBody":
    "Your details and download history will be erased with no way to restore them. PDFs already saved on your devices are unaffected.",
  "data.deleteConfirm": "Yes, delete permanently",
  "data.cancel": "Cancel",
  "data.deleteFailed": "Deletion failed. Try again, or write to us.",
  "data.correctBody": "To correct a detail, write to",

  "error.404Title": "This page does not exist",
  "error.404Body":
    "The link may be wrong, or the page may have moved. The library is still here.",
  "error.backHome": "Back to home",
};

const dictionaries: Record<string, Partial<Record<MessageKey, string>>> = {
  fr,
  en,
};

export type Translator = {
  (key: MessageKey, values?: Record<string, string | number>): string;
  language: string;
};

/**
 * Fabrique la fonction de traduction d'une langue. Les valeurs passees en
 * second argument remplacent les jetons `{nom}` du libelle.
 */
export function translator(language: string): Translator {
  const dictionary = dictionaries[language] ?? dictionaries[FALLBACK];

  const translate = ((key: MessageKey, values) => {
    const template = dictionary?.[key] ?? fr[key] ?? String(key);
    if (!values) return template;

    return Object.entries(values).reduce(
      (text, [name, value]) => text.replaceAll(`{${name}}`, String(value)),
      template,
    );
  }) as Translator;

  translate.language = language;
  return translate;
}

/** Clefs manquantes d'une traduction : utilisee par le test de completude. */
export function missingKeys(language: string): MessageKey[] {
  const dictionary = dictionaries[language];
  if (!dictionary) return Object.keys(fr) as MessageKey[];
  return (Object.keys(fr) as MessageKey[]).filter((key) => !dictionary[key]);
}
