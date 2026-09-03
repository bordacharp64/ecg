/**
 * =========================================================================
 *  STATUTS DECLARABLES AU TELECHARGEMENT
 * =========================================================================
 *  `group` sert uniquement a regrouper les options dans le menu deroulant.
 *  `value` est stocke en base : ne le modifiez pas sans migrer les donnees
 *  deja collectees, sinon les statistiques deviennent illisibles.
 * =========================================================================
 */

export type Status = {
  value: string;
  label: string;
  group: string;
  /** Vrai pour les etudiants du 2e cycle : sert aux statistiques. */
  isMedicalStudent: boolean;
};

export const statuses: Status[] = [
  {
    value: "etudiant-1",
    label: "Étudiant en médecine — 1re année",
    group: "Études de médecine",
    isMedicalStudent: true,
  },
  {
    value: "etudiant-2",
    label: "Étudiant en médecine — 2e année",
    group: "Études de médecine",
    isMedicalStudent: true,
  },
  {
    value: "etudiant-3",
    label: "Étudiant en médecine — 3e année",
    group: "Études de médecine",
    isMedicalStudent: true,
  },
  {
    value: "etudiant-4",
    label: "Étudiant en médecine — 4e année",
    group: "Études de médecine",
    isMedicalStudent: true,
  },
  {
    value: "etudiant-5",
    label: "Étudiant en médecine — 5e année",
    group: "Études de médecine",
    isMedicalStudent: true,
  },
  {
    value: "etudiant-6",
    label: "Étudiant en médecine — 6e année",
    group: "Études de médecine",
    isMedicalStudent: true,
  },
  {
    value: "interne",
    label: "Interne",
    group: "Formation post-diplôme",
    isMedicalStudent: false,
  },
  {
    value: "fellow",
    label: "Fellow",
    group: "Formation post-diplôme",
    isMedicalStudent: false,
  },
  {
    value: "generaliste",
    label: "Médecin généraliste",
    group: "Médecins",
    isMedicalStudent: false,
  },
  {
    value: "specialiste",
    label: "Médecin spécialiste",
    group: "Médecins",
    isMedicalStudent: false,
  },
];

export const statusValues = statuses.map((status) => status.value);

export function getStatus(value: string): Status | undefined {
  return statuses.find((status) => status.value === value);
}

/** Statuts groupes, dans l'ordre d'affichage du menu deroulant. */
export function groupedStatuses(): Array<{ group: string; items: Status[] }> {
  const groups: Array<{ group: string; items: Status[] }> = [];
  for (const status of statuses) {
    const existing = groups.find((entry) => entry.group === status.group);
    if (existing) existing.items.push(status);
    else groups.push({ group: status.group, items: [status] });
  }
  return groups;
}
