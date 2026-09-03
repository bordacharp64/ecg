import { catalogueLanguages } from "#content/livres.ts";
import { UI_LANGUAGES, languageName } from "@/lib/langue";

/**
 * Selecteur de langue. Volontairement un formulaire classique, sans
 * JavaScript : il fonctionne partout, y compris sur les navigateurs bloques
 * par les proxys de certains hopitaux et facultes.
 */
export function LanguagePicker({
  language,
  currentPath,
  label,
  chooseLabel,
}: {
  language: string;
  currentPath: string;
  label: string;
  chooseLabel: string;
}) {
  // Toute langue de l'interface, plus toute langue presente au catalogue :
  // un visiteur doit pouvoir demander les livres en espagnol des qu'ils
  // existent, meme si l'interface n'est pas encore traduite.
  const options = [
    ...new Set([...UI_LANGUAGES, ...catalogueLanguages()]),
  ].sort();

  if (options.length < 2) return null;

  return (
    <form
      action="/api/langue"
      method="post"
      className="flex items-center gap-2"
    >
      <input type="hidden" name="retour" value={currentPath} />
      <label htmlFor="langue" className="sr-only">
        {chooseLabel}
      </label>
      <select
        id="langue"
        name="langue"
        defaultValue={language}
        className="border border-liryc-line bg-white py-1.5 pr-7 pl-2 text-[0.82rem] font-bold text-liryc-navy"
        aria-label={label}
      >
        {options.map((code) => (
          <option key={code} value={code}>
            {languageName(code)}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="border border-liryc-line bg-white px-2.5 py-1.5 text-[0.78rem] font-bold text-liryc-teal transition-colors hover:bg-liryc-teal hover:text-white"
      >
        OK
      </button>
    </form>
  );
}
