import { desc, eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { countryName } from "#content/pays.ts";
import { getStatus } from "#content/statuts.ts";
import { db } from "@/lib/db";
import { downloads, readers } from "@/lib/db/schema";
import { currentReader, isAdminEmail } from "@/lib/lecteur";

/** Echappement CSV : guillemets doubles, separateur point-virgule (Excel FR). */
function csvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const text = String(value);
  return /[";\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

export async function GET() {
  const reader = await currentReader();
  if (!reader || !isAdminEmail(reader.email)) {
    return NextResponse.json({ message: "Non autorisé." }, { status: 404 });
  }

  const rows = await db
    .select({
      email: readers.email,
      firstName: readers.firstName,
      lastName: readers.lastName,
      country: readers.country,
      status: readers.status,
      university: readers.university,
      language: readers.language,
      newsletterOptIn: readers.newsletterOptIn,
      createdAt: readers.createdAt,
      lastSeenAt: readers.lastSeenAt,
      downloadCount: sql<number>`(
        select count(*) from ${downloads} where ${downloads.readerId} = ${readers.id}
      )`,
    })
    .from(readers)
    .orderBy(desc(readers.createdAt));

  const header = [
    "email",
    "prenom",
    "nom",
    "pays_code",
    "pays",
    "statut_code",
    "statut",
    "faculte",
    "langue_interface",
    "annonces_parution",
    "premier_telechargement_le",
    "dernier_passage_le",
    "nb_telechargements",
  ];

  const body = rows.map((row) =>
    [
      row.email,
      row.firstName,
      row.lastName,
      row.country,
      countryName(row.country, "fr"),
      row.status,
      getStatus(row.status)?.label ?? row.status,
      row.university,
      row.language,
      row.newsletterOptIn ? "oui" : "non",
      row.createdAt.toISOString(),
      row.lastSeenAt?.toISOString() ?? "",
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
      "Content-Disposition": `attachment; filename="lecteurs-ecg-${stamp}.csv"`,
      "Cache-Control": "private, no-store",
    },
  });
}
