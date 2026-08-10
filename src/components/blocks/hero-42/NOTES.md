# hero-42

## Upstream

| | |
|---|---|
| **Source** | [WatermelonCorp/watermellon-registry](https://github.com/WatermelonCorp/watermellon-registry) |
| **File** | `src/components/watermelon-ui/hero-42.tsx` |
| **Registry item** | [`public/r/hero-42.json`](https://github.com/WatermelonCorp/watermellon-registry/blob/main/public/r/hero-42.json) |
| **Licence** | MIT — Copyright (c) 2025-present Watermelon Contributors |
| **Verified** | 2026-08-06 — licence read from the repo's own LICENSE file, and the source confirmed byte-for-byte identical to what was pasted in |

Attribution is recorded in [THIRD-PARTY-NOTICES.md](../../../../THIRD-PARTY-NOTICES.md) at the repo root.

## Vetting outcome

The block was **not** usable as shipped. Four problems, all confirmed against the repo:

1. **Trademarked logos.** A "Trusted By Leading Brands" strip rendered Google, Adobe, Microsoft and Stripe marks. Trademark exposure is independent of the code licence, and fake client logos are actively harmful on a personal credibility site.
2. **Dependencies serving only that strip.** `hugeicons-react` and `react-icons` existed solely to draw those four logos. `hugeicons-react@0.4.0` is additionally published deprecated ("no longer maintained, use @hugeicons/react instead").
3. **Broken import.** `@/assets/logo-icon` is Watermelon's own brand mark and is absent from the registry item's `files` array, so it never ships with the component.
4. **Hotlinked asset.** The background `<img>` pointed at `https://assets.watermelon.sh/bg-hero-42.avif`, which is not in the repo. MIT over the code does not reach it and its own licence is unknown.

The registry manifest is also unreliable: it declares `@hugeicons/react` and `motion` while the source imports `hugeicons-react` and `framer-motion`. Trust the source file's imports, not the manifest.

## Changes from upstream

- Deleted the brand strip and its three now-orphaned Framer Motion variants (`brandLabelVariants`, `brandsContainerVariants`, `brandCardVariants`).
- Dropped the `react-icons` and `hugeicons-react` imports entirely.
- Replaced the hotlinked background with `HERO_BG_SRC` (currently `null`) and a local radial-gradient stand-in. **Do not repoint this at a third-party CDN.**
- Swapped the logo for [`@/assets/logo-icon`](../../../assets/logo-icon.tsx) — our own placeholder mark — and the wordmark to MOTION.
- Lifted the nav out into [`@/components/site-nav`](../../site-nav.tsx) so it can stay `fixed` across the page; the hero's `overflow-hidden` root prevents fixed positioning from working inside it. Hero content gained top padding to compensate.
- CTAs became anchors into the page: "See the work" → `#journey`, "The vision" → `#vision`. Upstream's "Get Demo" was inert and meaningless here. (The second CTA read "My story" → `#my-story` until that section was removed on 2026-08-08.)
- Fixed a stale upstream comment referencing a "Sun icon + 'Serein' wordmark" that described neither the code nor this project.

## Outstanding

- Headline and subtitle are still upstream's placeholder copy.
- `HERO_BG_SRC` is `null` pending a background photo in `public/`.
