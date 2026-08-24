import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { howItWorks } from "@/lib/site-config";

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="How It Works"
          title="Three simple steps to a spotless home"
          description="No call centres, no guesswork. Just a fast, transparent process from quote to a home that finally feels done."
        />

        <div className="relative mt-16 grid gap-10 sm:grid-cols-3 sm:gap-8">
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-neutral-200 to-transparent sm:block"
          />
          {howItWorks.map((item, i) => (
            <Reveal key={item.step} index={i} className="relative flex flex-col items-start gap-4 sm:items-center sm:text-center">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-white bg-brand-500 font-heading text-xl font-extrabold text-white shadow-[var(--shadow-soft)]">
                {item.step}
              </span>
              <h3 className="font-heading text-lg font-bold text-neutral-900">{item.title}</h3>
              <p className="max-w-xs text-sm leading-relaxed text-neutral-600">{item.description}</p>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
