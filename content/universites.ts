/**
 * =========================================================================
 *  FACULTES DE MEDECINE PAR PAYS
 * =========================================================================
 *  Les pays presents dans cette table affichent un menu deroulant ; les
 *  autres affichent un champ de saisie libre. C'est volontaire : une liste
 *  mondiale partielle est pire qu'une saisie libre, parce qu'un etudiant qui
 *  ne trouve pas sa faculte choisit au hasard et fausse les statistiques.
 *
 *  AJOUTER UN PAYS
 *  Ajoutez une entree avec son code ISO et la liste de ses facultes, triee
 *  alphabetiquement. Le menu deroulant apparait automatiquement, et l'option
 *  « Autre » reste toujours proposee en fin de liste.
 *
 *  A VERIFIER AVANT MISE EN LIGNE
 *  Ces listes sont un point de depart etabli de bonne foi, a faire relire par
 *  l'equipe formation : les facultes fusionnent, changent de nom et de
 *  rattachement plus souvent qu'on ne le croit.
 * =========================================================================
 */

export const universitiesByCountry: Record<string, string[]> = {
  // France : la medecine y est delivree par les universites publiques.
  // Il n'existe pas d'etablissement prive delivrant le diplome francais.
  FR: [
    "Aix-Marseille Université",
    "Nantes Université",
    "Sorbonne Université",
    "Université Claude Bernard Lyon 1",
    "Université Clermont Auvergne",
    "Université Côte d'Azur (Nice)",
    "Université d'Angers",
    "Université de Bordeaux",
    "Université de Bourgogne (Dijon)",
    "Université de Bretagne Occidentale (Brest)",
    "Université de Caen Normandie",
    "Université de Franche-Comté (Besançon)",
    "Université de La Réunion",
    "Université de Lille",
    "Université de Limoges",
    "Université de Lorraine (Nancy)",
    "Université de Montpellier",
    "Université de Picardie Jules Verne (Amiens)",
    "Université de Poitiers",
    "Université de Reims Champagne-Ardenne",
    "Université de Rennes",
    "Université de Rouen Normandie",
    "Université de Strasbourg",
    "Université de Tours",
    "Université des Antilles",
    "Université Grenoble Alpes",
    "Université Jean Monnet Saint-Étienne",
    "Université Paris Cité",
    "Université Paris-Est Créteil",
    "Université Paris-Saclay",
    "Université Sorbonne Paris Nord (Bobigny)",
    "Université Toulouse III – Paul Sabatier",
  ],

  BE: [
    "KU Leuven",
    "UCLouvain",
    "Université de Liège",
    "Université de Mons",
    "Université de Namur",
    "Université libre de Bruxelles (ULB)",
    "Universiteit Antwerpen",
    "Universiteit Gent",
    "Universiteit Hasselt",
    "Vrije Universiteit Brussel (VUB)",
  ],

  CH: [
    "Università della Svizzera italiana (Lugano)",
    "Universität Basel",
    "Universität Bern",
    "Universität Zürich",
    "Université de Fribourg",
    "Université de Genève",
    "Université de Lausanne",
  ],

  CA: [
    "Dalhousie University",
    "McGill University",
    "McMaster University",
    "Memorial University of Newfoundland",
    "NOSM University",
    "Queen's University",
    "Université de Montréal",
    "Université de Sherbrooke",
    "Université Laval",
    "University of Alberta",
    "University of British Columbia",
    "University of Calgary",
    "University of Manitoba",
    "University of Ottawa",
    "University of Saskatchewan",
    "University of Toronto",
    "Western University",
  ],

  LU: ["Université du Luxembourg"],

  MA: [
    "Université Abdelmalek Essaâdi (Tanger)",
    "Université Cadi Ayyad (Marrakech)",
    "Université Hassan II (Casablanca)",
    "Université Ibn Zohr (Agadir)",
    "Université Internationale Abulcasis des Sciences de la Santé (privée, Rabat)",
    "Université Mohammed Premier (Oujda)",
    "Université Mohammed V (Rabat)",
    "Université Mohammed VI des Sciences de la Santé (privée, Casablanca)",
    "Université Sidi Mohamed Ben Abdellah (Fès)",
  ],

  TN: [
    "Faculté de médecine de Monastir",
    "Faculté de médecine de Sfax",
    "Faculté de médecine de Sousse",
    "Faculté de médecine de Tunis",
  ],

  DZ: [
    "Université Abou Bekr Belkaïd (Tlemcen)",
    "Université Ahmed Ben Bella (Oran)",
    "Université Badji Mokhtar (Annaba)",
    "Université Batna 2",
    "Université Benyoucef Benkhedda (Alger)",
    "Université Djillali Liabès (Sidi Bel Abbès)",
    "Université Ferhat Abbas (Sétif)",
    "Université Mouloud Mammeri (Tizi Ouzou)",
    "Université Saad Dahlab (Blida)",
    "Université Salah Boubnider (Constantine)",
  ],

  SN: [
    "Université Assane Seck (Ziguinchor)",
    "Université Cheikh Anta Diop (Dakar)",
    "Université de Thiès",
    "Université Gaston Berger (Saint-Louis)",
  ],

  CI: [
    "Université Alassane Ouattara (Bouaké)",
    "Université Félix Houphouët-Boigny (Abidjan)",
  ],

  CM: [
    "Université de Buéa",
    "Université de Douala",
    "Université de Yaoundé I",
    "Université des Montagnes (privée, Bangangté)",
  ],
};

/** Valeur envoyee par le formulaire quand la faculte n'est pas dans la liste. */
export const OTHER_UNIVERSITY = "__autre__";

export function hasUniversityList(countryCode: string): boolean {
  return Boolean(universitiesByCountry[countryCode.toUpperCase()]?.length);
}

export function universitiesFor(countryCode: string): string[] {
  return universitiesByCountry[countryCode.toUpperCase()] ?? [];
}

/** Pays disposant d'une liste, pour la documentation et l'administration. */
export function countriesWithList(): string[] {
  return Object.keys(universitiesByCountry).sort();
}
