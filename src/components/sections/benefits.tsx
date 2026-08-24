import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { iconMap } from "@/components/ui/icon-map";
import { benefits } from "@/lib/site-config";

export function Benefits() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Why Choose Miss Maid Group"
          title="A cleaning service you can actually rely on"
          description="We built Miss Maid Group around the things Gold Coast homeowners told us mattered most: trust, consistency, and a spotless result every single time."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, i) => {
            const Icon = iconMap[benefit.icon];
            return (
              <Reveal key={benefit.title} index={i}>
                <div className="group h-full rounded-[calc(var(--radius-brand)*2)] border border-neutral-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-[var(--shadow-soft-hover)]">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[var(--radius-brand)] bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-500 group-hover:text-white">
                    <Icon className="h-6 w-6" aria-hidden />
                  </div>
                  <h3 className="font-heading text-lg font-bold text-neutral-900">
                    {benefit.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-neutral-600">
                    {benefit.description}
                  </p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
