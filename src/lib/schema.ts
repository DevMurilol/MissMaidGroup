import { faqs, siteConfig, suburbs, type ServiceView } from "@/lib/site-config";

export function buildLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.url}/#business`,
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
    telephone: siteConfig.phoneHref.replace("tel:", ""),
    email: siteConfig.email,
    priceRange: "$$",
    image: `${siteConfig.url}/images/hero-home.webp`,
    logo: `${siteConfig.url}/images/logo-wordmark.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Gold Coast",
      addressRegion: "QLD",
      addressCountry: "AU",
    },
    areaServed: suburbs.map((suburb) => ({ "@type": "City", name: suburb })),
    geo: {
      "@type": "GeoCoordinates",
      latitude: -28.0167,
      longitude: 153.4,
    },
  };
}

export function buildServiceSchema(services: ServiceView[]) {
  return services
    .filter((service) => !service.hidden)
    .map((service) => ({
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: service.name,
      name: service.name,
      description: service.description,
      provider: { "@type": "LocalBusiness", name: siteConfig.name, "@id": `${siteConfig.url}/#business` },
      areaServed: { "@type": "AdministrativeArea", name: "Gold Coast, QLD" },
    }));
}

export function buildFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

export function buildBreadcrumbSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
    ],
  };
}
