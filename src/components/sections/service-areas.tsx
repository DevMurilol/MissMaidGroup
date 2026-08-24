import { MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { suburbs } from "@/lib/site-config";

export function ServiceAreas() {
  return (
    <section className="bg-brand-700 py-20 sm:py-28">
      <Container>
        <SectionHeading
          light
          eyebrow="Service Areas"
          title="Servicing homes across the Gold Coast"
          description="Wherever you are on the Coast, our local team is nearby. Don't see your suburb? Get in touch, we're always expanding."
        />

        <Reveal index={1}>
          <div className="mt-14 grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-3 lg:grid-cols-4">
            {suburbs.map((suburb) => (
              <div key={suburb} className="flex items-center gap-2 text-sm text-white/85">
                <MapPin className="h-4 w-4 shrink-0 text-brand-300" aria-hidden />
                {suburb}
              </div>
            ))}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
