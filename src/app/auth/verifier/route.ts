import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";

import { consumeLoginToken } from "@/lib/auth";

/**
 * Cible des liens de connexion envoyes par e-mail. Consomme le jeton, ouvre
 * la session et renvoie vers la bibliotheque.
 */
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    redirect("/connexion?erreur=lien_absent");
  }

  const user = await consumeLoginToken(token);

  if (!user) {
    redirect("/connexion?erreur=lien_invalide");
  }

  redirect("/bibliotheque?bienvenue=1");
}
