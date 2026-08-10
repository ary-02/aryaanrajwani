import type { ReactNode } from "react";
import { motion, type Variants } from "framer-motion";

/** Children of a Reveal stagger in as the section scrolls into view. */
export const staggerVariants: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", damping: 26, stiffness: 90 },
  },
};

/**
 * One staggered child of a Section.
 *
 * Pass `standalone` when the Reveal sits inside an extra wrapper element (a
 * grid, a column) rather than directly under Section's stagger container —
 * nesting past that point drops the inherited variant and the content stays
 * stuck at `hidden`, invisible with no error. `standalone` gives it its own
 * in-view trigger instead of relying on inheritance.
 */
export function Reveal({
  children,
  className,
  standalone = false,
}: {
  children: ReactNode;
  className?: string;
  standalone?: boolean;
}) {
  return (
    <motion.div
      variants={revealVariants}
      className={className}
      {...(standalone
        ? {
            initial: "hidden" as const,
            whileInView: "show" as const,
            viewport: { once: true, margin: "-80px" },
          }
        : {})}
    >
      {children}
    </motion.div>
  );
}

interface SectionProps {
  id: string;
  eyebrow: string;
  title: ReactNode;
  /** ReactNode rather than string, so a section can italicise part of its lede. */
  lede?: ReactNode;
  children: ReactNode;
}

/**
 * Shared shell for the one-pager's sections. `scroll-mt-24` keeps the heading
 * clear of the fixed nav when an anchor link lands here.
 */
export default function Section({
  id,
  eyebrow,
  title,
  lede,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className="scroll-mt-24 border-t border-white/[0.06] px-6 py-24 sm:px-8 md:px-12 lg:px-14 lg:py-32"
    >
      <motion.div
        variants={staggerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="mx-auto w-full max-w-6xl"
      >
        <Reveal>
          <p className="text-xs font-normal tracking-[0.18em] text-orange-400/75 uppercase">
            {eyebrow}
          </p>
        </Reveal>

        <Reveal>
          <h2 className="mt-4 text-3xl leading-[1.1] tracking-[-0.02em] text-balance text-white sm:text-4xl lg:text-5xl">
            {title}
          </h2>
        </Reveal>

        {lede ? (
          <Reveal>
            <p className="mt-5 max-w-2xl text-base leading-[1.7] text-pretty text-white/65">
              {lede}
            </p>
          </Reveal>
        ) : null}

        <div className="mt-14">{children}</div>
      </motion.div>
    </section>
  );
}
