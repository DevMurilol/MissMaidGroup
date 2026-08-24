import { getPrisma } from "@/lib/prisma";
import { requireAdminPage } from "@/lib/admin-session";
import { AdminPageHeader, DbNotice } from "@/components/admin/db-notice";
import { ServicesManager } from "@/components/admin/services-manager";
import { SeedButton } from "@/components/admin/seed-button";

export default async function AdminServicesPage() {
  await requireAdminPage("/admin/services");
  const prisma = getPrisma();
  const services = prisma ? await prisma.service.findMany({ orderBy: { sortOrder: "asc" } }) : null;

  return (
    <div>
      <AdminPageHeader
        title="Services"
        description="Toggle services on or off, edit descriptions, and control what appears on the live site. Turning on Airbnb Cleaning adds it to the Services section automatically."
      />

      {!prisma ? (
        <DbNotice />
      ) : services && services.length > 0 ? (
        <ServicesManager
          services={services.map((s) => ({
            id: s.id,
            slug: s.slug,
            name: s.name,
            description: s.description,
            points: s.points,
            icon: s.icon,
            isActive: s.isActive,
            isFeatured: s.isFeatured,
          }))}
        />
      ) : (
        <div className="rounded-[var(--radius-brand)] border border-dashed border-neutral-300 bg-white p-8 text-center">
          <p className="text-sm text-neutral-600">
            No services in the database yet. Load the defaults from the spec to get started.
          </p>
          <div className="mt-4 flex justify-center">
            <SeedButton />
          </div>
        </div>
      )}
    </div>
  );
}
