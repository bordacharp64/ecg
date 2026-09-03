import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { LoginForm } from "@/components/login-form";
import { Container, Notice } from "@/components/ui";
import { currentUser } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Connexion",
  description:
    "Recevez un lien de connexion par e-mail pour accéder à la bibliothèque ECG de l'IHU Liryc.",
  robots: { index: false, follow: true },
};

type Props = { searchParams: Promise<{ erreur?: string }> };

const errorMessages: Record<string, string> = {
  lien_invalide:
    "Ce lien de connexion n'est plus valable : il a expiré, ou il a déjà été utilisé. Demandez-en un nouveau ci-dessous.",
  lien_absent:
    "Le lien de connexion est incomplet. Demandez-en un nouveau ci-dessous.",
};

export default async function LoginPage({ searchParams }: Props) {
  const user = await currentUser().catch(() => null);
  if (user) redirect("/bibliotheque");

  const { erreur } = await searchParams;
  const message = erreur ? errorMessages[erreur] : undefined;

  return (
    <>
      <section className="bg-liryc-navy py-14 text-white sm:py-16">
        <Container>
          <h1 className="text-[2rem] leading-[2.5rem] font-black sm:text-[2.6rem] sm:leading-[3rem]">
            Se connecter
          </h1>
          <p className="mt-5 max-w-[54ch] text-[1.05rem] leading-relaxed text-white/85">
            Indiquez votre adresse e-mail : un lien de connexion vous y sera
            envoyé. Il n&apos;y a pas de mot de passe sur ce site.
          </p>
        </Container>
      </section>

      <section className="py-14 sm:py-20">
        <Container className="max-w-[560px] space-y-8">
          {message ? <Notice tone="error">{message}</Notice> : null}
          <LoginForm />
        </Container>
      </section>
    </>
  );
}
