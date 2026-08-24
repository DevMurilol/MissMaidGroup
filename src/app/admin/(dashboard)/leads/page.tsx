import { Download } from "lucide-react";
import { requireAdminPage } from "@/lib/admin-session";
import { getPrisma } from "@/lib/prisma";
import { AdminPageHeader, DbNotice } from "@/components/admin/db-notice";
import { LeadsTable } from "@/components/admin/leads-table";

export default async function AdminLeadsPage() {
  await requireAdminPage("/admin/leads");
  const prisma = getPrisma();
  const leads = prisma ? await prisma.lead.findMany({ orderBy: { createdAt: "desc" } }) : null;

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <AdminPageHeader title="Leads" description="Every quote request submitted through the website, newest first." />
        {prisma ? (
          <a
            href="/api/admin/leads/export"
            className="inline-flex items-center gap-2 rounded-[var(--radius-brand)] border border-neutral-200 bg-white px-4 py-2.5 text-sm font-heading font-semibold text-neutral-700 shadow-[var(--shadow-soft)] transition-colors hover:border-brand-300 hover:text-brand-700"
          >
            <Download className="h-4 w-4" aria-hidden />
            Export CSV
          </a>
        ) : null}
      </div>

      {!prisma || !leads ? (
        <DbNotice />
      ) : (
        <LeadsTable
          leads={leads.map((lead) => ({
            id: lead.id,
            name: lead.name,
            email: lead.email,
            phone: lead.phone,
            suburb: lead.suburb,
            serviceType: lead.serviceType,
            bedrooms: lead.bedrooms,
            bathrooms: lead.bathrooms,
            frequency: lead.frequency,
            quotedPrice: lead.quotedPrice.toString(),
            status: lead.status,
            createdAt: lead.createdAt.toISOString(),
          }))}
        />
      )}
    </div>
  );
}
