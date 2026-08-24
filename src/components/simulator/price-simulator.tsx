"use client";

import { useState, type FormEvent } from "react";
import { Check, Loader2, Minus, Plus, ShieldCheck } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { addOns, services, suburbs, type ServiceId } from "@/lib/site-config";
import type { Frequency } from "@/lib/pricing";
import { cn } from "@/lib/utils";

const frequencies: { id: Frequency; label: string; hint: string }[] = [
  { id: "once", label: "One-time", hint: "Single visit" },
  { id: "weekly", label: "Weekly", hint: "Save 15%" },
  { id: "fortnightly", label: "Fortnightly", hint: "Save 10%" },
  { id: "monthly", label: "Monthly", hint: "Save 5%" },
];

type Status = "idle" | "submitting" | "success" | "error";

export function PriceSimulator() {
  const [step, setStep] = useState<1 | 2>(1);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const [serviceId, setServiceId] = useState<ServiceId>("regular");
  const [bedrooms, setBedrooms] = useState(3);
  const [bathrooms, setBathrooms] = useState(2);
  const [frequency, setFrequency] = useState<Frequency>("weekly");
  const [addonIds, setAddonIds] = useState<string[]>([]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [suburb, setSuburb] = useState("");
  const [notes, setNotes] = useState("");
  const [company, setCompany] = useState("");

  const visibleServices = services.filter((s) => !s.hidden);

  function toggleAddon(id: string) {
    setAddonIds((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId,
          bedrooms,
          bathrooms,
          frequency,
          addonIds,
          name,
          email,
          phone,
          suburb,
          notes,
          company,
        }),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <section id="quote" className="bg-white py-20 sm:py-28">
      <Container className="max-w-3xl">
        <SectionHeading
          eyebrow="Request Your Quote"
          title="Get your obligation-free quote"
          description="Answer a few quick questions and we'll email your personalised quote, no price haggling, no surprises."
        />

        <Reveal variant="enter" className="mt-12">
          <div className="rounded-[calc(var(--radius-brand)*2)] border border-neutral-200 bg-white p-6 shadow-[var(--shadow-soft-hover)] sm:p-10">
            {status === "success" ? (
              <div className="flex flex-col items-center gap-4 py-10 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                  <Check className="h-8 w-8" aria-hidden />
                </span>
                <h3 className="font-heading text-2xl font-bold text-neutral-900">
                  Thanks! Your quote is on the way to your inbox.
                </h3>
                <p className="max-w-sm text-sm text-neutral-600">
                  Keep an eye on {email || "your inbox"}. Our team will follow up within one
                  business day to confirm your booking.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-8 flex items-center gap-3">
                  <StepDot active={step === 1} done={step > 1} label="1" />
                  <div className="h-px flex-1 bg-neutral-200" />
                  <StepDot active={step === 2} done={false} label="2" />
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-8">
                  <input
                    type="text"
                    name="company"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                    style={{
                      position: "absolute",
                      width: 1,
                      height: 1,
                      padding: 0,
                      margin: -1,
                      overflow: "hidden",
                      clip: "rect(0,0,0,0)",
                      whiteSpace: "nowrap",
                      border: 0,
                    }}
                    aria-hidden
                  />

                  {step === 1 ? (
                    <div className="flex flex-col gap-8">
                      <Field label="Cleaning type">
                        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                          {visibleServices.map((service) => (
                            <ChoiceCard
                              key={service.id}
                              active={serviceId === service.id}
                              onClick={() => setServiceId(service.id)}
                              title={service.name}
                            />
                          ))}
                        </div>
                      </Field>

                      <div className="grid gap-8 sm:grid-cols-2">
                        <Field label="Bedrooms">
                          <Stepper value={bedrooms} min={1} max={6} onChange={setBedrooms} />
                        </Field>
                        <Field label="Bathrooms">
                          <Stepper value={bathrooms} min={1} max={4} onChange={setBathrooms} />
                        </Field>
                      </div>

                      <Field label="Frequency">
                        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                          {frequencies.map((f) => (
                            <button
                              key={f.id}
                              type="button"
                              onClick={() => setFrequency(f.id)}
                              className={cn(
                                "cursor-pointer rounded-[var(--radius-brand)] border px-3 py-3 text-center transition-all duration-200",
                                frequency === f.id
                                  ? "border-brand-500 bg-brand-50 text-brand-700"
                                  : "border-neutral-200 text-neutral-700 hover:border-brand-200"
                              )}
                            >
                              <span className="block font-heading text-sm font-bold">{f.label}</span>
                              <span className="block text-xs text-neutral-500">{f.hint}</span>
                            </button>
                          ))}
                        </div>
                      </Field>

                      <Field label="Add-ons (optional)">
                        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
                          {addOns.map((addOn) => (
                            <label
                              key={addOn.id}
                              className={cn(
                                "flex cursor-pointer items-center gap-2.5 rounded-[var(--radius-brand)] border px-3 py-3 transition-all duration-200",
                                addonIds.includes(addOn.id)
                                  ? "border-brand-500 bg-brand-50"
                                  : "border-neutral-200 hover:border-brand-200"
                              )}
                            >
                              <input
                                type="checkbox"
                                checked={addonIds.includes(addOn.id)}
                                onChange={() => toggleAddon(addOn.id)}
                                className="h-4 w-4 shrink-0 accent-brand-600"
                              />
                              <span className="text-sm font-medium text-neutral-800">{addOn.name}</span>
                            </label>
                          ))}
                        </div>
                      </Field>

                      <Button type="button" size="lg" onClick={() => setStep(2)} className="w-full justify-center">
                        Continue
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6">
                      <div className="grid gap-6 sm:grid-cols-2">
                        <Field label="Full name">
                          <input
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Jane Smith"
                            className="input-field"
                          />
                        </Field>
                        <Field label="Email">
                          <input
                            required
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="jane@email.com"
                            className="input-field"
                          />
                        </Field>
                      </div>

                      <div className="grid gap-6 sm:grid-cols-2">
                        <Field label="Phone">
                          <input
                            required
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="0400 000 000"
                            className="input-field"
                          />
                        </Field>
                        <Field label="Suburb">
                          <input
                            required
                            list="suburb-list"
                            value={suburb}
                            onChange={(e) => setSuburb(e.target.value)}
                            placeholder="e.g. Burleigh Heads"
                            className="input-field"
                          />
                          <datalist id="suburb-list">
                            {suburbs.map((s) => (
                              <option key={s} value={s} />
                            ))}
                          </datalist>
                        </Field>
                      </div>

                      <Field label="Anything we should know? (optional)">
                        <textarea
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          rows={3}
                          placeholder="Pets, gate codes, parking notes..."
                          className="input-field resize-none"
                        />
                      </Field>

                      {status === "error" ? (
                        <p role="alert" className="text-sm font-medium text-red-600">
                          {errorMessage}
                        </p>
                      ) : null}

                      <div className="flex flex-col-reverse gap-3 sm:flex-row">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => setStep(1)}
                          className="sm:w-40 justify-center"
                        >
                          Back
                        </Button>
                        <Button
                          type="submit"
                          size="lg"
                          disabled={status === "submitting"}
                          className="flex-1 justify-center"
                        >
                          {status === "submitting" ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                              Sending...
                            </>
                          ) : (
                            "Get My Quote"
                          )}
                        </Button>
                      </div>

                      <p className="flex items-center justify-center gap-2 text-xs text-neutral-500">
                        <ShieldCheck className="h-3.5 w-3.5 text-brand-600" aria-hidden />
                        Your details are only used to prepare your quote. No spam, ever.
                      </p>
                    </div>
                  )}
                </form>
              </>
            )}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-2.5">
      <span className="font-heading text-sm font-semibold text-neutral-800">{label}</span>
      {children}
    </label>
  );
}

function ChoiceCard({ title, active, onClick }: { title: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "cursor-pointer rounded-[var(--radius-brand)] border px-4 py-3.5 text-left text-sm font-semibold transition-all duration-200",
        active ? "border-brand-500 bg-brand-50 text-brand-700" : "border-neutral-200 text-neutral-700 hover:border-brand-200"
      )}
    >
      {title}
    </button>
  );
}

function Stepper({
  value,
  min,
  max,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease"
        className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-[var(--radius-brand)] border border-neutral-200 text-neutral-700 transition-colors hover:border-brand-300 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Minus className="h-4 w-4" aria-hidden />
      </button>
      <span className="w-8 text-center font-heading text-lg font-bold text-neutral-900">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase"
        className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-[var(--radius-brand)] border border-neutral-200 text-neutral-700 transition-colors hover:border-brand-300 hover:text-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <Plus className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}

function StepDot({ active, done, label }: { active: boolean; done: boolean; label: string }) {
  return (
    <span
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-heading text-xs font-bold transition-colors",
        active || done ? "bg-brand-500 text-white" : "bg-neutral-100 text-neutral-500"
      )}
    >
      {done ? <Check className="h-4 w-4" aria-hidden /> : label}
    </span>
  );
}
