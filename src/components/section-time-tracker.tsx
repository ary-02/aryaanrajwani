import { useEffect, useRef } from "react";
import { track } from "@vercel/analytics/react";

/**
 * Reports how long a visitor actually spends looking at each top-level
 * section (hero, journey, vision), as Vercel Analytics custom events.
 *
 * Vercel's `<Analytics />` alone only gives pageviews — on a one-page site
 * that is a single number, not "which section held attention." This adds
 * the section-level breakdown on top, by watching each `[data-section]`
 * element with one shared `IntersectionObserver` and accumulating how long
 * it stays at least half on screen.
 *
 * Dwell time is reported per VISIT rather than batched until the visitor
 * leaves: a section is "reported" the moment it drops below the visibility
 * threshold, and again on tab-hide or page-hide for whatever is still open
 * at that instant. Waiting for a single end-of-session flush risks losing
 * everything to a `beforeunload` that never reliably fires, especially on
 * mobile Safari.
 *
 * Renders nothing — mount once, near the root, after every `[data-section]`
 * element exists in the DOM.
 */

/** A section must be at least this much on screen to count as "being viewed". */
const VISIBLE_THRESHOLD = 0.5;

/** Below this, a dwell is a scroll-past, not a read — dropped as noise. */
const MIN_REPORTABLE_SECONDS = 1;

interface SectionState {
  /** `performance.now()` when the section last crossed into view, or null while offscreen/hidden. */
  visibleSince: number | null;
  /** Milliseconds banked from earlier visible spans this "visit", not yet reported. */
  accumulatedMs: number;
}

export default function SectionTimeTracker() {
  // Ref rather than state: this is bookkeeping the observer callback mutates
  // on every scroll tick, and none of it should ever trigger a re-render.
  const stateRef = useRef<Map<string, SectionState>>(new Map());

  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>("[data-section]"),
    );
    if (elements.length === 0) return;

    const state = stateRef.current;
    for (const el of elements) {
      const section = el.dataset.section;
      if (section) state.set(section, { visibleSince: null, accumulatedMs: 0 });
    }

    /** Bank whatever time has passed since this section last became visible. */
    const bank = (section: string, now: number) => {
      const s = state.get(section);
      if (!s || s.visibleSince === null) return;
      s.accumulatedMs += now - s.visibleSince;
      s.visibleSince = null;
    };

    /** Send the banked time as one event, then reset the counter. */
    const report = (section: string) => {
      const s = state.get(section);
      if (!s) return;
      const seconds = Math.round(s.accumulatedMs / 1000);
      s.accumulatedMs = 0;
      if (seconds >= MIN_REPORTABLE_SECONDS) {
        track("section_dwell", { section, seconds });
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const now = performance.now();
        for (const entry of entries) {
          const section = (entry.target as HTMLElement).dataset.section;
          if (!section) continue;
          const s = state.get(section);
          if (!s) continue;

          const isVisible =
            entry.isIntersecting && entry.intersectionRatio >= VISIBLE_THRESHOLD;

          if (isVisible && s.visibleSince === null) {
            // A backgrounded tab can still fire intersection callbacks (the
            // layout hasn't changed); only start the clock while the page is
            // actually the one on screen.
            if (document.visibilityState === "visible") {
              s.visibleSince = now;
            }
          } else if (!isVisible && s.visibleSince !== null) {
            bank(section, now);
            report(section);
          }
        }
      },
      // 0 as well as the real threshold: without it, a section that is
      // *already* below VISIBLE_THRESHOLD when another crosses it produces no
      // callback at all, and its exit is never observed.
      { threshold: [0, VISIBLE_THRESHOLD] },
    );

    for (const el of elements) observer.observe(el);

    const handleVisibilityChange = () => {
      const now = performance.now();
      if (document.visibilityState === "hidden") {
        // Treat backgrounding the tab like every open section just ended —
        // otherwise a visitor who opens this in one tab and comes back an
        // hour later reports an hour of "attention".
        for (const section of state.keys()) {
          bank(section, now);
          report(section);
        }
      } else {
        // Resuming: don't hand-roll geometry to figure out what's on screen
        // again. Re-observing a target is specified to fire its callback
        // once immediately with the current intersection state, which is
        // exactly the fresh read this needs.
        observer.disconnect();
        for (const el of elements) observer.observe(el);
      }
    };

    const handlePageHide = () => {
      const now = performance.now();
      for (const section of state.keys()) {
        bank(section, now);
        report(section);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("pagehide", handlePageHide);

    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("pagehide", handlePageHide);
    };
  }, []);

  return null;
}
