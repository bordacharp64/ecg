"use client";

import Link from "next/link";
import { useState } from "react";

import { Button, Notice } from "@/components/ui";

export function LoginForm() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentTo, setSentTo] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/connexion", {
        method: "POST",
        body: formData,
      });
      const payload = await response.json();

      if (!response.ok) {
        setError(payload.message ?? "Une erreur est survenue.");
        return;
      }

      setSentTo(payload.email as string);
    } catch {
      setError(
        "Le serveur n'a pas répondu. Vérifiez votre connexion et réessayez.",
      );
    } finally {
      setPending(false);
    }
  }

  if (sentTo) {
    return (
      <Notice tone="success" title="Lien envoyé">
        <p>
          Si un compte existe pour <strong>{sentTo}</strong>, un lien de
          connexion vient d&apos;y être envoyé. Il est valable 30 minutes et ne
          fonctionne qu&apos;une fois.
        </p>
      </Notice>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {error ? <Notice tone="error">{error}</Notice> : null}

      <div>
        <label
          htmlFor="email"
          className="block text-[0.85rem] font-bold tracking-wide text-liryc-navy uppercase"
        >
          Adresse e-mail
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          autoFocus
          className="mt-2 w-full border border-liryc-line bg-white px-4 py-3 text-[0.98rem] text-liryc-ink transition-colors focus:border-liryc-teal"
        />
      </div>

      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Envoi en cours…" : "Recevoir mon lien de connexion"}
      </Button>

      <p className="text-[0.88rem] text-liryc-ink">
        Pas encore de compte ?{" "}
        <Link
          href="/inscription"
          className="font-bold text-liryc-teal hover:text-liryc-navy"
        >
          S&apos;inscrire gratuitement
        </Link>
      </p>
    </form>
  );
}
