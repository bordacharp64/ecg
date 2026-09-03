"use client";

import Link from "next/link";
import { useState } from "react";

import { Button, Notice } from "@/components/ui";
import { profiles } from "@/lib/validation";

const labelClass =
  "block text-[0.85rem] font-bold tracking-wide text-liryc-navy uppercase";
const inputClass =
  "mt-2 w-full border border-liryc-line bg-white px-4 py-3 text-[0.98rem] " +
  "text-liryc-ink transition-colors focus:border-liryc-teal";
const errorClass = "mt-1.5 text-[0.85rem] font-bold text-liryc-red";

type Errors = Record<string, string>;

export function RegistrationForm() {
  const [errors, setErrors] = useState<Errors>({});
  const [pending, setPending] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const [profile, setProfile] = useState("etudiant");

  // L'annee d'etudes n'a de sens que pour les etudiants et les internes.
  const showStudyYear = profile === "etudiant" || profile === "interne";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setErrors({});

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/inscription", {
        method: "POST",
        body: formData,
      });
      const payload = await response.json();

      if (!response.ok) {
        setErrors(
          payload.errors ?? {
            form: payload.message ?? "Une erreur est survenue.",
          },
        );
        return;
      }

      setSentTo(payload.email as string);
    } catch {
      setErrors({
        form: "Le serveur n'a pas répondu. Vérifiez votre connexion et réessayez.",
      });
    } finally {
      setPending(false);
    }
  }

  if (sentTo) {
    return (
      <Notice tone="success" title="Vérifiez votre boîte e-mail">
        <p>
          Un lien de confirmation vient d&apos;être envoyé à{" "}
          <strong>{sentTo}</strong>. Cliquez dessus pour activer votre compte et
          ouvrir la bibliothèque. Le lien est valable 30 minutes.
        </p>
        <p className="mt-3">
          Rien reçu au bout de quelques minutes ? Regardez dans les indésirables,
          ou{" "}
          <Link href="/connexion" className="underline">
            demandez un nouveau lien
          </Link>
          .
        </p>
      </Notice>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {errors.form ? <Notice tone="error">{errors.form}</Notice> : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className={labelClass}>
            Prénom
          </label>
          <input
            id="firstName"
            name="firstName"
            autoComplete="given-name"
            required
            className={inputClass}
            aria-invalid={Boolean(errors.firstName)}
          />
          {errors.firstName ? (
            <p className={errorClass}>{errors.firstName}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="lastName" className={labelClass}>
            Nom
          </label>
          <input
            id="lastName"
            name="lastName"
            autoComplete="family-name"
            required
            className={inputClass}
            aria-invalid={Boolean(errors.lastName)}
          />
          {errors.lastName ? (
            <p className={errorClass}>{errors.lastName}</p>
          ) : null}
        </div>
      </div>

      <div>
        <label htmlFor="email" className={labelClass}>
          Adresse e-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={inputClass}
          aria-invalid={Boolean(errors.email)}
          aria-describedby="email-help"
        />
        <p id="email-help" className="mt-1.5 text-[0.85rem] text-liryc-ink">
          Votre adresse universitaire de préférence. C&apos;est par là
          qu&apos;arrivent vos liens de connexion.
        </p>
        {errors.email ? <p className={errorClass}>{errors.email}</p> : null}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="profile" className={labelClass}>
            Vous êtes
          </label>
          <select
            id="profile"
            name="profile"
            required
            value={profile}
            onChange={(event) => setProfile(event.target.value)}
            className={inputClass}
            aria-invalid={Boolean(errors.profile)}
          >
            {profiles.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.profile ? (
            <p className={errorClass}>{errors.profile}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="studyYear" className={labelClass}>
            Année d&apos;études{" "}
            <span className="font-normal normal-case">(facultatif)</span>
          </label>
          <select
            id="studyYear"
            name="studyYear"
            className={inputClass}
            disabled={!showStudyYear}
          >
            <option value="">—</option>
            {Array.from({ length: 12 }, (_, index) => index + 1).map((year) => (
              <option key={year} value={year}>
                {year}
                <sup>e</sup> année
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-[1fr_180px]">
        <div>
          <label htmlFor="institution" className={labelClass}>
            Faculté ou établissement
          </label>
          <input
            id="institution"
            name="institution"
            required
            placeholder="Université de Bordeaux"
            className={inputClass}
            aria-invalid={Boolean(errors.institution)}
          />
          {errors.institution ? (
            <p className={errorClass}>{errors.institution}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="country" className={labelClass}>
            Pays
          </label>
          <select id="country" name="country" className={inputClass}>
            <option value="FR">France</option>
            <option value="BE">Belgique</option>
            <option value="CH">Suisse</option>
            <option value="CA">Canada</option>
            <option value="LU">Luxembourg</option>
            <option value="MA">Maroc</option>
            <option value="TN">Tunisie</option>
            <option value="DZ">Algérie</option>
            <option value="SN">Sénégal</option>
            <option value="ZZ">Autre</option>
          </select>
        </div>
      </div>

      <fieldset className="space-y-4 border-t border-liryc-line pt-6">
        <legend className="sr-only">Consentements</legend>

        <label className="flex gap-3 text-[0.92rem] leading-relaxed text-liryc-ink">
          <input
            type="checkbox"
            name="privacyAccepted"
            required
            className="mt-1 h-4 w-4 shrink-0 accent-[#086d84]"
            aria-invalid={Boolean(errors.privacyAccepted)}
          />
          <span>
            J&apos;ai lu et j&apos;accepte la{" "}
            <Link
              href="/confidentialite"
              className="font-bold text-liryc-teal underline"
            >
              politique de confidentialité
            </Link>{" "}
            et les conditions d&apos;usage des ouvrages.
          </span>
        </label>
        {errors.privacyAccepted ? (
          <p className={errorClass}>{errors.privacyAccepted}</p>
        ) : null}

        <label className="flex gap-3 text-[0.92rem] leading-relaxed text-liryc-ink">
          <input
            type="checkbox"
            name="newsletterOptIn"
            className="mt-1 h-4 w-4 shrink-0 accent-[#086d84]"
          />
          <span>
            Je souhaite être informé des nouvelles parutions et des formations
            de l&apos;IHU Liryc. (facultatif, désinscription à tout moment)
          </span>
        </label>
      </fieldset>

      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Envoi en cours…" : "Créer mon compte"}
      </Button>

      <p className="text-[0.88rem] text-liryc-ink">
        Vous avez déjà un compte ?{" "}
        <Link
          href="/connexion"
          className="font-bold text-liryc-teal hover:text-liryc-navy"
        >
          Se connecter
        </Link>
      </p>
    </form>
  );
}
