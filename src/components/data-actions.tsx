"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button, Notice } from "@/components/ui";

export function DataActions({ labels }: { labels: Record<string, string> }) {
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
        setError(labels.deleteFailed);
        return;
      }
      router.push("/");
      router.refresh();
    } catch {
      setError(labels.deleteFailed);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-5">
      {error ? <Notice tone="error">{error}</Notice> : null}

      {!confirming ? (
        <Button variant="secondary" onClick={() => setConfirming(true)}>
          {labels.delete}
        </Button>
      ) : (
        <div className="border-l-4 border-liryc-red bg-[#fdf0f2] p-6">
          <p className="font-bold text-liryc-navy">
            {labels.deleteConfirmTitle}
          </p>
          <p className="mt-2 text-[0.93rem] leading-relaxed text-liryc-ink">
            {labels.deleteConfirmBody}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Button
              onClick={handleDelete}
              disabled={pending}
              className="bg-liryc-red hover:bg-[#b30224]"
            >
              {labels.deleteConfirm}
            </Button>
            <Button
              variant="secondary"
              onClick={() => setConfirming(false)}
              disabled={pending}
            >
              {labels.cancel}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
