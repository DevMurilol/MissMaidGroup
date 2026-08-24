"use client";

import { useState, useTransition } from "react";
import { Save } from "lucide-react";
import { cn } from "@/lib/utils";

type ServiceRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  points: string[];
  icon: string;
  isActive: boolean;
  isFeatured: boolean;
};

const iconOptions = ["Home", "Sparkles", "PackageCheck", "KeyRound", "ShieldCheck", "ReceiptText", "SprayCan", "CalendarClock", "BadgeCheck", "MapPin"];

export function ServicesManager({ services }: { services: ServiceRow[] }) {
  return (
    <div className="flex flex-col gap-5">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}

function ServiceCard({ service }: { service: ServiceRow }) {
  const [form, setForm] = useState({
    name: service.name,
    description: service.description,
    points: service.points.join(", "),
    icon: service.icon,
    isFeatured: service.isFeatured,
  });
  const [isActive, setIsActive] = useState(service.isActive);
  const [pending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<number | null>(null);

  function toggleActive() {
    const next = !isActive;
    setIsActive(next);
    startTransition(async () => {
      await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle", id: service.id, isActive: next }),
      });
    });
  }

  function handleSave() {
    startTransition(async () => {
      await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "upsert",
          id: service.id,
          slug: service.slug,
          name: form.name,
          description: form.description,
          points: form.points.split(",").map((p) => p.trim()).filter(Boolean),
          icon: form.icon,
          isFeatured: form.isFeatured,
        }),
      });
      setSavedAt(Date.now());
    });
  }

  return (
    <div className="rounded-[calc(var(--radius-brand)*2)] border border-neutral-200 bg-white p-6">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <span className="text-xs font-heading font-bold uppercase tracking-wide text-neutral-400">{service.slug}</span>
          <h3 className="font-heading text-lg font-bold text-neutral-900">{form.name}</h3>
        </div>
        <button
          type="button"
          onClick={toggleActive}
          aria-pressed={isActive}
          className={cn(
            "relative h-7 w-12 shrink-0 cursor-pointer rounded-full transition-colors",
            isActive ? "bg-brand-500" : "bg-neutral-300"
          )}
        >
          <span
            className={cn(
              "absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform",
              isActive ? "translate-x-6" : "translate-x-1"
            )}
          />
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-heading font-semibold text-neutral-700">Name</span>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" />
        </label>
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-heading font-semibold text-neutral-700">Icon</span>
          <select value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="input-field">
            {iconOptions.map((icon) => (
              <option key={icon} value={icon}>
                {icon}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="mt-4 flex flex-col gap-1.5 text-sm">
        <span className="font-heading font-semibold text-neutral-700">Description</span>
        <textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          rows={2}
          className="input-field resize-none"
        />
      </label>

      <label className="mt-4 flex flex-col gap-1.5 text-sm">
        <span className="font-heading font-semibold text-neutral-700">Bullet points (comma separated)</span>
        <input value={form.points} onChange={(e) => setForm({ ...form, points: e.target.value })} className="input-field" />
      </label>

      <div className="mt-5 flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
          <input
            type="checkbox"
            checked={form.isFeatured}
            onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
            className="h-4 w-4 accent-brand-600"
          />
          Featured (highlighted card)
        </label>

        <div className="flex items-center gap-3">
          {savedAt ? <span className="text-xs font-medium text-brand-700">Saved</span> : null}
          <button
            type="button"
            onClick={handleSave}
            disabled={pending}
            className="inline-flex cursor-pointer items-center gap-2 rounded-[var(--radius-brand)] bg-brand-500 px-4 py-2 text-sm font-heading font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save className="h-4 w-4" aria-hidden />
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
