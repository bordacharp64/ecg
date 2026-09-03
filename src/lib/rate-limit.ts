/**
 * Limitation de debit en memoire : suffisante pour proteger l'envoi d'e-mails
 * d'un site de cette taille sur une instance unique.
 *
 * Si le site est un jour deploye sur plusieurs instances, remplacer ce module
 * par un compteur partage (Redis, Upstash) : la signature de `rateLimit`
 * n'a pas besoin de changer.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

/** Purge paresseuse : evite de faire grossir la Map indefiniment. */
function sweep(now: number): void {
  if (buckets.size < 500) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export function rateLimit(options: {
  key: string;
  limit: number;
  windowMs: number;
}): { allowed: boolean; retryAfterSeconds: number } {
  const { key, limit, windowMs } = options;
  const now = Date.now();

  sweep(now);

  const bucket = buckets.get(key);

  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (bucket.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil((bucket.resetAt - now) / 1000),
    };
  }

  bucket.count += 1;
  return { allowed: true, retryAfterSeconds: 0 };
}
