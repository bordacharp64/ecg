/**
 * =========================================================================
 *  PAYS
 * =========================================================================
 *  Seuls les codes ISO 3166-1 alpha-2 sont stockes ici. Les noms affiches
 *  sont produits par `Intl.DisplayNames`, donc traduits automatiquement dans
 *  la langue de la page : rien a maintenir a la main, et pas de liste de
 *  249 noms a tenir a jour dans chaque langue.
 * =========================================================================
 */

/** Codes ISO 3166-1 alpha-2 des pays et territoires. */
const COUNTRY_CODES = [
  "AD","AE","AF","AG","AL","AM","AO","AR","AT","AU","AZ","BA","BB","BD","BE",
  "BF","BG","BH","BI","BJ","BN","BO","BR","BS","BT","BW","BY","BZ","CA","CD",
  "CF","CG","CH","CI","CL","CM","CN","CO","CR","CU","CV","CY","CZ","DE","DJ",
  "DK","DM","DO","DZ","EC","EE","EG","ER","ES","ET","FI","FJ","FM","FR","GA",
  "GB","GD","GE","GH","GM","GN","GQ","GR","GT","GW","GY","HN","HR","HT","HU",
  "ID","IE","IL","IN","IQ","IR","IS","IT","JM","JO","JP","KE","KG","KH","KI",
  "KM","KN","KP","KR","KW","KZ","LA","LB","LC","LI","LK","LR","LS","LT","LU",
  "LV","LY","MA","MC","MD","ME","MG","MH","MK","ML","MM","MN","MR","MT","MU",
  "MV","MW","MX","MY","MZ","NA","NE","NG","NI","NL","NO","NP","NR","NZ","OM",
  "PA","PE","PG","PH","PK","PL","PS","PT","PW","PY","QA","RO","RS","RU","RW",
  "SA","SB","SC","SD","SE","SG","SI","SK","SL","SM","SN","SO","SR","SS","ST",
  "SV","SY","SZ","TD","TG","TH","TJ","TL","TM","TN","TO","TR","TT","TV","TW",
  "TZ","UA","UG","US","UY","UZ","VA","VC","VE","VN","VU","WS","YE","ZA","ZM",
  "ZW",
] as const;

export type CountryCode = (typeof COUNTRY_CODES)[number];

const codeSet = new Set<string>(COUNTRY_CODES);

export function isCountryCode(value: string): boolean {
  return codeSet.has(value.toUpperCase());
}

export function countryName(code: string, locale = "fr"): string {
  try {
    const names = new Intl.DisplayNames([locale], { type: "region" });
    return names.of(code.toUpperCase()) ?? code.toUpperCase();
  } catch {
    return code.toUpperCase();
  }
}

/**
 * Liste triee pour un menu deroulant. Les pays de `pinned` sont remontes en
 * tete : dans un premier temps la collection s'adresse aux facultes
 * francophones, autant epargner un long defilement a la majorite des
 * visiteurs.
 */
export function countryOptions(
  locale = "fr",
  pinned: string[] = ["FR", "BE", "CH", "CA", "LU"],
): Array<{ code: string; name: string; pinned: boolean }> {
  const collator = new Intl.Collator(locale, { sensitivity: "base" });

  const all = COUNTRY_CODES.map((code) => ({
    code: code as string,
    name: countryName(code, locale),
    pinned: pinned.includes(code),
  }));

  const head = pinned
    .map((code) => all.find((entry) => entry.code === code))
    .filter((entry): entry is (typeof all)[number] => Boolean(entry));

  const tail = all
    .filter((entry) => !pinned.includes(entry.code))
    .sort((a, b) => collator.compare(a.name, b.name));

  return [...head, ...tail];
}
