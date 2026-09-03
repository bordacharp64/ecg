import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/** Conteneur a la largeur du site institutionnel (1280px, marges degressives). */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[1280px] px-5 sm:px-10 ${className}`}
    >
      {children}
    </div>
  );
}

type ButtonVariant = "primary" | "secondary" | "ghost";

const buttonBase =
  "inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[0.95rem] font-bold " +
  "transition-colors duration-200 disabled:cursor-not-allowed disabled:opacity-55";

const buttonVariants: Record<ButtonVariant, string> = {
  primary:
    "bg-liryc-teal text-white hover:bg-liryc-navy",
  secondary:
    "border-2 border-liryc-teal bg-white text-liryc-teal hover:bg-liryc-teal hover:text-white",
  ghost:
    "border-2 border-white/70 bg-transparent text-white hover:bg-white hover:text-liryc-navy",
};

export function Button({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant }) {
  return (
    <button
      {...props}
      className={`${buttonBase} ${buttonVariants[variant]} ${className}`}
    />
  );
}

export function ButtonLink({
  variant = "primary",
  className = "",
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant }) {
  return (
    <Link
      {...props}
      className={`${buttonBase} ${buttonVariants[variant]} ${className}`}
    />
  );
}

/** Titre de section : surtitre en capitales + filet cyan, comme sur ihu-liryc.fr */
export function SectionTitle({
  eyebrow,
  title,
  intro,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
}) {
  const alignment = align === "center" ? "text-center mx-auto" : "";
  return (
    <div className={`max-w-[720px] ${alignment}`}>
      {eyebrow ? (
        <p className="mb-3 text-[0.8rem] font-bold tracking-[0.16em] text-liryc-cyan uppercase">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-[1.85rem] leading-[2.35rem] sm:text-title-2 sm:leading-title-2 text-liryc-navy">
        {title}
      </h2>
      <span
        className={`mt-5 block h-[3px] w-16 bg-liryc-cyan ${
          align === "center" ? "mx-auto" : ""
        }`}
      />
      {intro ? (
        <p className="mt-6 text-[1.05rem] leading-relaxed text-liryc-ink">
          {intro}
        </p>
      ) : null}
    </div>
  );
}

/** Bandeau de message : succes, erreur ou information. */
export function Notice({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "success" | "error";
  title?: string;
  children: ReactNode;
}) {
  const tones = {
    info: "border-liryc-cyan bg-liryc-cyan-soft text-liryc-navy",
    success: "border-liryc-green bg-[#f2f9ed] text-liryc-navy",
    error: "border-liryc-red bg-[#fdf0f2] text-liryc-navy",
  } as const;

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={`border-l-4 px-5 py-4 text-[0.95rem] leading-relaxed ${tones[tone]}`}
    >
      {title ? <p className="mb-1 font-bold">{title}</p> : null}
      {children}
    </div>
  );
}
