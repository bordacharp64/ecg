import { z } from "zod";

const name = z
  .string()
  .trim()
  .min(2, "Ce champ doit comporter au moins 2 caractères.")
  .max(80, "Ce champ est limité à 80 caractères.");

export const profiles = [
  { value: "etudiant", label: "Étudiant en médecine (2e cycle)" },
  { value: "interne", label: "Interne / résident" },
  { value: "medecin", label: "Médecin" },
  { value: "paramedical", label: "Professionnel paramédical" },
  { value: "autre", label: "Autre" },
] as const;

const profileValues = profiles.map((p) => p.value) as [string, ...string[]];

/** Une case cochee arrive comme "on" en HTML, ou comme `true` en JSON. */
function isChecked(value: unknown): boolean {
  return value === "on" || value === "true" || value === true;
}

export const registrationSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(5, "Adresse e-mail requise.")
    .max(160, "Adresse e-mail trop longue.")
    .email("Cette adresse e-mail n'est pas valide."),
  firstName: name,
  lastName: name,
  profile: z.enum(profileValues, { message: "Choisissez un profil." }),
  institution: z
    .string()
    .trim()
    .min(2, "Indiquez votre faculté ou votre établissement.")
    .max(140, "Ce champ est limité à 140 caractères."),
  country: z
    .string()
    .trim()
    .length(2, "Code pays invalide.")
    .toUpperCase()
    .default("FR"),
  studyYear: z
    .union([z.coerce.number().int().min(1).max(12), z.literal("")])
    .optional()
    .transform((value) => (value === "" || value === undefined ? null : value)),
  // Une case a cocher absente du formulaire n'est tout simplement pas envoyee :
  // le champ doit donc accepter `undefined` et le refuser explicitement, sinon
  // l'utilisateur recoit un message d'erreur generique au lieu du notre.
  privacyAccepted: z
    .unknown()
    .refine(isChecked, {
      message:
        "Vous devez accepter la politique de confidentialité pour vous inscrire.",
    }),
  newsletterOptIn: z.unknown().optional().transform(isChecked),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .min(5, "Adresse e-mail requise.")
    .email("Cette adresse e-mail n'est pas valide."),
});

/** Aplatit les erreurs Zod en un objet { champ: message } exploitable par le formulaire. */
export function fieldErrors(
  error: z.ZodError,
): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!result[key]) result[key] = issue.message;
  }
  return result;
}
