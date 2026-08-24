"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/ui/section-heading";
import { Reveal } from "@/components/ui/reveal";
import { faqs } from "@/lib/site-config";
import { cn } from "@/lib/utils";

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="bg-white py-20 sm:py-28">
      <Container className="max-w-4xl">
        <SectionHeading
          eyebrow="Frequently Asked Questions"
          title="Everything you need to know"
          description="Can't find your answer here? Give our local team a call, we're happy to help."
        />

        <div className="mt-12 flex flex-col divide-y divide-neutral-200 border-y border-neutral-200">
          {faqs.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <Reveal key={item.question} index={index}>
                <div>
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    aria-expanded={isOpen}
                    className="flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left"
                  >
                    <span className="font-heading text-base font-semibold text-neutral-900">{item.question}</span>
                    <ChevronDown
                      className={cn("h-5 w-5 shrink-0 text-brand-600 transition-transform duration-200", isOpen && "rotate-180")}
                      aria-hidden
                    />
                  </button>
                  <div
                    className={cn(
                      "grid overflow-hidden transition-all duration-300 ease-out",
                      isOpen ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0"
                    )}
                  >
                    <p className="min-h-0 text-sm leading-relaxed text-neutral-600">{item.answer}</p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
