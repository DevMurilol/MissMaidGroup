import { Resend } from "resend";
import { addOns, services, siteConfig, type ServiceId } from "@/lib/site-config";
import type { Frequency } from "@/lib/pricing";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : undefined;

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
  price: { structural: number; addonsTotal: number; discount: number; total: number };
}) {
  if (!resend) {
    console.warn("[quote] RESEND_API_KEY not set, skipping email send.");
    return { sent: false as const };
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
    <p><em>Price breakdown</em>: base+rooms $${input.price.structural.toFixed(2)}, add-ons $${input.price.addonsTotal.toFixed(2)}, frequency discount $${input.price.discount.toFixed(2)}.</p>
  `;

  const customerHtml = `
    <h2>Thanks for reaching out, ${input.name.split(" ")[0]}!</h2>
    <p>Your quote is on the way, our team is reviewing your details and will confirm your price and availability shortly.</p>
    <p><strong>Your request:</strong></p>
    <ul>
      <li>${serviceName} &middot; ${input.bedrooms} bed / ${input.bathrooms} bath</li>
      <li>${frequencyLabel[input.frequency]} frequency</li>
      <li>Add-ons: ${addonNames}</li>
      <li>Suburb: ${input.suburb}</li>
    </ul>
    <p>We'll be in touch within one business day. In the meantime, feel free to call us on ${siteConfig.phone}.</p>
    <p>From the ${siteConfig.name} team</p>
  `;

  const [internal, customer] = await Promise.allSettled([
    resend.emails.send({
      from: `${siteConfig.name} Quotes <quotes@${new URL(siteConfig.url).hostname}>`,
      to: siteConfig.email,
      replyTo: input.email,
      subject: `New quote request from ${input.name} (${input.suburb})`,
      html: internalHtml,
    }),
    resend.emails.send({
      from: `${siteConfig.name} <hello@${new URL(siteConfig.url).hostname}>`,
      to: input.email,
      subject: "Your Miss Maid Group quote is on the way!",
      html: customerHtml,
    }),
  ]);

  return {
    sent: internal.status === "fulfilled" || customer.status === "fulfilled",
  };
}
