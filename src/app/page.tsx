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
import { services } from "@/lib/site-config";

// Fully static. Every word on this page comes from site-config.ts, so the HTML
// is generated once at build time and served from Workers Static Assets. The
// Worker itself only runs for /api/quote. Content changes ship with a deploy.

export default function Home() {
  const schemas = [
    buildLocalBusinessSchema(),
    ...buildServiceSchema(services),
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
        <Services services={services} />
        <HowItWorks />
        <Reviews />
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
