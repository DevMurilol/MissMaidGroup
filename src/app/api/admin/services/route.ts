import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/admin-session";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getPrisma } from "@/lib/prisma";

const bodySchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("toggle"), id: z.string(), isActive: z.boolean() }),
  z.object({
    action: z.literal("upsert"),
    id: z.string().optional(),
    slug: z.enum(["regular", "deep", "move", "airbnb"]),
    name: z.string().min(2),
    description: z.string().min(2),
    points: z.array(z.string()).default([]),
    icon: z.string().min(2),
    isFeatured: z.boolean().default(false),
  }),
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

  if (body.action === "toggle") {
    const service = await prisma.service.update({
      where: { id: body.id },
      data: { isActive: body.isActive },
    });
    revalidatePath("/");
    return NextResponse.json({ service });
  }

  const service = await prisma.service.upsert({
    where: { slug: body.slug },
    create: {
      slug: body.slug,
      name: body.name,
      description: body.description,
      points: body.points,
      icon: body.icon,
      isFeatured: body.isFeatured,
    },
    update: {
      name: body.name,
      description: body.description,
      points: body.points,
      icon: body.icon,
      isFeatured: body.isFeatured,
    },
  });

  revalidatePath("/");

  return NextResponse.json({ service });
}
