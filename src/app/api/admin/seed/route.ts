import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-session";
import { revalidatePath } from "next/cache";
import { getPrisma } from "@/lib/prisma";
import { addOns, services } from "@/lib/site-config";
import { pricingRules } from "@/lib/pricing";

export async function POST() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  await prisma.$transaction([
    ...services.map((service, index) =>
      prisma!.service.upsert({
        where: { slug: service.id },
        create: {
          slug: service.id,
          name: service.name,
          description: service.description,
          points: [...service.points],
          icon: service.icon,
          isFeatured: Boolean(service.featured),
          isActive: !service.hidden,
          sortOrder: index,
        },
        update: {},
      })
    ),
    ...addOns.map((addOn, index) =>
      prisma!.addOn.upsert({
        where: { slug: addOn.id },
        create: { slug: addOn.id, name: addOn.name, price: addOn.price, sortOrder: index },
        update: {},
      })
    ),
  ]);

  const existingRule = await prisma.pricingRule.findFirst();
  if (!existingRule) {
    await prisma.pricingRule.create({
      data: {
        baseCallout: pricingRules.baseCallout,
        perBedroom: pricingRules.perBedroom,
        perBathroom: pricingRules.perBathroom,
        regularMultiplier: pricingRules.serviceMultiplier.regular,
        deepMultiplier: pricingRules.serviceMultiplier.deep,
        moveMultiplier: pricingRules.serviceMultiplier.move,
        airbnbMultiplier: pricingRules.serviceMultiplier.airbnb,
        weeklyDiscount: pricingRules.frequencyDiscount.weekly,
        fortnightlyDiscount: pricingRules.frequencyDiscount.fortnightly,
        monthlyDiscount: pricingRules.frequencyDiscount.monthly,
      },
    });
  }

  revalidatePath("/");

  return NextResponse.json({ ok: true });
}
