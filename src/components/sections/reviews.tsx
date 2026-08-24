import { Star } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { testimonials } from "@/lib/site-config";

export function Reviews() {
  return (
    <section id="reviews" className="bg-sand-50 py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Customer Reviews"
          title="Trusted by homeowners across the Gold Coast"
          description="Real feedback from real clients, because a spotless home should speak for itself."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} index={i}>
              <figure className="flex h-full flex-col rounded-[calc(var(--radius-brand)*2)] border border-neutral-200 bg-white p-7 shadow-[var(--shadow-soft)]">
                <div className="flex gap-0.5" aria-label={`${t.rating} out of 5 stars`}>
                  {Array.from({ length: t.rating }).map((_, idx) => (
                    <Star key={idx} className="h-4 w-4 fill-brand-500 text-brand-500" aria-hidden />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-neutral-700">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500 font-heading text-sm font-bold text-white">
                    {t.name.charAt(0)}
                  </span>
                  <span>
                    <span className="block font-heading text-sm font-bold text-neutral-900">{t.name}</span>
                    <span className="block text-xs text-neutral-500">{t.suburb}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
