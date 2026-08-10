import { useEffect, useRef, useState, type ReactNode } from "react";

/** Blocks that are shorter than their box still need runway on both sides. */
const MIN_COPIES = 3;

/**
 * A scroller that drifts on its own but stays under the visitor's control.
 *
 * `InfiniteSlider` can't do this: it loops by animating a CSS transform, and a
 * transform is invisible to native scrolling, so a wheel gesture inside one
 * does nothing. Here both the drift and the visitor act on the SAME property —
 * `scrollTop` — so they compose instead of fighting. Wheel, trackpad, touch
 * and drag all work for free because it is a real scroll container.
 *
 * `children` is repeated, and the loop keeps the position inside the SECOND
 * copy, wrapping by exactly one copy whenever it leaves. Sitting in the middle
 * rather than at the top is what makes upward scrolling work: native scrollTop
 * clamps at 0, so a position resting at the top has no runway above it and no
 * way to detect an attempt to scroll past it. A full copy above and below means
 * both directions are seamless and neither ever reaches a real edge.
 *
 * Each copy is its own React instance, so the dialog triggers inside them get
 * distinct `useId` values and their layoutIds don't collide.
 */
export default function AutoScroller({
  speed = 22,
  className = "",
  children,
}: {
  /** Drift in pixels per second. */
  speed?: number;
  className?: string;
  children: ReactNode;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const firstCopyRef = useRef<HTMLDivElement>(null);
  // Held in a ref, not state: the rAF loop reads it every frame and re-rendering
  // on hover would restart the animation and tear the position.
  const pausedRef = useRef(false);
  const [copies, setCopies] = useState(MIN_COPIES);

  useEffect(() => {
    const scroller = scrollerRef.current;
    const firstCopy = firstCopyRef.current;
    if (!scroller || !firstCopy) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    /** One copy plus the gap that follows it — the distance to wrap by. */
    let period = 0;

    const measure = () => {
      const cs = getComputedStyle(scroller);
      const gap = parseFloat(cs.rowGap) || 0;
      const padY =
        (parseFloat(cs.paddingTop) || 0) + (parseFloat(cs.paddingBottom) || 0);
      period = firstCopy.offsetHeight + gap;
      if (period <= 0) return;

      // Enough copies that scrollTop can actually REACH the far edge of the
      // middle band. Short lists are the trap: with too few copies the maximum
      // scrollTop sits below the wrap point, the wrap never fires, and the
      // drift stalls silently against the bottom of the range.
      const needed = Math.max(
        MIN_COPIES,
        2 + Math.ceil((scroller.clientHeight - padY + gap + 8) / period),
      );
      setCopies((c) => (c === needed ? c : needed));
    };

    measure();
    // Cards reflow on font load and on resize, which moves the seam.
    const ro = new ResizeObserver(measure);
    ro.observe(firstCopy);
    ro.observe(scroller);

    /**
     * Authoritative position, kept as a float in JS.
     *
     * `scrollTop += delta` does NOT work here. The browser snaps the stored
     * offset to a whole device pixel, so on a fractional-DPR display a
     * sub-pixel step rounds UP every frame and the error compounds — the list
     * ran at exactly devicePixelRatio times the requested speed (36 px/s
     * instead of 22 at DPR 1.65). Accumulating here and only ever WRITING to
     * scrollTop keeps the snapping out of the feedback loop.
     */
    let pos = scroller.scrollTop;
    let written = pos;
    let primed = false;
    let raf = 0;
    let last = 0;

    const frame = (now: number) => {
      if (!last) last = now;
      // Seconds, clamped: a backgrounded tab resumes with a huge delta and
      // would otherwise jump the list forward by a screenful.
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (period > 0) {
        // Drop into the middle band once the first measurement lands.
        if (!primed) {
          pos = period;
          primed = true;
        }

        // A gap wider than snapping error means the visitor scrolled; adopt it.
        if (Math.abs(scroller.scrollTop - written) > 2) pos = scroller.scrollTop;

        if (!pausedRef.current && !reduceMotion.matches) pos += speed * dt;

        // Loops, not ifs: a fast flick can land several copies out. The bounds
        // don't touch, so a resting position can't ping-pong between them.
        while (pos >= 2 * period) pos -= period;
        while (pos < period) pos += period;

        scroller.scrollTop = pos;
        written = scroller.scrollTop;
      }

      raf = requestAnimationFrame(frame);
    };

    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [speed, copies]);

  const pause = () => {
    pausedRef.current = true;
  };
  const resume = () => {
    pausedRef.current = false;
  };

  return (
    <div
      ref={scrollerRef}
      // `overscroll-contain` keeps a gesture here from chaining to the page.
      // Scrollbar hidden in both engines: the drift makes a jumping thumb noisy.
      className={`flex h-full flex-col gap-4 overflow-y-auto overscroll-contain [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden ${className}`}
      onPointerEnter={pause}
      onPointerLeave={resume}
      onPointerDown={pause}
      onPointerUp={resume}
      onTouchStart={pause}
      onTouchEnd={resume}
      // Capture phase: focus/blur don't bubble, and the target is a card deep
      // inside. Keyboard users get a still list while tabbing through triggers.
      onFocusCapture={pause}
      onBlurCapture={resume}
    >
      {Array.from({ length: copies }, (_, i) => (
        <div
          key={i}
          ref={i === 0 ? firstCopyRef : undefined}
          className="flex flex-col gap-4"
        >
          {children}
        </div>
      ))}
    </div>
  );
}
