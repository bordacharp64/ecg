import Link from "next/link";

import { books } from "@/../content/livres";
import { BookCover } from "@/components/book-cover";
import { ButtonLink, Container, SectionTitle } from "@/components/ui";
import { currentUser } from "@/lib/auth";

const steps = [
  {
    number: "01",
    title: "Je crée mon compte",
    body: "Nom, faculté, année d'études : moins d'une minute. Aucune pièce justificative, aucun paiement.",
  },
  {
    number: "02",
    title: "Je confirme mon adresse",
    body: "Un lien de connexion arrive par e-mail. Pas de mot de passe à retenir ni à perdre.",
  },
  {
    number: "03",
    title: "Je télécharge",
    body: "La bibliothèque s'ouvre. Les ouvrages restent accessibles à chaque nouvelle connexion.",
  },
];

export default async function HomePage() {
  const user = await currentUser().catch(() => null);
  const availableCount = books.filter((book) => book.published).length;

  return (
    <>
      {/* ---------------------------------------------------------------- */}
      {/* Bandeau d'accueil                                                */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-liryc-navy text-white">
        {/* Trace ECG decoratif en fond */}
        <svg
          className="pointer-events-none absolute inset-x-0 bottom-0 hidden h-[150px] w-full opacity-[0.13] sm:block"
          viewBox="0 0 1440 280"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0 190h180l26-52 40 116 46-164 40 110 30-42h150l26-52 40 116 46-164 40 110 30-42h150l26-52 40 116 46-164 40 110 30-42h278"
            fill="none"
            stroke="#47bad4"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        <Container className="relative grid items-center gap-14 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:py-28">
          <div>
            <p className="mb-5 inline-block border border-liryc-cyan/60 px-3.5 py-1.5 text-[0.72rem] font-bold tracking-[0.16em] text-liryc-cyan uppercase">
              Gratuit · Étudiants en médecine
            </p>
            <h1 className="text-[2.1rem] leading-[2.6rem] font-black sm:text-title-1 sm:leading-title-1">
              Apprendre à lire un ECG,
              <span className="block text-liryc-cyan">
                tracé après tracé.
              </span>
            </h1>
            <p className="mt-7 max-w-[52ch] text-[1.08rem] leading-relaxed text-white/85">
              Quatre ouvrages d&apos;interprétation de l&apos;électrocardiogramme,
              écrits et mis en page à l&apos;IHU Liryc. Des PDF interactifs :
              les tracés se laissent explorer, mesurer et annoter. Mis à
              disposition sans frais des étudiants en médecine.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              {user ? (
                <ButtonLink href="/bibliotheque">
                  Ouvrir ma bibliothèque
                </ButtonLink>
              ) : (
                <>
                  <ButtonLink href="/inscription">
                    Créer mon compte gratuit
                  </ButtonLink>
                  <ButtonLink href="/ouvrages" variant="ghost">
                    Voir les ouvrages
                  </ButtonLink>
                </>
              )}
            </div>

            <dl className="mt-14 flex flex-wrap gap-x-12 gap-y-6 border-t border-white/15 pt-8">
              <div>
                <dt className="text-[0.78rem] font-bold tracking-[0.12em] text-liryc-cyan uppercase">
                  Ouvrages
                </dt>
                <dd className="mt-1 text-[1.9rem] leading-none font-black">
                  {books.length}
                </dd>
              </div>
              <div>
                <dt className="text-[0.78rem] font-bold tracking-[0.12em] text-liryc-cyan uppercase">
                  Disponibles
                </dt>
                <dd className="mt-1 text-[1.9rem] leading-none font-black">
                  {availableCount}
                </dd>
              </div>
              <div>
                <dt className="text-[0.78rem] font-bold tracking-[0.12em] text-liryc-cyan uppercase">
                  Prix
                </dt>
                <dd className="mt-1 text-[1.9rem] leading-none font-black">
                  0 €
                </dd>
              </div>
            </dl>
          </div>

          {/* Trois couvertures en eventail */}
          <div className="relative mx-auto hidden h-[420px] w-[400px] lg:block">
            {/* Pile de couvertures : les volumes suivants sont rendus en
                premier et ne laissent depasser que leur tranche, si bien que
                le titre du volume 1, au premier plan, reste entierement
                lisible. */}
            {books
              .slice(0, 3)
              .reverse()
              .map((book, index) => (
                <div
                  key={book.slug}
                  className="absolute w-[264px] shadow-2xl"
                  style={{
                    left: `${index * 44}px`,
                    top: `${(2 - index) * 14}px`,
                    zIndex: index + 1,
                    transform: `rotate(${(2 - index) * -3.5}deg)`,
                  }}
                >
                  <BookCover book={book} decorative={index !== 2} />
                </div>
              ))}
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* La collection                                                    */}
      {/* ---------------------------------------------------------------- */}
      <section className="py-20 sm:py-24">
        <Container>
          <SectionTitle
            eyebrow="La collection"
            title="Quatre volumes, une progression"
            intro="Chaque volume se lit seul, mais la collection suit l'ordre dans lequel on apprend l'ECG : d'abord la grammaire du tracé, puis le rythme, la conduction et l'ischémie."
          />

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {books.map((book) => (
              <article key={book.slug} className="group flex flex-col">
                <Link
                  href={`/ouvrages/${book.slug}`}
                  className="block overflow-hidden"
                >
                  <BookCover
                    book={book}
                    className="transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </Link>

                <div className="flex flex-1 flex-col pt-5">
                  <p className="text-[0.72rem] font-bold tracking-[0.14em] text-liryc-cyan uppercase">
                    {book.volume}
                    {!book.published ? " · à paraître" : ""}
                  </p>
                  <h3 className="mt-2 text-title-4 leading-title-4 text-liryc-navy">
                    <Link
                      href={`/ouvrages/${book.slug}`}
                      className="hover:text-liryc-teal"
                    >
                      {book.title}
                    </Link>
                  </h3>
                  <p className="mt-2 flex-1 text-[0.92rem] leading-relaxed text-liryc-ink">
                    {book.subtitle}
                  </p>
                  <Link
                    href={`/ouvrages/${book.slug}`}
                    className="mt-4 text-[0.88rem] font-bold text-liryc-teal hover:text-liryc-navy"
                  >
                    Découvrir →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Comment ca marche                                                */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-liryc-mist py-20 sm:py-24">
        <Container>
          <SectionTitle
            eyebrow="En pratique"
            title="Trois étapes, aucune formalité"
            align="center"
          />

          <ol className="mt-14 grid gap-8 md:grid-cols-3">
            {steps.map((step) => (
              <li key={step.number} className="bg-white p-8">
                <span className="block text-[2.6rem] leading-none font-black text-liryc-cyan">
                  {step.number}
                </span>
                <h3 className="mt-5 text-title-4 leading-title-4 text-liryc-navy">
                  {step.title}
                </h3>
                <p className="mt-3 text-[0.95rem] leading-relaxed text-liryc-ink">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-12 text-center">
            <ButtonLink href={user ? "/bibliotheque" : "/inscription"}>
              {user ? "Ouvrir ma bibliothèque" : "Commencer maintenant"}
            </ButtonLink>
          </div>
        </Container>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Pourquoi des PDF interactifs                                     */}
      {/* ---------------------------------------------------------------- */}
      <section className="py-20 sm:py-24">
        <Container className="grid items-start gap-14 lg:grid-cols-2">
          <div>
            <SectionTitle
              eyebrow="Des PDF interactifs"
              title="Le tracé n'est pas une image, c'est un exercice"
              intro="Les ouvrages exploitent les fonctions interactives du format PDF : masquer puis révéler une interprétation, dérouler une légende, se déplacer d'un chapitre à l'autre par les liens du sommaire."
            />
            <div className="prose-liryc mt-8">
              <ul>
                <li>Interprétations masquées, à révéler après avoir cherché</li>
                <li>Sommaire cliquable et renvois internes entre chapitres</li>
                <li>Zoom sans perte sur les tracés, calibration visible</li>
                <li>Lecture hors ligne, sur ordinateur ou tablette</li>
              </ul>
            </div>
            <Link
              href="/aide"
              className="mt-6 inline-block font-bold text-liryc-teal hover:text-liryc-navy"
            >
              Comment ouvrir un PDF interactif →
            </Link>
          </div>

          <div className="border-l-4 border-liryc-orange bg-liryc-mist p-8">
            <p className="text-[0.78rem] font-bold tracking-[0.14em] text-liryc-orange uppercase">
              À savoir
            </p>
            <p className="mt-4 text-[1.02rem] leading-relaxed text-liryc-navy">
              Les fonctions interactives ne s&apos;affichent pas dans la visionneuse
              PDF intégrée aux navigateurs, ni dans l&apos;aperçu des messageries.
            </p>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-liryc-ink">
              Téléchargez le fichier, puis ouvrez-le avec un lecteur complet
              (Adobe Acrobat Reader, gratuit, sur ordinateur comme sur tablette).
              Le reste du contenu, lui, reste lisible partout.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
