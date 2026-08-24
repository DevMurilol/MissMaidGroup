import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Benefits } from "@/components/sections/benefits";
import { Services } from "@/components/sections/services";
import { HowItWorks } from "@/components/sections/how-it-works";
import { Reviews } from "@/components/sections/reviews";
import { Gallery } from "@/components/sections/gallery";
import { ServiceAreas } from "@/components/sections/service-areas";
import { FAQ } from "@/components/sections/faq";
import { PriceSimulator } from "@/components/simulator/price-simulator";
import { FinalCTA } from "@/components/sections/final-cta";
import { StickyMobileCta } from "@/components/layout/sticky-mobile-cta";
import {
  buildBreadcrumbSchema,
  buildFaqSchema,
  buildLocalBusinessSchema,
  buildServiceSchema,
} from "@/lib/schema";
import { getPrisma } from "@/lib/prisma";
import { services as staticServices, type ServiceView } from "@/lib/site-config";

// Prerendered at build time and refreshed hourly, so visitors are served static
// HTML straight from Workers Static Assets instead of booting the Worker. Admin
// edits do not wait for this window: the services API calls revalidatePath("/").
export const revalidate = 3600;

function applyEnvAirbnbOverride(list: ServiceView[]): ServiceView[] {
  const showAirbnb = process.env.SHOW_AIRBNB_SERVICE === "true";
  if (!showAirbnb) return list;
  return list.map((service) => (service.id === "airbnb" ? { ...service, hidden: false } : service));
}

async function getServices(): Promise<ServiceView[]> {
  const prisma = getPrisma();
  if (!prisma) return applyEnvAirbnbOverride(staticServices);
  const dbServices = await prisma.service.findMany({ orderBy: { sortOrder: "asc" } });
  if (dbServices.length === 0) return applyEnvAirbnbOverride(staticServices);
  return dbServices.map((s) => ({
    id: s.slug,
    name: s.name,
    description: s.description,
    points: s.points,
    icon: s.icon,
    featured: s.isFeatured,
    hidden: !s.isActive,
  }));
}

export default async function Home() {
  const liveServices = await getServices();
  const schemas = [
    buildLocalBusinessSchema(),
    ...buildServiceSchema(liveServices),
    buildFaqSchema(),
    buildBreadcrumbSchema(),
  ];

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <Header />
      <main className="flex-1">
        <Hero />
        <Benefits />
        <Services services={liveServices} />
        <HowItWorks />
        <Reviews />
        <Gallery />
        <ServiceAreas />
        <FAQ />
        <PriceSimulator />
        <FinalCTA />
      </main>
      <Footer />
      <StickyMobileCta />
    </>
  );
}
