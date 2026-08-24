import { DatabaseZap } from "lucide-react";

export function DbNotice() {
  return (
    <div className="flex items-start gap-3 rounded-[var(--radius-brand)] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <DatabaseZap className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
      <div>
        <p className="font-heading font-bold">No database connected</p>
        <p className="mt-1 text-amber-800">
          Set a <code className="rounded bg-amber-100 px-1 py-0.5">DATABASE_URL</code> environment
          variable and run <code className="rounded bg-amber-100 px-1 py-0.5">npx prisma migrate deploy</code>{" "}
          to enable this section.
        </p>
      </div>
    </div>
  );
}

export function AdminPageHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-8">
      <h1 className="font-heading text-2xl font-bold text-neutral-900">{title}</h1>
      <p className="mt-1.5 text-sm text-neutral-600">{description}</p>
    </div>
  );
}
