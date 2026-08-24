import type { Metadata } from "next";
import Link from "next/link";
import { LogOut, ListChecks, PlusSquare, Sliders, Users } from "lucide-react";
import { logoutAction } from "../login/actions";

export const metadata: Metadata = { title: "Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const navItems = [
  { href: "/admin/leads", label: "Leads", icon: Users },
  { href: "/admin/services", label: "Services", icon: ListChecks },
  { href: "/admin/addons", label: "Add-ons", icon: PlusSquare },
  { href: "/admin/rules", label: "Quote Rules", icon: Sliders },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-neutral-50">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-neutral-200 bg-white p-6 sm:flex">
        <Link href="/admin/leads" className="mb-8 flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-brand)] bg-brand-500 font-heading text-base font-extrabold text-white">
            M
          </span>
          <span className="font-heading text-sm font-bold text-neutral-900">Miss Maid Admin</span>
        </Link>
        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-[var(--radius-brand)] px-3 py-2.5 text-sm font-semibold text-neutral-700 transition-colors hover:bg-brand-50 hover:text-brand-700"
            >
              <item.icon className="h-4 w-4" aria-hidden />
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={logoutAction}>
          <button
            type="submit"
            className="flex w-full cursor-pointer items-center gap-3 rounded-[var(--radius-brand)] px-3 py-2.5 text-sm font-semibold text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-800"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Sign out
          </button>
        </form>
      </aside>

      <main className="flex-1 p-6 sm:p-10">{children}</main>
    </div>
  );
}
