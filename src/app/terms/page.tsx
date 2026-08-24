import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: `Terms of service for booking and using ${siteConfig.name} cleaning services on the Gold Coast.`,
};

export default function TermsPage() {
  return (
    <LegalPage title="Terms of Service" updated="20 August 2026">
      <p>
        These terms govern your use of {siteConfig.name} cleaning services. By requesting a
        quote or booking a service with us, you agree to the terms outlined below.
      </p>
      <h2 className="font-heading text-lg font-bold text-neutral-900">Bookings & cancellations</h2>
      <p>
        Bookings can be rescheduled or cancelled free of charge with at least 24 hours&apos;
        notice. Cancellations made with less notice may incur a call-out fee. There are no
        lock-in contracts, regular services can be paused or cancelled at any time.
      </p>
      <h2 className="font-heading text-lg font-bold text-neutral-900">Pricing & payment</h2>
      <p>
        Quotes provided through our online simulator are estimates based on the information
        supplied and are confirmed prior to booking. Payment is processed securely after each
        completed clean.
      </p>
      <h2 className="font-heading text-lg font-bold text-neutral-900">Satisfaction guarantee</h2>
      <p>
        If any area of your home does not meet our standards, contact us within 24 hours of your
        clean and we will return to correct it at no additional cost.
      </p>
      <h2 className="font-heading text-lg font-bold text-neutral-900">Liability</h2>
      <p>
        {siteConfig.name} carries public liability insurance. Any damage claims must be reported
        within 48 hours of service completion.
      </p>
      <h2 className="font-heading text-lg font-bold text-neutral-900">Contact</h2>
      <p>
        Questions about these terms can be sent to{" "}
        <a href={`mailto:${siteConfig.email}`} className="font-semibold text-brand-700">
          {siteConfig.email}
        </a>{" "}
        or by calling {siteConfig.phone}.
      </p>
    </LegalPage>
  );
}
