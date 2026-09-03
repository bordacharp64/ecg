import { ButtonLink, Container } from "@/components/ui";
import { pageContext } from "@/lib/contexte";

export default async function NotFound() {
  const { t } = await pageContext();

  return (
    <section className="py-24 sm:py-32">
      <Container className="max-w-[620px] text-center">
        <p className="text-[0.8rem] font-bold tracking-[0.16em] text-liryc-cyan uppercase">
          Erreur 404
        </p>
        <h1 className="mt-4 text-[2rem] leading-[2.5rem] font-black text-liryc-navy">
          {t("error.404Title")}
        </h1>
        <p className="mt-5 text-[1.02rem] leading-relaxed text-liryc-ink">
          {t("error.404Body")}
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <ButtonLink href="/">{t("error.backHome")}</ButtonLink>
          <ButtonLink href="/ouvrages" variant="secondary">
            {t("nav.books")}
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
