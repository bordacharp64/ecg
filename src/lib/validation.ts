import { z } from "zod";

import { isCountryCode } from "#content/pays.ts";
import { statusValues } from "#content/statuts.ts";
import {
  hasUniversityList,
  OTHER_UNIVERSITY,
  universitiesFor,
} from "#content/universites.ts";

/** Une case cochee arrive comme "on" en HTML, ou comme `true` en JSON. */
function isChecked(value: unknown): boolean {
  return value === "on" || value === "true" || value === true;
}

const name = z
  .string()
  .trim()
  .min(2, "Ce champ doit comporter au moins 2 caractères.")
  .max(80, "Ce champ est limité à 80 caractères.");

/**
 * Fiche d'identification remplie au moment du telechargement.
 *
 * La coherence pays / faculte est verifiee apres coup (`superRefine`) parce
 * qu'elle croise deux champs : une faculte choisie dans la liste doit
 * appartenir au pays declare, sinon un formulaire bricole permettrait
 * d'enregistrer n'importe quel couple et de polluer les statistiques.
 */
export const identificationSchema = z
  .object({
    firstName: name,
    lastName: name,
    email: z
      .string()
      .trim()
      .toLowerCase()
      .min(5, "Adresse e-mail requise.")
      .max(160, "Adresse e-mail trop longue.")
      .email("Cette adresse e-mail n'est pas valide."),
    country: z
      .string()
      .trim()
      .toUpperCase()
      .refine(isCountryCode, "Choisissez un pays dans la liste."),
    status: z.enum(statusValues as [string, ...string[]], {
      message: "Choisissez votre statut.",
    }),
    /** Valeur du menu deroulant, ou OTHER_UNIVERSITY. */
    university: z.string().trim().min(1, "Choisissez votre faculté."),
    /** Rempli uniquement si `university` vaut OTHER_UNIVERSITY. */
    universityOther: z
      .string()
      .trim()
      .max(140, "Ce champ est limité à 140 caractères.")
      .optional()
      .default(""),
    language: z
      .string()
      .trim()
      .toLowerCase()
      .max(8)
      .optional()
      .default("fr"),
    privacyAccepted: z.unknown().refine(isChecked, {
      message:
        "Vous devez accepter la politique de confidentialité pour télécharger.",
    }),
    newsletterOptIn: z.unknown().optional().transform(isChecked),
  })
  .superRefine((data, ctx) => {
    if (data.university === OTHER_UNIVERSITY) {
      if (data.universityOther.length < 2) {
        ctx.addIssue({
          code: "custom",
          path: ["universityOther"],
          message: "Indiquez le nom de votre faculté de médecine.",
        });
      }
      return;
    }

    const list = universitiesFor(data.country);
    if (list.length > 0 && !list.includes(data.university)) {
      ctx.addIssue({
        code: "custom",
        path: ["university"],
        message: "Choisissez une faculté dans la liste de votre pays.",
      });
    }
  })
  .transform((data) => ({
    ...data,
    /** Valeur finalement enregistree : le choix, ou la saisie libre. */
    resolvedUniversity:
      data.university === OTHER_UNIVERSITY
        ? data.universityOther
        : data.university,
  }));

export type Identification = z.infer<typeof identificationSchema>;

/**
 * Vrai si le pays impose de choisir dans une liste. Reprise ici pour que le
 * formulaire et la validation partagent la meme source de verite.
 */
export { hasUniversityList, OTHER_UNIVERSITY };

/** Aplatit les erreurs Zod en { champ: message } exploitable par le formulaire. */
export function fieldErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!result[key]) result[key] = issue.message;
  }
  return result;
}
