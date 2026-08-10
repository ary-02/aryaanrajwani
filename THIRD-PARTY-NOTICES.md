# Third-Party Notices

## Watermelon UI

`src/components/blocks/hero-42/index.tsx` is adapted from the `hero-42` block in the
[Watermelon UI registry](https://github.com/WatermelonCorp/watermellon-registry)
(`src/components/watermelon-ui/hero-42.tsx`). It has been modified.

```
MIT License

Copyright (c) 2025-present Watermelon Contributors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Fonts

Playfair Display is loaded from Google Fonts and is licensed under the
SIL Open Font License 1.1.

## Runtime dependencies

Licences for `react`, `react-dom`, `framer-motion`, and `lucide-react` ship in
`node_modules/<pkg>/LICENSE` after `npm install`.

## Magic UI

The following are adapted from [Magic UI](https://github.com/magicuidesign/magicui).
Both have been modified.

- `src/components/blocks/progressive-blur/index.tsx` — from
  `apps/www/registry/magicui/progressive-blur.tsx`
- `src/components/blocks/shimmer-button/index.tsx` — from
  `apps/www/registry/magicui/shimmer-button.tsx`. The `@keyframes shimmer-slide`
  and `@keyframes spin-around` rules in `src/index.css` are also from Magic UI,
  taken from that component's registry manifest
  (`apps/www/public/r/shimmer-button.json`).

```
MIT License

Copyright (c) Magic UI

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Motion-Primitives

The following are adapted from [Motion-Primitives](https://github.com/ibelick/motion-primitives)
and have been modified:

- `src/components/blocks/morphing-dialog/index.tsx` — from `components/core/morphing-dialog.tsx`
- `src/components/blocks/infinite-slider/index.tsx` — from `components/core/infinite-slider.tsx`
- `src/components/blocks/dock/index.tsx` — from `components/core/dock.tsx`
- `src/components/blocks/carousel/index.tsx` — from `components/core/carousel.tsx`
- `src/hooks/use-click-outside.ts` — from `hooks/useClickOutside.tsx`

```
MIT License

Copyright (c) 2024 ibelick

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## react-use-measure

`react-use-measure` (MIT, Poimandres) is a runtime dependency of the infinite
slider. Its licence ships in `node_modules/react-use-measure/LICENSE`.

## Bundled npm dependencies

The sections above cover source copied into this repository. These packages are
installed from npm and compiled into the shipped bundle, so their notices travel
with the site too. All are permissive; full licence texts are in each package's
directory under `node_modules/`.

| Package | Licence |
|---|---|
| react, react-dom | MIT — Copyright (c) Meta Platforms, Inc. and affiliates |
| framer-motion | MIT — Copyright (c) 2018 Framer B.V. |
| lucide-react | ISC — Copyright (c) Lucide Contributors |
| clsx | MIT — Copyright (c) Luke Edwards |
| tailwind-merge | MIT — Copyright (c) Dany Castillo |
| react-use-measure | MIT — Copyright (c) Paul Henschel |
| pdfjs-dist | Apache-2.0 — Copyright Mozilla Foundation |

`pdfjs-dist` is Mozilla's [pdf.js](https://github.com/mozilla/pdf.js). It draws
the first page of `public/resume.pdf` onto a canvas in
[src/components/pdf-page.tsx](src/components/pdf-page.tsx). Apache-2.0 asks that
the licence and any NOTICE file be retained on redistribution; bundling strips
source comments, so the attribution is recorded here instead. It is loaded by
dynamic import and is not part of the initial bundle.
