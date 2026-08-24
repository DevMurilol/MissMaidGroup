import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-session";
import { getPrisma } from "@/lib/prisma";

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET() {
  const unauthorized = await requireAdminApi();
  if (unauthorized) return unauthorized;

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "Database not configured." }, { status: 503 });
  }

  const leads = await prisma.lead.findMany({ orderBy: { createdAt: "desc" } });

  const headers = [
    "Created",
    "Name",
    "Email",
    "Phone",
    "Suburb",
    "Service",
    "Bedrooms",
    "Bathrooms",
    "Frequency",
    "Add-ons",
    "Quoted Price",
    "Status",
  ];

  const rows = leads.map((lead) =>
    [
      lead.createdAt.toISOString(),
      lead.name,
      lead.email,
      lead.phone,
      lead.suburb,
      lead.serviceType,
      String(lead.bedrooms),
      String(lead.bathrooms),
      lead.frequency,
      lead.addonIds.join("; "),
      lead.quotedPrice.toString(),
      lead.status,
    ]
      .map(csvEscape)
      .join(",")
  );

  const csv = [headers.join(","), ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="miss-maid-group-leads-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
