import { type AddOnView, type ServiceId, addOns as defaultAddOns } from "@/lib/site-config";

export const pricingRules = {
  /** What an hour of cleaning is worth. Every quote derives from this number. */
  hourlyRate: 60,

  /**
   * Hours are estimated from the parts of a home that actually consume time.
   * Tuned so a typical 3 bedroom / 2 bathroom home lands on 3.00 hours, which
   * at the weekly rate is the $180 the business quotes for that job.
   */
  baseHours: 1.25, // common areas, kitchen and floors
  hoursPerBedroom: 0.25,
  hoursPerBathroom: 0.5,

  /** No job is dispatched for less than this, travel has to pay for itself. */
  minimumHours: 2,

  /**
   * Deeper work takes longer on the same house, so this scales the hours rather
   * than the money. A deep clean is not a dearer hour, it is more hours.
   */
  serviceMultiplier: {
    regular: 1,
    deep: 1.4,
    move: 1.6,
    airbnb: 1.15,
  } satisfies Record<ServiceId, number>,

  /**
   * Frequency is a surcharge, not a discount.
   *
   * The old model discounted recurring work (weekly paid 85%), which meant the
   * business earned less per hour the more reliable the client was. Here the
   * weekly rate IS the rate: it is never reduced, and everything less frequent
   * pays more to cover the extra travel and scheduling of an isolated visit.
   *
   * Derived from a 3 hour job: weekly $180, fortnightly $187.50, monthly $210,
   * one-off $220.
   */
  frequencyMultiplier: {
    weekly: 1,
    fortnightly: 25 / 24, // $187.50 on a 3 hour job
    monthly: 7 / 6, //      $210.00
    once: 11 / 9, //        $220.00
  },
};

export type Frequency = keyof typeof pricingRules.frequencyMultiplier;
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
  const roomHours =
    rules.baseHours + bedrooms * rules.hoursPerBedroom + bathrooms * rules.hoursPerBathroom;

  // Rounded to the quarter hour before any money is worked out, so the figure
  // quoted to the customer multiplies out exactly: "3.25 hours at $60" really
  // is the $195 on the invoice.
  const hours = Math.max(
    rules.minimumHours,
    roundToQuarterHour(roomHours * rules.serviceMultiplier[serviceId])
  );

  const labour = hours * rules.hourlyRate;

  // Add-ons stay flat fees, not hours: they are defined pieces of work with a
  // known price, and quoting "0.6 of an hour for the oven" helps nobody.
  const addonsTotal = addonIds.reduce((sum, id) => {
    const addOn = catalog.find((a) => a.id === id);
    return sum + (addOn?.price ?? 0);
  }, 0);

  const subtotal = labour + addonsTotal;
  const total = subtotal * rules.frequencyMultiplier[frequency];
  // What a less frequent booking adds on top of the weekly rate. Zero for
  // weekly, which is the floor.
  const frequencyUplift = total - subtotal;

  return {
    hours,
    hourlyRate: rules.hourlyRate,
    labour: round(labour),
    addonsTotal: round(addonsTotal),
    frequencyUplift: round(frequencyUplift),
    total: round(total),
  };
}

function roundToQuarterHour(value: number) {
  return Math.round(value * 4) / 4;
}

function round(value: number) {
  return Math.round(value * 100) / 100;
}
