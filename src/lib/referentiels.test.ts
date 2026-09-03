import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { books } from "#content/livres.ts";
import { countryOptions, isCountryCode } from "#content/pays.ts";
import { statuses } from "#content/statuts.ts";
import {
  countriesWithList,
  universitiesFor,
} from "#content/universites.ts";

describe("catalogue", () => {
  it("n'a pas deux ouvrages avec le même identifiant d'URL", () => {
    const slugs = books.map((book) => book.slug);
    assert.equal(new Set(slugs).size, slugs.length);
  });

  it("n'a pas deux ouvrages pour la même œuvre dans la même langue", () => {
    const pairs = books.map((book) => `${book.work}:${book.language}`);
    assert.equal(new Set(pairs).size, pairs.length);
  });

  it("donne un nom de fichier distinct à chaque ouvrage", () => {
    const names = books.map((book) => book.fileName);
    assert.equal(new Set(names).size, names.length);
  });

  it("prévoit un aperçu d'au moins une page pour chaque ouvrage", () => {
    for (const book of books) {
      assert.ok(
        book.previewPages >= 1,
        `${book.slug} : previewPages doit valoir au moins 1`,
      );
    }
  });

  it("garde le même numéro de volume entre traductions d'une œuvre", () => {
    const volumes = new Map<string, number>();
    for (const book of books) {
      const known = volumes.get(book.work);
      if (known === undefined) volumes.set(book.work, book.volume);
      else
        assert.equal(
          book.volume,
          known,
          `${book.slug} : volume incohérent avec les autres traductions`,
        );
    }
  });
});

describe("pays", () => {
  it("propose une liste complète et sans doublon", () => {
    const options = countryOptions("fr");
    const codes = options.map((option) => option.code);
    assert.equal(new Set(codes).size, codes.length);
    assert.ok(options.length > 180);
  });

  it("remonte la France en tête", () => {
    assert.equal(countryOptions("fr")[0].code, "FR");
  });

  it("traduit les noms de pays selon la langue", () => {
    const nameIn = (locale: string) =>
      countryOptions(locale).find((c) => c.code === "DE")?.name;
    assert.equal(nameIn("fr"), "Allemagne");
    assert.equal(nameIn("en"), "Germany");
  });

  it("reconnaît les codes valides et rejette les autres", () => {
    assert.equal(isCountryCode("fr"), true);
    assert.equal(isCountryCode("ZZ"), false);
  });
});

describe("statuts", () => {
  it("couvre les six années d'études, l'internat, le fellowship et les médecins", () => {
    const values = statuses.map((status) => status.value);
    for (let year = 1; year <= 6; year++) {
      assert.ok(values.includes(`etudiant-${year}`), `manque etudiant-${year}`);
    }
    for (const expected of ["interne", "fellow", "generaliste", "specialiste"]) {
      assert.ok(values.includes(expected), `manque ${expected}`);
    }
  });

  it("n'a pas de valeur en double", () => {
    const values = statuses.map((s) => s.value);
    assert.equal(new Set(values).size, values.length);
  });
});

describe("facultés", () => {
  it("n'associe une liste qu'à des codes pays valides", () => {
    for (const code of countriesWithList()) {
      assert.ok(isCountryCode(code), `code pays inconnu dans la table : ${code}`);
    }
  });

  it("ne contient ni doublon ni entrée vide", () => {
    for (const code of countriesWithList()) {
      const list = universitiesFor(code);
      assert.equal(
        new Set(list).size,
        list.length,
        `doublon dans la liste de ${code}`,
      );
      for (const name of list) {
        assert.ok(name.trim().length > 2, `entrée vide dans la liste de ${code}`);
      }
    }
  });

  it("garde les listes triées, pour que le menu déroulant soit lisible", () => {
    const collator = new Intl.Collator("fr", { sensitivity: "base" });
    for (const code of countriesWithList()) {
      const list = universitiesFor(code);
      const sorted = [...list].sort(collator.compare);
      assert.deepEqual(list, sorted, `liste de ${code} non triée`);
    }
  });

  it("renvoie une liste vide pour un pays non renseigné", () => {
    assert.deepEqual(universitiesFor("JP"), []);
  });
});
