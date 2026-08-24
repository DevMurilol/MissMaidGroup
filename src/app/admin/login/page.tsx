import type { Metadata } from "next";
import { LoginForm } from "./login-form";

export const metadata: Metadata = { title: "Admin Login", robots: { index: false, follow: false } };

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ from?: string }>;
}) {
  const { from } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-sand-50 px-6">
      <div className="w-full max-w-sm rounded-[calc(var(--radius-brand)*2)] border border-neutral-200 bg-white p-8 shadow-[var(--shadow-soft-hover)]">
        <div className="mb-6 flex flex-col items-center gap-2 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-brand)] bg-brand-500 font-heading text-lg font-extrabold text-white">
            M
          </span>
          <h1 className="font-heading text-xl font-bold text-neutral-900">Miss Maid Group Admin</h1>
          <p className="text-sm text-neutral-500">Sign in to manage services, add-ons, and leads.</p>
        </div>
        <LoginForm from={from ?? "/admin/leads"} />
      </div>
    </div>
  );
}
