# Analytics

`@vercel/analytics` — a pageview counter for the site, plus one custom event
this project adds on top: how long a visitor actually spends looking at each
top-level section (hero, journey, vision), not just that they loaded the page.

## What ships in code

- **`<Analytics />`** in [src/App.tsx](../src/App.tsx) — Vercel's own script.
  Injects nothing outside production; `npm run dev` sends no data anywhere.
  Gives pageviews, visitor counts, referrers, countries and devices —
  automatic, no further wiring.
- **`<SectionTimeTracker />`**, same file — this project's own addition, in
  [src/components/section-time-tracker.tsx](../src/components/section-time-tracker.tsx).
  Renders nothing. Watches every element carrying a `data-section` attribute
  with one shared `IntersectionObserver`, and fires a `section_dwell` custom
  event (`{ section, seconds }`) each time that element drops below half
  visible, or the tab is hidden, or the page is closed — whichever comes
  first for whatever is on screen at that moment.

`data-section` is set in two places:

- [src/components/section.tsx](../src/components/section.tsx) sets it to the
  section's own `id` automatically, so `#journey` and `#vision` are tracked
  with no per-section wiring — anything built on the shared `Section` shell
  gets this for free.
- The hero has no shared shell, so
  [src/components/blocks/hero-42/index.tsx](../src/components/blocks/hero-42/index.tsx)
  sets `data-section="hero"` directly on its root `<div>`.

A new full-page section only needs `data-section` set once, the same way, to
show up in the breakdown.

## What still has to happen in the Vercel dashboard

Adding the package does not turn data collection on — that is a per-project
toggle only an account holder can flip:

1. Open the project on vercel.com → **Analytics** tab → **Enable**.
2. Data starts appearing after the next deploy that includes this change,
   once real visitors load the page. There's nothing to see from local
   `npm run dev` or `npm run build && npm run preview` — the script only
   reports from a production Vercel deployment.
3. Pageviews and the built-in breakdowns (referrer, country, device) show up
   on the **Analytics** tab itself, on the free plan, no further setup.
4. **Custom events — this includes `section_dwell` — need the Pro plan to
   view.** The free (Hobby) plan collects pageviews only; `track()` calls are
   silently accepted but their data isn't surfaced anywhere until the project
   is on Pro. Nothing needs to change in code if the plan is upgraded later —
   the events are already being sent from day one, so historical data isn't
   lost by waiting.

## Reading the numbers once they're there

Under **Analytics → Events** (Pro plan), each `section_dwell` event carries:

- `section` — `"hero"`, `"journey"`, or `"vision"`
- `seconds` — how long that one continuous viewing lasted

A single visitor generates several of these per section if they scroll back
and forth, not one aggregate number — summing or averaging them per section
is left to Vercel's own event breakdown, not done in this codebase.

## Deliberate limits

- **Dwell under 1 second is dropped.** A fast scroll-past isn't "attention",
  and reporting it would just be noise on top of the real signal.
- **Backgrounded-tab time is never counted.** The clock for a section pauses
  the instant `document.visibilityState` goes to `"hidden"`, so a visitor who
  opens the tab and leaves it open for an hour doesn't report an hour spent
  reading Vision.
- **No page-level scroll-depth percentage.** `section_dwell` says how long
  each named section held the viewport, which answers "which section" more
  directly than a raw 0–100% scroll figure would.
