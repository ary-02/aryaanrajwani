# infinite-slider

## Upstream

| | |
|---|---|
| **Source** | [ibelick/motion-primitives](https://github.com/ibelick/motion-primitives) |
| **File** | `components/core/infinite-slider.tsx` |
| **Licence** | MIT — Copyright (c) 2024 ibelick |
| **Verified** | 2026-08-06 — same repo as [morphing-dialog](../morphing-dialog/NOTES.md); licence re-checked, source taken from the repo rather than the demo |

Attribution is recorded in [THIRD-PARTY-NOTICES.md](../../../../THIRD-PARTY-NOTICES.md) at the repo root.

## Vetting outcome

Clean. React + TypeScript + Tailwind, no trademarked logos, no deprecated
packages.

What was pasted in was `infinite-slider-vertical.tsx`, the **demo**. Its twelve
album covers were hotlinked from `i.scdn.co` (Spotify's CDN) and are
copyrighted artwork — not carried over. The real content is our own cards.

One new dependency: **`react-use-measure`** (MIT, pmndrs), which the component
uses to measure the doubled track so it knows how far to translate before
looping.

## Changes from upstream

Animation logic is verbatim — the measure/translate/repeat cycle, the hover
speed transition, and the `{children}{children}` doubling are untouched.

- **Imports `framer-motion` instead of `motion/react`**, same reasoning as
  morphing-dialog: two copies of the animation library in one bundle would mean
  two separate layout contexts.
- Removed the `"use client"` directive.
- **Track width is `w-full` in vertical mode**, `w-max` only in horizontal.
  Upstream hardcodes `w-max`, which is right for a horizontal row but collapses
  vertical items to their content width — our cards would have shrunk to fit
  their text instead of filling the block.
- Added a default export for the folder-import convention.

## Integration

Used by [src/components/sections/journey.tsx](../../sections/journey.tsx) via its
local `LoopingEntries` wrapper, on the Work Experience, Projects and Competitions
blocks. Education is a single static card and is deliberately not looped.

Two things that were checked and are worth not breaking:

**Card duplication is safe for the dialogs.** The slider renders `children`
twice, so every card exists twice in the DOM. Each copy is its own React
instance with its own `useId`, so the `MorphingDialog` `layoutId`s don't
collide — verified that opening a dialog from a *duplicated* card works and
shows the right content.

**The loop replaced native scrolling.** The block used to be an
`overflow-y-auto` scroller; the slider is transform-driven inside an
`overflow-hidden` wrapper, so there is no scrollbar and no wheel scrolling.
Reaching a given card means waiting for it to come round. `speedOnHover={2}`
(against `speed={22}`) slows it to a near-stop on hover so the cards stay
clickable — do not remove that without providing another way to stop the motion.
