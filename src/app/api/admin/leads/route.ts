import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-session";
import { z } from "zod";
import { getPrisma } from "@/lib/prisma";

const bodySchema = z.object({
  id: z.string(),
  status: z.enum(["new", "contacted", "booked", "archived"]),
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

  const lead = await prisma.lead.update({
    where: { id: parsed.data.id },
    data: { status: parsed.data.status },
  });

  return NextResponse.json({ lead });
}
