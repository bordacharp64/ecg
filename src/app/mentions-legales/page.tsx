import type { Metadata } from "next";

import { Container, Notice } from "@/components/ui";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Éditeur, hébergeur, propriété intellectuelle et conditions d'usage de la bibliothèque ECG de l'IHU Liryc.",
};

export default function LegalPage() {
  return (
    <>
      <section className="bg-liryc-navy py-14 text-white sm:py-16">
        <Container>
          <h1 className="text-[2rem] leading-[2.5rem] font-black sm:text-[2.6rem] sm:leading-[3rem]">
            Mentions légales
          </h1>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-[952px] space-y-10">
          <Notice tone="info" title="À compléter avant la mise en ligne">
            Les éléments entre crochets doivent être renseignés par
            l&apos;IHU Liryc : dénomination juridique, adresse, directeur de la
            publication, hébergeur retenu.
          </Notice>

          <div className="prose-liryc">
            <h2>Éditeur du site</h2>
            <p>
              [Dénomination juridique exacte de l&apos;IHU Liryc]
              <br />
              [Adresse du siège]
              <br />
              [Numéro SIRET]
              <br />
              Directeur de la publication : [nom et fonction]
              <br />
              Contact : [adresse e-mail de contact]
            </p>

            <h2>Hébergement</h2>
            <p>
              [Nom de l&apos;hébergeur]
              <br />
              [Adresse de l&apos;hébergeur]
              <br />
              Données hébergées dans l&apos;Union européenne.
            </p>

            <h2>Propriété intellectuelle</h2>
            <p>
              Les ouvrages diffusés sur ce site, leurs textes, leurs
              illustrations et les tracés électrocardiographiques qu&apos;ils
              contiennent sont protégés par le droit d&apos;auteur. Ils
              demeurent la propriété de leurs auteurs et de l&apos;IHU Liryc.
            </p>
            <p>
              Leur mise à disposition gratuite vaut autorisation de
              téléchargement, de lecture, d&apos;annotation et d&apos;impression
              pour un usage strictement personnel de formation. Sont en
              revanche exclues, sauf autorisation écrite préalable :
            </p>
            <ul>
              <li>
                la reproduction ou la rediffusion des fichiers, en tout ou
                partie, sur quelque support que ce soit ;
              </li>
              <li>
                leur mise en ligne sur un autre site, un espace de partage, un
                réseau social ou une plateforme d&apos;enseignement ;
              </li>
              <li>toute exploitation commerciale, revente ou cession ;</li>
              <li>
                la réutilisation des tracés et illustrations dans un autre
                support pédagogique.
              </li>
            </ul>
            <p>
              Toute demande de réutilisation dans un cadre d&apos;enseignement
              peut être adressée à [adresse e-mail de contact] : elle est
              examinée favorablement dans la plupart des cas.
            </p>

            <h2>Avertissement médical</h2>
            <p>
              Les ouvrages de cette collection sont des supports de formation
              destinés à des étudiants et à des professionnels de santé. Ils ne
              constituent ni un avis médical, ni un protocole de soins, et ne
              se substituent pas au jugement clinique ni aux recommandations en
              vigueur. Ils ne sont pas destinés au public et ne doivent pas
              servir à l&apos;autodiagnostic.
            </p>

            <h2>Responsabilité</h2>
            <p>
              L&apos;IHU Liryc apporte le plus grand soin à l&apos;exactitude
              des contenus diffusés, sans pouvoir garantir l&apos;absence
              d&apos;erreur. Toute inexactitude constatée peut être signalée à
              [adresse e-mail de contact] et sera corrigée dans l&apos;édition
              suivante.
            </p>

            <h2>Accessibilité</h2>
            <p>
              Le site est conçu pour être utilisable au clavier, avec un
              lecteur d&apos;écran et à fort niveau de zoom. Si vous rencontrez
              un obstacle d&apos;accès, signalez-le à [adresse e-mail de
              contact] : nous corrigerons.
            </p>

            <h2>Droit applicable</h2>
            <p>
              Le présent site est soumis au droit français. Pour la protection
              des données personnelles, voir la page
              « Données personnelles ».
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
