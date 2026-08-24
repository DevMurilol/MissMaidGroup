import type { Metadata } from "next";
import { LegalPage } from "@/components/layout/legal-page";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${siteConfig.name} collects, uses, and protects your personal information.`,
};

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="20 August 2026">
      <p>
        {siteConfig.name} respects your privacy. This policy explains what information we
        collect through our website and quote simulator, and how it is used.
      </p>
      <h2 className="font-heading text-lg font-bold text-neutral-900">Information we collect</h2>
      <p>
        When you request a quote, we collect your name, email address, phone number, suburb, and
        details about the cleaning service you&apos;re requesting. This information is used
        solely to prepare your quote and coordinate your booking.
      </p>
      <h2 className="font-heading text-lg font-bold text-neutral-900">How we use your information</h2>
      <p>
        Your details are used to send you a personalised quote by email, contact you about your
        booking, and improve our service. We do not sell or share your personal information with
        third parties for marketing purposes.
      </p>
      <h2 className="font-heading text-lg font-bold text-neutral-900">Data storage</h2>
      <p>
        Lead and booking information is stored securely and retained only as long as necessary
        to provide our services and meet legal obligations.
      </p>
      <h2 className="font-heading text-lg font-bold text-neutral-900">Your rights</h2>
      <p>
        You can request access to, correction of, or deletion of your personal information at
        any time by contacting{" "}
        <a href={`mailto:${siteConfig.email}`} className="font-semibold text-brand-700">
          {siteConfig.email}
        </a>
        .
      </p>
    </LegalPage>
  );
}
