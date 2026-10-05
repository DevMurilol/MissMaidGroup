"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, Phone, X } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { navLinks, siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        // Opaque, not bg-white/90: the header crosses two dark sections (the
        // service areas band and the final CTA) and at 90% those bled through
        // enough to drop the nav links to roughly 2:1 against their own
        // background. Solid white keeps the dark text readable the whole way
        // down. With no transparency there is nothing for backdrop-blur to do,
        // so it goes too.
        scrolled ? "bg-white shadow-[var(--shadow-soft)]" : "bg-transparent"
      )}
    >
      <Container className="flex h-20 items-center justify-between">
        <Link href="#home" className="flex items-center">
          {/* Wordmark already reads "miss maid", so no text label beside it. */}
          <Image
            src="/images/logo-wordmark.png"
            alt={siteConfig.name}
            width={85}
            height={44}
            loading="eager"
            fetchPriority="high"
            className="h-9 w-auto shrink-0 sm:h-11"
          />
        </Link>

        <nav className="hidden items-center gap-9 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-heading text-sm font-semibold text-neutral-700 transition-colors hover:text-brand-700"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={siteConfig.phoneHref}
            className="flex items-center gap-2 font-heading text-sm font-semibold text-neutral-700 transition-colors hover:text-brand-700"
          >
            <Phone className="h-4 w-4" aria-hidden />
            {siteConfig.phone}
          </a>
          <Button href="#quote" size="sm">
            Get a Quote
          </Button>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-brand)] text-neutral-700 lg:hidden"
        >
          {open ? <X className="h-6 w-6" aria-hidden /> : <Menu className="h-6 w-6" aria-hidden />}
        </button>
      </Container>

      {open ? (
        <div className="border-t border-neutral-200 bg-white lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-[var(--radius-brand)] px-3 py-3 font-heading text-base font-semibold text-neutral-800 hover:bg-brand-50"
              >
                {link.label}
              </a>
            ))}
            <a
              href={siteConfig.phoneHref}
              className="flex items-center gap-2 rounded-[var(--radius-brand)] px-3 py-3 font-heading text-base font-semibold text-neutral-800 hover:bg-brand-50"
            >
              <Phone className="h-4 w-4" aria-hidden />
              {siteConfig.phone}
            </a>
            <Button href="#quote" className="mt-2 justify-center" onClick={() => setOpen(false)}>
              Get a Quote
            </Button>
          </Container>
        </div>
      ) : null}
    </header>
  );
}
