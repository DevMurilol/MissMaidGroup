import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { navLinks, siteConfig } from "@/lib/site-config";

export function Footer() {
  return (
    <footer className="bg-neutral-900 pt-16 pb-8 text-white/70">
      <Container>
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <Link href="#home" className="inline-flex">
              {/* Reversed wordmark: the brand green is only 1.2:1 on this
                  dark background, so the mono-white variant is used here. */}
              <Image
                src="/images/logo-wordmark-white.png"
                alt={siteConfig.name}
                width={85}
                height={44}
                className="h-10 w-auto"
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              Reliable, insured house cleaning across the Gold Coast, delivered with hotel-level
              attention to detail.
            </p>
          </div>

          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-white">Quick Links</h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="transition-colors hover:text-white">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-white">Contact</h3>
            <ul className="mt-4 flex flex-col gap-3 text-sm">
              <li>
                <a href={siteConfig.phoneHref} className="flex items-center gap-2.5 transition-colors hover:text-white">
                  <Phone className="h-4 w-4 shrink-0" aria-hidden />
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2.5 transition-colors hover:text-white">
                  <Mail className="h-4 w-4 shrink-0" aria-hidden />
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                Gold Coast, Queensland, Australia
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-white">Legal</h3>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              <li>
                <Link href="/terms" className="transition-colors hover:text-white">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="transition-colors hover:text-white">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Miss Maid Group. All rights reserved.</p>
          <p>ABN available on request &middot; Gold Coast, QLD</p>
        </div>
      </Container>
    </footer>
  );
}
