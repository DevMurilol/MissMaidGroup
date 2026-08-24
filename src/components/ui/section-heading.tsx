import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  light?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      {eyebrow ? (
        <span
          className={cn(
            "inline-flex items-center rounded-full px-3.5 py-1.5 text-xs font-heading font-semibold uppercase tracking-[0.14em]",
            light ? "bg-white/10 text-brand-100" : "bg-brand-50 text-brand-700"
          )}
        >
          {eyebrow}
        </span>
      ) : null}
      <h2
        className={cn(
          "balance font-heading text-3xl font-bold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]",
          light ? "text-white" : "text-neutral-900",
          align === "center" ? "max-w-2xl" : "max-w-xl"
        )}
      >
        {title}
      </h2>
      {description ? (
        <p
          className={cn(
            "balance max-w-2xl text-base leading-relaxed sm:text-lg",
            light ? "text-white/75" : "text-neutral-700"
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}
