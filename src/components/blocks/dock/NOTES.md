# dock

## Upstream

| | |
|---|---|
| **Source** | [ibelick/motion-primitives](https://github.com/ibelick/motion-primitives) |
| **File** | `components/core/dock.tsx` |
| **Licence** | MIT — Copyright (c) 2024 ibelick |
| **Verified** | 2026-08-06 — third component from this repo; licence re-checked, source taken from the repo rather than the demo |

Attribution is recorded in [THIRD-PARTY-NOTICES.md](../../../../THIRD-PARTY-NOTICES.md) at the repo root.

## Vetting outcome

Clean. React + TypeScript + Tailwind, no new dependencies, no hotlinked assets,
no bundled brand artwork.

What was pasted in was `apple-style-dock.tsx`, the **demo** — a seven-item nav
(Home, Products, Components, Activity, Change Log, Email, Theme) with every
`href` set to `'#'`. Only the four contact links were carried over.

## Changes from upstream

Magnification maths, spring config, context and tooltip behaviour are verbatim.

- **Imports `framer-motion` instead of `motion/react`**, same reasoning as the
  other blocks from this repo: two copies of the animation library in one bundle
  would mean two separate layout contexts.
- Removed the `"use client"` directive.
- **`DockItem` now renders a real `<a>` when given an `href`.** Upstream always
  renders `<div role="button">` and never consumes an href at all — the demo
  defines `href` on every item and silently drops it, so nothing navigates. As
  anchors these are keyboard-activatable, middle-clickable, and announced as
  links. Without an `href` it still renders the original div.
- Added an `aria-label` prop. The icons are decorative and the text label only
  exists in a hover tooltip, so without one each item's accessible name would be
  empty.
- `cloneElement` target typed as `ReactElement<Record<string, unknown>>` —
  React 19's `ReactElement` defaults its props to `unknown`, which makes the
  untyped upstream call a compile error.

## Integration

Used by [src/components/site-dock.tsx](../../site-dock.tsx), fixed to the bottom
of the viewport so contact is reachable from any section.

Upstream's palette is light-first (`bg-gray-50`, `bg-gray-100` tooltips) with
`dark:` variants that never apply here — this site doesn't enable Tailwind's
class-based dark variant. Rather than edit the component, the dark styling is
passed in via `className` at the call site and `cn()`/tailwind-merge resolves the
conflicts. Keep it that way so the component stays close to upstream.

The wrapper is `pointer-events-none` with `pointer-events-auto` on the dock
itself, so the full-width fixed strip doesn't swallow clicks on the page behind
it. `<main>` carries `pb-28` to keep content clear of the dock.
