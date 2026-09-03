import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  bestVersionOf,
  groupBooksForLanguage,
  parseAcceptLanguage,
  resolveLanguage,
  worksForLanguage,
} from "./langue.ts";

describe("parseAcceptLanguage", () => {
  it("classe les langues par qualité décroissante", () => {
    assert.deepEqual(
      parseAcceptLanguage("en;q=0.7,fr;q=0.9,de;q=0.3"),
      ["fr", "en", "de"],
    );
  });

  it("ramène les variantes régionales à la langue", () => {
    assert.deepEqual(parseAcceptLanguage("fr-CA,fr;q=0.9,en-US;q=0.8"), [
      "fr",
      "en",
    ]);
  });

  it("tolère un en-tête absent ou vide", () => {
    assert.deepEqual(parseAcceptLanguage(null), []);
    assert.deepEqual(parseAcceptLanguage(""), []);
  });

  it("ignore le joker", () => {
    assert.deepEqual(parseAcceptLanguage("*"), []);
  });
});

describe("resolveLanguage", () => {
  it("fait primer le choix explicite du visiteur sur son navigateur", () => {
    const result = resolveLanguage({
      cookieValue: "en",
      acceptLanguage: "fr-FR,fr;q=0.9",
    });
    assert.equal(result.language, "en");
    assert.equal(result.source, "cookie");
  });

  it("ignore un cookie portant une langue inconnue", () => {
    const result = resolveLanguage({
      cookieValue: "xx",
      acceptLanguage: "en-GB,en;q=0.9",
    });
    assert.equal(result.language, "en");
    assert.equal(result.source, "navigateur");
  });

  it("retient le français par défaut pour une langue non gérée", () => {
    const result = resolveLanguage({ acceptLanguage: "ja-JP,ja;q=0.9" });
    assert.equal(result.language, "fr");
    assert.equal(result.source, "defaut");
  });
});

describe("groupBooksForLanguage", () => {
  it("place la langue du visiteur en tête", () => {
    const groups = groupBooksForLanguage("en");
    assert.equal(groups[0].language, "en");
    assert.equal(groups[0].isPreferred, true);
  });

  it("privilégie le français puis l'anglais pour une langue absente", () => {
    // L'espagnol n'est pas au catalogue : on doit retomber sur fr puis en.
    const languages = groupBooksForLanguage("es").map((g) => g.language);
    assert.deepEqual(languages.slice(0, 2), ["fr", "en"]);
    assert.equal(
      languages.includes("es"),
      false,
      "une langue absente du catalogue ne doit pas créer de section vide",
    );
  });

  it("n'oublie aucun ouvrage", () => {
    const total = groupBooksForLanguage("fr").reduce(
      (sum, group) => sum + group.books.length,
      0,
    );
    assert.equal(total, 5);
  });

  it("fait passer les volumes disponibles avant ceux à paraître", () => {
    const french = groupBooksForLanguage("fr")[0].books;
    const firstUnpublished = french.findIndex((book) => !book.published);
    const lastPublished = french.reduce(
      (last, book, index) => (book.published ? index : last),
      -1,
    );
    assert.ok(
      firstUnpublished === -1 || lastPublished < firstUnpublished,
      "un volume à paraître ne doit pas précéder un volume disponible",
    );
  });
});

describe("bestVersionOf", () => {
  it("préfère une version publiée dans une autre langue à une traduction à paraître", () => {
    // La traduction anglaise du volume 1 n'est pas encore publiée : un
    // visiteur anglophone doit recevoir la version française, téléchargeable.
    const best = bestVersionOf("semiologie", "en");
    assert.equal(best?.language, "fr");
    assert.equal(best?.published, true);
  });

  it("renvoie la version dans la langue du visiteur quand elle est publiée", () => {
    const best = bestVersionOf("semiologie", "fr");
    assert.equal(best?.slug, "semiologie-electrocardiographique");
  });
});

describe("worksForLanguage", () => {
  it("ne montre qu'une version par œuvre", () => {
    const works = worksForLanguage("fr").map((book) => book.work);
    assert.equal(new Set(works).size, works.length);
  });

  it("affiche les quatre volumes de la collection, pas les traductions", () => {
    assert.equal(worksForLanguage("fr").length, 4);
    assert.equal(worksForLanguage("en").length, 4);
  });

  it("classe par volume, disponibles d'abord", () => {
    const works = worksForLanguage("fr");
    assert.equal(works[0].volume, 1);
    assert.equal(works[0].published, true);
  });
});
