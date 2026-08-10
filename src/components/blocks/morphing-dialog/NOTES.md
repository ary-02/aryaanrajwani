# morphing-dialog

## Upstream

| | |
|---|---|
| **Source** | [ibelick/motion-primitives](https://github.com/ibelick/motion-primitives) |
| **File** | `components/core/morphing-dialog.tsx` |
| **Also taken** | `hooks/useClickOutside.tsx` → [src/hooks/use-click-outside.ts](../../../hooks/use-click-outside.ts) |
| **Licence** | MIT — Copyright (c) 2024 ibelick ([LICENCE.md](https://github.com/ibelick/motion-primitives/blob/main/LICENCE.md), note the British spelling) |
| **Verified** | 2026-08-06 — licence read from the repo; component source taken from the repo, not the demo |

Attribution is recorded in [THIRD-PARTY-NOTICES.md](../../../../THIRD-PARTY-NOTICES.md) at the repo root.

## Vetting outcome

Clean. No trademarked logos, no orphaned or deprecated dependencies,
React + TypeScript + Tailwind as required.

What was pasted in was `morphing-dialog-basic-2.tsx`, the **demo**, not the
component. Its content — a Murakami book cover hotlinked from
`m.media-amazon.com` and the book's jacket copy — is illustrative filler and was
not carried over. That image would have been both a hotlink to a third party and
someone else's copyrighted cover art.

Two unshipped imports: `cn` from `@/lib/utils` (already present, added with
[progressive-blur](../progressive-blur/NOTES.md)) and the `useClickOutside`
hook, which is a separate file in the upstream repo and had to be taken too.

The demo also used the site's own `ScrollArea`. Not adopted — a native
`overflow-y-auto` with `max-h-[85vh]` does the job, same call as for
progressive-blur.

## Changes from upstream

Component logic is otherwise verbatim — context, focus trap, Escape handling,
scroll lock, portal, and every `layoutId` are untouched.

- **Imports `framer-motion` instead of `motion/react`.** Upstream uses the newer
  `motion` package. Installing it alongside `framer-motion` would put two copies
  of the animation library in the bundle with separate layout contexts. The
  exports used here (`motion`, `AnimatePresence`, `MotionConfig`, `Transition`,
  `Variant`) are identical across both.
- Removed the `"use client"` directive — a Next.js App Router marker with no
  meaning in Vite, and Rollup warns about module-level directives.
- **Backdrop restyled** from `bg-white/40 dark:bg-black/40` to a fixed dark
  scrim. This site has a single dark theme and doesn't enable Tailwind's
  class-based dark variant, so upstream's light default would have applied and
  washed the page out.
- **Backdrop raised to `z-50`, container to `z-60`.** At upstream's `z-40` the
  fixed site nav (also `z-50`) stayed crisp above the scrim.
- **Trigger ref now falls back to the context ref.** Upstream only attaches a
  ref when one is passed as a prop, so `triggerRef.current` stayed null and the
  focus-return-on-close in `MorphingDialogContent` silently no-opped. Verified
  fixed: focus returns to the card after Escape.
- `triggerRef` prop typed `RefObject<HTMLButtonElement | null>` to match the
  context type under React 19's stricter ref types.
- Dropped `aria-label={`Open dialog ${uniqueId}`}` from the trigger. React's
  generated id is meaningless to a screen reader and it overrode the card's own
  text content as the accessible name.
- Formatting only: double quotes and trailing commas to match this repo.

## Integration

Used by [src/components/sections/journey.tsx](../../sections/journey.tsx). Every
entry card in all four blocks is a dialog trigger; the card face stays sparse and
`entry.details` renders only inside the dialog.

`MorphingDialogContainer` portals to `document.body`, which is what stops the
dialog being clipped by the `overflow-hidden` on its `EntryBlock`. Do not
"simplify" that portal away.

`MorphingDialogImage` and `MorphingDialogDescription` are exported but currently
unused — kept so the component stays whole for later use (e.g. company logos on
the cards).
