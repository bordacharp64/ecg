import type { Metadata } from "next";

import { Container, Notice, SectionTitle } from "@/components/ui";

export const metadata: Metadata = {
  title: "Aide à la lecture",
  description:
    "Comment ouvrir et exploiter les PDF interactifs de la collection ECG de l'IHU Liryc, sur ordinateur comme sur tablette.",
};

const steps = [
  {
    title: "1. Enregistrez le fichier",
    body: "Depuis votre bibliothèque, cliquez sur « Télécharger le PDF ». Le fichier s'enregistre sur votre appareil : ne l'ouvrez pas depuis l'onglet du navigateur.",
  },
  {
    title: "2. Installez un lecteur PDF complet",
    body: "Adobe Acrobat Reader est gratuit et existe pour Windows, macOS, iPadOS et Android. C'est le seul lecteur qui restitue l'ensemble des fonctions interactives.",
  },
  {
    title: "3. Ouvrez le fichier depuis ce lecteur",
    body: "Sur tablette : « Ouvrir dans » puis Acrobat. Sur ordinateur : clic droit, « Ouvrir avec ». Autorisez l'affichage du contenu interactif si la question est posée.",
  },
];

const faq = [
  {
    question: "Les zones masquées ne réagissent pas quand je clique",
    answer:
      "Le fichier est probablement ouvert dans la visionneuse du navigateur (Chrome, Safari, Edge) ou dans l'Aperçu de macOS. Ces lecteurs affichent le texte et les tracés, mais ignorent les champs interactifs. Enregistrez le fichier et ouvrez-le dans Adobe Acrobat Reader.",
  },
  {
    question: "Puis-je lire les ouvrages sur mon téléphone ?",
    answer:
      "Techniquement oui, mais les tracés perdent beaucoup à cet écran : la mesure d'un intervalle demande de la surface. Nous recommandons une tablette au minimum, idéalement un ordinateur.",
  },
  {
    question: "Puis-je annoter le PDF ?",
    answer:
      "Oui. Les annotations d'Acrobat Reader (surlignage, notes, dessin) fonctionnent normalement et sont conservées dans votre copie du fichier.",
  },
  {
    question: "Puis-je imprimer un ouvrage ?",
    answer:
      "L'impression est autorisée pour votre usage personnel. Les fonctions interactives disparaissent bien sûr sur le papier, et les tracés perdent la finesse permise par le zoom.",
  },
  {
    question: "Puis-je partager le fichier avec ma promotion ?",
    answer:
      "Non : les ouvrages sont mis à disposition pour un usage personnel. Orientez plutôt vos camarades vers ce site, où l'inscription est gratuite. Cela nous permet aussi de mesurer la diffusion réelle de la collection.",
  },
  {
    question: "Comment savoir si une nouvelle version est parue ?",
    answer:
      "La date de version figure sur la fiche de chaque ouvrage. Si vous avez coché la case correspondante à l'inscription, vous recevez un e-mail à chaque mise à jour.",
  },
  {
    question: "Je ne reçois pas le lien de connexion",
    answer:
      "Vérifiez le dossier des indésirables, puis que l'adresse saisie est bien la bonne. Certaines messageries universitaires filtrent fortement : dans ce cas, réessayez avec une adresse personnelle. En dernier recours, écrivez-nous à formation@ihu-liryc.fr.",
  },
];

export default function HelpPage() {
  return (
    <>
      <section className="bg-liryc-navy py-14 text-white sm:py-16">
        <Container>
          <p className="mb-3 text-[0.78rem] font-bold tracking-[0.16em] text-liryc-cyan uppercase">
            Mode d&apos;emploi
          </p>
          <h1 className="text-[2rem] leading-[2.5rem] font-black sm:text-[2.6rem] sm:leading-[3rem]">
            Aide à la lecture
          </h1>
          <p className="mt-5 max-w-[60ch] text-[1.05rem] leading-relaxed text-white/85">
            Ces ouvrages exploitent les fonctions interactives du format PDF.
            Encore faut-il les ouvrir avec le bon outil : voici comment.
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-[952px] space-y-16">
          <Notice tone="info" title="Le point essentiel">
            La visionneuse PDF intégrée aux navigateurs et l&apos;aperçu des
            messageries n&apos;affichent pas les champs interactifs. Le fichier
            paraît alors incomplet, alors qu&apos;il ne l&apos;est pas.
            Téléchargez-le, puis ouvrez-le dans Adobe Acrobat Reader.
          </Notice>

          <div>
            <SectionTitle eyebrow="En trois gestes" title="Bien ouvrir un ouvrage" />
            <ol className="mt-10 grid gap-8 md:grid-cols-3">
              {steps.map((step) => (
                <li key={step.title} className="border-t-4 border-liryc-cyan pt-5">
                  <h3 className="text-title-4 leading-title-4 text-liryc-navy">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-[0.95rem] leading-relaxed text-liryc-ink">
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <SectionTitle eyebrow="Questions fréquentes" title="Vos questions" />
            <dl className="mt-10 divide-y divide-liryc-line border-y border-liryc-line">
              {faq.map((item) => (
                <div key={item.question} className="py-6">
                  <dt className="text-title-4 leading-title-4 text-liryc-teal">
                    {item.question}
                  </dt>
                  <dd className="mt-2.5 max-w-[80ch] text-[0.97rem] leading-relaxed text-liryc-ink">
                    {item.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="border-l-4 border-liryc-teal bg-liryc-mist p-8">
            <h2 className="text-title-3 leading-title-3 text-liryc-navy">
              Une question sans réponse ici ?
            </h2>
            <p className="mt-3 text-[0.97rem] leading-relaxed text-liryc-ink">
              Écrivez à{" "}
              <a
                href="mailto:formation@ihu-liryc.fr"
                className="font-bold text-liryc-teal underline"
              >
                formation@ihu-liryc.fr
              </a>
              . Les remarques sur le contenu des ouvrages sont également
              bienvenues : elles nourrissent les éditions suivantes.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
