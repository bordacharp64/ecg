/**
 * Copie le worker de pdf.js dans public/ pour qu'il soit servi depuis le
 * domaine du site. Aucune requete vers un CDN tiers n'est ainsi necessaire :
 * c'est ce qui permet de tenir la promesse « aucun traceur, aucune ressource
 * externe » de la politique de confidentialite.
 *
 * Lance automatiquement par `npm install` (script postinstall) et par
 * `npm run build`.
 */
import { copyFileSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";

const require = createRequire(import.meta.url);

try {
  const pdfjsRoot = dirname(require.resolve("pdfjs-dist/package.json"));
  const source = join(pdfjsRoot, "build", "pdf.worker.min.mjs");
  const targetDir = join(process.cwd(), "public", "pdfjs");

  mkdirSync(targetDir, { recursive: true });
  copyFileSync(source, join(targetDir, "pdf.worker.min.mjs"));
  console.log("pdf.js : worker copié dans public/pdfjs/");
} catch (error) {
  console.error(
    "pdf.js : copie du worker impossible. L'aperçu en ligne ne fonctionnera pas.",
    error instanceof Error ? error.message : error,
  );
  process.exitCode = 1;
}
