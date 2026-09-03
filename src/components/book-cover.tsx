import type { Book, BookAccent } from "@/../content/livres";

const accents: Record<BookAccent, { from: string; to: string; trace: string }> = {
  teal: { from: "#044251", to: "#086d84", trace: "#47bad4" },
  cyan: { from: "#086d84", to: "#47bad4", trace: "#ffffff" },
  orange: { from: "#8c4a00", to: "#ef7d00", trace: "#ffe0b8" },
  green: { from: "#3d6b28", to: "#75b94e", trace: "#eaf7e1" },
  purple: { from: "#4a1c4d", to: "#792e7e", trace: "#e9d5ea" },
};

/**
 * Couverture generee : evite d'avoir a produire quatre visuels avant la mise
 * en ligne. Pour utiliser une vraie couverture, deposer l'image dans
 * public/couvertures/<slug>.jpg et l'afficher a la place de ce composant.
 */
export function BookCover({
  book,
  className = "",
  decorative = false,
}: {
  book: Book;
  className?: string;
  /**
   * `true` pour les couvertures d'arriere-plan d'une pile : seul le visuel est
   * conserve, sans le texte. Un fragment de titre qui depasse derriere une
   * autre couverture se lit comme un defaut d'affichage.
   */
  decorative?: boolean;
}) {
  const accent = accents[book.accent];
  const gradientId = `grad-${book.slug}`;

  return (
    <div
      className={`relative aspect-[3/4] w-full overflow-hidden ${className}`}
      role={decorative ? "presentation" : "img"}
      aria-label={
        decorative
          ? undefined
          : `Couverture de « ${book.title} », ${book.volume}`
      }
      aria-hidden={decorative || undefined}
    >
      <svg
        viewBox="0 0 300 400"
        className="absolute inset-0 h-full w-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={accent.from} />
            <stop offset="100%" stopColor={accent.to} />
          </linearGradient>
        </defs>
        <rect width="300" height="400" fill={`url(#${gradientId})`} />

        {/* Trace ECG decoratif, en filigrane */}
        <path
          d="M0 268h44l14-40 22 84 26-118 22 78 16-32h34l14-26 20 60 22-86 18 58 14-22h34"
          fill="none"
          stroke={accent.trace}
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.55"
        />
        <path
          d="M0 330h300"
          stroke={accent.trace}
          strokeWidth="1"
          opacity="0.2"
        />
      </svg>

      {decorative ? null : (
      <div className="relative flex h-full flex-col justify-between p-6 text-white">
        <div>
          <p className="text-[0.62rem] font-bold tracking-[0.2em] uppercase opacity-85">
            IHU Liryc
          </p>
          <p className="mt-0.5 text-[0.62rem] font-bold tracking-[0.2em] uppercase opacity-70">
            {book.volume}
          </p>
        </div>

        <div>
          <p className="text-[1.28rem] leading-[1.5rem] font-black">
            {book.title}
          </p>
          <p className="mt-2 text-[0.78rem] leading-[1.1rem] opacity-85">
            {book.subtitle}
          </p>
        </div>
      </div>
      )}
    </div>
  );
}
