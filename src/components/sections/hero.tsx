import Image from "next/image";
import { Phone, ShieldCheck, Podium, Star } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { siteConfig, trustBadges } from "@/lib/site-config";

const badgeIcons = [ShieldCheck, Podium];
export function Hero() {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-sand-50 pt-14 pb-20 sm:pt-20 sm:pb-28"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(76,175,80,0.12),transparent)]"
      />
      {/*
        The hero recedes instead of revealing. It is already on screen at load,
        so it starts at rest and only moves once it begins leaving the top,
        letting the next section read as sliding over it. The wrapper carries
        the animation rather than the section, so the section keeps its own
        height and the scroll maths stays stable.
      */}
      <div className="hero-recede">
        <Container className="grid items-center gap-14 lg:grid-cols-2 lg:gap-10">
          <div className="flex flex-col items-start gap-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-4 py-1.5 text-xs font-heading font-semibold uppercase tracking-[0.14em] text-brand-700 shadow-[var(--shadow-soft)]">
              <Star
                className="h-3.5 w-3.5 fill-brand-500 text-brand-500"
                aria-hidden
              />
              Gold Coast&apos;s trusted local cleaners
            </span>

            <h1 className="balance font-heading text-4xl font-extrabold leading-[1.08] tracking-tight text-neutral-900 sm:text-5xl lg:text-[3.4rem]">
              Professional House Cleaning Services in{" "}
              <span className="text-brand-600">Gold Coast</span>
            </h1>

            <p className="balance max-w-xl text-lg leading-relaxed text-neutral-700">
              Reliable, insured, and detail-oriented cleaners delivering
              hotel-level quality to your home.
            </p>

            <ul className="flex flex-wrap gap-x-6 gap-y-3">
              {trustBadges.map((badge, i) => {
                const Icon = badgeIcons[i];
                return (
                  <li
                    key={badge}
                    className="flex items-center gap-2 text-sm font-semibold text-neutral-800"
                  >
                    <Icon className="h-4 w-4 text-brand-600" aria-hidden />
                    {badge}
                  </li>
                );
              })}
            </ul>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button href="#quote" size="lg">
                Get My Quote
              </Button>
              <Button href={siteConfig.phoneHref} variant="secondary" size="lg">
                <Phone className="h-4 w-4" aria-hidden />
                Call Us: {siteConfig.phone}
              </Button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-4 -z-10 rounded-[calc(var(--radius-brand)*4)] bg-brand-100/60 blur-2xl"
            />
            <div className="overflow-hidden rounded-[calc(var(--radius-brand)*2)] shadow-[var(--shadow-soft-hover)]">
              <Image
                src="/images/hero-home.webp"
                alt="Bright, freshly cleaned modern living room in a Gold Coast home"
                width={1600}
                height={894}
                loading="eager"
                fetchPriority="high"
                sizes="(min-width: 1024px) 560px, 100vw"
                className="h-auto w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 hidden items-center gap-3 rounded-[var(--radius-brand)] border border-neutral-200 bg-white px-5 py-4 shadow-[var(--shadow-soft-hover)] sm:flex">
              <div className="flex -space-x-2">
                {["A", "J", "P"].map((letter) => (
                  <span
                    key={letter}
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-brand-500 font-heading text-xs font-bold text-white"
                  >
                    {letter}
                  </span>
                ))}
              </div>
              <div>
                <p className="font-heading text-sm font-bold text-neutral-900">
                  500+ homes cleaned
                </p>
                <p className="text-xs text-neutral-500">
                  across the Gold Coast
                </p>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </section>
  );
}
