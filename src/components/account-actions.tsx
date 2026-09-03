"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, Notice } from "@/components/ui";

export function AccountActions() {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/compte", { method: "DELETE" });
      if (!response.ok) {
        setError("La suppression a échoué. Réessayez ou écrivez-nous.");
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError("Le serveur n'a pas répondu. Réessayez.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-5">
      {error ? <Notice tone="error">{error}</Notice> : null}

      {!confirming ? (
        <Button variant="secondary" onClick={() => setConfirming(true)}>
          Supprimer mon compte
        </Button>
      ) : (
        <div className="border-l-4 border-liryc-red bg-[#fdf0f2] p-6">
          <p className="font-bold text-liryc-navy">
            Confirmer la suppression définitive ?
          </p>
          <p className="mt-2 text-[0.93rem] leading-relaxed text-liryc-ink">
            Votre compte, vos informations et votre historique de
            téléchargement seront effacés sans possibilité de restauration. Les
            PDF déjà enregistrés sur vos appareils ne sont pas concernés.
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              onClick={handleDelete}
              disabled={pending}
              className="bg-liryc-red hover:bg-[#b30224]"
            >
              {pending ? "Suppression…" : "Oui, supprimer définitivement"}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setConfirming(false)}
              disabled={pending}
            >
              Annuler
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
