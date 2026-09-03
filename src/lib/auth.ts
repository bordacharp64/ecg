import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

import { and, eq, gt, isNull } from "drizzle-orm";
import { cookies } from "next/headers";

import { db } from "@/lib/db";
import { loginTokens, sessions, users, type User } from "@/lib/db/schema";

const SESSION_COOKIE = "ecg_session";
const SESSION_TTL_DAYS = 30;
const LOGIN_TOKEN_TTL_MINUTES = 30;

/**
 * On ne stocke jamais un jeton en clair : la base ne contient que son
 * empreinte SHA-256, ce qui rend une fuite de la table inexploitable pour
 * usurper une session.
 */
function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

function generateToken(): string {
  return randomBytes(32).toString("base64url");
}

export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

/** Comparaison a temps constant, pour ne pas fuir d'information par le timing. */
export function safeEquals(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

// --------------------------------------------------------------------------
// Liens de connexion (magic links)
// --------------------------------------------------------------------------

/**
 * Cree un jeton de connexion a usage unique et renvoie sa valeur en clair.
 * L'appelant est responsable de l'envoyer par e-mail : la valeur n'est plus
 * recuperable ensuite.
 */
export async function createLoginToken(userId: string): Promise<string> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + LOGIN_TOKEN_TTL_MINUTES * 60_000);

  await db.insert(loginTokens).values({
    userId,
    tokenHash: hashToken(token),
    expiresAt,
  });

  return token;
}

/**
 * Consomme un jeton de connexion et ouvre une session.
 * Renvoie null si le jeton est inconnu, expire ou deja utilise.
 */
export async function consumeLoginToken(token: string): Promise<User | null> {
  const tokenHash = hashToken(token);

  const [row] = await db
    .select()
    .from(loginTokens)
    .where(
      and(
        eq(loginTokens.tokenHash, tokenHash),
        isNull(loginTokens.consumedAt),
        gt(loginTokens.expiresAt, new Date()),
      ),
    )
    .limit(1);

  if (!row) return null;

  // Usage unique : on marque le jeton consomme avant d'ouvrir la session.
  await db
    .update(loginTokens)
    .set({ consumedAt: new Date() })
    .where(eq(loginTokens.id, row.id));

  const now = new Date();
  const [user] = await db
    .update(users)
    .set({
      lastSeenAt: now,
      // Le clic sur le lien prouve la maitrise de la boite e-mail.
      emailVerifiedAt: now,
    })
    .where(eq(users.id, row.userId))
    .returning();

  if (!user) return null;

  await openSession(user.id);
  return user;
}

// --------------------------------------------------------------------------
// Sessions
// --------------------------------------------------------------------------

export async function openSession(userId: string): Promise<void> {
  const token = generateToken();
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 86_400_000);

  await db.insert(sessions).values({
    userId,
    tokenHash: hashToken(token),
    expiresAt,
  });

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function currentUser(): Promise<User | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const [row] = await db
    .select({ user: users })
    .from(sessions)
    .innerJoin(users, eq(users.id, sessions.userId))
    .where(
      and(
        eq(sessions.tokenHash, hashToken(token)),
        gt(sessions.expiresAt, new Date()),
      ),
    )
    .limit(1);

  return row?.user ?? null;
}

export async function closeSession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;

  if (token) {
    await db.delete(sessions).where(eq(sessions.tokenHash, hashToken(token)));
  }

  jar.delete(SESSION_COOKIE);
}

/** Revoque toutes les sessions d'un compte (utile avant suppression). */
export async function closeAllSessions(userId: string): Promise<void> {
  await db.delete(sessions).where(eq(sessions.userId, userId));
}

// --------------------------------------------------------------------------
// Administration
// --------------------------------------------------------------------------

export function isAdminEmail(email: string): boolean {
  const allowed = (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((entry) => normalizeEmail(entry))
    .filter(Boolean);

  return allowed.includes(normalizeEmail(email));
}

/**
 * Domaines e-mail autorises a l'inscription. Vide = aucune restriction.
 * Permet, si l'IHU le souhaite, de reserver l'acces aux adresses
 * universitaires (ex. "u-bordeaux.fr,univ-lyon1.fr").
 */
export function isEmailDomainAllowed(email: string): boolean {
  const raw = (process.env.ALLOWED_EMAIL_DOMAINS ?? "").trim();
  if (!raw) return true;

  const domains = raw
    .split(",")
    .map((entry) => entry.trim().toLowerCase().replace(/^@/, ""))
    .filter(Boolean);

  if (domains.length === 0) return true;

  const emailDomain = normalizeEmail(email).split("@")[1];
  if (!emailDomain) return false;

  return domains.some(
    (domain) => emailDomain === domain || emailDomain.endsWith(`.${domain}`),
  );
}
