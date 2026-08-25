import { useState, type ReactNode } from "react";
import { ChevronDown } from "lucide-react";
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

/**
 * TODO: replace with the real ones. Specific and in-progress reads as
 * self-aware; vague reads as a dodge.
 *
 * `skills` is what naming the weakness is actually for: the gap plus the list
 * of things being learnt to close it reads as a plan, where the bare gap reads
 * as an admission. A card without any renders as it always did — no chevron and
 * nothing to open, since a control that reveals an empty list is worse than no
 * control.
 */
const WEAKNESSES: { title: string; blurb: string; skills?: string[] }[] = [
  {
    title: "Storytelling",
    blurb: "",
    skills: ["Audience modelling", "Strategic sales", "Cause-effect relationship"],
  },
  {
    title: "Content Creation",
    blurb: "",
    skills: [
      "Scripting",
      "Trust building",
      "Media hooks",
      "Branding",
      "Camera consciousness",
    ],
  },
  {
    title: "AI Automation Tools",
    blurb: "",
    skills: [
      "Problem solving",
      "Product building",
      "Workflow mapping",
      "AI familiarity",
    ],
  },
  {
    title: "Coding",
    blurb: "",
    skills: ["Vibe debugging", "Technical infrastructure"],
  },
  {
    title: "Performance Marketing",
    blurb: "",
    skills: ["Funnel economics", "Result orientation", "A/B testing"],
  },
];

/**
 * One "hungry amateur at" card, with the skills it is chasing behind a toggle.
 *
 * The list mounts and unmounts rather than animating open. Animating `height`
 * on something that can be onscreen mid-scroll is the bug that silently killed
 * every mobile section link once already — Chrome cancels an in-flight smooth
 * scroll the moment layout changes under it. Only opacity and transform move
 * here; the height change lands in one frame.
 */
function WeaknessCard({
  title,
  blurb,
  skills,
}: {
  title: string;
  blurb: string;
  skills?: string[];
}) {
  const [open, setOpen] = useState(false);
  const hasSkills = !!skills && skills.length > 0;

  return (
    <article className="h-full rounded-xl border border-dashed border-white/[0.16] bg-transparent p-6">
      {hasSkills ? (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="group flex w-full items-center justify-between gap-3 text-left"
        >
          <h4 className="text-base font-medium text-white/90">{title}</h4>
          <ChevronDown
            className={`h-4 w-4 shrink-0 text-white/35 transition-[transform,color] duration-200 group-hover:text-white/70 ${
              open ? "rotate-180" : ""
            }`}
            aria-hidden="true"
          />
        </button>
      ) : (
        <h4 className="text-base font-medium text-white/90">{title}</h4>
      )}

      {/* Same guard as the ambition cards: an empty blurb would still
          render its top margin and leave a gap under the heading. */}
      {blurb && (
        <p className="mt-2.5 text-sm leading-[1.7] text-pretty text-white/60">
          {blurb}
        </p>
      )}

      {hasSkills && open && (
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <li
              key={skill}
              className="rounded-md border border-white/[0.09] bg-white/[0.02] px-2.5 py-1 text-xs text-white/50"
            >
              {skill}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}

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
            <WeaknessCard {...item} />
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
