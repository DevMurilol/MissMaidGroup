import { NextResponse } from "next/server";
import { z } from "zod";
import { quoteFormSchema } from "@/lib/validation";
import { calculateQuotePrice, pricingRules } from "@/lib/pricing";
import { sendQuoteEmail } from "@/lib/resend";
import { addOns, siteConfig } from "@/lib/site-config";

export async function POST(request: Request) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = quoteFormSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Please check the form for errors.", issues: z.treeifyError(parsed.error) },
      { status: 422 }
    );
  }

  const data = parsed.data;

  if (data.company) {
    // Honeypot triggered: pretend success, do nothing further.
    return NextResponse.json({ ok: true });
  }

  const price = calculateQuotePrice(
    {
      serviceId: data.serviceId,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      frequency: data.frequency,
      addonIds: data.addonIds,
    },
    pricingRules,
    [...addOns]
  );

  const emailResult = await sendQuoteEmail({
    name: data.name,
    email: data.email,
    phone: data.phone,
    suburb: data.suburb,
    serviceId: data.serviceId,
    bedrooms: data.bedrooms,
    bathrooms: data.bathrooms,
    frequency: data.frequency,
    addonIds: data.addonIds,
    notes: data.notes,
    price,
  });

  // The lead email is the whole point: without it the request is lost. Say so
  // instead of showing a success screen for something that never arrived.
  if (!emailResult.leadDelivered) {
    return NextResponse.json(
      {
        error: `We could not send your request just now. Please call ${siteConfig.phone} or email ${siteConfig.email} and we will take it from there.`,
      },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true, customerEmailed: emailResult.customerDelivered });
}
