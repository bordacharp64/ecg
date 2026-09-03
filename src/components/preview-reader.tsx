"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import { Button, Notice } from "@/components/ui";

/**
 * Lecteur d'apercu. Les pages sont dessinees sur un canvas par pdf.js, ce qui
 * donne trois choses qu'un `<iframe>` ne donne pas : pas de bouton de
 * telechargement ni d'impression dans la visionneuse du navigateur, une
 * navigation homogene d'un navigateur a l'autre, et la certitude que seules
 * les pages servies par le serveur sont accessibles.
 *
 * La couche d'annotations n'est volontairement pas activee : l'apercu montre
 * les pages, les fonctions interactives restent la valeur du PDF telecharge.
 */

type PdfDocument = {
  numPages: number;
  getPage: (n: number) => Promise<PdfPage>;
  destroy: () => Promise<void>;
};

type PdfPage = {
  getViewport: (options: { scale: number }) => {
    width: number;
    height: number;
  };
  render: (options: {
    canvasContext: CanvasRenderingContext2D;
    viewport: { width: number; height: number };
  }) => { promise: Promise<void>; cancel: () => void };
};

export function PreviewReader({
  previewUrl,
  downloadUrl,
  bookHref,
  labels,
}: {
  previewUrl: string;
  downloadUrl: string;
  bookHref: string;
  labels: Record<string, string>;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const documentRef = useRef<PdfDocument | null>(null);
  const renderTaskRef = useRef<{ cancel: () => void } | null>(null);

  const [status, setStatus] = useState<"loading" | "ready" | "failed">(
    "loading",
  );
  const [pageCount, setPageCount] = useState(0);
  const [page, setPage] = useState(1);
  const [zoom, setZoom] = useState(1);

  // Chargement du document, une seule fois.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = "/pdfjs/pdf.worker.min.mjs";

        const doc = (await pdfjs.getDocument({
          url: previewUrl,
          // L'apercu est court : le charger d'un bloc evite des requetes
          // partielles et rend la navigation instantanee.
          disableRange: true,
          disableStream: true,
        }).promise) as unknown as PdfDocument;

        if (cancelled) {
          await doc.destroy();
          return;
        }

        documentRef.current = doc;
        setPageCount(doc.numPages);
        setStatus("ready");
      } catch (error) {
        if (!cancelled) {
          console.error("Chargement de l'aperçu impossible :", error);
          setStatus("failed");
        }
      }
    }

    load();

    return () => {
      cancelled = true;
      renderTaskRef.current?.cancel();
      documentRef.current?.destroy().catch(() => undefined);
      documentRef.current = null;
    };
  }, [previewUrl]);

  const renderPage = useCallback(
    async (pageNumber: number, scale: number) => {
      const doc = documentRef.current;
      const canvas = canvasRef.current;
      if (!doc || !canvas) return;

      // Un rendu en cours doit etre annule, sinon deux pages se dessinent
      // l'une sur l'autre quand on navigue vite.
      renderTaskRef.current?.cancel();

      const pdfPage = await doc.getPage(pageNumber);

      // On borne la largeur pour rester lisible sans saturer la memoire sur
      // mobile, et on tient compte de la densite d'ecran pour la nettete.
      const containerWidth = canvas.parentElement?.clientWidth ?? 900;
      const base = pdfPage.getViewport({ scale: 1 });
      const fitScale = Math.min(containerWidth / base.width, 2);
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      const viewport = pdfPage.getViewport({ scale: fitScale * scale * ratio });

      canvas.width = Math.floor(viewport.width);
      canvas.height = Math.floor(viewport.height);
      canvas.style.width = `${Math.floor(viewport.width / ratio)}px`;
      canvas.style.height = `${Math.floor(viewport.height / ratio)}px`;

      const context = canvas.getContext("2d");
      if (!context) return;

      const task = pdfPage.render({ canvasContext: context, viewport });
      renderTaskRef.current = task;

      try {
        await task.promise;
      } catch (error) {
        // Une annulation volontaire n'est pas une erreur.
        if ((error as { name?: string })?.name !== "RenderingCancelledException") {
          console.error("Rendu de la page impossible :", error);
        }
      }
    },
    [],
  );

  useEffect(() => {
    if (status !== "ready") return;
    renderPage(page, zoom);
  }, [status, page, zoom, renderPage]);

  // Re-rendu au redimensionnement, pour garder la page ajustee a la fenetre.
  useEffect(() => {
    if (status !== "ready") return;

    let timer: ReturnType<typeof setTimeout>;
    function onResize() {
      clearTimeout(timer);
      timer = setTimeout(() => renderPage(page, zoom), 150);
    }

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      clearTimeout(timer);
    };
  }, [status, page, zoom, renderPage]);

  // Navigation au clavier : les fleches font ce qu'on attend d'un livre.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      const target = event.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;

      if (event.key === "ArrowRight" || event.key === "PageDown") {
        setPage((current) => Math.min(current + 1, pageCount));
      } else if (event.key === "ArrowLeft" || event.key === "PageUp") {
        setPage((current) => Math.max(current - 1, 1));
      }
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pageCount]);

  if (status === "failed") {
    return (
      <Notice tone="error">
        <p>{labels.failed}</p>
        <p className="mt-3 flex flex-wrap gap-4">
          <a href={downloadUrl} className="font-bold underline">
            {labels.download}
          </a>
          <Link href={bookHref} className="font-bold underline">
            {labels.backToBook}
          </Link>
        </p>
      </Notice>
    );
  }

  const isLastPage = status === "ready" && page >= pageCount;

  return (
    <div>
      {/* Barre de navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border border-liryc-line bg-liryc-mist px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setPage((c) => Math.max(c - 1, 1))}
            disabled={status !== "ready" || page <= 1}
            aria-label={labels.previous}
            className="border border-liryc-line bg-white px-3 py-2 text-[0.9rem] font-bold text-liryc-teal transition-colors hover:bg-liryc-teal hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-liryc-teal"
          >
            ←
          </button>
          <p
            aria-live="polite"
            className="min-w-[7rem] text-center text-[0.9rem] font-bold text-liryc-navy"
          >
            {status === "ready"
              ? `${labels.page} ${page} ${labels.of2} ${pageCount}`
              : "…"}
          </p>
          <button
            type="button"
            onClick={() => setPage((c) => Math.min(c + 1, pageCount))}
            disabled={status !== "ready" || isLastPage}
            aria-label={labels.next}
            className="border border-liryc-line bg-white px-3 py-2 text-[0.9rem] font-bold text-liryc-teal transition-colors hover:bg-liryc-teal hover:text-white disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-liryc-teal"
          >
            →
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))}
            disabled={status !== "ready" || zoom <= 0.6}
            aria-label={labels.zoomOut}
            className="border border-liryc-line bg-white px-3 py-2 text-[0.9rem] font-bold text-liryc-teal transition-colors hover:bg-liryc-teal hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            −
          </button>
          <span className="min-w-[3.5rem] text-center text-[0.85rem] font-bold text-liryc-ink">
            {Math.round(zoom * 100)} %
          </span>
          <button
            type="button"
            onClick={() => setZoom((z) => Math.min(2.5, z + 0.2))}
            disabled={status !== "ready" || zoom >= 2.5}
            aria-label={labels.zoomIn}
            className="border border-liryc-line bg-white px-3 py-2 text-[0.9rem] font-bold text-liryc-teal transition-colors hover:bg-liryc-teal hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            +
          </button>
        </div>
      </div>

      {/* Page courante */}
      <div className="flex min-h-[60vh] justify-center overflow-auto bg-liryc-navy/5 p-4">
        {status === "loading" ? (
          <p className="self-center text-[0.95rem] font-bold text-liryc-teal">
            {labels.loading}
          </p>
        ) : null}
        <canvas
          ref={canvasRef}
          className={`h-auto max-w-full shadow-lg ${status === "ready" ? "" : "hidden"}`}
        />
      </div>

      {/* Fin de l'apercu */}
      {isLastPage ? (
        <div className="mt-8 border-l-4 border-liryc-orange bg-liryc-mist p-7">
          <h2 className="text-title-4 leading-title-4 text-liryc-navy">
            {labels.endTitle}
          </h2>
          <p className="mt-3 max-w-[70ch] text-[0.97rem] leading-relaxed text-liryc-ink">
            {labels.endBody}
          </p>
          <div className="mt-5 flex flex-wrap gap-4">
            <Button
              type="button"
              onClick={() => window.location.assign(downloadUrl)}
            >
              {labels.download}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={() => setPage(1)}
            >
              ← {labels.previous}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
