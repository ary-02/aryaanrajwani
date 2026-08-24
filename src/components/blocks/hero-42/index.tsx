/**
 * Adapted from the `hero-42` block in Watermelon UI (WatermelonCorp/watermellon-registry),
 * MIT licensed — Copyright (c) 2025-present Watermelon Contributors.
 * Full licence text in THIRD-PARTY-NOTICES.md at the repo root.
 *
 * See NOTES.md in this folder for the vetting record and the full list of
 * changes from upstream.
 */
import { motion, type Variants } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
// Restore alongside the commented-out <ResumeDialog /> below — `noUnusedLocals`
// fails the build on an import with no remaining usage.
// import ResumeDialog from "@/components/resume-dialog";

// ─── Playfair Display for the italic serif headline line ───────────────────
const fontStyle = `@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,700;1,800&display=swap');`;

// ─── Design token — warm near-black matching the reference ─────────────────
const BG = "#180e08";

/**
 * TODO: drop a background photo at `public/hero-bg.avif` and set this to
 * "/hero-bg.avif". Until then the gradient stand-in below carries the panel.
 * Do not point this at a third-party CDN — the upstream component hotlinked
 * assets.watermelon.sh, whose licence we don't hold.
 */
const HERO_BG_SRC: string | null = null;

// ─── Framer-Motion Variants ────────────────────────────────────────────────

/** Background image: slow scale-down + fade */
const bgVariants: Variants = {
  hidden: { opacity: 0, scale: 1.06 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 2.0, ease: [0.22, 1, 0.36, 1], delay: 0 },
  },
};

/** Stagger wrapper for headline lines */
const headlineContainerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.18, delayChildren: 0.32 },
  },
};

/** Each headline line: dramatic rise + blur clear */
const headlineLineVariants: Variants = {
  hidden: { opacity: 0, y: 56, filter: "blur(20px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", damping: 30, stiffness: 72, mass: 1.4 },
  },
};

/** Subtitle: softer rise, fires after headline settles */
const subtitleVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", damping: 26, stiffness: 92, delay: 0.94 },
  },
};

/** CTA row: scale + fade after subtitle */
const ctaVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.94 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", damping: 24, stiffness: 110, delay: 1.14 },
  },
};

// ─── Component ─────────────────────────────────────────────────────────────

