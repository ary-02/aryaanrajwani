# shimmer-button

## Upstream

| | |
|---|---|
| **Source** | [magicuidesign/magicui](https://github.com/magicuidesign/magicui) |
| **File** | `apps/www/registry/magicui/shimmer-button.tsx` |
| **Manifest** | `apps/www/public/r/shimmer-button.json` |
| **Licence** | MIT — Copyright (c) Magic UI |
| **Verified** | 2026-08-06 — second component from this repo (see `progressive-blur`); file located in the repo and compared against the pasted copy byte-for-byte |

Attribution is recorded in [THIRD-PARTY-NOTICES.md](../../../../THIRD-PARTY-NOTICES.md) at the repo root.

## Vetting outcome

Clean on licence and stack: React + TypeScript + Tailwind, no new dependencies,
no hotlinked assets, no bundled brand artwork. The pasted source matched
upstream exactly, so nothing had been altered in transit.

**The component file is not self-sufficient.** It uses `animate-shimmer-slide`
and `animate-spin-around`, neither of which is a Tailwind built-in. They ship in
the *registry manifest* (`cssVars.theme` and `css`), not in the `.tsx`:

```json
"cssVars": { "theme": {
  "animate-shimmer-slide": "shimmer-slide var(--speed) ease-in-out infinite alternate",
  "animate-spin-around":   "spin-around calc(var(--speed) * 2) infinite linear"
}},
"css": { "@keyframes shimmer-slide": { ... }, "@keyframes spin-around": { ... } }
```

Paste the component on its own and it renders as a static dark pill with no
shimmer whatsoever — and nothing errors, so the omission is silent. Both the
`--animate-*` theme vars and the two `@keyframes` blocks now live in
[src/index.css](../../../index.css); Tailwind v4 has no config file to put them
in. **If the shimmer ever stops, look there first, not here.**

This is the same failure class as `hero-42`'s missing `@/assets/logo-icon`:
the manifest's declarations are part of the component, and only diffing the two
surfaces it.

`@container-[size]` and `inset-(--cut)` are Tailwind **v4** syntax, so this is
the v4 version of the component and needs no conversion. Verified in the build
output: `container-type: size` is emitted, which is what makes the spark's
`h-[100cqh]` resolve — with v4's plain `@container` (inline-size only) the
container-query *height* unit would collapse and the spark would have no size.

## Changes from upstream

The markup, the spark/highlight/backdrop layers and all six CSS custom
properties are verbatim.

- **Added an `as` prop** (`"button" | "span"`, default `"button"`). The only
  consumer is the Resume trigger, and `MorphingDialogTrigger` already renders a
  `<button>` — nesting upstream's `<button>` inside it would be invalid HTML and
  two nested interactive controls, so the visual shell renders as a `<span>`
  while the trigger keeps the semantics, click handling, keyboard handling and
  `aria-*` wiring.
- Prettier formatting (trailing commas, semicolons) to match the repo.

## Integration

Used by [src/components/resume-dialog.tsx](../../resume-dialog.tsx).

`background` is set to `rgba(31,19,11,1)` at the call site rather than upstream's
pure black, matching the dialog panel it morphs into. Keep palette overrides at
the call site so the component stays close to upstream.

The children need `z-10`: the spark container is `-z-30` and the backdrop
`-z-20`, but the highlight overlay after them is not negative, so unlayered
content sits under it.
