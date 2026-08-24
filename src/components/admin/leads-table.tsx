"use client";

import { useState, useTransition } from "react";
import { cn } from "@/lib/utils";

type Lead = {
  id: string;
  name: string;
  email: string;
  phone: string;
  suburb: string;
  serviceType: string;
  bedrooms: number;
  bathrooms: number;
  frequency: string;
  quotedPrice: string;
  status: string;
  createdAt: string;
};

const statusStyles: Record<string, string> = {
  new: "bg-blue-50 text-blue-700",
  contacted: "bg-amber-50 text-amber-700",
  booked: "bg-brand-50 text-brand-700",
  archived: "bg-neutral-100 text-neutral-500",
};

export function LeadsTable({ leads }: { leads: Lead[] }) {
  const [rows, setRows] = useState(leads);
  const [pending, startTransition] = useTransition();

  function updateStatus(id: string, status: string) {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, status } : row)));
    startTransition(async () => {
      await fetch("/api/admin/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
    });
  }

  if (rows.length === 0) {
    return <p className="text-sm text-neutral-500">No leads yet, once your quote simulator receives submissions, they will appear here.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-[var(--radius-brand)] border border-neutral-200 bg-white">
      <table className="w-full min-w-[860px] text-left text-sm">
        <thead className="border-b border-neutral-200 bg-neutral-50 text-xs font-heading font-bold uppercase tracking-wide text-neutral-500">
          <tr>
            <th className="px-4 py-3">Client</th>
            <th className="px-4 py-3">Service</th>
            <th className="px-4 py-3">Suburb</th>
            <th className="px-4 py-3">Quote</th>
            <th className="px-4 py-3">Received</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {rows.map((lead) => (
            <tr key={lead.id} className={cn("transition-opacity", pending && "opacity-80")}>
              <td className="px-4 py-3">
                <p className="font-semibold text-neutral-900">{lead.name}</p>
                <p className="text-xs text-neutral-500">{lead.email}</p>
                <p className="text-xs text-neutral-500">{lead.phone}</p>
              </td>
              <td className="px-4 py-3 text-neutral-700">
                {lead.serviceType} &middot; {lead.bedrooms}bd/{lead.bathrooms}ba &middot; {lead.frequency}
              </td>
              <td className="px-4 py-3 text-neutral-700">{lead.suburb}</td>
              <td className="px-4 py-3 font-semibold text-neutral-900">${Number(lead.quotedPrice).toFixed(2)}</td>
              <td className="px-4 py-3 text-neutral-500">
                {new Date(lead.createdAt).toLocaleDateString("en-AU", { day: "2-digit", month: "short", year: "numeric" })}
              </td>
              <td className="px-4 py-3">
                <select
                  value={lead.status}
                  onChange={(e) => updateStatus(lead.id, e.target.value)}
                  className={cn(
                    "cursor-pointer rounded-full border-0 px-3 py-1.5 text-xs font-heading font-bold focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500",
                    statusStyles[lead.status] ?? statusStyles.new
                  )}
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="booked">Booked</option>
                  <option value="archived">Archived</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
