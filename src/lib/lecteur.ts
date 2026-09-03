import { createHmac, timingSafeEqual } from "node:crypto";

import { eq } from "drizzle-orm";
import { cookies } from "next/headers";

import { db } from "@/lib/db";
import { readers, type Reader } from "@/lib/db/schema";

const READER_COOKIE = "ecg_lecteur";
const COOKIE_TTL_DAYS = 365;

function secret(): string {
  const value = process.env.SESSION_SECRET;
  if (!value || value.length < 24) {
    throw new Error(
      "SESSION_SECRET est absent ou trop court (32 caractères minimum). Générez-le avec : openssl rand -base64 48",
    );
  }
  return value;
}

/**
 * Le cookie ne contient que l'identifiant du lecteur, signe. Pas de table de
 * sessions a maintenir : rien de sensible n'y transite, et une signature
 * invalide se detecte sans requete en base.
 */
function sign(readerId: string): string {
  const signature = createHmac("sha256", secret())
    .update(readerId)
    .digest("base64url");
  return `${readerId}.${signature}`;
}

function verify(value: string): string | null {
  const separator = value.lastIndexOf(".");
  if (separator <= 0) return null;

  const readerId = value.slice(0, separator);
  const provided = value.slice(separator + 1);
  const expected = createHmac("sha256", secret())
    .update(readerId)
    .digest("base64url");

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;

  return timingSafeEqual(a, b) ? readerId : null;
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Pose le cookie d'identification apres remplissage de la fiche. */
export async function rememberReader(readerId: string): Promise<void> {
  const jar = await cookies();
  jar.set(READER_COOKIE, sign(readerId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: COOKIE_TTL_DAYS * 86_400,
  });
}

export async function forgetReader(): Promise<void> {
  const jar = await cookies();
  jar.delete(READER_COOKIE);
}

/**
 * Le lecteur reconnu sur cet appareil, ou null. Un cookie signe mais dont le
 * lecteur a ete supprime renvoie null : la suppression de compte reste donc
 * effective, meme si le navigateur garde son cookie.
 */
export async function currentReader(): Promise<Reader | null> {
  const jar = await cookies();
  const raw = jar.get(READER_COOKIE)?.value;
  if (!raw) return null;

  const readerId = verify(raw);
  if (!readerId) return null;

  const [reader] = await db
    .select()
    .from(readers)
    .where(eq(readers.id, readerId))
    .limit(1);

  return reader ?? null;
}

export function isAdminEmail(email: string): boolean {
  const allowed = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((entry) => normalizeEmail(entry))
    .filter(Boolean);

  return allowed.includes(normalizeEmail(email));
}
