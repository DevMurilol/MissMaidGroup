import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { BeforeAfter } from "@/components/ui/before-after";
import { galleryShowcase } from "@/lib/site-config";

export function Gallery() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <Container className="max-w-4xl">
        <SectionHeading
          eyebrow="Before & After"
          title="See the Miss Maid Group difference"
          description="Tap the photo or drag the slider to watch the grime lift away. Real result from a real Gold Coast job."
        />

        <Reveal index={1} className="mt-14">
          <BeforeAfter
            before={galleryShowcase.before}
            after={galleryShowcase.after}
            label={galleryShowcase.label}
            aspect="aspect-[5/4]"
            sizes="(min-width: 1024px) 900px, 100vw"
          />
          <p className="mt-6 text-center text-sm text-neutral-500">
            More real client transformations added regularly, follow along or{" "}
            <a href="#quote" className="font-semibold text-brand-700 hover:underline">
              book your own
            </a>
            .
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
