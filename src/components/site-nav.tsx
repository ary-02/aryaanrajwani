import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import { ChevronDown, Globe, Menu, X } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav";

/** Slides down from top + blur-clear. Carried over from the hero's nav. */
const navVariants: Variants = {
  hidden: { opacity: 0, y: -22, filter: "blur(8px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { type: "spring", damping: 22, stiffness: 180, delay: 0.05 },
  },
};

/**
 * Opacity and transform only — deliberately NOT height. Animating the panel's
 * height cancels an in-flight smooth scroll in Chrome, which silently broke
 * every mobile section link. Transform-driven animation doesn't touch layout,
 * so the scroll survives.
 */
const mobilePanelVariants: Variants = {
  hidden: { opacity: 0, y: -8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * Fixed to the viewport so the section links stay reachable after you scroll
 * past the hero. It has to live outside hero-42.tsx: the hero's root sets
 * `overflow-hidden` to clip its background, and that kills sticky/fixed
 * positioning for anything nested inside it.
 */
export default function SiteNav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Transparent over the hero, tinted once content sits behind it.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  /**
   * Mobile links can't rely on native anchor behaviour: closing the panel
   * collapses the clicked link's own container to height 0 in the same tick,
   * and the browser drops the pending fragment scroll. Drive it ourselves once
   * the collapse has been committed. `scrollIntoView()` with no argument still
   * honours `scroll-behavior` from CSS, so reduced-motion is respected.
   */
  const handleMobileNav = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string,
  ) => {
    e.preventDefault();
    setMenuOpen(false);
    // Update the URL *before* scrolling: a history write lands on the current
    // entry and Chrome restores that entry's saved offset, which cancels a
    // scroll already in flight.
    history.replaceState(null, "", `#${id}`);
    requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView();
    });
  };

  return (
    <motion.header
      variants={navVariants}
      initial="hidden"
      animate="show"
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ${
        scrolled || menuOpen
          ? "border-b border-white/[0.08] bg-[#180e08]/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav
        className="flex w-full items-center justify-between px-6 py-5 sm:px-8 md:px-12 lg:px-14"
        aria-label="Primary navigation"
      >
        {/* Signature wordmark — also the "back to top" affordance. The mark is
            the name itself, so there is no icon beside it: a glyph plus a
            script signature reads as two competing logos. */}
        <a
          href="#top"
          className="rounded-md transition-opacity duration-200 hover:opacity-80"
        >
          {/* Larger than the type around it on purpose: a copperplate script
              carries a small x-height, so it reads a size or two smaller than
              its font-size suggests. leading is loose enough to clear the
              descenders on the j and y. */}
          <span className="font-signature text-[2rem] leading-[1.15] font-normal tracking-[0.01em] text-white/95 italic">
            Aryaan Rajwani
          </span>
        </a>

        {/* Section links — hidden below md, mirrored in the mobile panel */}
        <div className="hidden items-center gap-9 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="flex min-h-[40px] items-center text-sm font-normal text-white/75 transition-colors duration-200 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Right: language selector + CTA + mobile toggle */}
        <div className="flex items-center gap-3">
          <button className="group hidden min-h-[40px] items-center gap-1.5 text-sm font-normal text-white/70 transition-colors duration-200 hover:text-white md:flex active:scale-[0.96]">
            <Globe className="h-4 w-4 shrink-0" aria-hidden="true" />
            EN
            <ChevronDown
              className="h-3.5 w-3.5 opacity-70 transition-transform duration-200 group-hover:rotate-180"
              aria-hidden="true"
            />
          </button>

          <a
            href="#vision"
            className="hidden min-h-[40px] items-center rounded-lg border border-white/25 bg-white/[0.06] px-4 py-2 text-sm font-normal text-white/85 backdrop-blur-sm transition-[transform,background-color,border-color] duration-150 ease-out hover:border-white/40 hover:bg-white/[0.10] hover:text-white active:scale-[0.96] sm:flex"
          >
            Explore more
          </a>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav-panel"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/[0.06] text-white/85 transition-[transform,background-color,border-color] duration-150 ease-out hover:border-white/35 hover:bg-white/[0.11] hover:text-white active:scale-[0.94] md:hidden"
          >
            {menuOpen ? (
              <X className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Menu className="h-5 w-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile panel — same links, closes on selection. Unmounted rather than
          collapsed, so it occupies no layout when closed. */}
      {menuOpen ? (
        <motion.div
          id="mobile-nav-panel"
          variants={mobilePanelVariants}
          initial="hidden"
          animate="show"
          className="md:hidden"
        >
          <div className="flex flex-col gap-1 border-t border-white/[0.08] px-6 py-4 sm:px-8">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={(e) => handleMobileNav(e, item.id)}
                className="flex min-h-[48px] items-center rounded-lg px-2 text-base font-normal text-white/80 transition-colors duration-200 hover:bg-white/[0.06] hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </div>
        </motion.div>
      ) : null}
    </motion.header>
  );
}
