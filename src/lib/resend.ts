import { Resend, type CreateEmailOptions } from "resend";
import { addOns, services, siteConfig, type ServiceId } from "@/lib/site-config";
import type { Frequency } from "@/lib/pricing";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : undefined;

/**
 * Both emails are sent from the one mailbox the business actually owns.
 *
 * Resend only needs the *domain* verified, so a made-up sender like
 * "quotes@missmaidgroup.com.au" would be allowed. It is deliberately not used:
 * nothing would be watching that address if a reply or a bounce landed there.
 *
 * Note this must not be derived from siteConfig.url. That URL carries a "www."
 * host, and "hello@www.missmaidgroup.com.au" is not a domain anyone verifies,
 * so every send would be rejected.
 */
const FROM = `${siteConfig.name} <${siteConfig.email}>`;

export type QuoteEmailResult = {
  /** Notification to the business. This is the one that must not be lost. */
  leadDelivered: boolean;
  /** Courtesy confirmation to the customer. Nice to have, not critical. */
  customerDelivered: boolean;
  /** Why the lead email failed, when it did. */
  reason?: string;
};

/**
 * resend.emails.send() resolves with { data: null, error } on an API failure
 * instead of throwing, so a plain try/catch (or Promise.allSettled) reports a
 * rejected send as a success. The error field has to be read explicitly.
 */
async function deliver(options: CreateEmailOptions): Promise<{ ok: boolean; reason?: string }> {
  if (!resend) return { ok: false, reason: "RESEND_API_KEY is not set" };
  try {
    const { error } = await resend.emails.send(options);
    if (error) return { ok: false, reason: `${error.name}: ${error.message}` };
    return { ok: true };
  } catch (err) {
    return { ok: false, reason: err instanceof Error ? err.message : String(err) };
  }
}

const frequencyLabel: Record<Frequency, string> = {
  once: "One-time",
  weekly: "Weekly",
  fortnightly: "Fortnightly",
  monthly: "Monthly",
};

export async function sendQuoteEmail(input: {
  name: string;
  email: string;
  phone: string;
  suburb: string;
  serviceId: ServiceId;
  bedrooms: number;
  bathrooms: number;
  frequency: Frequency;
  addonIds: string[];
  notes?: string;
  price: {
    hours: number;
    hourlyRate: number;
    labour: number;
    addonsTotal: number;
    frequencyUplift: number;
    total: number;
  };
}): Promise<QuoteEmailResult> {
  if (!resend) {
    console.error("[quote] RESEND_API_KEY is not set. Nothing was sent.");
    return { leadDelivered: false, customerDelivered: false, reason: "RESEND_API_KEY is not set" };
  }

  const serviceName = services.find((s) => s.id === input.serviceId)?.name ?? input.serviceId;
  const addonNames = input.addonIds
    .map((id) => addOns.find((a) => a.id === id)?.name)
    .filter(Boolean)
    .join(", ") || "None";
  const timestamp = new Date().toLocaleString("en-AU", { timeZone: "Australia/Brisbane" });

  const internalHtml = `
    <h2>New quote request, ${input.name}</h2>
    <p><strong>Calculated price:</strong> $${input.price.total.toFixed(2)} AUD</p>
    <ul>
      <li><strong>Estimated time:</strong> ${input.price.hours} hours</li>
      <li><strong>Service:</strong> ${serviceName}</li>
      <li><strong>Bedrooms:</strong> ${input.bedrooms}</li>
      <li><strong>Bathrooms:</strong> ${input.bathrooms}</li>
      <li><strong>Frequency:</strong> ${frequencyLabel[input.frequency]}</li>
      <li><strong>Add-ons:</strong> ${addonNames}</li>
      <li><strong>Suburb:</strong> ${input.suburb}</li>
      <li><strong>Name:</strong> ${input.name}</li>
      <li><strong>Email:</strong> ${input.email}</li>
      <li><strong>Phone:</strong> ${input.phone}</li>
      <li><strong>Notes:</strong> ${input.notes || "None provided"}</li>
      <li><strong>Submitted:</strong> ${timestamp} (AEST)</li>
    </ul>
    <p><em>Price breakdown</em>: ${input.price.hours} hours at $${input.price.hourlyRate}/hour = $${input.price.labour.toFixed(2)}, add-ons $${input.price.addonsTotal.toFixed(2)}, frequency uplift $${input.price.frequencyUplift.toFixed(2)}.</p>
  `;

  const customerHtml = `
    <h2>Thanks for reaching out, ${input.name.split(" ")[0]}!</h2>
    <p>Your quote is on the way, our team is reviewing your details and will confirm your price and availability shortly.</p>
    <p><strong>Your request:</strong></p>
    <ul>
      <li>${serviceName} &middot; ${input.bedrooms} bed / ${input.bathrooms} bath</li>
      <li>Estimated ${input.price.hours} hours on site</li>
      <li>${frequencyLabel[input.frequency]} frequency</li>
      <li>Add-ons: ${addonNames}</li>
      <li>Suburb: ${input.suburb}</li>
    </ul>
    <p>We'll be in touch within one business day. In the meantime, feel free to call us on ${siteConfig.phone}.</p>
    <p>From the ${siteConfig.name} team</p>
  `;

  const [lead, customer] = await Promise.all([
    deliver({
      from: FROM,
      to: siteConfig.email,
      // Hitting reply on the lead email answers the customer, not ourselves.
      replyTo: input.email,
      subject: `New quote request from ${input.name} (${input.suburb})`,
      html: internalHtml,
    }),
    deliver({
      from: FROM,
      to: input.email,
      subject: "Your Miss Maid Group quote is on the way!",
      html: customerHtml,
    }),
  ]);

  if (!lead.ok) console.error("[quote] Lead email failed:", lead.reason);
  if (!customer.ok) console.error("[quote] Customer confirmation failed:", customer.reason);

  return { leadDelivered: lead.ok, customerDelivered: customer.ok, reason: lead.reason };
}
