import { type AddOnView, type ServiceId, addOns as defaultAddOns } from "@/lib/site-config";

export const pricingRules = {
  baseCallout: 60,
  perBedroom: 25,
  perBathroom: 20,
  serviceMultiplier: {
    regular: 1,
    deep: 1.4,
    move: 1.6,
    airbnb: 1.15,
  } satisfies Record<ServiceId, number>,
  frequencyDiscount: {
    once: 0,
    weekly: 0.15,
    fortnightly: 0.1,
    monthly: 0.05,
  },
};

export type Frequency = keyof typeof pricingRules.frequencyDiscount;
export type PricingRules = typeof pricingRules;

export function calculateQuotePrice(
  {
    serviceId,
    bedrooms,
    bathrooms,
    frequency,
    addonIds,
  }: {
    serviceId: ServiceId;
    bedrooms: number;
    bathrooms: number;
    frequency: Frequency;
    addonIds: string[];
  },
  rules: PricingRules = pricingRules,
  catalog: AddOnView[] = [...defaultAddOns]
) {
  const structural = rules.baseCallout + bedrooms * rules.perBedroom + bathrooms * rules.perBathroom;

  const serviceAdjusted = structural * rules.serviceMultiplier[serviceId];

  const addonsTotal = addonIds.reduce((sum, id) => {
    const addOn = catalog.find((a) => a.id === id);
    return sum + (addOn?.price ?? 0);
  }, 0);

  const subtotal = serviceAdjusted + addonsTotal;
  const discount = subtotal * rules.frequencyDiscount[frequency];
  const total = subtotal - discount;

  return {
    structural: round(structural),
    addonsTotal: round(addonsTotal),
    discount: round(discount),
    total: round(total),
  };
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}
