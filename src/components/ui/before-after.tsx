"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Before / after comparison, as a cross-fade rather than a drag-across wipe.
 *
 * A wipe needs the two frames to register pixel for pixel, which means a locked
 * off camera. Real job photos are taken by hand, minutes apart, and the camera
 * moves between them. Under a wipe that shows up as a hard seam with duplicated
 * taps and broken edges. A dissolve carries the same information, reads as the
 * grime lifting away, and is forgiving of a camera that shifted.
 */
export function BeforeAfter({
  before,
  after,
  label,
  aspect = "aspect-[4/3]",
  sizes = "(min-width: 1024px) 33vw, 100vw",
}: {
  before: string;
  after: string;
  label: string;
  aspect?: string;
  sizes?: string;
}) {
  /** 0 = untouched, 100 = fully cleaned. */
  const [value, setValue] = useState(0);
  /** Dragging must track the finger exactly; taps and the intro should glide. */
  const [smooth, setSmooth] = useState(true);
  const frameRef = useRef<HTMLDivElement>(null);
  const hasPlayed = useRef(false);

  // Play the reveal once when it scrolls into view, so the control is
  // discovered rather than sitting there looking like a static photo.
  useEffect(() => {
    const node = frameRef.current;
    if (!node) return;

    let timer = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasPlayed.current) return;
        hasPlayed.current = true;
        observer.disconnect();

        // Reduced motion: land on the cleaned frame with no tween. Handled in
        // the callback rather than the effect body, which would fire a
        // synchronous setState and cascade a render.
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
          setSmooth(false);
          setValue(100);
          return;
        }

        timer = window.setTimeout(() => {
          setSmooth(true);
          setValue(100);
        }, 350);
      },
      { threshold: 0.45 }
    );

    observer.observe(node);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
  }, []);

  const onDrag = useCallback((next: number) => {
    setSmooth(false);
    setValue(next);
  }, []);

  const toggle = useCallback(() => {
    setSmooth(true);
    setValue((v) => (v > 50 ? 0 : 100));
  }, []);

  const cleaned = value > 50;

  return (
    <figure className="flex flex-col gap-4">
      <div
        ref={frameRef}
        className={cn(
          "group relative w-full select-none overflow-hidden rounded-[calc(var(--radius-brand)*2)] shadow-[var(--shadow-soft)]",
          aspect
        )}
      >
        {/* The dirty frame sits underneath and never moves. */}
        <Image src={before} alt={`${label} before cleaning`} fill sizes={sizes} className="object-cover" />

        {/* The clean frame fades in over it. */}
        <Image
          src={after}
          alt={`${label} after cleaning by Miss Maid Group`}
          fill
          sizes={sizes}
          className="object-cover"
          style={{
            opacity: value / 100,
            transition: smooth ? "opacity 900ms cubic-bezier(0.22, 1, 0.36, 1)" : "none",
          }}
        />

        {/* Tap anywhere on the photo to flip between the two states. */}
        <button
          type="button"
          onClick={toggle}
          aria-label={cleaned ? `Show ${label} before cleaning` : `Show ${label} after cleaning`}
          className="absolute inset-0 z-10 cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        />

        <span
          className={cn(
            "pointer-events-none absolute left-3 top-3 z-20 rounded-full px-3 py-1 text-xs font-heading font-semibold text-white transition-colors duration-500",
            cleaned ? "bg-neutral-900/45" : "bg-neutral-900/80"
          )}
        >
          Before
        </span>
        <span
          className={cn(
            "pointer-events-none absolute right-3 top-3 z-20 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-heading font-semibold text-white transition-colors duration-500",
            cleaned ? "bg-brand-600/95" : "bg-brand-600/40"
          )}
        >
          <Sparkles className="h-3 w-3" aria-hidden />
          After
        </span>
        <span className="pointer-events-none absolute bottom-3 left-3 z-20 rounded-[var(--radius-brand)] bg-white/95 px-3 py-1.5 text-xs font-heading font-bold text-neutral-900">
          {label}
        </span>
      </div>

      {/* Visible control. A cross-fade has no divider to grab, so the affordance
          cannot live on the image alone. Native range input: keyboard operable
          and a proper touch target on mobile at no cost. */}
      <div className="flex items-center gap-3 px-1">
        <span className="text-xs font-heading font-semibold text-neutral-500">Dirty</span>
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => onDrag(Number(e.target.value))}
          onPointerUp={() => setSmooth(true)}
          aria-label={`Fade between ${label} before and after cleaning`}
          className="h-2 flex-1 cursor-ew-resize accent-brand-600"
        />
        <span className="text-xs font-heading font-semibold text-brand-700">Spotless</span>
      </div>
    </figure>
  );
}
