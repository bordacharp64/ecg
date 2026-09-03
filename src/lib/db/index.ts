import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

/**
 * En developpement, Next recharge les modules a chaud ; on met le client en
 * cache sur globalThis pour ne pas ouvrir un pool de connexions par rechargement.
 */
const globalForDb = globalThis as unknown as {
  __ecgSql?: ReturnType<typeof postgres>;
};

function createClient() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL n'est pas defini. Copiez .env.example en .env.local et renseignez la variable.",
    );
  }
  return postgres(url, { max: 10 });
}

const sql = globalForDb.__ecgSql ?? createClient();
if (process.env.NODE_ENV !== "production") {
  globalForDb.__ecgSql = sql;
}

export const db = drizzle(sql, { schema });
export { schema };
