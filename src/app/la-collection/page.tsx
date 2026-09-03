import type { Metadata } from "next";

import { ButtonLink, Container, SectionTitle } from "@/components/ui";

export const metadata: Metadata = {
  title: "La collection",
  description:
    "Pourquoi l'IHU Liryc met gratuitement à disposition des étudiants en médecine ses ouvrages d'interprétation de l'électrocardiogramme.",
};

export default function CollectionPage() {
  return (
    <>
      <section className="bg-liryc-navy py-14 text-white sm:py-16">
        <Container>
          <p className="mb-3 text-[0.78rem] font-bold tracking-[0.16em] text-liryc-cyan uppercase">
            Une démarche de formation
          </p>
          <h1 className="max-w-[30ch] text-[2rem] leading-[2.5rem] font-black sm:text-[2.6rem] sm:leading-[3rem]">
            Remettre l&apos;ECG au centre de l&apos;apprentissage
          </h1>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="grid gap-16 lg:grid-cols-[1fr_340px]">
          <div className="prose-liryc max-w-[952px]">
            <p className="text-[1.12rem] leading-relaxed">
              L&apos;électrocardiogramme reste l&apos;examen le plus prescrit en
              cardiologie et l&apos;un des plus mal interprétés. Il ne s&apos;agit
              pourtant pas d&apos;un savoir difficile : c&apos;est un savoir qui
              demande des tracés, beaucoup de tracés, et une méthode.
            </p>

            <h2>Pourquoi cette collection</h2>
            <p>
              Les ouvrages de cette collection sont nés de l&apos;enseignement
              dispensé à l&apos;IHU Liryc. Ils rassemblent ce que nous
              répétons année après année aux étudiants, aux internes et aux
              médecins en formation continue : une méthode de lecture, des
              tracés authentiques, et les pièges qui font manquer un diagnostic.
            </p>

            <h2>Pourquoi gratuitement</h2>
            <p>
              Parce qu&apos;un manuel qui coûte cher n&apos;est pas lu par ceux
              qui en ont le plus besoin. L&apos;IHU Liryc est un institut
              hospitalo-universitaire : la diffusion des connaissances fait
              partie de sa mission. Ces ouvrages sont donc mis à disposition
              sans frais, à la seule condition d&apos;une inscription qui nous
              permet de savoir où et comment ils sont utilisés.
            </p>

            <h2>Pourquoi des PDF interactifs</h2>
            <p>
              Un tracé imprimé se lit passivement : l&apos;œil descend vers la
              légende et l&apos;exercice est perdu. Le PDF interactif permet
              d&apos;inverser cet ordre. L&apos;interprétation reste masquée
              jusqu&apos;à ce que le lecteur ait cherché, les mesures se
              dévoilent à la demande, et le sommaire permet de circuler entre
              chapitres. C&apos;est un livre qui se pratique autant qu&apos;il
              se lit.
            </p>

            <h2>Comment la collection évolue</h2>
            <p>
              Chaque volume est révisé à mesure que les recommandations
              évoluent et que les retours des lecteurs nous parviennent. La date
              de version figure sur chaque fiche : une version plus récente
              remplace toujours la précédente, sans que vous ayez à vous
              réinscrire.
            </p>

            <h2>Et pour les autres langues</h2>
            <p>
              La collection démarre en français, pour les étudiants des facultés
              françaises et francophones. Une édition anglaise est envisagée
              une fois les quatre volumes français parus et éprouvés.
            </p>
          </div>

          <aside className="space-y-6">
            <div className="border border-liryc-line bg-liryc-mist p-7">
              <h2 className="text-title-4 leading-title-4 text-liryc-navy">
                À propos de l&apos;IHU Liryc
              </h2>
              <p className="mt-3 text-[0.93rem] leading-relaxed text-liryc-ink">
                L&apos;institut de rythmologie et modélisation cardiaque réunit
                à Bordeaux la recherche, le soin et la formation autour des
                maladies du rythme cardiaque.
              </p>
              <a
                href="https://www.ihu-liryc.fr"
                rel="noreferrer"
                className="mt-4 inline-block text-[0.9rem] font-bold text-liryc-teal hover:text-liryc-navy"
              >
                ihu-liryc.fr →
              </a>
            </div>

            <div className="border-l-4 border-liryc-cyan bg-liryc-cyan-soft p-7">
              <h2 className="text-title-4 leading-title-4 text-liryc-navy">
                Accéder aux ouvrages
              </h2>
              <p className="mt-3 text-[0.93rem] leading-relaxed text-liryc-ink">
                L&apos;inscription est gratuite et prend moins d&apos;une
                minute.
              </p>
              <div className="mt-5">
                <ButtonLink href="/inscription">Créer mon compte</ButtonLink>
              </div>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
