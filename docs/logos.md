# Logos

Notes for `public/logos/`. This file lives in `docs/` rather than beside the
images on purpose: everything under `public/` is served verbatim at the site
root, so a README kept there would be published at `/logos/README.md`.

Files in `public/` are served from the site root,
so `public/logos/work-exp/acme.svg` is referenced in code as
`/logos/work-exp/acme.svg`.

Use lowercase, hyphenated filenames with no spaces — a space becomes `%20` in
the URL and the filename stops saying what the file is.

Wire one up by setting `logo` on the entry in
`src/components/sections/journey.tsx`:

    {
      period: "2024 — Present",
      title: "Role Title",
      org: "Acme Corp",
      logo: "/logos/acme.svg",
      ...
    }

Entries without a `logo` fall back to a monogram of the org's initial, so the
cards look intentional either way.

Prefer SVG. PNG should be ~80x80 (2x the 40px display size). Monochrome or
light-on-transparent reads best on the dark cards.

These are logos of places actually worked at or studied — nominative use. The
"no third-party brand logos" rule in CLAUDE.md targets fake "trusted by" social
proof, which is a different thing.

## Artwork on white backgrounds

Logos supplied as screenshots are usually dark artwork on an opaque white
rectangle. Those render on a deliberate white tile (see `LOGO_FRAME_IMAGE` in
`src/components/sections/journey.tsx`) so they read as a logo chip rather than a
stray white block on the dark card.

If you can get transparent-background SVGs or PNGs instead, say so and the tile
can be dropped for a cleaner look.
