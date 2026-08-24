import { cn } from "@/lib/utils";
import Link from "next/link";
import type { MouseEventHandler, ReactNode } from "react";

const base =
  "inline-flex items-center justify-center gap-2 rounded-[var(--radius-brand)] font-heading font-semibold transition-all duration-200 ease-out cursor-pointer disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2";

const variants = {
  primary:
    "bg-brand-500 text-white shadow-[var(--shadow-soft)] hover:bg-brand-700 hover:shadow-[var(--shadow-soft-hover)] hover:-translate-y-0.5 active:translate-y-0",
  secondary:
    "bg-white text-brand-700 border border-neutral-200 shadow-[var(--shadow-soft)] hover:border-brand-300 hover:bg-brand-50 hover:-translate-y-0.5 active:translate-y-0",
  outlineLight:
    "bg-transparent text-white border border-white/40 hover:bg-white/10 hover:border-white/70",
  ghost: "bg-transparent text-neutral-700 hover:bg-neutral-50",
} as const;

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-5 py-3 text-base",
  lg: "px-7 py-4 text-base",
} as const;

type Variant = keyof typeof variants;
type Size = keyof typeof sizes;

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  href,
  onClick,
  type,
  disabled,
}: {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  href?: string;
  onClick?: MouseEventHandler;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    return (
      <Link href={href} className={classes} onClick={onClick}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type ?? "button"} disabled={disabled} className={classes} onClick={onClick}>
      {children}
    </button>
  );
}
