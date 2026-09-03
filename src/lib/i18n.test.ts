import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { missingKeys, translator } from "./i18n.ts";
import { UI_LANGUAGES } from "./langue.ts";

describe("dictionnaire de traduction", () => {
  it("traduit toutes les clefs dans chaque langue de l'interface", () => {
    for (const language of UI_LANGUAGES) {
      const missing = missingKeys(language);
      assert.deepEqual(
        missing,
        [],
        `Traduction « ${language} » incomplète : ${missing.join(", ")}`,
      );
    }
  });

  it("retombe sur le français plutôt que d'afficher une clef technique", () => {
    const t = translator("xx");
    assert.equal(t("nav.books"), "Les ouvrages");
  });

  it("remplace les jetons du libellé", () => {
    const t = translator("fr");
    assert.equal(t("preview.pagesOf", { n: 20 }), "Les 20 premières pages");
  });

  it("expose la langue courante", () => {
    assert.equal(translator("en").language, "en");
  });
});
