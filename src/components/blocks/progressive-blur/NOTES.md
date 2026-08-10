# progressive-blur

## Upstream

| | |
|---|---|
| **Source** | [magicuidesign/magicui](https://github.com/magicuidesign/magicui) |
| **File** | `apps/www/registry/magicui/progressive-blur.tsx` |
| **Registry item** | [`apps/www/public/r/progressive-blur.json`](https://github.com/magicuidesign/magicui/blob/main/apps/www/public/r/progressive-blur.json) |
| **Licence** | MIT — Copyright (c) Magic UI ([LICENSE.md](https://github.com/magicuidesign/magicui/blob/main/LICENSE.md)) |
| **Verified** | 2026-08-06 — licence read from the repo's own LICENSE.md; component source taken from the registry JSON, not the demo |

Attribution is recorded in [THIRD-PARTY-NOTICES.md](../../../../THIRD-PARTY-NOTICES.md) at the repo root.

Magic UI sells a "Magic UI Pro" tier alongside the free repo. `progressive-blur` is in the **free, MIT-licensed registry** — checked, not assumed.

## Vetting outcome

Clean. No trademarked logos, no hotlinked CDN assets, no orphaned or deprecated
dependencies, React + TypeScript + Tailwind as required.

What was pasted in was `progressive-blur-demo.tsx`, the **demo**, not the component
— it imports the real thing from `@/registry/magicui/progressive-blur`. The source
above came from the registry item instead. The demo's own contents (a scroll area
of 20 numbered boxes) are illustrative filler and were not carried over.

One unshipped import: `cn` from `@/lib/utils`, the standard shadcn helper, which
the registry item does not include. Added at [src/lib/utils.ts](../../../lib/utils.ts),
pulling in `clsx` and `tailwind-merge`. Future shadcn-style blocks will reuse it.

## Changes from upstream

Component logic is **verbatim** — every blur layer, mask gradient and prop default
is untouched. Only these:

- Removed the `"use client"` directive. It is a Next.js App Router marker with no
  meaning in Vite, and Rollup warns about module-level directives at build time.
- Added semicolons and a trailing comma to match this repo's formatting.
- Added a `default` export alongside the named one, so it can be imported from the
  folder path per the block convention.

## Integration

Used by [src/components/sections/journey.tsx](../../sections/journey.tsx) to fade
out the bottom of the scrollable work-experience list.

The demo wrapped its content in shadcn's `ScrollArea` (Radix). That was **not**
adopted — a native `overflow-y-auto` container does the same job without adding
`@radix-ui/react-scroll-area` and a shadcn install to the project. The structure
matters: the blur is `absolute`, so it must be a sibling of the scrolling element
inside a shared `relative` parent, otherwise it scrolls away with the content.

Say the word if the styled Radix scrollbar is wanted after all.
