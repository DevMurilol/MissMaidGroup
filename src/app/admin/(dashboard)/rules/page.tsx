import { getPrisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/admin-session";
import { pricingRules } from "@/lib/pricing";
import { AdminPageHeader, DbNotice } from "@/components/admin/db-notice";
import { RulesForm } from "@/components/admin/rules-form";

export default async function AdminRulesPage() {
  await requireAdminPage("/admin/rules");
  const prisma = getPrisma();
  const rule = prisma ? await prisma.pricingRule.findFirst() : null;

  const values = rule
    ? {
        baseCallout: rule.baseCallout.toString(),
        perBedroom: rule.perBedroom.toString(),
        perBathroom: rule.perBathroom.toString(),
        regularMultiplier: rule.regularMultiplier.toString(),
        deepMultiplier: rule.deepMultiplier.toString(),
        moveMultiplier: rule.moveMultiplier.toString(),
        airbnbMultiplier: rule.airbnbMultiplier.toString(),
        weeklyDiscount: rule.weeklyDiscount.toString(),
        fortnightlyDiscount: rule.fortnightlyDiscount.toString(),
        monthlyDiscount: rule.monthlyDiscount.toString(),
      }
    : {
        baseCallout: String(pricingRules.baseCallout),
        perBedroom: String(pricingRules.perBedroom),
        perBathroom: String(pricingRules.perBathroom),
        regularMultiplier: String(pricingRules.serviceMultiplier.regular),
        deepMultiplier: String(pricingRules.serviceMultiplier.deep),
        moveMultiplier: String(pricingRules.serviceMultiplier.move),
        airbnbMultiplier: String(pricingRules.serviceMultiplier.airbnb),
        weeklyDiscount: String(pricingRules.frequencyDiscount.weekly),
        fortnightlyDiscount: String(pricingRules.frequencyDiscount.fortnightly),
        monthlyDiscount: String(pricingRules.frequencyDiscount.monthly),
      };

  return (
    <div>
      <AdminPageHeader
        title="Quote Rules"
        description="Control how the price simulator calculates every quote. Changes apply to new quote requests immediately."
      />
      {!prisma ? <DbNotice /> : null}
      <RulesForm rule={values} />
    </div>
  );
}
