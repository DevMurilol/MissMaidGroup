import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-neutral-900 py-20 sm:py-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_80%_at_50%_0%,rgba(76,175,80,0.25),transparent)]"
      />
      <Container className="relative flex flex-col items-center gap-7 text-center">
        <Reveal>
          <h2 className="balance max-w-2xl font-heading text-3xl font-bold text-white sm:text-4xl">
            Ready for a cleaner, fresher home?
          </h2>
        </Reveal>
        <Reveal index={1}>
          <p className="max-w-xl text-base leading-relaxed text-white/70">
            Get your obligation-free quote in minutes and let the Gold Coast&apos;s trusted local
            cleaners take it from here.
          </p>
        </Reveal>
        <Reveal index={2}>
          <Button href="#quote" size="lg">
            Request Your Quote
          </Button>
        </Reveal>
      </Container>
    </section>
  );
}
