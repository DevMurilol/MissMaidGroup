"use client";

import { useState, useTransition } from "react";
import { Save } from "lucide-react";

type RulesShape = {
  baseCallout: string;
  perBedroom: string;
  perBathroom: string;
  regularMultiplier: string;
  deepMultiplier: string;
  moveMultiplier: string;
  airbnbMultiplier: string;
  weeklyDiscount: string;
  fortnightlyDiscount: string;
  monthlyDiscount: string;
};

export function RulesForm({ rule }: { rule: RulesShape }) {
  const [form, setForm] = useState(rule);
  const [pending, startTransition] = useTransition();
  const [savedAt, setSavedAt] = useState<number | null>(null);

  function set<K extends keyof RulesShape>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const numeric = Object.fromEntries(Object.entries(form).map(([key, value]) => [key, Number(value)]));
      await fetch("/api/admin/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(numeric),
      });
      setSavedAt(Date.now());
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl rounded-[calc(var(--radius-brand)*2)] border border-neutral-200 bg-white p-8">
      <h3 className="font-heading text-base font-bold text-neutral-900">Base pricing</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <RuleField label="Call-out fee ($)" value={form.baseCallout} onChange={(v) => set("baseCallout", v)} />
        <RuleField label="Per bedroom ($)" value={form.perBedroom} onChange={(v) => set("perBedroom", v)} />
        <RuleField label="Per bathroom ($)" value={form.perBathroom} onChange={(v) => set("perBathroom", v)} />
      </div>

      <h3 className="mt-8 font-heading text-base font-bold text-neutral-900">Service multipliers</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-4">
        <RuleField label="Regular" value={form.regularMultiplier} onChange={(v) => set("regularMultiplier", v)} step="0.05" />
        <RuleField label="Deep clean" value={form.deepMultiplier} onChange={(v) => set("deepMultiplier", v)} step="0.05" />
        <RuleField label="Move in/out" value={form.moveMultiplier} onChange={(v) => set("moveMultiplier", v)} step="0.05" />
        <RuleField label="Airbnb" value={form.airbnbMultiplier} onChange={(v) => set("airbnbMultiplier", v)} step="0.05" />
      </div>

      <h3 className="mt-8 font-heading text-base font-bold text-neutral-900">Frequency discounts (0-1)</h3>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <RuleField label="Weekly" value={form.weeklyDiscount} onChange={(v) => set("weeklyDiscount", v)} step="0.01" />
        <RuleField label="Fortnightly" value={form.fortnightlyDiscount} onChange={(v) => set("fortnightlyDiscount", v)} step="0.01" />
        <RuleField label="Monthly" value={form.monthlyDiscount} onChange={(v) => set("monthlyDiscount", v)} step="0.01" />
      </div>

      <div className="mt-8 flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex cursor-pointer items-center gap-2 rounded-[var(--radius-brand)] bg-brand-500 px-5 py-2.5 text-sm font-heading font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
        >
          <Save className="h-4 w-4" aria-hidden />
          Save rules
        </button>
        {savedAt ? <span className="text-xs font-medium text-brand-700">Saved</span> : null}
      </div>
    </form>
  );
}

function RuleField({
  label,
  value,
  onChange,
  step = "1",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  step?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="font-heading font-semibold text-neutral-700">{label}</span>
      <input type="number" step={step} value={value} onChange={(e) => onChange(e.target.value)} className="input-field" />
    </label>
  );
}
