import { desc, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { currentUser, isAdminEmail } from "@/lib/auth";
import { db } from "@/lib/db";
import { downloads, users } from "@/lib/db/schema";

/** Echappement CSV : guillemets doubles et separateur point-virgule (Excel FR). */
function csvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const text = String(value);
  return /[";\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export async function GET() {
  const user = await currentUser();
  if (!user || !isAdminEmail(user.email)) {
    return NextResponse.json({ message: "Non autorisé." }, { status: 404 });
  }

  const rows = await db
    .select({
      email: users.email,
      firstName: users.firstName,
      lastName: users.lastName,
      profile: users.profile,
      institution: users.institution,
      country: users.country,
      studyYear: users.studyYear,
      newsletterOptIn: users.newsletterOptIn,
      createdAt: users.createdAt,
      emailVerifiedAt: users.emailVerifiedAt,
      downloadCount: sql<number>`(
        select count(*) from ${downloads} where ${downloads.userId} = ${users.id}
      )`,
    })
    .from(users)
    .orderBy(desc(users.createdAt));

  const header = [
    "email",
    "prenom",
    "nom",
    "profil",
    "etablissement",
    "pays",
    "annee_etudes",
    "actualites",
    "inscrit_le",
    "adresse_confirmee_le",
    "nb_telechargements",
  ];

  const body = rows.map((row) =>
    [
      row.email,
      row.firstName,
      row.lastName,
      row.profile,
      row.institution,
      row.country,
      row.studyYear ?? "",
      row.newsletterOptIn ? "oui" : "non",
      row.createdAt.toISOString(),
      row.emailVerifiedAt?.toISOString() ?? "",
      row.downloadCount,
    ]
      .map(csvCell)
      .join(";"),
  );

  // BOM UTF-8 : sans lui, Excel sous Windows abime les accents.
  const csv = `﻿${[header.join(";"), ...body].join("\r\n")}\r\n`;
  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="inscriptions-ecg-${stamp}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
