"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

export function SeedButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  function handleClick() {
    setError("");
    startTransition(async () => {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      if (!res.ok) {
        setError("Could not load starter data. Check the server logs.");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="inline-flex cursor-pointer items-center gap-2 rounded-[var(--radius-brand)] bg-brand-500 px-4 py-2.5 text-sm font-heading font-semibold text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Sparkles className="h-4 w-4" aria-hidden />
        {pending ? "Loading..." : "Load starter data from spec"}
      </button>
      {error ? <p className="text-xs font-medium text-red-600">{error}</p> : null}
    </div>
  );
}
