import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, verifySessionToken } from "@/lib/admin-auth";

/**
 * Request-scoped admin session guards.
 *
 * These replace the former `src/proxy.ts` check, which cannot run on Cloudflare
 * Workers: Next 16 pins Proxy to the Node.js runtime and OpenNext does not
 * support it. Checking per page and per route handler is also what the Next.js
 * auth guide recommends, since layouts do not re-render on client-side
 * navigation and therefore never were a reliable boundary.
 */
export const getAdminSession = cache(async (): Promise<{ email: string } | null> => {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(ADMIN_COOKIE_NAME)?.value);
});

/** Guard for admin pages: sends unauthenticated visitors to the login screen. */
export async function requireAdminPage(from?: string) {
  const session = await getAdminSession();
  if (!session) {
    redirect(from ? `/admin/login?from=${encodeURIComponent(from)}` : "/admin/login");
  }
  return session;
}

/** Guard for admin route handlers: returns a 401 response, or null when allowed. */
export async function requireAdminApi(): Promise<NextResponse | null> {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
