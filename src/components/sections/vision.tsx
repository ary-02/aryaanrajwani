import type { ReactNode } from "react";
import Section, { Reveal } from "@/components/section";

// TODO: two of three still placeholder.
// `blurb` is a ReactNode so a card can italicise its supporting line, matching
// the treatment on the section ledes.
const AMBITIONS: { title: string; blurb: ReactNode }[] = [
  {
    title: "An Attention Economy",
    blurb: <em>Personal branding &amp; leveraged distribution through social media</em>,
  },
  {
    title: "Business Automations",
    blurb: (
      <em>Discover gaps &amp; find value to provide in distorted real workflows</em>
    ),
  },
  {
    title: "Hyper-personalized Selling",
    blurb: (
      <em>Become trustworthy to sell to in the growing world of AI chaos</em>
    ),
  },
];

// TODO: replace with the real ones. Specific and in-progress reads as
// self-aware; vague reads as a dodge.
const WEAKNESSES = [
  {
    title: "Storytelling",
    blurb: "",
  },
  {
    title: "Content Creation",
    blurb: "",
  },
  {
    title: "AI Automation Tools",
    blurb: "",
  },
  {
    title: "Coding",
    blurb: "",
  },
];

export default function Vision() {
  return (
    <Section
      id="vision"
      eyebrow="Vision"
      title="What I anticipate — and what I'd love to see myself try."
      lede={<em>A bit of strategy and a bit of delusion</em>}
    >
      {/* Ambitions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {AMBITIONS.map((item, i) => (
          <Reveal key={i}>
            <article className="flex h-full flex-col rounded-xl border border-white/[0.12] bg-white/[0.05] p-6 backdrop-blur-sm transition-[background-color,border-color] duration-200 hover:border-white/[0.22] hover:bg-white/[0.09]">
              <span className="text-xs font-normal tracking-wide text-orange-400/70">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-3 text-lg font-medium text-white">
                {item.title}
              </h3>
              {/* Guarded: an empty blurb would still render the paragraph and
                  its top margin, leaving a gap under the heading that reads as
                  a layout bug rather than as deliberately unwritten. */}
              {item.blurb && (
                <p className="mt-2.5 text-sm leading-[1.7] text-pretty text-white/65">
                  {item.blurb}
                </p>
              )}
            </article>
          </Reveal>
        ))}
      </div>

      {/* Weaknesses */}
      <Reveal className="mt-16">
        <h3 className="text-sm font-normal tracking-[0.14em] text-white/40 uppercase">
          A hungry amateur at
        </h3>
      </Reveal>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {WEAKNESSES.map((item, i) => (
          <Reveal key={i}>
            <article className="h-full rounded-xl border border-dashed border-white/[0.16] bg-transparent p-6">
              <h4 className="text-base font-medium text-white/90">
                {item.title}
              </h4>
              {/* Same guard as the ambition cards: an empty blurb would still
                  render its top margin and leave a gap under the heading. */}
              {item.blurb && (
                <p className="mt-2.5 text-sm leading-[1.7] text-pretty text-white/60">
                  {item.blurb}
                </p>
              )}
            </article>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
