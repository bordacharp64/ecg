import Link from "next/link";

import { BookCover } from "@/components/book-cover";
import { ButtonLink, Container, SectionTitle } from "@/components/ui";
import { pageContext } from "@/lib/contexte";
import { worksForLanguage } from "@/lib/langue";

export default async function HomePage() {
  const { language, t } = await pageContext();

  // Un representant par oeuvre, dans la meilleure langue disponible pour ce
  // visiteur : quatre volumes, et non huit traductions.
  const works = worksForLanguage(language);
  const availableCount = works.filter((book) => book.published).length;

  const steps = [
    { number: "01", title: t("home.step1Title"), body: t("home.step1Body") },
    { number: "02", title: t("home.step2Title"), body: t("home.step2Body") },
    { number: "03", title: t("home.step3Title"), body: t("home.step3Body") },
  ];

  return (
    <>
      {/* ---------------------------------------------------------------- */}
      {/* Bandeau d'accueil                                                */}
      {/* ---------------------------------------------------------------- */}
      <section className="relative overflow-hidden bg-liryc-navy text-white">
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
              {t("home.badge")}
            </p>
            <h1 className="text-[2.1rem] leading-[2.6rem] font-black sm:text-title-1 sm:leading-title-1">
              {t("home.title1")}
              <span className="block text-liryc-cyan">{t("home.title2")}</span>
            </h1>
            <p className="mt-7 max-w-[52ch] text-[1.08rem] leading-relaxed text-white/85">
              {t("home.intro")}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <ButtonLink href="/ouvrages">{t("home.cta")}</ButtonLink>
              <ButtonLink href="#comment" variant="ghost">
                {t("home.ctaSecondary")}
              </ButtonLink>
            </div>

            <dl className="mt-14 flex flex-wrap gap-x-12 gap-y-6 border-t border-white/15 pt-8">
              <div>
                <dt className="text-[0.78rem] font-bold tracking-[0.12em] text-liryc-cyan uppercase">
                  {t("home.statBooks")}
                </dt>
                <dd className="mt-1 text-[1.9rem] leading-none font-black">
                  {works.length}
                </dd>
              </div>
              <div>
                <dt className="text-[0.78rem] font-bold tracking-[0.12em] text-liryc-cyan uppercase">
                  {t("home.statAvailable")}
                </dt>
                <dd className="mt-1 text-[1.9rem] leading-none font-black">
                  {availableCount}
                </dd>
              </div>
              <div>
                <dt className="text-[0.78rem] font-bold tracking-[0.12em] text-liryc-cyan uppercase">
                  {t("home.statPrice")}
                </dt>
                <dd className="mt-1 text-[1.9rem] leading-none font-black">
                  {t("home.free")}
                </dd>
              </div>
            </dl>
          </div>

          {/* Pile de couvertures : seule celle du premier plan porte son
              titre, les autres ne laissent depasser que leur tranche. */}
          <div className="relative mx-auto hidden h-[420px] w-[400px] lg:block">
            {works
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
                  <BookCover
                    book={book}
                    volumeLabel={`${t("books.volume")} ${book.volume}`}
                    decorative={index !== 2}
                  />
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
            eyebrow={t("home.collectionEyebrow")}
            title={t("home.collectionTitle")}
            intro={t("home.collectionIntro")}
          />

          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {works.map((book) => (
              <article key={book.slug} className="group flex flex-col">
                <Link
                  href={`/ouvrages/${book.slug}`}
                  className="block overflow-hidden"
                >
                  <BookCover
                    book={book}
                    volumeLabel={`${t("books.volume")} ${book.volume}`}
                    className="transition-transform duration-300 group-hover:scale-[1.03]"
                  />
                </Link>

                <div className="flex flex-1 flex-col pt-5">
                  <p className="text-[0.72rem] font-bold tracking-[0.14em] text-liryc-cyan uppercase">
                    {t("books.volume")} {book.volume}
                    {!book.published ? ` · ${t("books.comingSoon")}` : ""}
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
                    {t("books.discover")} →
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
      <section id="comment" className="bg-liryc-mist py-20 sm:py-24">
        <Container>
          <SectionTitle
            eyebrow={t("home.stepsEyebrow")}
            title={t("home.stepsTitle")}
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
            <ButtonLink href="/ouvrages">{t("home.cta")}</ButtonLink>
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
              eyebrow={t("home.interactiveEyebrow")}
              title={t("home.interactiveTitle")}
              intro={t("home.interactiveIntro")}
            />
            <div className="prose-liryc mt-8">
              <ul>
                <li>{t("home.interactive1")}</li>
                <li>{t("home.interactive2")}</li>
                <li>{t("home.interactive3")}</li>
                <li>{t("home.interactive4")}</li>
              </ul>
            </div>
            <Link
              href="/aide"
              className="mt-6 inline-block font-bold text-liryc-teal hover:text-liryc-navy"
            >
              {t("home.interactiveLink")} →
            </Link>
          </div>

          <div className="border-l-4 border-liryc-orange bg-liryc-mist p-8">
            <p className="text-[0.78rem] font-bold tracking-[0.14em] text-liryc-orange uppercase">
              {t("home.noticeTitle")}
            </p>
            <p className="mt-4 text-[1.02rem] leading-relaxed text-liryc-navy">
              {t("home.noticeBody")}
            </p>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-liryc-ink">
              {t("home.noticeBody2")}
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
