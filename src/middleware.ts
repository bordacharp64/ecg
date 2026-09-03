import { NextResponse, type NextRequest } from "next/server";

/**
 * Expose le chemin de la requete aux composants serveur.
 *
 * L'App Router ne donne pas le chemin courant a un layout : sans cela, le
 * selecteur de langue renverrait toujours le visiteur a l'accueil au lieu de
 * la page qu'il consultait. Un middleware qui recopie le chemin dans un
 * en-tete regle le probleme sans rendre le selecteur dependant de JavaScript.
 */
export const CHEMIN_HEADER = "x-chemin-courant";

export function middleware(request: NextRequest) {
  const headers = new Headers(request.headers);
  headers.set(
    CHEMIN_HEADER,
    request.nextUrl.pathname + request.nextUrl.search,
  );

  return NextResponse.next({ request: { headers } });
}

export const config = {
  // Inutile sur les fichiers statiques et les images optimisees.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
