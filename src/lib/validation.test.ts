import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { identificationSchema } from "./validation.ts";

const valide = {
  firstName: "Camille",
  lastName: "Duverger",
  email: "Camille.Duverger@u-bordeaux.fr",
  country: "fr",
  status: "etudiant-4",
  university: "Université de Bordeaux",
  privacyAccepted: "on",
};

describe("fiche d'identification", () => {
  it("accepte une fiche complète et normalise l'e-mail et le pays", () => {
    const result = identificationSchema.safeParse(valide);
    assert.equal(result.success, true);
    assert.equal(result.data?.email, "camille.duverger@u-bordeaux.fr");
    assert.equal(result.data?.country, "FR");
    assert.equal(result.data?.resolvedUniversity, "Université de Bordeaux");
  });

  it("exige le consentement", () => {
    const { privacyAccepted, ...sansConsentement } = valide;
    void privacyAccepted;
    const result = identificationSchema.safeParse(sansConsentement);
    assert.equal(result.success, false);
    assert.match(
      result.error?.issues.find((i) => i.path[0] === "privacyAccepted")
        ?.message ?? "",
      /politique de confidentialité/,
    );
  });

  it("refuse une faculté qui n'appartient pas au pays déclaré", () => {
    const result = identificationSchema.safeParse({
      ...valide,
      university: "KU Leuven", // faculté belge, pays déclaré : France
    });
    assert.equal(result.success, false);
    assert.equal(result.error?.issues[0]?.path[0], "university");
  });

  it("accepte une saisie libre pour un pays sans liste", () => {
    const result = identificationSchema.safeParse({
      ...valide,
      country: "JP",
      university: "__autre__",
      universityOther: "University of Tokyo",
    });
    assert.equal(result.success, true);
    assert.equal(result.data?.resolvedUniversity, "University of Tokyo");
  });

  it("refuse « autre » laissé vide", () => {
    const result = identificationSchema.safeParse({
      ...valide,
      country: "JP",
      university: "__autre__",
      universityOther: "",
    });
    assert.equal(result.success, false);
    assert.equal(result.error?.issues[0]?.path[0], "universityOther");
  });

  it("refuse un code pays inconnu", () => {
    const result = identificationSchema.safeParse({ ...valide, country: "ZZ" });
    assert.equal(result.success, false);
  });

  it("refuse un statut hors liste", () => {
    const result = identificationSchema.safeParse({ ...valide, status: "roi" });
    assert.equal(result.success, false);
  });

  it("traite l'abonnement absent comme un refus, sans erreur", () => {
    const result = identificationSchema.safeParse(valide);
    assert.equal(result.success, true);
    assert.equal(result.data?.newsletterOptIn, false);
  });
});
