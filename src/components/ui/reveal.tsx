import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Scroll-linked reveal.
 *
 * Motion stays tied to scroll position instead of playing once on entry and
 * freezing, so the page keeps responding to the reader the whole way down.
 *
 * There is no JavaScript here on purpose. The behaviour comes from native
 * scroll-driven animations in globals.css, which means this is a Server
 * Component: no client bundle, no IntersectionObserver, no hydration cost on a
 * page whose Core Web Vitals are a stated KPI. Browsers without scroll
 * timelines render the content plainly visible.
 */
export function Reveal({
  children,
  className,
  index = 0,
  variant = "cycle",
}: {
  children: ReactNode;
  className?: string;
  /**
   * Position in a group, for staggering. Drives the start of the scroll range,
   * not a time delay. Capped so the last card in a long grid still completes
   * its curve while it is on screen.
   */
  index?: number;
  /**
   * "cycle" rises in, settles, then drifts and dims on the way out.
   * "enter" rises in and holds. Use it for anything the visitor reads or types
   * into while scrolling, so it never dims underneath them.
   */
  variant?: "cycle" | "enter";
}) {
  const staggered = index > 0;

  return (
    <div
      className={cn("reveal", variant === "enter" && "reveal--enter", className)}
      style={
        staggered
          ? ({ "--reveal-index": Math.min(index, 4) } as CSSProperties)
          : undefined
      }
    >
      {children}
    </div>
  );
}
