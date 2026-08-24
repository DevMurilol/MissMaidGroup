import { getPrisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/admin-session";
import { AdminPageHeader, DbNotice } from "@/components/admin/db-notice";
import { AddonsManager } from "@/components/admin/addons-manager";
import { SeedButton } from "@/components/admin/seed-button";

export default async function AdminAddonsPage() {
  await requireAdminPage("/admin/addons");
  const prisma = getPrisma();
  const addOns = prisma ? await prisma.addOn.findMany({ orderBy: { sortOrder: "asc" } }) : null;

  return (
    <div>
      <AdminPageHeader
        title="Add-ons"
        description="Manage the extras clients can add to any cleaning service, and set their price multipliers."
      />

      {!prisma ? (
        <DbNotice />
      ) : addOns && addOns.length > 0 ? (
        <AddonsManager
          addOns={addOns.map((a) => ({
            id: a.id,
            slug: a.slug,
            name: a.name,
            price: a.price.toString(),
            isActive: a.isActive,
          }))}
        />
      ) : (
        <div className="rounded-[var(--radius-brand)] border border-dashed border-neutral-300 bg-white p-8 text-center">
          <p className="text-sm text-neutral-600">
            No add-ons in the database yet. Load the defaults from the spec to get started.
          </p>
          <div className="mt-4 flex justify-center">
            <SeedButton />
          </div>
        </div>
      )}
    </div>
  );
}