export default function Hero42() {
  return (
    <>
      {/* Self-contained font import */}
      <style>{fontStyle}</style>

      <div
        className="relative min-h-screen w-full overflow-hidden antialiased selection:bg-orange-500/30 selection:text-white"
        style={{ backgroundColor: BG }}
      >
        {/* ── Background + gradient overlays ───────────────────────────── */}
        <motion.div
          variants={bgVariants}
          initial="hidden"
          animate="show"
          className="pointer-events-none absolute inset-0 z-0 will-change-transform select-none"
        >
          {HERO_BG_SRC ? (
            <img
              src={HERO_BG_SRC}
              alt=""
              className="h-full w-full object-cover object-right"
            />
          ) : (
            // Stand-in for the missing photo: a warm glow off to the right,
            // roughly where the subject sat in the original composition.
            <div
              className="h-full w-full"
              style={{
                background:
                  "radial-gradient(60% 70% at 78% 42%, rgba(234,88,12,0.55) 0%, rgba(180,60,10,0.28) 35%, rgba(24,14,8,0) 72%)",
              }}
            />
          )}


          {/* Left-to-right gradient: keeps left side dark for legible text */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(24,14,8,0.96) 0%, rgba(24,14,8,0.78) 38%, rgba(24,14,8,0.22) 68%, transparent 100%)",
            }}
          />

          {/* Bottom vignette */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, rgba(24,14,8,0.92) 0%, rgba(24,14,8,0.40) 30%, transparent 55%)",
            }}
          />
        </motion.div>

        {/* ── z-10 layout ──────────────────────────────────────────────── */}
        <div className="relative z-10 flex min-h-screen flex-col">
          {/* Top padding clears the fixed nav, which used to sit here in flow. */}
          <div className="flex flex-1 flex-col justify-center px-6 pt-32 pb-20 sm:px-8 sm:pt-36 md:px-12 lg:px-14 lg:pt-40">
            <div className="flex max-w-4xl flex-col items-start">
              {/* Headline — each line animates independently */}
              <motion.h1
                variants={headlineContainerVariants}
                initial="hidden"
                animate="show"
                className="text-4xl leading-[1.06] tracking-[-0.02em] text-balance sm:text-5xl md:text-6xl lg:text-7xl 2xl:text-8xl"
              >
                {/* Line 1: heavy sans-serif — pure white. Sits 1.5 steps above
                    the h1's scale, i.e. between the next size up and the one
                    after — hence the explicit values rather than named sizes. */}
                <motion.span
                  variants={headlineLineVariants}
                  className="block font-medium text-white will-change-transform text-[3.375rem] sm:text-[4.125rem] md:text-[5.25rem] lg:text-[7rem] 2xl:text-[9.25rem]"
                >
                  Aryaan Rajwani
                </motion.span>

                {/* Line 2: italic serif — same colour, distinct texture.
                    No size classes: it inherits the h1's responsive scale, so
                    both lines are the same size. */}
                <motion.span
                  variants={headlineLineVariants}
                  className="block text-white will-change-transform"
                  style={{
                    fontFamily: "'Playfair Display', Georgia, serif",
                    fontStyle: "italic",
                    fontWeight: 300,
                  }}
                >
                  making asymmetric bets
                </motion.span>
              </motion.h1>

              {/* Subtitle — one sentence, wrapping naturally. The measure is
                  set wide enough that it breaks into two or three lines rather
                  than a narrow block of text under the headline. */}
              <motion.p
                variants={subtitleVariants}
                initial="hidden"
                animate="show"
                className="mt-5 max-w-[520px] text-sm leading-[1.65] font-normal text-pretty text-white/70 will-change-transform sm:text-base"
              >
                Hey, I'm Aryaan. I am 21, shooting strategic shots across
                industries to find an intersection at things I admire
              </motion.p>

              {/* CTA buttons */}
              <motion.div
                variants={ctaVariants}
                initial="hidden"
                animate="show"
                className="mt-8 flex flex-wrap items-center gap-3 will-change-transform"
              >
                {/* Primary: orange filled with arrow — optical padding */}
                <a
                  href="#journey"
                  className="group flex min-h-[44px] items-center gap-2 rounded-lg bg-orange-600 pl-5 pr-4 py-2.5 text-base font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.20),inset_0_-1px_0_rgba(0,0,0,0.25),0_2px_8px_rgba(234,88,12,0.35),0_8px_24px_rgba(234,88,12,0.20)] transition-[transform,background-color,box-shadow] duration-150 ease-out hover:bg-orange-500 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_4px_14px_rgba(234,88,12,0.50),0_12px_32px_rgba(234,88,12,0.28)] active:scale-[0.96]"
                >
                  See the work
                  <ArrowUpRight
                    className="h-4 w-4 shrink-0 transition-transform duration-150 ease-out group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </a>

                {/* Secondary: dark glass outlined */}
                <a
                  href="#vision"
                  className="flex min-h-[44px] items-center rounded-lg border border-white/20 bg-white/[0.07] px-5 py-2.5 text-base font-normal text-white/80 backdrop-blur-sm transition-[transform,background-color,border-color] duration-150 ease-out hover:border-white/35 hover:bg-white/[0.11] hover:text-white active:scale-[0.96]"
                >
                  The vision
                </a>
              </motion.div>

              {/* Resume — HIDDEN UNTIL THE REAL PDF LANDS.
                  public/resume.pdf is still the placeholder stub, and a button
                  that downloads a stub reads as broken, where a missing one
                  just reads as not-built-yet. To restore: drop the real resume
                  at public/resume.pdf, run `npm run resume:check`, then
                  uncomment this block and its import above. The dialog draws
                  its own preview from the PDF, so there is nothing else to
                  update.

              <motion.div
                variants={ctaVariants}
                initial="hidden"
                animate="show"
                className="mt-3 will-change-transform"
              >
                <ResumeDialog />
              </motion.div>
              */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
