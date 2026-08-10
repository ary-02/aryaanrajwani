# carousel

## Upstream

| | |
|---|---|
| **Source** | [ibelick/motion-primitives](https://github.com/ibelick/motion-primitives) |
| **File** | `components/core/carousel.tsx` |
| **Licence** | MIT — Copyright (c) 2024 ibelick |
| **Verified** | 2026-08-07 — fourth component from this repo (see `morphing-dialog`, `dock`, `infinite-slider`); source taken from the repo, not the demo |

Attribution is recorded in [THIRD-PARTY-NOTICES.md](../../../../THIRD-PARTY-NOTICES.md) at the repo root.

## Vetting outcome

Clean on licence and stack: React + TypeScript + Tailwind, no new dependencies
(`lucide-react` and `cn` were already here), no hotlinked assets, no bundled
brand artwork.

What was pasted in was `CarouselBasic`, the **demo** — four numbered boxes with
`aspect-square` borders. None of it is the component; it only shows the call
shape. The real component is the file above.

## Changes from upstream

Context, drag handling, the IntersectionObserver that counts visible items, and
the spring transition are verbatim.

- **Imports `framer-motion` instead of `motion/react`**, as with every block
  from this repo: two copies of the animation library would mean two separate
  layout contexts, and the dialogs this renders inside depend on shared layout.
- Removed the `"use client"` directive.
- Prettier formatting to match the repo.

## Two upstream quirks worth knowing

Both are handled at the call site in
[src/components/photo-carousel.tsx](../../photo-carousel.tsx), not patched here,
so this file stays close to upstream.

**1. `CarouselNavigation` is positioned outside a clipped box.** It defaults to
`left-[-12.5%] w-[125%]`, placing the arrows beyond the carousel's edges — but
`Carousel` renders all of its children inside a `div.overflow-hidden`, so those
arrows are clipped away. Passing `className="left-0 w-full"` brings them inside
the frame, which is the only thing that works at dialog width anyway.

**2. `CarouselIndicator` cannot be recoloured.** Its palette is light-first
(`bg-zinc-950` active, `bg-zinc-900/50` idle, with `dark:` variants that never
apply because this project does not enable Tailwind's class-based dark variant).
Both states therefore land on near-black and disappear against a photograph.
`classNameButton` does not rescue it: tailwind-merge applies it over *both*
states, so the active dot stops being distinguishable from the idle ones. The
indicator is instead rebuilt at the call site from the exported `useCarousel`
hook, which is the supported seam for exactly this.

## Integration

Used by [src/components/photo-carousel.tsx](../../photo-carousel.tsx), which
feeds the `gallery` field on a Journey entry.
