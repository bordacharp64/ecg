"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { OTHER_UNIVERSITY, universitiesByCountry } from "#content/universites.ts";
import { Button, Notice } from "@/components/ui";

const labelClass =
  "block text-[0.85rem] font-bold tracking-wide text-liryc-navy uppercase";
const inputClass =
  "mt-2 w-full border border-liryc-line bg-white px-4 py-3 text-[0.98rem] " +
  "text-liryc-ink transition-colors focus:border-liryc-teal " +
  "disabled:cursor-not-allowed disabled:bg-liryc-mist disabled:text-liryc-ink/60";
const errorClass = "mt-1.5 text-[0.85rem] font-bold text-liryc-red";

export type CountryOption = { code: string; name: string; pinned: boolean };
export type StatusGroup = {
  group: string;
  items: Array<{ value: string; label: string }>;
};

export function IdentificationForm({
  bookSlug,
  language,
  countries,
  statusGroups,
  labels,
}: {
  bookSlug: string;
  language: string;
  countries: CountryOption[];
  statusGroups: StatusGroup[];
  labels: Record<string, string>;
}) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pending, setPending] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [country, setCountry] = useState("");
  const [university, setUniversity] = useState("");

  const facultyList = useMemo(
    () => (country ? (universitiesByCountry[country] ?? []) : []),
    [country],
  );

  // Deux comportements selon le pays : menu deroulant quand la liste des
  // facultes existe, saisie libre sinon. Une liste mondiale partielle
  // pousserait l'etudiant a choisir au hasard.
  const hasList = facultyList.length > 0;
  const needsFreeText = !hasList || university === OTHER_UNIVERSITY;

  function handleCountryChange(value: string) {
    setCountry(value);
    // La faculte choisie n'a plus de sens si le pays change.
    setUniversity("");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setErrors({});

    const formData = new FormData(event.currentTarget);
    // Sans liste pour ce pays, la saisie libre fait office de choix.
    if (!hasList) formData.set("university", OTHER_UNIVERSITY);

    try {
      const response = await fetch("/api/identification", {
        method: "POST",
        body: formData,
      });
      const payload = await response.json();

      if (!response.ok) {
        setErrors(
          payload.errors ?? { form: payload.message ?? labels.serverError },
        );
        return;
      }

      const url = payload.downloadUrl as string | null;
      if (url) {
        setDownloadUrl(url);
        // Le telechargement part tout seul : la fiche etant validee, faire
        // cliquer une seconde fois serait une friction inutile.
        window.location.assign(url);
      }
    } catch {
      setErrors({ form: labels.serverError });
    } finally {
      setPending(false);
    }
  }

  if (downloadUrl) {
    return (
      <Notice tone="success" title={labels.startingTitle}>
        <p>{labels.startingBody}</p>
        <p className="mt-3">
          <a href={downloadUrl} className="font-bold underline">
            {labels.startingLink}
          </a>
        </p>
      </Notice>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <input type="hidden" name="book" value={bookSlug} />
      <input type="hidden" name="language" value={language} />

      {errors.form ? <Notice tone="error">{errors.form}</Notice> : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className={labelClass}>
            {labels.firstName}
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
            {labels.lastName}
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
          {labels.email}
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
          {labels.emailHelp}
        </p>
        {errors.email ? <p className={errorClass}>{errors.email}</p> : null}
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="country" className={labelClass}>
            {labels.country}
          </label>
          <select
            id="country"
            name="country"
            required
            value={country}
            onChange={(event) => handleCountryChange(event.target.value)}
            className={inputClass}
            aria-invalid={Boolean(errors.country)}
          >
            <option value="">{labels.countryPlaceholder}</option>
            {countries.map((option) => (
              <option key={option.code} value={option.code}>
                {option.name}
              </option>
            ))}
          </select>
          {errors.country ? <p className={errorClass}>{errors.country}</p> : null}
        </div>

        <div>
          <label htmlFor="status" className={labelClass}>
            {labels.status}
          </label>
          <select
            id="status"
            name="status"
            required
            defaultValue=""
            className={inputClass}
            aria-invalid={Boolean(errors.status)}
          >
            <option value="">{labels.statusPlaceholder}</option>
            {statusGroups.map((group) => (
              <optgroup key={group.group} label={group.group}>
                {group.items.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          {errors.status ? <p className={errorClass}>{errors.status}</p> : null}
        </div>
      </div>

      <div>
        <label htmlFor="university" className={labelClass}>
          {labels.university}
        </label>

        {hasList ? (
          <select
            id="university"
            name="university"
            required
            value={university}
            onChange={(event) => setUniversity(event.target.value)}
            className={inputClass}
            aria-invalid={Boolean(errors.university)}
          >
            <option value="">{labels.universityPlaceholder}</option>
            {facultyList.map((faculty) => (
              <option key={faculty} value={faculty}>
                {faculty}
              </option>
            ))}
            <option value={OTHER_UNIVERSITY}>{labels.universityOther}</option>
          </select>
        ) : null}

        {needsFreeText ? (
          <div className={hasList ? "mt-3" : ""}>
            <label htmlFor="universityOther" className="sr-only">
              {labels.universityFreeText}
            </label>
            <input
              id="universityOther"
              name="universityOther"
              required
              disabled={!country}
              placeholder={
                country
                  ? labels.universityFreeText
                  : labels.universityAfterCountry
              }
              className={inputClass}
              aria-invalid={Boolean(errors.universityOther)}
            />
          </div>
        ) : null}

        {errors.university ? (
          <p className={errorClass}>{errors.university}</p>
        ) : null}
        {errors.universityOther ? (
          <p className={errorClass}>{errors.universityOther}</p>
        ) : null}
      </div>

      <fieldset className="space-y-4 border-t border-liryc-line pt-6">
        <legend className="sr-only">{labels.consents}</legend>

        <label className="flex gap-3 text-[0.92rem] leading-relaxed text-liryc-ink">
          <input
            type="checkbox"
            name="privacyAccepted"
            required
            className="mt-1 h-4 w-4 shrink-0 accent-[#086d84]"
            aria-invalid={Boolean(errors.privacyAccepted)}
          />
          <span>
            {labels.privacyBefore}{" "}
            <Link
              href="/confidentialite"
              className="font-bold text-liryc-teal underline"
            >
              {labels.privacyLink}
            </Link>{" "}
            {labels.privacyAfter}
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
          <span>{labels.newsletter}</span>
        </label>
      </fieldset>

      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? labels.submitting : labels.submit}
      </Button>
    </form>
  );
}
