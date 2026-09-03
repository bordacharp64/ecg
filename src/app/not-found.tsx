import { ButtonLink, Container } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="py-24 sm:py-32">
      <Container className="max-w-[620px] text-center">
        <p className="text-[0.8rem] font-bold tracking-[0.16em] text-liryc-cyan uppercase">
          Erreur 404
        </p>
        <h1 className="mt-4 text-[2rem] leading-[2.5rem] font-black text-liryc-navy">
          Cette page n&apos;existe pas
        </h1>
        <p className="mt-5 text-[1.02rem] leading-relaxed text-liryc-ink">
          Le lien est peut-être erroné, ou la page a été déplacée. La
          bibliothèque, elle, est toujours là.
        </p>
        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <ButtonLink href="/">Retour à l&apos;accueil</ButtonLink>
          <ButtonLink href="/ouvrages" variant="secondary">
            Voir les ouvrages
          </ButtonLink>
        </div>
      </Container>
    </section>
  );
}
