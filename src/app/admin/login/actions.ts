"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, ADMIN_SESSION_TTL_SECONDS, createSessionToken, verifyAdminCredentials } from "@/lib/admin-auth";

export type LoginState = { error?: string };

export async function loginAction(_prevState: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") || "");
  const password = String(formData.get("password") || "");
  const from = String(formData.get("from") || "/admin/leads");

  if (!process.env.ADMIN_SESSION_SECRET || !process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    return { error: "Admin access is not configured yet. Set ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_SESSION_SECRET." };
  }

  if (!verifyAdminCredentials(email, password)) {
    return { error: "Invalid email or password." };
  }

  const token = await createSessionToken(email);
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: ADMIN_SESSION_TTL_SECONDS,
  });

  redirect(from.startsWith("/admin") ? from : "/admin/leads");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  redirect("/admin/login");
}
