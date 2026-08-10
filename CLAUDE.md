# MOTION

A personal showcase site for **Aryaan Rajwani** — resume, portfolio, ambitions, and honest weaknesses, presented in a way that holds attention. The audience is recruiters, startup founders, and fellow enthusiasts, so the bar is "memorable and credible," not "complete." Depth belongs behind engaging surfaces, not dumped on the page.

Single-page Vite + React 19 + TypeScript + Tailwind v4 app. No routing, state library, backend, or tests yet — ask before introducing any of them rather than assuming.

## Commands

```
npm run dev           # Vite dev server on :5173
npm run build         # tsc --noEmit, then vite build — a type error blocks the build
npm run typecheck     # tsc --noEmit
npm run resume:check  # validate public/resume.pdf before publishing
```

If a build ever fails on a missing esbuild binary: npm blocked esbuild's postinstall at install time (`npm warn allow-scripts`). Vite runs fine regardless, but the fix is `npm approve-scripts esbuild`. The symptom is baffling and the cause is invisible, hence the note.

## Conventions

- **`@/` → `src/`**, declared in *two* places: `resolve.alias` in [vite.config.ts](vite.config.ts) and `paths` in [tsconfig.json](tsconfig.json). Change one without the other and either the editor or the bundler breaks. Most likely trip-up in the repo.
- **Tailwind v4** via the `@tailwindcss/vite` plugin plus `@import "tailwindcss"` in [src/index.css](src/index.css). There is **no `tailwind.config.js`** and one should not be added by reflex — v4 does theming in CSS.
- **There is deliberately no `tsconfig.node.json`.** The standard Vite `references` + `noEmit` split fails with `TS6310`; `vite.config.ts` is covered by the single root tsconfig. Do not "restore" the split.
- `noUnusedLocals` / `noUnusedParameters` are on. Dead consts fail the typecheck instead of lingering — this is what catches orphaned Framer Motion variants after you delete a section.
- Styling is inline Tailwind utilities. Multi-stop gradients and animation variants live in `style={{}}` or module-level consts because they don't express well as utilities. Match the surrounding file.
- Animation is `framer-motion`, driven by named `Variants` consts declared above the component. Icons are `lucide-react`.
- **Never animate a layout property (`height`, `width`, `margin`) on the nav or anything that can be onscreen during a scroll.** Chrome silently cancels an in-flight smooth scroll when layout changes mid-flight — this broke every mobile section link with no error anywhere. Animate `opacity` and `transform` instead, and mount/unmount rather than collapsing.

## Page structure

One-pager: hero, then `#journey`, `#vision`. Section ids and nav labels come from [src/lib/nav.ts](src/lib/nav.ts) — add a section there and both the desktop nav and the mobile panel pick it up, so an anchor can't drift from its target.

A third section, `#my-story`, was removed on 2026-08-08: it was still entirely placeholder and was the only thing blocking the first deploy. Both hero CTAs and the nav's "Explore more" button were repointed at `#vision`. Don't rebuild it with placeholder copy — that is exactly why it was cut. Write the narrative first.

- [src/components/site-nav.tsx](src/components/site-nav.tsx) is `fixed` and lives *outside* the hero. It has to: the hero's root sets `overflow-hidden` to clip its background, which kills fixed/sticky positioning for anything nested inside.
- Scrolling is native — `scroll-behavior: smooth` on `html` in [src/index.css](src/index.css), with a `prefers-reduced-motion` override. Sections carry `scroll-mt-24` to clear the fixed nav. Don't add a JS scroll library.
- Mobile links are the one exception: they call `scrollIntoView()` from a `requestAnimationFrame` after the panel unmounts, because a native fragment scroll doesn't survive the click target being removed.
- New sections should use the shared [src/components/section.tsx](src/components/section.tsx) shell (`Section` + `Reveal`) so eyebrow/heading/scroll-reveal treatment stays consistent.

## Where imported blocks live

**Every third-party component gets its own folder under `src/components/blocks/`** — one block, one folder, no exceptions. This quarantines foreign code so a block's dependencies, assets and licence terms can't bleed into anything else.

```
src/components/blocks/
  hero-42/
    index.tsx     the component
    NOTES.md      upstream repo, licence, vetting outcome, changes made
    assets/       any vendored images or icons (create only if needed)
```

Import via the folder: `import Hero42 from "@/components/blocks/hero-42"`.

`NOTES.md` is required and carries the vetting trail from the checklist below — source repo and exact file path, licence, when it was verified, what was wrong with it, what was changed, and what's still outstanding. It lives beside the code so the reasoning survives; `THIRD-PARTY-NOTICES.md` at the root remains the formal attribution record. [src/components/blocks/hero-42/NOTES.md](src/components/blocks/hero-42/NOTES.md) is the reference example.

This applies to **imported blocks only**. Components written for this project — [site-nav.tsx](src/components/site-nav.tsx), [section.tsx](src/components/section.tsx), [sections/](src/components/sections/) — stay as flat files. The folder rule exists to isolate foreign code, not to add nesting for its own sake.

## Bringing in third-party components — required checklist

