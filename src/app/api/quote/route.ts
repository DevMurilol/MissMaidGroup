import { NextResponse } from "next/server";
import { z } from "zod";
import { getPrisma } from "@/lib/prisma";
import type { PrismaClient } from "@/generated/prisma/client";
import { quoteFormSchema } from "@/lib/validation";
import { calculateQuotePrice, pricingRules, type PricingRules } from "@/lib/pricing";
import { sendQuoteEmail } from "@/lib/resend";
import { addOns as defaultAddOns, type AddOnView } from "@/lib/site-config";

async function resolvePricingContext(
  prisma: PrismaClient | undefined
): Promise<{ rules: PricingRules; catalog: AddOnView[] }> {
  if (!prisma) return { rules: pricingRules, catalog: [...defaultAddOns] };

  const [dbRule, dbAddOns] = await Promise.all([prisma.pricingRule.findFirst(), prisma.addOn.findMany({ where: { isActive: true } })]);

  const rules: PricingRules = dbRule
    ? {
        baseCallout: Number(dbRule.baseCallout),
        perBedroom: Number(dbRule.perBedroom),
        perBathroom: Number(dbRule.perBathroom),
        serviceMultiplier: {
          regular: Number(dbRule.regularMultiplier),
          deep: Number(dbRule.deepMultiplier),
          move: Number(dbRule.moveMultiplier),
          airbnb: Number(dbRule.airbnbMultiplier),
        },
        frequencyDiscount: {
          once: 0,
          weekly: Number(dbRule.weeklyDiscount),
          fortnightly: Number(dbRule.fortnightlyDiscount),
          monthly: Number(dbRule.monthlyDiscount),
        },
      }
    : pricingRules;

  const catalog: AddOnView[] =
    dbAddOns.length > 0 ? dbAddOns.map((a) => ({ id: a.slug, name: a.name, price: Number(a.price) })) : [...defaultAddOns];

  return { rules, catalog };
}

export async function POST(request: Request) {
  const prisma = getPrisma();
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

  const { rules, catalog } = await resolvePricingContext(prisma);
  const price = calculateQuotePrice(
    {
      serviceId: data.serviceId,
      bedrooms: data.bedrooms,
      bathrooms: data.bathrooms,
      frequency: data.frequency,
      addonIds: data.addonIds,
    },
    rules,
    catalog
  );

  let leadSaved = false;
  if (prisma) {
    try {
      await prisma.lead.create({
        data: {
          name: data.name,
          email: data.email,
          phone: data.phone,
          suburb: data.suburb,
          serviceType: data.serviceId,
          bedrooms: data.bedrooms,
          bathrooms: data.bathrooms,
          frequency: data.frequency,
          addonIds: data.addonIds,
          notes: data.notes || null,
          quotedPrice: price.total,
        },
      });
      leadSaved = true;
    } catch (error) {
      console.error("[quote] Failed to save lead:", error);
    }
  }

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

  return NextResponse.json({ ok: true, leadSaved, emailSent: emailResult.sent });
}
