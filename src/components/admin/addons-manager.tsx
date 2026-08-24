"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Save, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

type AddOnRow = { id: string; slug: string; name: string; price: string; isActive: boolean };

export function AddonsManager({ addOns }: { addOns: AddOnRow[] }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {addOns.map((addOn) => (
          <AddonCard key={addOn.id} addOn={addOn} />
        ))}
      </div>
      <NewAddonForm />
    </div>
  );
}

function AddonCard({ addOn }: { addOn: AddOnRow }) {
  const router = useRouter();
  const [name, setName] = useState(addOn.name);
  const [price, setPrice] = useState(addOn.price);
  const [isActive, setIsActive] = useState(addOn.isActive);
  const [pending, startTransition] = useTransition();

  function toggleActive() {
    const next = !isActive;
    setIsActive(next);
    startTransition(async () => {
      await fetch("/api/admin/addons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "toggle", id: addOn.id, isActive: next }),
      });
    });
  }

  function handleSave() {
    startTransition(async () => {
      await fetch("/api/admin/addons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "upsert", id: addOn.id, slug: addOn.slug, name, price: Number(price) }),
      });
    });
  }

  function handleDelete() {
    startTransition(async () => {
      await fetch("/api/admin/addons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "delete", id: addOn.id }),
      });
      router.refresh();
    });
  }

  return (
    <div className={cn("rounded-[calc(var(--radius-brand)*2)] border bg-white p-5", isActive ? "border-neutral-200" : "border-neutral-200 opacity-60")}>
      <div className="flex items-center justify-between gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} className="input-field font-heading font-semibold" />
        <button
          type="button"
          onClick={handleDelete}
          aria-label={`Remove ${name}`}
          className="cursor-pointer rounded-[var(--radius-brand)] p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <Trash2 className="h-4 w-4" aria-hidden />
        </button>
      </div>
      <div className="mt-3 flex items-center gap-2">
        <span className="text-sm text-neutral-500">$</span>
        <input
          type="number"
          min={0}
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="input-field"
        />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs font-semibold text-neutral-600">
          <input type="checkbox" checked={isActive} onChange={toggleActive} className="h-4 w-4 accent-brand-600" />
          Active
        </label>
        <button
          type="button"
          onClick={handleSave}
          disabled={pending}
          className="inline-flex cursor-pointer items-center gap-1.5 rounded-[var(--radius-brand)] bg-brand-500 px-3 py-1.5 text-xs font-heading font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
        >
          <Save className="h-3.5 w-3.5" aria-hidden />
          Save
        </button>
      </div>
    </div>
  );
}

function NewAddonForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    const slug = name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-");
    startTransition(async () => {
      await fetch("/api/admin/addons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "upsert", slug, name: name.trim(), price: Number(price) || 0 }),
      });
      setName("");
      setPrice("");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3 rounded-[var(--radius-brand)] border border-dashed border-neutral-300 bg-white p-5">
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-heading font-semibold text-neutral-700">New add-on name</span>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Garage" className="input-field w-48" />
      </label>
      <label className="flex flex-col gap-1.5 text-sm">
        <span className="font-heading font-semibold text-neutral-700">Price ($)</span>
        <input type="number" min={0} step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className="input-field w-32" />
      </label>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex cursor-pointer items-center gap-2 rounded-[var(--radius-brand)] bg-brand-500 px-4 py-2.5 text-sm font-heading font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
      >
        <Plus className="h-4 w-4" aria-hidden />
        Add
      </button>
    </form>
  );
}
