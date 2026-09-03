import next from "eslint-config-next";

/**
 * eslint-config-next 16 exporte directement une configuration « plate » :
 * inutile de passer par FlatCompat.
 */
const config = [
  { ignores: [".next/**", "node_modules/**", "drizzle/**"] },
  ...next,
];

export default config;
