import {
  boolean,
  index,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/**
 * Un « lecteur » est une personne qui a rempli la fiche d'identification au
 * moment de son premier telechargement. Il n'y a pas de compte, pas de mot de
 * passe et pas de connexion : la fiche est le seul point de collecte.
 *
 * Minimisation des donnees (RGPD art. 5.1.c) : strictement les champs demandes
 * par l'equipe formation, plus la trace du consentement. Ni adresse postale,
 * ni telephone, ni date de naissance, ni adresse IP.
 */
export const readers = pgTable(
  "readers",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    /** Toujours en minuscules, sans espaces (cf. normalizeEmail). */
    email: text("email").notNull(),
    firstName: text("first_name").notNull(),
    lastName: text("last_name").notNull(),

    /** Code ISO 3166-1 alpha-2. */
    country: text("country").notNull(),

    /** Valeur issue de content/statuts.ts : "etudiant-4", "interne"... */
    status: text("status").notNull(),

    /**
     * Faculte de medecine. Choisie dans la liste du pays quand elle existe,
     * saisie librement sinon — d'ou le texte libre plutot qu'une cle etrangere.
     */
    university: text("university").notNull(),

    /** Consentement explicite et horodate a la politique de confidentialite. */
    privacyAcceptedAt: timestamp("privacy_accepted_at", {
      withTimezone: true,
    }).notNull(),

    /** Opt-in distinct pour les annonces de parution (RGPD art. 7). */
    newsletterOptIn: boolean("newsletter_opt_in").notNull().default(false),

    /** Langue de l'interface au moment de la saisie : utile aux statistiques. */
    language: text("language").notNull().default("fr"),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    lastSeenAt: timestamp("last_seen_at", { withTimezone: true }),
  },
  (table) => [
    uniqueIndex("readers_email_unique").on(table.email),
    index("readers_country_idx").on(table.country),
  ],
);

/**
 * Journal des telechargements : statistiques de diffusion et rapports
 * d'activite de la formation. Aucune adresse IP conservee.
 */
export const downloads = pgTable(
  "downloads",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    readerId: uuid("reader_id")
      .notNull()
      .references(() => readers.id, { onDelete: "cascade" }),
    /** Identifiant de l'ouvrage tel que defini dans content/livres.ts */
    bookSlug: text("book_slug").notNull(),
    /** Langue de l'ouvrage telecharge, dupliquee pour figer l'historique. */
    bookLanguage: text("book_language").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("downloads_reader_idx").on(table.readerId),
    index("downloads_book_idx").on(table.bookSlug),
  ],
);

/**
 * Consultations de l'apercu en ligne. Volontairement anonymes : l'apercu est
 * libre, il n'y a donc personne a rattacher. On ne compte que le volume, ce
 * qui suffit a mesurer le rapport entre lecture en ligne et telechargement.
 */
export const previewViews = pgTable(
  "preview_views",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    bookSlug: text("book_slug").notNull(),
    bookLanguage: text("book_language").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("preview_views_book_idx").on(table.bookSlug)],
);

export type Reader = typeof readers.$inferSelect;
export type NewReader = typeof readers.$inferInsert;
