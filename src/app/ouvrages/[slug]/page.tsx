import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { books, getBook } from "@/../content/livres";
import { BookCover } from "@/components/book-cover";
import { ButtonLink, Container, Notice } from "@/components/ui";
import { currentUser } from "@/lib/auth";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return books.map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) return { title: "Ouvrage introuvable" };

  return {
    title: book.title,
    description: book.description.slice(0, 300),
  };
}

const monthNames = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

/** "2026-09" -> "septembre 2026" */
function formatUpdatedAt(value: string): string {
  const [year, month] = value.split("-");
  const index = Number(month) - 1;
  if (!year || Number.isNaN(index) || !monthNames[index]) return value;
  return `${monthNames[index]} ${year}`;
}

export default async function BookPage({ params }: Params) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) notFound();

  const user = await currentUser().catch(() => null);

  return (
    <>
      <section className="bg-liryc-navy py-14 text-white sm:py-16">
        <Container>
          <nav aria-label="Fil d'Ariane" className="mb-8 text-[0.85rem]">
            <ol className="flex flex-wrap items-center gap-2 text-white/65">
              <li>
                <Link href="/" className="font-bold hover:text-liryc-cyan">
                  Accueil
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/ouvrages"
                  className="font-bold hover:text-liryc-cyan"
                >
                  Les ouvrages
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-white">
                {book.title}
              </li>
            </ol>
          </nav>

          <div className="grid gap-12 md:grid-cols-[280px_1fr]">
            <div className="max-w-[280px] shadow-2xl">
              <BookCover book={book} />
            </div>

            <div>
              <p className="text-[0.78rem] font-bold tracking-[0.16em] text-liryc-cyan uppercase">
                {book.volume}
              </p>
              <h1 className="mt-3 text-[1.95rem] leading-[2.4rem] font-black sm:text-[2.6rem] sm:leading-[3rem]">
                {book.title}
              </h1>
              <p className="mt-3 text-[1.15rem] text-liryc-cyan">
                {book.subtitle}
              </p>

              <dl className="mt-9 flex flex-wrap gap-x-10 gap-y-4 border-t border-white/15 pt-7 text-[0.9rem]">
                <div>
                  <dt className="font-bold tracking-[0.1em] text-liryc-cyan uppercase">
                    Format
                  </dt>
                  <dd className="mt-1 text-white/85">PDF interactif</dd>
                </div>
                <div>
                  <dt className="font-bold tracking-[0.1em] text-liryc-cyan uppercase">
                    Langue
                  </dt>
                  <dd className="mt-1 text-white/85">Français</dd>
                </div>
                {book.pages ? (
                  <div>
                    <dt className="font-bold tracking-[0.1em] text-liryc-cyan uppercase">
                      Pages
                    </dt>
                    <dd className="mt-1 text-white/85">{book.pages}</dd>
                  </div>
                ) : null}
                <div>
                  <dt className="font-bold tracking-[0.1em] text-liryc-cyan uppercase">
                    Version
                  </dt>
                  <dd className="mt-1 text-white/85">
                    {formatUpdatedAt(book.updatedAt)}
                  </dd>
                </div>
                <div>
                  <dt className="font-bold tracking-[0.1em] text-liryc-cyan uppercase">
                    Prix
                  </dt>
                  <dd className="mt-1 text-white/85">Gratuit</dd>
                </div>
              </dl>

              <div className="mt-9 flex flex-wrap gap-4">
                {!book.published ? (
                  <ButtonLink href="/inscription" variant="ghost">
                    Être informé de la parution
                  </ButtonLink>
                ) : user ? (
                  <ButtonLink href={`/api/telechargement/${book.slug}`}>
                    Télécharger le PDF
                  </ButtonLink>
                ) : (
                  <>
                    <ButtonLink href="/inscription">
                      S&apos;inscrire pour télécharger
                    </ButtonLink>
                    <ButtonLink href="/connexion" variant="ghost">
                      J&apos;ai déjà un compte
                    </ButtonLink>
                  </>
                )}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="grid gap-14 lg:grid-cols-[1fr_360px]">
          <div className="max-w-[952px]">
            <div className="prose-liryc">
              <h2>Présentation</h2>
              <p>{book.description}</p>

              <h2>Ce que vous y trouverez</h2>
              <ul>
                {book.highlights.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <h2>Sommaire</h2>
              <ol className="mt-4 space-y-3">
                {book.contents.map((item, index) => (
                  <li key={item} className="flex gap-4">
                    <span className="w-8 shrink-0 text-[0.9rem] font-black text-liryc-cyan">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-[0.98rem] leading-relaxed text-liryc-ink">
                      {item}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <aside className="space-y-6">
            {!book.published ? (
              <Notice tone="info" title="Volume à paraître">
                Ce volume n&apos;est pas encore téléchargeable. Créez votre
                compte dès maintenant : vous serez prévenu de sa mise en ligne.
              </Notice>
            ) : null}

            <div className="border border-liryc-line bg-liryc-mist p-7">
              <h2 className="text-title-4 leading-title-4 text-liryc-navy">
                Lire ce PDF interactif
              </h2>
              <p className="mt-3 text-[0.92rem] leading-relaxed text-liryc-ink">
                Enregistrez le fichier sur votre appareil, puis ouvrez-le avec
                Adobe Acrobat Reader. Les interprétations masquées et les
                renvois du sommaire ne fonctionnent pas dans la visionneuse du
                navigateur.
              </p>
              <Link
                href="/aide"
                className="mt-4 inline-block text-[0.9rem] font-bold text-liryc-teal hover:text-liryc-navy"
              >
                Guide de lecture →
              </Link>
            </div>

            <div className="border border-liryc-line p-7">
              <h2 className="text-title-4 leading-title-4 text-liryc-navy">
                Conditions d&apos;usage
              </h2>
              <p className="mt-3 text-[0.92rem] leading-relaxed text-liryc-ink">
                Ouvrage diffusé à des fins pédagogiques, pour un usage
                personnel. Sa reproduction, sa rediffusion et sa revente ne sont
                pas autorisées.
              </p>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
