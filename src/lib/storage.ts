import { createHmac, createHash } from "node:crypto";
import { createReadStream, existsSync, statSync } from "node:fs";
import { isAbsolute, join, normalize, resolve } from "node:path";
import { Readable } from "node:stream";

export type StoredFile = {
  stream: ReadableStream<Uint8Array>;
  size: number | null;
};

/**
 * Deux pilotes de stockage, choisis par la variable STORAGE_DRIVER :
 *   - "local" : les PDF sont lus dans un dossier du serveur, hors webroot.
 *   - "s3"    : les PDF sont lus dans un bucket S3 compatible (Scaleway, OVH,
 *               MinIO, AWS). Le bucket reste prive : rien n'est jamais expose
 *               directement, tout passe par la route authentifiee.
 */
export function storageDriver(): "local" | "s3" {
  return process.env.STORAGE_DRIVER === "s3" ? "s3" : "local";
}

/**
 * Le dossier de stockage est resolu a l'execution depuis une variable
 * d'environnement. Les annotations `turbopackIgnore` presentes sur les acces
 * disque de ce module indiquent au bundler que ces chemins sont volontairement
 * dynamiques : sans elles, il embarquerait tout le projet dans la sortie
 * serveur "au cas ou".
 */
function localDir(): string {
  const configured = process.env.LOCAL_STORAGE_DIR ?? "./private/livres";
  if (isAbsolute(configured)) return configured;
  return resolve(/* turbopackIgnore: true */ process.cwd(), configured);
}

/**
 * Un nom de fichier ne doit jamais pouvoir sortir du dossier de stockage.
 * On refuse tout ce qui n'est pas un simple nom de fichier PDF.
 */
function assertSafeFileName(fileName: string): void {
  const normalized = normalize(fileName);
  if (
    normalized !== fileName ||
    fileName.includes("/") ||
    fileName.includes("\\") ||
    fileName.includes("\0") ||
    fileName.startsWith(".")
  ) {
    throw new Error(`Nom de fichier invalide : ${fileName}`);
  }
}

export function localFileExists(fileName: string): boolean {
  try {
    assertSafeFileName(fileName);
  } catch {
    return false;
  }
  return existsSync(join(/* turbopackIgnore: true */ localDir(), fileName));
}

async function openLocal(fileName: string): Promise<StoredFile> {
  assertSafeFileName(fileName);
  const path = join(/* turbopackIgnore: true */ localDir(), fileName);

  if (!existsSync(/* turbopackIgnore: true */ path)) {
    throw new Error(
      `Fichier absent du stockage local : ${path}. Déposez le PDF puis réessayez.`,
    );
  }

  const { size } = statSync(/* turbopackIgnore: true */ path);
  const nodeStream = createReadStream(/* turbopackIgnore: true */ path);

  return {
    stream: Readable.toWeb(nodeStream) as ReadableStream<Uint8Array>,
    size,
  };
}

// --------------------------------------------------------------------------
// S3 : signature AWS Signature V4 calculee a la main, pour eviter d'ajouter
// le SDK AWS (plusieurs Mo) alors qu'un seul GET est necessaire.
// --------------------------------------------------------------------------

function sha256Hex(payload: string): string {
  return createHash("sha256").update(payload, "utf8").digest("hex");
}

function hmac(key: Buffer | string, data: string): Buffer {
  return createHmac("sha256", key).update(data, "utf8").digest();
}

async function openS3(fileName: string): Promise<StoredFile> {
  assertSafeFileName(fileName);

  const endpoint = process.env.S3_ENDPOINT;
  const region = process.env.S3_REGION;
  const bucket = process.env.S3_BUCKET;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

  if (!endpoint || !region || !bucket || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "STORAGE_DRIVER=s3 mais la configuration S3 est incomplète (S3_ENDPOINT, S3_REGION, S3_BUCKET, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY).",
    );
  }

  const host = new URL(endpoint).host;
  const canonicalUri = `/${bucket}/${encodeURIComponent(fileName)}`;
  const url = `${endpoint.replace(/\/$/, "")}${canonicalUri}`;

  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const dateStamp = amzDate.slice(0, 8);
  const payloadHash = sha256Hex("");

  const canonicalHeaders =
    `host:${host}\n` +
    `x-amz-content-sha256:${payloadHash}\n` +
    `x-amz-date:${amzDate}\n`;
  const signedHeaders = "host;x-amz-content-sha256;x-amz-date";

  const canonicalRequest = [
    "GET",
    canonicalUri,
    "",
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const scope = `${dateStamp}/${region}/s3/aws4_request`;
  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    scope,
    sha256Hex(canonicalRequest),
  ].join("\n");

  const signingKey = hmac(
    hmac(hmac(hmac(`AWS4${secretAccessKey}`, dateStamp), region), "s3"),
    "aws4_request",
  );
  const signature = createHmac("sha256", signingKey)
    .update(stringToSign, "utf8")
    .digest("hex");

  const response = await fetch(url, {
    headers: {
      host,
      "x-amz-date": amzDate,
      "x-amz-content-sha256": payloadHash,
      Authorization:
        `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${scope}, ` +
        `SignedHeaders=${signedHeaders}, Signature=${signature}`,
    },
  });

  if (!response.ok || !response.body) {
    throw new Error(
      `Lecture S3 impossible pour ${fileName} (HTTP ${response.status}).`,
    );
  }

  const length = response.headers.get("content-length");

  return {
    stream: response.body,
    size: length ? Number(length) : null,
  };
}

export async function openBookFile(fileName: string): Promise<StoredFile> {
  return storageDriver() === "s3" ? openS3(fileName) : openLocal(fileName);
}
