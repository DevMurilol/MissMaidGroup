import type { Metadata } from "next";
import { Inter, Lato } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/lib/site-config";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Professional House Cleaning Services in Gold Coast`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [...siteConfig.keywords],
  authors: [{ name: siteConfig.name }],
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Professional House Cleaning Services in Gold Coast`,
    description: siteConfig.description,
    images: [{ url: "/images/hero-home.webp", width: 1600, height: 894, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Professional House Cleaning Services in Gold Coast`,
    description: siteConfig.description,
    images: ["/images/hero-home.webp"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: siteConfig.url },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-AU" className={`${inter.variable} ${lato.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-neutral-900 pb-16 lg:pb-0">{children}</body>
    </html>
  );
}
