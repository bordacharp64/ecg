import type { Metadata } from "next";

import { Container, Notice } from "@/components/ui";

export const metadata: Metadata = {
  title: "Données personnelles",
  description:
    "Quelles données la bibliothèque ECG de l'IHU Liryc collecte, pourquoi, combien de temps, et comment exercer vos droits.",
};

export default function PrivacyPage() {
  return (
    <>
      <section className="bg-liryc-navy py-14 text-white sm:py-16">
        <Container>
          <h1 className="text-[2rem] leading-[2.5rem] font-black sm:text-[2.6rem] sm:leading-[3rem]">
            Données personnelles
          </h1>
          <p className="mt-4 text-[0.95rem] text-white/70">
            Politique de confidentialité de la bibliothèque ECG
          </p>
        </Container>
      </section>

      <section className="py-16 sm:py-20">
        <Container className="max-w-[952px] space-y-10">
          <Notice tone="info" title="À faire valider avant la mise en ligne">
            Ce texte est un projet rédigé à partir du fonctionnement réel du
            site. Il doit être relu et complété par le délégué à la protection
            des données de l&apos;IHU Liryc : identité exacte du responsable de
            traitement, coordonnées du DPO, base légale retenue et durées de
            conservation définitives. Les emplacements à compléter sont signalés
            entre crochets.
          </Notice>

          <div className="prose-liryc">
            <h2>Qui traite vos données</h2>
            <p>
              Le responsable du traitement est [dénomination juridique exacte de
              l&apos;IHU Liryc], dont le siège est situé [adresse]. Les
              questions relatives à vos données peuvent être adressées au
              délégué à la protection des données : [adresse e-mail du DPO].
            </p>

            <h2>Quelles données et pourquoi</h2>
            <p>
              La collecte est limitée à ce qui sert effectivement au
              fonctionnement du site et au pilotage de la formation :
            </p>
            <ul>
              <li>
                <strong>Nom, prénom, adresse e-mail</strong> — identifier votre
                compte et vous envoyer vos liens de connexion. Sans ces
                données, l&apos;accès aux ouvrages ne peut pas être ouvert.
              </li>
              <li>
                <strong>Profil, établissement, pays, année d&apos;études</strong>{" "}
                — mesurer la diffusion des ouvrages par faculté et par niveau,
                et orienter les éditions suivantes.
              </li>
              <li>
                <strong>Historique de téléchargement</strong> (ouvrage et date)
                — statistiques de diffusion et rapports d&apos;activité de
                l&apos;institut.
              </li>
              <li>
                <strong>Consentement aux informations de formation</strong>, si
                vous l&apos;avez donné — vous prévenir des nouvelles parutions.
              </li>
            </ul>
            <p>
              Aucune adresse IP n&apos;est conservée dans la base. Aucun mot de
              passe n&apos;est stocké : l&apos;authentification repose sur un
              lien à usage unique envoyé par e-mail.
            </p>

            <h2>Base légale</h2>
            <p>
              Le traitement repose sur [base légale à confirmer par le DPO :
              consentement, art. 6.1.a, ou mission d&apos;intérêt public,
              art. 6.1.e]. L&apos;envoi d&apos;informations sur les formations
              repose, lui, sur votre consentement distinct, révocable à tout
              moment.
            </p>

            <h2>Combien de temps</h2>
            <ul>
              <li>
                <strong>Compte</strong> : conservé tant que le compte est actif,
                puis [durée à confirmer, par exemple 3 ans] après la dernière
                connexion, avant suppression automatique.
              </li>
              <li>
                <strong>Liens de connexion</strong> : 30 minutes, puis inutilisables.
              </li>
              <li>
                <strong>Sessions</strong> : 30 jours, renouvelées à chaque connexion.
              </li>
              <li>
                <strong>Historique de téléchargement</strong> : supprimé avec le
                compte. Les statistiques agrégées, qui ne permettent plus de
                vous identifier, peuvent être conservées au-delà.
              </li>
            </ul>

            <h2>Qui y a accès</h2>
            <p>
              Seules les personnes de l&apos;équipe formation de l&apos;IHU
              Liryc habilitées à cet effet accèdent aux données nominatives.
              Aucune donnée n&apos;est vendue, louée ni transmise à des fins
              commerciales.
            </p>
            <p>
              Les sous-traitants techniques sont [hébergeur à préciser] pour
              l&apos;hébergement du site et de la base de données, et
              [prestataire d&apos;envoi d&apos;e-mails à préciser] pour
              l&apos;acheminement des liens de connexion. Les données sont
              hébergées dans l&apos;Union européenne.
            </p>

            <h2>Cookies</h2>
            <p>
              Le site dépose un seul cookie, nommé <code>ecg_session</code>,
              strictement nécessaire au maintien de votre connexion. Il ne sert
              à aucune mesure d&apos;audience et à aucun suivi publicitaire. À
              ce titre, il ne requiert pas de consentement préalable. Aucun
              traceur tiers n&apos;est chargé, et les polices de caractères
              sont servies depuis le site lui-même.
            </p>

            <h2>Vos droits</h2>
            <p>
              Vous disposez d&apos;un droit d&apos;accès, de rectification,
              d&apos;effacement, de limitation, d&apos;opposition et de
              portabilité de vos données.
            </p>
            <ul>
              <li>
                <strong>Accès et portabilité</strong> : depuis la page « Mon
                compte », le bouton « Télécharger mes données » produit
                immédiatement un fichier contenant l&apos;ensemble de vos
                données.
              </li>
              <li>
                <strong>Effacement</strong> : depuis la même page, le bouton
                « Supprimer mon compte » efface définitivement votre compte et
                votre historique.
              </li>
              <li>
                <strong>Rectification</strong> : écrivez à [adresse e-mail de
                contact].
              </li>
              <li>
                <strong>Retrait du consentement</strong> aux informations de
                formation : lien de désinscription présent dans chaque envoi.
              </li>
            </ul>
            <p>
              Si vous estimez que vos droits ne sont pas respectés, vous pouvez
              introduire une réclamation auprès de la Commission nationale de
              l&apos;informatique et des libertés (CNIL), 3 place de Fontenoy,
              TSA 80715, 75334 Paris Cedex 07 — <code>www.cnil.fr</code>.
            </p>

            <h2>Mise à jour</h2>
            <p>
              Dernière mise à jour : [date de validation]. Toute modification
              substantielle vous sera signalée par e-mail si vous disposez
              d&apos;un compte actif.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
