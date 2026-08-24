import { Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { Button } from "@/components/ui/button";
import { iconMap } from "@/components/ui/icon-map";
import { addOns as defaultAddOns, services as defaultServices, type ServiceView, type AddOnView } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function Services({
  services = defaultServices,
  addOns = [...defaultAddOns],
}: {
  services?: ServiceView[];
  addOns?: AddOnView[];
}) {
  const visibleServices = services.filter((service) => !service.hidden);

  return (
    <section id="services" className="bg-sand-50 py-20 sm:py-28">
      <Container>
        <SectionHeading
          eyebrow="Our Cleaning Services"
          title="Cleaning plans for every stage of home life"
          description="From weekly upkeep to bond-back move-outs, choose the service that matches what your home needs right now."
        />

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {visibleServices.map((service, i) => {
            const Icon = iconMap[service.icon] ?? iconMap.Home;
            return (
              <Reveal key={service.id} index={i}>
                <div
                  className={cn(
                    "flex h-full flex-col rounded-[calc(var(--radius-brand)*2)] border p-8 transition-all duration-300 hover:-translate-y-1",
                    service.featured
                      ? "border-brand-500 bg-brand-700 text-white shadow-[var(--shadow-soft-hover)]"
                      : "border-neutral-200 bg-white hover:border-brand-200 hover:shadow-[var(--shadow-soft-hover)]"
                  )}
                >
                  {service.featured ? (
                    <span className="mb-5 inline-flex w-fit items-center rounded-full bg-white/15 px-3 py-1 text-xs font-heading font-bold uppercase tracking-wide text-white">
                      Most requested
                    </span>
                  ) : (
                    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-[var(--radius-brand)] bg-brand-50 text-brand-600">
                      <Icon className="h-6 w-6" aria-hidden />
                    </div>
                  )}

                  <h3 className={cn("font-heading text-xl font-bold", service.featured ? "text-white" : "text-neutral-900")}>
                    {service.name}
                  </h3>
                  <p className={cn("mt-2.5 text-sm leading-relaxed", service.featured ? "text-white/85" : "text-neutral-600")}>
                    {service.description}
                  </p>

                  <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                    {service.points.map((point) => (
                      <li key={point} className="flex items-start gap-2.5 text-sm">
                        <Check
                          className={cn("mt-0.5 h-4 w-4 shrink-0", service.featured ? "text-white" : "text-brand-600")}
                          aria-hidden
                        />
                        <span className={service.featured ? "text-white/90" : "text-neutral-700"}>{point}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    href="#quote"
                    variant={service.featured ? "outlineLight" : "secondary"}
                    className="mt-8 w-full justify-center"
                  >
                    Get My Quote
                  </Button>
                </div>
              </Reveal>
            );
          })}
        </div>

        <Reveal index={1}>
          <div className="mt-8 rounded-[calc(var(--radius-brand)*2)] border border-neutral-200 bg-white p-8">
            <h3 className="font-heading text-lg font-bold text-neutral-900">Popular add-ons</h3>
            <p className="mt-1.5 text-sm text-neutral-600">
              Layer these onto any service for the extra detail your home needs.
            </p>
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {addOns.map((addOn) => (
                <div
                  key={addOn.id}
                  className="flex flex-col items-center justify-center gap-1 rounded-[var(--radius-brand)] border border-neutral-200 bg-neutral-50 px-3 py-4 text-center transition-colors hover:border-brand-300 hover:bg-brand-50"
                >
                  <span className="font-heading text-sm font-semibold text-neutral-800">{addOn.name}</span>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
