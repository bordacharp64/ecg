import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { isSelectableLanguage, LANGUAGE_COOKIE } from "@/lib/langue";

/**
 * Enregistre le choix de langue du visiteur. Ce cookie prime ensuite sur la
 * detection automatique : un visiteur qui a choisi une langue ne doit plus
 * jamais se voir imposer celle de son navigateur.
 */
export async function POST(request: Request) {
  const formData = await request.formData();
  const language = String(formData.get("langue") ?? "").trim().toLowerCase();
  const redirectTo = String(formData.get("retour") ?? "/");

  if (!isSelectableLanguage(language)) {
    return NextResponse.json(
      { message: "Langue non gérée." },
      { status: 422 },
    );
  }

  const jar = await cookies();
  jar.set(LANGUAGE_COOKIE, language, {
    httpOnly: false,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 365 * 86_400,
  });

  // On ne redirige que vers une adresse interne : un parametre `retour`
  // fabrique ne doit pas pouvoir servir de tremplin vers un autre site.
  const safePath = redirectTo.startsWith("/") && !redirectTo.startsWith("//")
    ? redirectTo
    : "/";

  return NextResponse.redirect(new URL(safePath, request.url), { status: 303 });
}
