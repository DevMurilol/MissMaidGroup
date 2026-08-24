import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-session";
import { z } from "zod";
import { getPrisma } from "@/lib/prisma";

const bodySchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("upsert"),
    id: z.string().optional(),
    slug: z.string().min(2),
    name: z.string().min(2),
    price: z.coerce.number().min(0),
  }),
  z.object({ action: z.literal("delete"), id: z.string() }),
  z.object({ action: z.literal("toggle"), id: z.string(), isActive: z.boolean() }),
]);

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

  const body = parsed.data;

  if (body.action === "delete") {
    await prisma.addOn.delete({ where: { id: body.id } });
    return NextResponse.json({ ok: true });
  }

  if (body.action === "toggle") {
    const addOn = await prisma.addOn.update({ where: { id: body.id }, data: { isActive: body.isActive } });
    return NextResponse.json({ addOn });
  }

  const addOn = await prisma.addOn.upsert({
    where: { slug: body.slug },
    create: { slug: body.slug, name: body.name, price: body.price },
    update: { name: body.name, price: body.price },
  });

  return NextResponse.json({ addOn });
}
