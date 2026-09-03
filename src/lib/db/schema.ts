import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Minimisation des donnees (RGPD, art. 5.1.c) : on ne collecte que ce qui
 * sert reellement au pilotage de la formation. Pas de date de naissance,
 * pas d'adresse postale, pas de telephone.
 */
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    /** Toujours stocke en minuscules et sans espaces (cf. normalizeEmail). */
    email: text("email").notNull(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),

    /** "etudiant" | "interne" | "medecin" | "paramedical" | "autre" */
    profile: text("profile").notNull(),
    /** Etablissement ou faculte declaree, en texte libre. */
    institution: text("institution").notNull(),
    /** Code ISO 3166-1 alpha-2, "FR" par defaut. */
    country: text("country").notNull().default("FR"),
    /** Annee d'etudes : 1 a 12, ou null pour les profils non etudiants. */
    studyYear: integer("study_year"),

    /** Consentement explicite et horodate a la politique de confidentialite. */
    privacyAcceptedAt: timestamp("privacy_accepted_at", {
      withTimezone: true,
    }).notNull(),
    /** Opt-in distinct pour les informations de formation (art. 7 RGPD). */
    newsletterOptIn: boolean("newsletter_opt_in").notNull().default(false),

    /** Renseigne au premier clic sur un lien de connexion. */
    emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }),
  },
  (table) => [uniqueIndex("users_email_unique").on(table.email)],
);

/**
 * Jeton de connexion sans mot de passe ("magic link"). Seul le hash SHA-256
 * du jeton est stocke : une fuite de la base ne permet pas de se connecter.
 */
export const loginTokens = pgTable(
  "login_tokens",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    consumedAt: timestamp("consumed_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("login_tokens_hash_unique").on(table.tokenHash),
    index("login_tokens_user_idx").on(table.userId),
  ],
);

/** Sessions revocables cote serveur : seul le hash de l'identifiant est stocke. */
export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("sessions_hash_unique").on(table.tokenHash),
    index("sessions_user_idx").on(table.userId),
  ],
);

/**
 * Journal des telechargements : sert aux statistiques de diffusion et aux
 * rapports d'activite de la formation. Aucune adresse IP n'est conservee.
 */
export const downloads = pgTable(
  "downloads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    /** Identifiant du livre tel que defini dans content/livres.ts */
    bookSlug: text("book_slug").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("downloads_user_idx").on(table.userId),
    index("downloads_book_idx").on(table.bookSlug),
  ],
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
