import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-session";
import { z } from "zod";
import { getPrisma } from "@/lib/prisma";

const bodySchema = z.object({
  baseCallout: z.coerce.number().min(0),
  perBedroom: z.coerce.number().min(0),
  perBathroom: z.coerce.number().min(0),
  regularMultiplier: z.coerce.number().min(0),
  deepMultiplier: z.coerce.number().min(0),
  moveMultiplier: z.coerce.number().min(0),
  airbnbMultiplier: z.coerce.number().min(0),
  weeklyDiscount: z.coerce.number().min(0).max(1),
  fortnightlyDiscount: z.coerce.number().min(0).max(1),
  monthlyDiscount: z.coerce.number().min(0).max(1),
});

export async function POST(request: Request) {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 422 });
  }

  const existing = await prisma.pricingRule.findFirst();
  const rule = existing
    ? await prisma.pricingRule.update({ where: { id: existing.id }, data: parsed.data })
    : await prisma.pricingRule.create({ data: parsed.data });

  return NextResponse.json({ rule });
}