The site is assembled largely from open-source UI blocks. [src/components/blocks/hero-42/](src/components/blocks/hero-42/) is the worked example: adapted from the MIT-licensed [Watermelon UI registry](https://github.com/WatermelonCorp/watermellon-registry), and unusable as shipped. Every step below exists because that one block failed it. Run all of them, every time.

1. **Verify the source is genuinely open source.** Name the exact upstream repo, file path, and licence before copying a line. A component browser or marketing site claiming "open source" is not evidence — find the licensed repo and read its LICENSE. Watch for pro/paid tiers sitting alongside a free repo.
2. **Confirm the licence permits our use.** Permissive only: MIT, ISC, Apache-2.0, BSD. Copyleft (GPL/AGPL) and source-available/non-commercial licences are out. If the licence is unclear, missing, or the source can't be located, stop and ask — don't paste it in "for now."
3. **Check the language and stack match.** We take React + TypeScript + Tailwind v4 only. Reject or fully rewrite: Vue/Svelte/Angular blocks, plain-JS components lacking types, Tailwind v3-only syntax, and CSS-in-JS (styled-components, emotion). Half-converted components are worse than none.
4. **Strip third-party brand logos and "trusted by" social proof.** Trademark exposure is entirely independent of the code licence — MIT over the code grants nothing over Google's or Stripe's marks. On a personal site, fake client logos also destroy exactly the credibility the site exists to build.
5. **Remove dependencies orphaned by deleted markup.** Check what each import is still actually used for. Registry manifests are unreliable: `hero-42.json` declared `@hugeicons/react` and `motion` while the source imported `hugeicons-react` and `framer-motion`. `hugeicons-react` was also published deprecated.
6. **Never hotlink another project's CDN.** Images referenced by URL usually fall outside the licence and entirely outside our control. Vendor the asset into `public/` or use a local placeholder.
7. **Resolve imports the upstream never ships.** Diff the registry manifest's `files` array against the source's actual imports — `hero-42` imported an `@/assets/logo-icon` that was not included.
8. **Record attribution in [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md):** upstream repo, file path, full licence text, and a note that it was modified. This is the one hard obligation MIT actually imposes.
9. **Write the block's `NOTES.md`** in its folder, capturing everything steps 1–8 turned up. Keep a short header comment in `index.tsx` pointing at it.
10. **Replace upstream branding** — wordmark, logo, palette, and placeholder copy — with MOTION's own.

## Resume

**`public/resume.pdf` is the only file.** Updating the resume means replacing it
— the dialog preview is drawn from that same PDF, so there is nothing to
regenerate and nothing that can drift.

```
npm run resume:check    # validate before publishing
```

[src/components/pdf-page.tsx](src/components/pdf-page.tsx) renders page one onto
a canvas with pdf.js. Do **not** "simplify" this to an `<iframe>` or an
`<embed>`: an embedded PDF is drawn by whatever viewer the visitor's browser
supplies, which paints its own scrollbar and — with the Acrobat extension
installed — Adobe's toolbar, in a separate process no stylesheet of ours can
reach. It can be cropped but not hidden, and cropping doesn't catch an injected
extension toolbar. iOS Safari declines to render embedded PDFs at all. Drawing
pixels ourselves is what avoids all of it.

This replaced a flat `resume-preview.png` that had to be regenerated by hand
every time the PDF changed, with nothing enforcing it.

pdf.js is imported dynamically — it is the largest dependency in the tree, and
the dialog body only mounts on open, so it stays out of the initial bundle.
Check the build output: `pdf-*.js` and `pdf.worker.min-*.mjs` must remain
separate chunks. If they ever merge into `index-*.js`, the dynamic import has
been broken.

`npm run resume:check` ([scripts/check-resume.mjs](scripts/check-resume.mjs))
guards the two failure modes this project has actually hit: a PDF truncated by
an upload cap (no `%%EOF`, renders as "Failed to load PDF document" everywhere
but locally), and a phone number shipped to a public, scraped page.

## Current state

Remaining placeholder copy is marked `TODO` at its source array.

- [src/components/sections/journey.tsx](src/components/sections/journey.tsx) — **written**, except `SKILLS` (still "Skill" ×8) and the two project dates.
- [src/components/sections/vision.tsx](src/components/sections/vision.tsx) — **written**. Three ambition cards, plus four dashed "A hungry amateur at" cards whose blurbs are deliberately blank.
- [src/components/blocks/hero-42/](src/components/blocks/hero-42/) — still carries upstream's placeholder headline ("The Quiet Is Where / Direction Begins"), a look-and-feel stand-in, not final content.
- [src/assets/logo-icon.tsx](src/assets/logo-icon.tsx) — original placeholder mark, no longer used by the nav (which now sets the name in a script face). Keeps the `className` + `fill="currentColor"` contract so callers colour it with a Tailwind `text-*` class.
- `HERO_BG_SRC` in the hero is `null`, with a radial-gradient stand-in in place of a background photo. Set it once an asset lands in `public/`.
- The nav's "EN" language selector is inert decoration inherited from upstream. Wire it up or delete it.
- `public/resume.pdf` is a 1.3 KB placeholder. Replace it with the real resume (phone number removed) and run `npm run resume:check`.
- `index.html` still titles the page "MOTION", and there is no favicon, meta description or OG tag.

No contact/footer section, so the page trails off after Vision. The contact dock is the only closing affordance.
