import { cache } from "react";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

/**
 * Cloudflare Workers cannot carry a database connection across requests, so the
 * client must not live on `globalThis`. `cache()` scopes it to a single request
 * (one client per request, shared by every caller within it) and `maxUses: 1`
 * stops the pool from handing an already-used socket to a later request.
 *
 * Returns `undefined` when DATABASE_URL is unset, which is what makes the site
 * fall back to the static content in `site-config.ts`.
 */
export const getPrisma = cache((): PrismaClient | undefined => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) return undefined;

  const adapter = new PrismaPg({ connectionString, maxUses: 1 });
  return new PrismaClient({ adapter });
});
